const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function testVerificationFlow() {
  try {
    console.log('\n📧 === EMAIL VERIFICATION FLOW TEST ===\n');

    // 1. Signup
    console.log('1️⃣  Testing signup...');
    const email = `testuser${Date.now()}@example.com`;
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      email,
      password: 'Test123456!',
      name: 'Test User',
      phone: '+2341234567890'
    });
    
    const token = signupRes.data.access_token;
    const userId = signupRes.data.user.id;
    console.log(`✅ Signup successful!`);
    console.log(`   Email: ${email}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Token: ${token.substring(0, 30)}...`);

    // 2. Send verification email
    console.log('\n2️⃣  Testing send-verification-email...');
    const emailRes = await axios.post(`${API_URL}/auth/send-verification-email`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Email sent!`);
    console.log(`   Response: ${JSON.stringify(emailRes.data)}`);

    // 3. Get the verification code from database (for testing purposes)
    console.log('\n3️⃣  Fetching verification code from database...');
    const userRes = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const verificationCode = userRes.data.verificationCode;
    if (!verificationCode) {
      console.log('❌ Verification code not found in database!');
      console.log(`   Full user data: ${JSON.stringify(userRes.data)}`);
      return;
    }
    console.log(`✅ Got verification code: ${verificationCode}`);

    // 4. Verify email with code
    console.log('\n4️⃣  Testing verify-email with code...');
    const verifyRes = await axios.post(`${API_URL}/auth/verify-email`, 
      { code: verificationCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`✅ Email verified!`);
    console.log(`   Response: ${JSON.stringify(verifyRes.data)}`);

    // 5. Check user status
    console.log('\n5️⃣  Checking user verification status...');
    const userFinalRes = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ User status:`)
    console.log(`   Email: ${userFinalRes.data.email}`);
    console.log(`   isVerified: ${userFinalRes.data.isVerified}`);
    console.log(`   verificationCode: ${userFinalRes.data.verificationCode}`);

    console.log('\n✅ === ALL TESTS PASSED! ===\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testVerificationFlow();
