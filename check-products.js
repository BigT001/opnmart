const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://infosamuelstanley_db_user:4Fuk30Q9qahYHLH3@opnmart.ukpo6w5.mongodb.net/?appName=opnmart';

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 10000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const db = mongoose.connection.db;
  
  try {
    // Get product count
    const productCount = await db.collection('products').countDocuments({});
    console.log(`\n📊 Total Products: ${productCount}`);
    
    if (productCount > 0) {
      console.log('\n📦 Sample Products (first 5):');
      const products = await db.collection('products').find({}).limit(5).toArray();
      products.forEach((product, index) => {
        console.log(`\n  ${index + 1}. ${product.name}`);
        console.log(`     Category: ${product.category} > ${product.subcategory}`);
        console.log(`     Brand: ${product.brand}`);
        console.log(`     Price: ₦${product.price}`);
        console.log(`     Condition: ${product.condition}`);
      });
    } else {
      console.log('\n❌ No products found in database');
    }
    
    // Get collection info
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections in Database:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error fetching data:', err);
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('❌ Connection Error:', err.message);
  console.log('\n⚠️  Your IP address may not be whitelisted in MongoDB Atlas.');
  console.log('   Go to: https://cloud.mongodb.com/ > Network Access > Add IP Address');
  process.exit(1);
});
