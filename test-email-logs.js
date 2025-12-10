const axios = require('axios');

async function testEmailWithLogs() {
  try {
    const email = `emailtest${Date.now()}@gmail.com`;
    console.log('\n========== EMAIL LOGGING TEST ==========\n');
    console.log(`📧 Testing with email: ${email}\n`);

    // Signup
    console.log('1️⃣  Creating user...');
    const signupRes = await axios.post('http://localhost:3001/auth/signup', {
      email,
      password: 'Test123456!',
      name: 'Test User',
      phone: '+2341234567890'
    });
    console.log('✅ User created\n');

    // Send email
    console.log('2️⃣  Sending verification email...');
    console.log('📋 Check backend terminal for detailed logs from Resend\n');
    
    const token = signupRes.data.access_token;
    const emailRes = await axios.post('http://localhost:3001/auth/send-verification-email', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Email send call completed\n');
    console.log('📋 Backend logs should show:');
    console.log('   [EMAIL SERVICE] Attempting to send verification email...');
    console.log('   [EMAIL SERVICE] Resend API Response: {...}');
    console.log('   [EMAIL SERVICE] Full error details if failed\n');
    
    console.log('🔍 Check your email at: ' + email);
    console.log('   Spam folder: Yes');
    console.log('   Promotions folder: Yes\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testEmailWithLogs();
