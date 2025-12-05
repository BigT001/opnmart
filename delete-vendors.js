const mongoose = require('mongoose');

async function deleteVendor() {
  const mongoUri = 'mongodb+srv://infosamuelstanley_db_user:4Fuk30Q9qahYHLH3@opnmart.ukpo6w5.mongodb.net/?appName=opnmart';
  
  try {
    await mongoose.connect(mongoUri);
    console.log('\n✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Delete all vendors
    const result = await db.collection('vendors').deleteMany({});
    
    console.log(`\n✓ Deleted ${result.deletedCount} vendor(s) from the database\n`);

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

deleteVendor();
