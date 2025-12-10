require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    
    console.log(`Connecting to database: ${dbName}\n`);
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    
    // Collections to clear
    const collections = ['users', 'vendors', 'products', 'categories', 'orders'];
    
    console.log('Clearing collections...\n');
    
    for (const collection of collections) {
      try {
        const result = await db.collection(collection).deleteMany({});
        console.log(`✅ ${collection}: Deleted ${result.deletedCount} documents`);
      } catch (e) {
        console.log(`⚠️  ${collection}: Collection doesn't exist or is empty`);
      }
    }
    
    console.log('\n✅ Database completely wiped - starting fresh!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
})();
