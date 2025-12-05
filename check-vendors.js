const mongoose = require('mongoose');

async function checkVendors() {
  const mongoUri = 'mongodb+srv://infosamuelstanley_db_user:4Fuk30Q9qahYHLH3@opnmart.ukpo6w5.mongodb.net/?appName=opnmart';
  
  try {
    await mongoose.connect(mongoUri);
    console.log('\n✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const vendors = await db.collection('vendors').find({}).toArray();
    
    console.log('\n=== VENDORS IN DATABASE ===');
    console.log(`Total vendors: ${vendors.length}\n`);
    
    if (vendors.length > 0) {
      vendors.forEach((v, i) => {
        console.log(`${i + 1}. ${v.vendorType || 'unknown'} vendor`);
        console.log(`   ID: ${v._id}`);
        console.log(`   Email: ${v.email}`);
        console.log(`   Store/Business: ${v.storeName || v.tradingName || 'N/A'}`);
        console.log(`   Category: ${v.businessCategory || 'N/A'}`);
        console.log(`   Created: ${new Date(v.createdAt).toLocaleString() || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No vendors found in the database.');
    }

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkVendors();
