require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(uri);
    const db = conn.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`Collections to delete:`);
    if (collections.length === 0) {
      console.log('  (none - database is empty)');
    } else {
      collections.forEach(c => console.log(`  - ${c.name}`));
    }
    
    // Drop entire database
    console.log('\nDropping entire database...');
    await db.dropDatabase();
    console.log('✅ Database dropped successfully!\n');
    
    // Verify it's empty
    const collectionsAfter = await db.listCollections().toArray();
    console.log(`Collections remaining: ${collectionsAfter.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Database is now completely fresh and empty!');
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
})();
