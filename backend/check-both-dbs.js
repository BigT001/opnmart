const mongoose = require('mongoose');

async function checkBothDBs() {
  try {
    // First database (from earlier deletion attempts)
    const uri1 = 'mongodb+srv://opnmart:2%40yoWj1tl%40@opnmart-cluster.7j3k9.mongodb.net/opnmart?retryWrites=true&w=majority';
    
    // Second database (from .env file)
    const uri2 = 'mongodb+srv://infosamuelstanley_db_user:4Fuk30Q9qahYHLH3@opnmart.ukpo6w5.mongodb.net/?appName=opnmart';

    console.log('Checking Database 1...');
    let conn1 = await mongoose.createConnection(uri1).asPromise();
    let db1 = conn1.db;
    let count1 = await db1.collection('products').countDocuments();
    console.log(`  DB1: ${count1} products`);
    await conn1.close();

    console.log('Checking Database 2...');
    let conn2 = await mongoose.createConnection(uri2).asPromise();
    let db2 = conn2.db;
    let count2 = await db2.collection('products').countDocuments();
    console.log(`  DB2: ${count2} products`);
    
    if (count2 > 0) {
      const products = await db2.collection('products').find({}).toArray();
      products.forEach(p => {
        console.log(`    - ${p.name}`);
      });
    }
    
    await conn2.close();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

checkBothDBs();
