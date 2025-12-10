const mongoose = require('mongoose');
require('dotenv').config();

async function deleteAllProducts() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://opnmart:2%40yoWj1tl%40@opnmart-cluster.7j3k9.mongodb.net/opnmart?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get all products first
    const allProducts = await db.collection('products').find({}).toArray();
    console.log(`Found ${allProducts.length} products to delete`);
    
    allProducts.forEach(p => {
      console.log(`  - ${p.name} (ID: ${p._id})`);
    });

    // Delete all
    const result = await db.collection('products').deleteMany({});
    console.log(`\n✓ Deleted ${result.deletedCount} products`);

    // Verify
    const count = await db.collection('products').countDocuments();
    console.log(`✓ Verified: ${count} products remaining`);

    await mongoose.connection.close();
    console.log('✓ Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

deleteAllProducts();
