# Mongoose MongoDB Setup - Complete Guide

**Status**: ✅ Fully Configured with Schemas & API Routes

---

## 📦 What's Installed

- **mongoose** (^7.0.0) - MongoDB object modeling
- **mongodb** (^7.0.0) - MongoDB driver (included with Mongoose)
- **next-cloudinary** - Image hosting integration
- **next** (16.0.6) - Next.js framework

---

## 🗄️ Database Schema Overview

### 1. **Category Schema**
Stores main marketplace categories (Electronics, Appliances)

```typescript
{
  _id: ObjectId,
  id: String (unique),           // 'electronics', 'appliances'
  name: String,                  // 'Electronics', 'Home & Appliances'
  icon: String,                  // '📱', '🏠'
  description?: String,
  isActive: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `id`, `isActive`, `displayOrder`

### 2. **Subcategory Schema**
Stores subcategories under each main category

```typescript
{
  _id: ObjectId,
  id: String (unique),           // 'mobile_phones', 'ac', etc.
  categoryId: String,            // Reference to Category
  name: String,                  // 'Mobile Phones', 'Air Conditioners'
  icon: String,
  description?: String,
  isActive: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `id`, `categoryId`, `isActive`, compound `[categoryId, displayOrder]`

### 3. **Filter Schema**
Stores available filters for categories/subcategories

```typescript
{
  _id: ObjectId,
  id: String (unique),           // 'brand', 'condition', 'price_range'
  categoryId?: String,           // Optional: category-specific filter
  subcategoryId?: String,        // Optional: subcategory-specific filter
  name: String,                  // 'Brand', 'Condition', 'Price Range'
  type: String,                  // 'text', 'select', 'range', 'checkbox', 'radio'
  options: [                      // Available filter options
    {
      value: String,            // 'samsung', 'brand_new', '0-10000'
      label: String,            // 'Samsung', 'Brand New', '₦0 - ₦10,000'
      count?: Number            // Product count for this filter
    }
  ],
  isActive: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `id`, `categoryId`, `subcategoryId`, `isActive`

---

## 🔌 Mongoose Connection

**File**: `services/db/mongoose.ts`

```typescript
import { connectDB, disconnectDB, getConnection, isConnected } from '@/services/db/mongoose';

// Connect to database
const connection = await connectDB();

// Check if connected
if (isConnected()) {
  console.log('Connected to MongoDB');
}

// Get current connection
const conn = getConnection();

// Disconnect
await disconnectDB();
```

### Connection Features
- ✅ Connection caching (prevents reconnection)
- ✅ Global connection management
- ✅ Serverless environment support
- ✅ Connection pooling (max 10 connections)
- ✅ Connection error handling

---

## 🌱 Database Seeding

### Initialize Database with All Categories

**Endpoint**: `POST /api/seed`

```bash
# Check seed status
curl http://localhost:3000/api/seed

# Response:
{
  "success": true,
  "seeded": false,
  "counts": {
    "categories": 0,
    "subcategories": 0,
    "filters": 0
  }
}

# Seed database
curl -X POST http://localhost:3000/api/seed

# Response:
{
  "success": true,
  "message": "Database seeded successfully!",
  "data": {
    "categories": {
      "count": 2,
      "items": ["electronics", "appliances"]
    },
    "subcategories": {
      "count": 18,
      "byCategory": {
        "electronics": 13,
        "appliances": 5
      }
    },
    "filters": {
      "count": 8,
      "byCategory": {
        "electronics": 4,
        "appliances": 4
      }
    }
  }
}
```

### What Gets Seeded

**Categories** (2):
- 📱 Electronics
- 🏠 Appliances

**Electronics Subcategories** (13):
1. Mobile Phones
2. Phone Accessories
3. Laptops
4. Desktop Computers
5. Computer Accessories
6. Tablets
7. Audio & Music
8. Gaming
9. Cameras
10. Networking
11. Smart Gadgets
12. Office Electronics
13. Power & Energy

**Appliances Subcategories** (5):
1. Air Conditioners
2. Refrigerators & Freezers
3. Generators & Power
4. Kitchen Appliances
5. Home Appliances

**Filters** (8):
- Brand (Electronics & Appliances)
- Condition (Electronics & Appliances)
- Price Range (Electronics & Appliances)
- Warranty (Electronics & Appliances)

---

## 📡 API Endpoints

### 1. Get All Categories
```bash
GET /api/categories

Response:
{
  "success": true,
  "data": [...],
  "count": 2
}
```

### 2. Get Subcategories by Category
```bash
GET /api/subcategories?categoryId=electronics

Response:
{
  "success": true,
  "data": [...],
  "count": 13,
  "categoryId": "electronics"
}

# Get all subcategories
GET /api/subcategories
```

### 3. Get Filters by Category/Subcategory
```bash
# Get filters for electronics category
GET /api/filters?categoryId=electronics

# Get filters for specific subcategory
GET /api/filters?categoryId=electronics&subcategoryId=mobile_phones

Response:
{
  "success": true,
  "data": [...],
  "count": 4,
  "categoryId": "electronics",
  "subcategoryId": "all"
}
```

---

## 💻 Frontend Usage

### Fetch Categories on App Load
```typescript
import { useQuery } from '@/hooks';

export function CategoriesNav() {
  const { data: categories } = useQuery({
    key: ['categories'],
    url: '/api/categories',
  });

  return (
    <nav>
      {categories?.map(cat => (
        <Link key={cat.id} href={`/categories/${cat.id}`}>
          {cat.icon} {cat.name}
        </Link>
      ))}
    </nav>
  );
}
```

### Display Subcategories
```typescript
export function SubcategoryList({ categoryId }: { categoryId: string }) {
  const { data: subcategories } = useQuery({
    key: ['subcategories', categoryId],
    url: `/api/subcategories?categoryId=${categoryId}`,
  });

  return (
    <div>
      {subcategories?.map(sub => (
        <div key={sub.id}>
          {sub.icon} {sub.name}
        </div>
      ))}
    </div>
  );
}
```

### Display Filters
```typescript
export function FilterSidebar({ categoryId }: { categoryId: string }) {
  const { data: filters } = useQuery({
    key: ['filters', categoryId],
    url: `/api/filters?categoryId=${categoryId}`,
  });

  return (
    <aside>
      {filters?.map(filter => (
        <FilterGroup key={filter.id} filter={filter} />
      ))}
    </aside>
  );
}
```

---

## 🔧 Backend Usage

### Import Models
```typescript
import { Category } from '@/models/Category';
import { Subcategory } from '@/models/Subcategory';
import { Filter } from '@/models/Filter';
import { connectDB } from '@/services/db/mongoose';
```

### Query Examples

**Get all active categories**:
```typescript
await connectDB();
const categories = await Category.find({ isActive: true });
```

**Get subcategories for a category**:
```typescript
const subcategories = await Subcategory.find({
  categoryId: 'electronics',
  isActive: true
}).sort({ displayOrder: 1 });
```

**Get filters for a category**:
```typescript
const filters = await Filter.find({
  categoryId: 'electronics',
  isActive: true
}).sort({ displayOrder: 1 });
```

**Create a new category**:
```typescript
const category = await Category.create({
  id: 'furniture',
  name: 'Furniture',
  icon: '🪑',
  description: 'Home furniture',
  displayOrder: 3,
});
```

**Update filter options**:
```typescript
await Filter.findByIdAndUpdate(filterId, {
  options: [
    { value: 'samsung', label: 'Samsung', count: 150 },
    { value: 'lg', label: 'LG', count: 230 },
  ],
});
```

**Deactivate a category**:
```typescript
await Category.findByIdAndUpdate(categoryId, { isActive: false });
```

---

## 🔄 Database Synchronization

### Sync Data from Config Files
```typescript
// If you update config files, resync with:
// 1. Clear database
await Category.deleteMany({});
await Subcategory.deleteMany({});
await Filter.deleteMany({});

// 2. Reseed database
POST /api/seed
```

---

## 📊 Data Statistics

After seeding:
- **Categories**: 2
- **Subcategories**: 18
- **Filters**: 8
- **Filter Options**: 50+

**Categories Breakdown**:
```
Electronics
├── 13 Subcategories
│   ├── Mobile Phones
│   ├── Phone Accessories
│   ├── Laptops
│   ├── Desktop Computers
│   ├── Computer Accessories
│   ├── Tablets
│   ├── Audio & Music
│   ├── Gaming
│   ├── Cameras
│   ├── Networking
│   ├── Smart Gadgets
│   ├── Office Electronics
│   └── Power & Energy
└── 4 Filters (Brand, Condition, Price, Warranty)

Appliances
├── 5 Subcategories
│   ├── Air Conditioners
│   ├── Refrigerators & Freezers
│   ├── Generators & Power
│   ├── Kitchen Appliances
│   └── Home Appliances
└── 4 Filters (Brand, Condition, Price, Warranty)
```

---

## 🧪 Testing Database Connection

### Test Script
```typescript
// test-db.ts
import { connectDB, isConnected } from '@/services/db/mongoose';
import { Category } from '@/models/Category';

async function testConnection() {
  try {
    await connectDB();
    
    if (isConnected()) {
      console.log('✅ Connected to MongoDB');
      
      const categoriesCount = await Category.countDocuments();
      console.log(`✅ Found ${categoriesCount} categories`);
      
      const categories = await Category.find().limit(5);
      console.log('✅ Sample categories:', categories);
    }
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

---

## 🛡️ Security Best Practices

✅ **Already Configured**:
- Connection pooling
- Error handling
- Indexing for performance
- Data validation via schemas

**Additional Recommendations**:
- [ ] Enable MongoDB authentication
- [ ] Use connection string encryption
- [ ] Implement rate limiting on API endpoints
- [ ] Add request validation middleware
- [ ] Set up database backups
- [ ] Monitor connection metrics

---

## 🚀 Next Steps

1. ✅ Start the development server: `npm run dev`
2. ✅ Seed the database: `POST http://localhost:3000/api/seed`
3. ✅ Verify seeding: `GET http://localhost:3000/api/seed`
4. ✅ Test categories API: `GET http://localhost:3000/api/categories`
5. 🔄 Create Product model and schema
6. 🔄 Implement product filtering
7. 🔄 Connect to frontend components

---

## 📂 File Structure

```
services/db/
├── mongoose.ts          # Connection management
└── mongodb.ts           # Raw MongoDB driver (reference)

models/
├── Category.ts          # Category schema
├── Subcategory.ts       # Subcategory schema
├── Filter.ts            # Filter schema
└── Product.ts           # (To be created)

app/api/
├── categories/route.ts  # GET /api/categories
├── subcategories/route.ts  # GET /api/subcategories
├── filters/route.ts     # GET /api/filters
└── seed/route.ts        # POST/GET /api/seed

scripts/
└── seedDatabase.ts      # Seeding utility
```

---

**Status**: ✅ Mongoose Setup Complete
**Database**: Ready for Use
**API Endpoints**: Functional
**Next Action**: Seed database and test endpoints
