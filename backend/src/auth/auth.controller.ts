import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    // Combine firstName and lastName into name
    const name = `${signupDto.firstName} ${signupDto.lastName}`.trim();
    // Combine phonePrefix and phone
    const fullPhone = `${signupDto.phonePrefix || '+1'}${signupDto.phone}`;
    
    return this.authService.signup(
      signupDto.email,
      signupDto.password,
      name,
      fullPhone,
      signupDto.role,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('send-verification-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendVerificationEmail(@Req() req: any) {
    const userId = req.user.id;
    return this.authService.sendVerificationEmail(userId);
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Req() req: any, @Body() verifyDto: { code: string }) {
    const userId = req.user.id;
    return this.authService.verifyEmail(userId, verifyDto.code);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.findById(userId);
  }
}
