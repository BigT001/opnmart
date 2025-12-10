require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not set in .env');
    }
    
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Connected!');
    
    const db = mongoose.connection.db;
    
    // Check current count
    const beforeCount = await db.collection('products').countDocuments();
    console.log(`Products BEFORE deletion: ${beforeCount}`);
    
    // Delete everything
    const deleteResult = await db.collection('products').deleteMany({});
    console.log(`Deleted: ${deleteResult.deletedCount} products`);
    
    // Verify
    const afterCount = await db.collection('products').countDocuments();
    console.log(`Products AFTER deletion: ${afterCount}`);
    
    if (afterCount === 0) {
      console.log('\n✅ SUCCESS: Database is now completely EMPTY');
    } else {
      console.log('\n❌ FAILED: Database still has products');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
})();
