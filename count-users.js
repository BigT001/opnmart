const mongoose = require('mongoose');

// Use the same connection string from .env
const mongoUri = 'mongodb+srv://sta99175_db_user:n45LxR23xyyf7D9l@cluster0.7igdyfs.mongodb.net/?appName=Cluster0';

async function countUsers() {
  try {
    await mongoose.connect(mongoUri, {
      dbName: 'opnmart'
    });
    
    const db = mongoose.connection.db;
    const count = await db.collection('users').countDocuments();
    
    console.log('\n========== USER COUNT ==========');
    console.log('Total users in opnmart:', count);
    
    // Also show some sample users
    const users = await db.collection('users').find({}).limit(5).toArray();
    console.log('\nSample users (first 5):');
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Verified: ${user.isVerified}`);
      console.log(`   Created: ${user.createdAt}`);
    });
    
    console.log('\n================================\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

countUsers();
