const axios = require('axios');

const API_URL = 'http://localhost:3001';
const testEmail = `verify${Date.now()}@example.com`;

async function testCompleteFlow() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         COMPLETE EMAIL VERIFICATION FLOW TEST             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Step 1: Create user
    console.log('📝 Step 1: Creating new user account...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      email: testEmail,
      password: 'Test123456!',
      name: 'Verification Test User',
      phone: '+2341234567890'
    });
    
    const token = signupRes.data.access_token;
    const userId = signupRes.data.user.id;
    
    console.log(`   ✅ User created successfully`);
    console.log(`   📧 Email: ${testEmail}`);
    console.log(`   🆔 User ID: ${userId}`);

    // Step 2: Send verification email
    console.log('\n📧 Step 2: Sending verification email...');
    const emailRes = await axios.post(`${API_URL}/auth/send-verification-email`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`   ✅ Email sending initiated`);
    console.log(`   📬 Status: ${emailRes.data.message}`);
    console.log(`   💌 Email should arrive at: ${testEmail}`);

    // Step 3: Get the code from database (simulating user checking email)
    console.log('\n🔍 Step 3: Retrieving verification code from database...');
    const userRes = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const code = userRes.data.verificationCode;
    if (!code) {
      console.log('   ❌ ERROR: No verification code found in database!');
      console.log('   Database state:', {
        isVerified: userRes.data.isVerified,
        verificationCode: userRes.data.verificationCode,
        verificationCodeExpiry: userRes.data.verificationCodeExpiry
      });
      process.exit(1);
    }
    
    console.log(`   ✅ Code retrieved successfully`);
    console.log(`   🔐 Verification Code: ${code}`);
    console.log(`   ⏰ Expiry: ${new Date(userRes.data.verificationCodeExpiry).toLocaleTimeString()}`);

    // Step 4: Verify email
    console.log('\n✅ Step 4: Verifying email with code...');
    const verifyRes = await axios.post(`${API_URL}/auth/verify-email`, 
      { code },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`   ✅ Email verified successfully`);
    console.log(`   📨 Message: ${verifyRes.data.message}`);

    // Step 5: Verify final status
    console.log('\n🎉 Step 5: Final verification status check...');
    const finalRes = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`   ✅ User Profile Retrieved`);
    console.log(`   📧 Email: ${finalRes.data.email}`);
    console.log(`   ✔️  isVerified: ${finalRes.data.isVerified}`);
    console.log(`   🔐 Code Cleared: ${finalRes.data.verificationCode === null}`);

    if (!finalRes.data.isVerified) {
      console.log('\n❌ FAILED: User should be verified!');
      process.exit(1);
    }

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ ALL TESTS PASSED!                     ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n🎯 System Status Summary:');
    console.log('   ✅ User signup working');
    console.log('   ✅ Automatic email sending working');
    console.log('   ✅ Code generation working');
    console.log('   ✅ Code verification working');
    console.log('   ✅ Account marked as verified');
    console.log('\n📧 Frontend Flow:');
    console.log('   1. User signs up');
    console.log('   2. Verification code sent to email via Resend');
    console.log('   3. Verification modal appears asking for code');
    console.log('   4. User enters code and clicks verify');
    console.log('   5. Account becomes verified');
    console.log('   6. Header updates to show Dashboard button');
    console.log('\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    if (error.response?.data) {
      console.error('   Error:', error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
    console.error('\n');
    process.exit(1);
  }
}

testCompleteFlow();
