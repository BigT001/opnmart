import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Generate a 6-digit verification code
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification email with code
   */
  async sendVerificationEmail(email: string, name: string, verificationCode: string): Promise<boolean> {
    try {
      console.log(`[EMAIL SERVICE] ========== VERIFICATION EMAIL ==========`);
      console.log(`[EMAIL SERVICE] To: ${email}`);
      console.log(`[EMAIL SERVICE] API Key Set: ${process.env.RESEND_API_KEY ? '✅ YES' : '❌ NO'}`);
      console.log(`[EMAIL SERVICE] Sending via Resend API...`);
      
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      console.log(`[EMAIL SERVICE] From: ${fromEmail}`);
      console.log(`[EMAIL SERVICE] Code: ${verificationCode}`);
      
      const response = await this.resend.emails.send({
        from: `OpnMart <${fromEmail}>`,
        to: email,
        subject: 'Verify Your Email - OpnMart',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">OpnMart</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0;">Email Verification</p>
            </div>
            
            <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${name}!</h2>
              
              <p style="color: #6b7280; line-height: 1.6;">
                Thank you for signing up with OpnMart. To complete your registration and verify your email, please use the code below:
              </p>
              
              <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #1f2937; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Verification Code</p>
                <p style="margin: 10px 0 0 0; color: #10b981; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${verificationCode}</p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                This code will expire in <strong>10 minutes</strong>. If you didn't request this email, please ignore it.
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; margin-top: 20px; padding-top: 20px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © 2025 OpnMart. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log(`[EMAIL SERVICE] ✅ Resend Response:`, response);
      console.log(`[EMAIL SERVICE] ✅ Email sent successfully to ${email}`);
      return true;
    } catch (error: any) {
      console.error(`[EMAIL SERVICE] ❌ Error sending email to ${email}`);
      console.error(`[EMAIL SERVICE] Error Message:`, error?.message);
      console.error(`[EMAIL SERVICE] Error Code:`, error?.code);
      console.error(`[EMAIL SERVICE] Full Error:`, error);
      return false;
    }
  }

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      console.log(`[EMAIL SERVICE] Sending welcome email to: ${email}`);
      
      // Use onboarding@resend.dev for testing, or your verified domain in production
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const response = await this.resend.emails.send({
        from: `OpnMart <${fromEmail}>`,
        to: email,
        subject: 'Welcome to OpnMart!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">OpnMart</h1>
            </div>
            
            <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937;">Welcome to OpnMart, ${name}!</h2>
              
              <p style="color: #6b7280; line-height: 1.6;">
                Your email has been verified and your account is now active. You can now:
              </p>
              
              <ul style="color: #6b7280; line-height: 1.8;">
                <li>Browse and purchase products</li>
                <li>Manage your cart and orders</li>
                <li>Track deliveries</li>
                <li>Become a vendor and sell products</li>
              </ul>
              
              <p style="color: #6b7280; line-height: 1.6;">
                Get started by exploring our marketplace or logging into your account.
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; margin-top: 20px; padding-top: 20px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © 2025 OpnMart. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log(`✅ Welcome email sent to ${email}`);
      return true;
    } catch (error: any) {
      console.error(`[EMAIL SERVICE] ❌ Failed to send welcome email to ${email}`);
      console.error(`[EMAIL SERVICE] Error:`, error?.message);
      console.error(`[EMAIL SERVICE] Full Error:`, JSON.stringify(error, null, 2));
      return false;
    }
  }
}
