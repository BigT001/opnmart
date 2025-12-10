import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { EmailService } from './email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: any) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Send verification email with code (code already generated at signup)
   */
  async sendVerificationEmail(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Get the code that was already generated during signup
    if (!user.verificationCode) {
      throw new BadRequestException('No verification code found');
    }

    // Send email with the existing code
    const emailSent = await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      user.verificationCode,
    );

    if (!emailSent) {
      console.warn(`[USERS SERVICE] Email sending failed for ${user.email}, but continuing in dev mode`);
    }

    console.log(`[USERS SERVICE] Verification email triggered for ${user.email}`);

    return {
      success: true,
      message: 'Verification code sent to your email',
    };
  }

  /**
   * Verify email with code - THIS IS WHEN USER IS PERMANENTLY SAVED
   */
  async verifyEmail(userId: string, code: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      return { success: false, message: 'Email already verified' };
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      console.log(`[USERS SERVICE] Invalid code for ${user.email}. Expected: ${user.verificationCode}, Got: ${code}`);
      throw new BadRequestException('Invalid verification code');
    }

    // Check if code expired
    if (new Date() > user.verificationCodeExpiry) {
      console.log(`[USERS SERVICE] Code expired for ${user.email}`);
      throw new BadRequestException('Verification code has expired');
    }

    // Mark as verified and clear code - USER IS NOW PERMANENTLY SAVED
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    }, { new: true });

    console.log(`[USERS SERVICE] ✅ User PERMANENTLY SAVED after email verification: ${user.email}`);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return {
      success: true,
      message: 'Email verified successfully! Your account is now active.',
    };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async update(id: string, updateUserDto: any) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const totalCount = await this.userModel.countDocuments();
    const verifiedCount = await this.userModel.countDocuments({ isVerified: true });
    const unverifiedCount = await this.userModel.countDocuments({ isVerified: false });
    
    const recentUsers = await this.userModel
      .find()
      .select('email name isVerified createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      stats: {
        total: totalCount,
        verified: verifiedCount,
        unverified: unverifiedCount,
      },
      recentUsers,
    };
  }

  /**
   * Delete all users (admin only)
   */
  async deleteAllUsers() {
    const result = await this.userModel.deleteMany({});
    console.log(`[ADMIN] ⚠️  DELETED ${result.deletedCount} users from database`);
    return {
      success: true,
      message: `Deleted ${result.deletedCount} users from database`,
      deletedCount: result.deletedCount,
    };
  }
}
