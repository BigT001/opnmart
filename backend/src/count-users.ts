import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  
  // Get the MongoDB connection
  const connection = app.get('MongooseConnection');
  
  try {
    const db = connection.getClient().db('opnmart');
    const count = await db.collection('users').countDocuments();
    
    console.log('\n========== DATABASE USER COUNT ==========');
    console.log('Total users:', count);
    
    // Get some details
    const users = await db.collection('users').find({}).limit(5).toArray();
    console.log(`\nShowing first ${Math.min(5, count)} users:`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Verified: ${user.isVerified ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
    });
    
    console.log('\n=========================================\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await app.close();
}

bootstrap();
