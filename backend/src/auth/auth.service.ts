import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(email: string, password: string, name: string, phone: string, role: string = 'buyer') {
    console.log(`\n[AUTH] ========== SIGNUP INITIATED ==========`);
    console.log(`[AUTH] Email: ${email}`);
    console.log(`[AUTH] Name: ${name}`);

    // Check if user exists with this email (verified or unverified)
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      if (existingUser.isVerified) {
        console.error(`[AUTH] ❌ Email already registered and verified: ${email}`);
        throw new ConflictException('Email already registered');
      } else {
        console.error(`[AUTH] ❌ Email already has pending verification: ${email}`);
        throw new ConflictException('Email already registered. Please verify your email or use a different email.');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`[AUTH] Generated OTP: ${verificationCode}`);
    console.log(`[AUTH] OTP Expiry: ${expiryTime.toISOString()}`);

    // Create UNVERIFIED user (temporary, not yet saved permanently)
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role,
      isVerified: false, // NOT VERIFIED YET - TEMPORARY USER
      verificationCode,
      verificationCodeExpiry: expiryTime,
    });

    console.log(`[AUTH] ✅ Temporary unverified user created: ${user._id}`);
    console.log(`[AUTH] isVerified: ${user.isVerified}`);

    // Send verification email
    await this.usersService.sendVerificationEmail(user._id.toString());

    const token = this.generateToken(user);
    console.log(`[AUTH] JWT token generated for temporary user`);
    console.log(`[AUTH] ========== SIGNUP COMPLETE ==========\n`);

    return {
      ...token,
      message: 'Signup successful. Please verify your email with the OTP.',
    };
  }

  async login(email: string, password: string) {
    console.log(`\n[AUTH] ========== LOGIN ATTEMPT ==========`);
    console.log(`[AUTH] Email: ${email}`);

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.error(`[AUTH] ❌ User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`[AUTH] ✅ User found: ${user._id}`);
    console.log(`[AUTH] isVerified: ${user.isVerified}`);

    // Check if user is verified
    if (!user.isVerified) {
      console.error(`[AUTH] ❌ BLOCKED: Unverified user attempted login: ${email}`);
      throw new UnauthorizedException('Please verify your email first');
    }

    console.log(`[AUTH] ✅ User verified`);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error(`[AUTH] ❌ Invalid password for: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`[AUTH] ✅ Password correct`);

    // Return JWT token
    const token = this.generateToken(user);
    console.log(`[AUTH] ✅ JWT token generated`);
    console.log(`[AUTH] ========== LOGIN SUCCESS ==========\n`);
    return token;
  }

  private generateToken(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(payload: any) {
    return this.usersService.findById(payload.sub);
  }

  async sendVerificationEmail(userId: string) {
    return this.usersService.sendVerificationEmail(userId);
  }

  async verifyEmail(userId: string, code: string) {
    return this.usersService.verifyEmail(userId, code);
  }
}
