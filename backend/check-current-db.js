const mongoose = require('mongoose');
require('dotenv').config();

async function checkCurrentDB() {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;
    
    console.log(`Connecting to: ${uri?.substring(0, 60)}...`);
    console.log(`Database: ${dbName}\n`);
    
    const conn = await mongoose.connect(uri);
    const db = conn.connection.db;
    
    const products = await db.collection('products').find({}).limit(10).toArray();
    
    console.log(`Found ${products.length} products:`);
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} (ID: ${p._id})`);
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

checkCurrentDB();
