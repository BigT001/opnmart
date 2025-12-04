const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://infosamuelstanley_db_user:4Fuk30Q9qahYHLH3@cluster0.mmkc1xl.mongodb.net/opnmart?retryWrites=true&w=majority&appName=Cluster0';

async function testImages() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check for products with images
    const products = await db.collection('products').find({}).limit(5).toArray();
    
    console.log(`\n📦 Found ${products.length} products\n`);
    
    products.forEach((product, idx) => {
      console.log(`Product ${idx + 1}: ${product.name}`);
      console.log(`  - Main image: ${product.image ? 'YES' : 'NO'}`);
      console.log(`  - Additional images count: ${product.images ? product.images.length : 0}`);
      if (product.images && product.images.length > 0) {
        console.log(`  - Images array: ${JSON.stringify(product.images, null, 2)}`);
      }
      console.log('');
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testImages();
