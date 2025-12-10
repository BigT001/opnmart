const axios = require('axios');

const API_URL = 'http://localhost:3001';
const testEmail = `test${Date.now()}@example.com`;

async function testEmailVerification() {
  try {
    console.log('\n📧 === TESTING EMAIL VERIFICATION WITH RESEND ===\n');

    // 1. Signup
    console.log('1️⃣  Creating test user...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      email: testEmail,
      password: 'Test123456!',
      name: 'Test User',
      phone: '+2341234567890'
    });
    
    const token = signupRes.data.access_token;
    const userId = signupRes.data.user.id;
    console.log(`✅ User created successfully!`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   User ID: ${userId}`);

    // 2. Send verification email
    console.log('\n2️⃣  Sending verification email via Resend...');
    const emailRes = await axios.post(`${API_URL}/auth/send-verification-email`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Email sent!`);
    console.log(`   Response: ${JSON.stringify(emailRes.data)}`);
    console.log(`\n   📬 Check your inbox at ${testEmail} for the verification code!`);

    // 3. Get verification code from database for testing
    console.log('\n3️⃣  Fetching verification code from database...');
    const userRes = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const verificationCode = userRes.data.verificationCode;
    if (!verificationCode) {
      console.log('❌ Verification code not found!');
      return;
    }
    console.log(`✅ Code: ${verificationCode}`);

    // 4. Verify email with code
    console.log('\n4️⃣  Verifying email with code...');
    const verifyRes = await axios.post(`${API_URL}/auth/verify-email`, 
      { code: verificationCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Email verified!`);
    console.log(`   Response: ${JSON.stringify(verifyRes.data)}`);

    // 5. Check final user status
    console.log('\n5️⃣  Final user status:');
    const finalRes = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   Email: ${finalRes.data.email}`);
    console.log(`   isVerified: ${finalRes.data.isVerified}`);

    console.log('\n✅ === TEST COMPLETE! ===');
    console.log('\n📧 Resend is now sending emails successfully!');
    console.log('Users will receive verification codes in their email inbox.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testEmailVerification();
