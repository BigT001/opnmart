# MongoDB Setup Guide for OpenMart Backend

## 📦 Installation

MongoDB is now installed in your project:
```bash
npm install mongodb  # Already installed!
```

**Version**: ^7.0.0 (Latest)

---

## 🗄️ Database Configuration

### Environment Variables

Your `.env.local` is now configured with:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=opnmart
```

**For Production**, use MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opnmart?retryWrites=true&w=majority
MONGODB_DB=opnmart
```

---

## 🚀 Quick Start with MongoDB

### 1. Install MongoDB Locally (Windows)

**Option A: MongoDB Community Edition**
```bash
# Download and install from:
# https://www.mongodb.com/try/download/community
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option C: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update MONGODB_URI in `.env.local`

### 2. Start MongoDB Service

**Windows:**
```bash
# If installed as service
net start MongoDB

# Or manually:
mongod
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# or
mongod
```

---

## 📝 Database Collections Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: "buyer" | "seller" | "admin",
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  images: [String],
  sellerId: ObjectId (ref: users),
  stock: Number,
  rating: Number,
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId (ref: users),
  items: [
    {
      productId: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  shippingAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: products),
  userId: ObjectId (ref: users),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

---

## 💻 Using MongoDB in Backend API

### Connection Setup

The connection utility is available at: `services/db/mongodb.ts`

```typescript
import { connectToDatabase, getDb } from '@/services/db/mongodb';

// Connect to database
const { client, db } = await connectToDatabase();

// Or get existing connection
const db = await getDb();
```

### Example: Create a User

```typescript
import { getDb } from '@/services/db/mongodb';

async function createUser(userData) {
  const db = await getDb();
  const result = await db.collection('users').insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}
```

### Example: Get Products

```typescript
import { getDb } from '@/services/db/mongodb';
import { ObjectId } from 'mongodb';

async function getProducts(page = 1, limit = 10) {
  const db = await getDb();
  
  const skip = (page - 1) * limit;
  
  const products = await db
    .collection('products')
    .find()
    .skip(skip)
    .limit(limit)
    .toArray();
  
  const total = await db.collection('products').countDocuments();
  
  return {
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
```

### Example: Update Order Status

```typescript
import { getDb } from '@/services/db/mongodb';
import { ObjectId } from 'mongodb';

async function updateOrderStatus(orderId, status) {
  const db = await getDb();
  
  const result = await db
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    );
  
  return result;
}
```

---

## 🔍 MongoDB Queries Reference

### Find
```typescript
// Find one
await collection.findOne({ _id: new ObjectId(id) });

// Find many
await collection.find({ status: 'active' }).toArray();

// Find with filter and projection
await collection.find({ category: 'electronics' })
  .project({ name: 1, price: 1 })
  .limit(10)
  .toArray();
```

### Insert
```typescript
// Insert one
await collection.insertOne({ name: 'Product', price: 100 });

// Insert many
await collection.insertMany([...documents]);
```

### Update
```typescript
// Update one
await collection.updateOne(
  { _id: new ObjectId(id) },
  { $set: { status: 'shipped' } }
);

// Update many
await collection.updateMany(
  { status: 'pending' },
  { $set: { status: 'confirmed' } }
);
```

### Delete
```typescript
// Delete one
await collection.deleteOne({ _id: new ObjectId(id) });

// Delete many
await collection.deleteMany({ status: 'archived' });
```

### Aggregation
```typescript
// Get product count by category
await collection.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]).toArray();
```

---

## 🔐 Security Best Practices

### 1. Connection Pooling
✅ Already configured in `mongodb.ts` with:
- Max pool size: 10
- Connection caching
- Automatic reconnection

### 2. Authentication
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
```

### 3. Password Hashing
```typescript
import bcrypt from 'bcrypt';

// Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10);
```

### 4. Input Validation
```typescript
import { ObjectId } from 'mongodb';

// Validate ObjectId
if (!ObjectId.isValid(id)) {
  throw new Error('Invalid ID');
}
```

### 5. Rate Limiting
```typescript
// Add rate limiting middleware to your API
npm install express-rate-limit
```

---

## 📊 Indexes for Performance

Create these indexes in MongoDB:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Products
db.products.createIndex({ category: 1 });
db.products.createIndex({ sellerId: 1 });
db.products.createIndex({ rating: -1 });

// Orders
db.orders.createIndex({ buyerId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

// Reviews
db.reviews.createIndex({ productId: 1 });
db.reviews.createIndex({ userId: 1 });
```

---

## 🧪 Testing MongoDB Connection

### Test Script
```typescript
// test-db.ts
import { connectToDatabase } from '@/services/db/mongodb';

async function testConnection() {
  try {
    const { client, db } = await connectToDatabase();
    
    // Test write
    const result = await db.collection('test').insertOne({ 
      test: true, 
      createdAt: new Date() 
    });
    console.log('✅ Write successful:', result.insertedId);
    
    // Test read
    const doc = await db.collection('test').findOne({ 
      _id: result.insertedId 
    });
    console.log('✅ Read successful:', doc);
    
    // Cleanup
    await db.collection('test').deleteOne({ _id: result.insertedId });
    await client.close();
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testConnection();
```

Run with:
```bash
npx ts-node test-db.ts
```

---

## 🚀 Backend Integration Example

### Express Route Example
```typescript
import express from 'express';
import { getDb } from '@/services/db/mongodb';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const db = await getDb();
    const products = await db
      .collection('products')
      .find()
      .limit(10)
      .toArray();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const db = await getDb();
    const product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

---

## 📚 Additional Resources

- [MongoDB Official Docs](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas/register)
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI tool

---

## ⚙️ Next Steps

1. ✅ MongoDB is installed (`mongodb@7.0.0`)
2. ✅ Connection utility created (`services/db/mongodb.ts`)
3. ✅ Environment variables configured
4. 🔄 **Next**: Install MongoDB locally or use MongoDB Atlas
5. 🔄 **Then**: Create backend API routes
6. 🔄 **Finally**: Test API connection from frontend

---

**Status**: ✅ MongoDB Ready
**Connection File**: `services/db/mongodb.ts`
**Config**: `.env.local` with `MONGODB_URI` and `MONGODB_DB`
