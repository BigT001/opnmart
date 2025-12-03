#!/usr/bin/env node

/**
 * Database Setup Verification Script
 * Checks that all Mongoose components are properly configured
 */

import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const requiredFiles = [
  'services/db/mongoose.ts',
  'models/Category.ts',
  'models/Subcategory.ts',
  'models/Filter.ts',
  'app/api/categories/route.ts',
  'app/api/subcategories/route.ts',
  'app/api/filters/route.ts',
  'app/api/seed/route.ts',
];

console.log('\n🔍 Mongoose Database Setup Verification\n');
console.log('=' .repeat(50));

let allFilesExist = true;

requiredFiles.forEach((file) => {
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('=' .repeat(50));

// Check package.json for mongoose
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const hasMongoose = packageJson.dependencies?.mongoose || packageJson.devDependencies?.mongoose;

console.log('\n📦 Dependencies Check:');
console.log(`${hasMongoose ? '✅' : '❌'} mongoose installed`);

// Check .env.local for MONGODB_URI
const envPath = path.join(projectRoot, '.env.local');
const envExists = fs.existsSync(envPath);
const envContent = envExists ? fs.readFileSync(envPath, 'utf-8') : '';
const hasMongoUri = envContent.includes('MONGODB_URI');

console.log(`${envExists ? '✅' : '❌'} .env.local exists`);
console.log(`${hasMongoUri ? '✅' : '❌'} MONGODB_URI configured`);

console.log('\n' + '=' .repeat(50));

if (allFilesExist && hasMongoose && hasMongoUri) {
  console.log('\n✅ All Mongoose components are properly configured!\n');
  console.log('Next Steps:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Seed database: curl -X POST http://localhost:3000/api/seed');
  console.log('  3. Check status: curl http://localhost:3000/api/seed');
  console.log('  4. Query categories: curl http://localhost:3000/api/categories\n');
} else {
  console.log('\n❌ Some components are missing!\n');
  console.log('Missing:');
  if (!allFilesExist) console.log('  - Model or API route files');
  if (!hasMongoose) console.log('  - mongoose package');
  if (!hasMongoUri) console.log('  - MONGODB_URI environment variable\n');
}
