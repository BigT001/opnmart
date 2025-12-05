const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  icon: { type: String, required: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

const categories = [
  { id: 'electronics', name: 'Electronics', icon: '📱', description: 'Electronics and gadgets', displayOrder: 1 },
  { id: 'fashion', name: 'Fashion & Clothing', icon: '👕', description: 'Clothing and fashion items', displayOrder: 2 },
  { id: 'home', name: 'Home & Garden', icon: '🏡', description: 'Home and garden products', displayOrder: 3 },
  { id: 'sports', name: 'Sports & Outdoors', icon: '⚽', description: 'Sports and outdoor equipment', displayOrder: 4 },
  { id: 'books', name: 'Books & Media', icon: '📚', description: 'Books and media products', displayOrder: 5 },
  { id: 'health', name: 'Health & Beauty', icon: '💄', description: 'Health and beauty products', displayOrder: 6 },
  { id: 'toys', name: 'Toys & Games', icon: '🎮', description: 'Toys and games for all ages', displayOrder: 7 },
  { id: 'food', name: 'Food & Beverages', icon: '🍕', description: 'Food and beverage products', displayOrder: 8 },
  { id: 'automotive', name: 'Automotive', icon: '🚗', description: 'Automotive products and accessories', displayOrder: 9 },
  { id: 'appliances', name: 'Appliances', icon: '🔧', description: 'Home appliances', displayOrder: 10 },
];

async function seedCategories() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://sta99175_db_user:n45LxR23xyyf7D9l@cluster0.7igdyfs.mongodb.net/?appName=Cluster0';
    const dbName = process.env.MONGODB_DB || 'opnmart';
    await mongoose.connect(uri, { dbName });
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const result = await Category.insertMany(categories);
    console.log(`✓ Seeded ${result.length} categories`);
    result.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
