const mongoose = require('mongoose');

async function nuke() {
  try {
    const uri = 'mongodb+srv://infosamuelstanley_db_user:4Fuk30Q9qahYHLH3@opnmart.ukpo6w5.mongodb.net/?appName=opnmart';
    const dbName = 'opnmart';
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get all products
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products`);
    
    products.forEach(p => {
      console.log(`  - ${p.name}`);
    });

    // DELETE ALL
    if (products.length > 0) {
      const result = await db.collection('products').deleteMany({});
      console.log(`\nDELETED: ${result.deletedCount} products`);
    }

    // Verify
    const remaining = await db.collection('products').countDocuments();
    console.log(`Remaining: ${remaining} products\n`);

    if (remaining === 0) {
      console.log('✓ DATABASE CLEANED SUCCESSFULLY');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

nuke();
