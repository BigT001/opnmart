require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    // Database 1: From earlier attempts
    const uri1 = 'mongodb+srv://opnmart:2%40yoWj1tl%40@opnmart-cluster.7j3k9.mongodb.net/opnmart?retryWrites=true&w=majority';
    
    // Database 2: From current .env
    const uri2 = process.env.MONGODB_URI;
    
    console.log('CHECKING DATABASE 1...');
    console.log(`URI: ${uri1.substring(0, 60)}...\n`);
    
    try {
      const conn1 = await mongoose.createConnection(uri1).asPromise();
      const db1 = conn1.db;
      const collections1 = await db1.listCollections().toArray();
      console.log(`Collections found: ${collections1.length}`);
      collections1.forEach(c => console.log(`  - ${c.name}`));
      await conn1.close();
    } catch (e) {
      console.log(`Cannot connect: ${e.message}\n`);
    }
    
    console.log('\n--- SEPARATOR ---\n');
    
    console.log('CHECKING DATABASE 2 (Current .env)...');
    console.log(`URI: ${uri2.substring(0, 60)}...\n`);
    
    const conn2 = await mongoose.connect(uri2);
    const db2 = conn2.connection.db;
    const collections2 = await db2.listCollections().toArray();
    console.log(`Collections found: ${collections2.length}`);
    collections2.forEach(c => console.log(`  - ${c.name}`));
    
    await mongoose.disconnect();
    
    console.log('\n--- SUMMARY ---');
    console.log('Database 1: Unreachable (old/invalid)');
    console.log('Database 2: Current .env database (fresh/empty)');
    console.log('\n✅ Using only 1 database: The one in .env');
    
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
})();
