const mongoose = require('mongoose');

async function deleteAllUsers() {
  try {
    console.log('\n🗑️  DELETING ALL USERS FROM DATABASE\n');

    const mongoUri = 'mongodb+srv://infosamuelstanley_db_user:4Fuk30Q9qahYHLH3@opnmart.ukpo6w5.mongodb.net/?appName=opnmart';
    const dbName = 'opnmart_fresh';

    await mongoose.connect(`${mongoUri.replace('/?appName=opnmart', '')}/${dbName}`);
    console.log('✅ Connected to MongoDB');

    // Delete all users
    const result = await mongoose.connection.collection('users').deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users from the database`);

    // Delete all vendors
    const vendorResult = await mongoose.connection.collection('vendors').deleteMany({});
    console.log(`✅ Deleted ${vendorResult.deletedCount} vendors from the database`);

    // Delete all buyers (if separate collection)
    const buyerResult = await mongoose.connection.collection('buyers').deleteMany({});
    console.log(`✅ Deleted ${buyerResult.deletedCount} buyers from the database`);

    // Check what's left
    const userCount = await mongoose.connection.collection('users').countDocuments();
    const vendorCount = await mongoose.connection.collection('vendors').countDocuments();
    
    console.log(`\n📊 Database Status:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Vendors: ${vendorCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Database cleaned! Ready for fresh start.\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteAllUsers();
