#!/usr/bin/env node

/**
 * Test Products Creation Script
 * Creates sample products in MongoDB via the API
 * Run this after starting the dev server with: npm run dev
 * Then in another terminal: node test-products.js
 */

const API_BASE_URL = 'http://localhost:3000';

// Sample product images from Cloudinary (public test images)
const SAMPLE_IMAGES = [
  'https://res.cloudinary.com/demo/image/fetch/w_200/https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/IPhone_14_Pro_Max_mockup.svg/440px-IPhone_14_Pro_Max_mockup.svg.png',
  'https://res.cloudinary.com/demo/image/fetch/w_200/https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
];

const SAMPLE_PRODUCTS = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium 6.8" display with advanced AI features, 200MP main camera, and all-day battery life',
    category: 'electronics',
    subcategory: 'mobile_phones',
    brand: 'samsung',
    price: 650000,
    oldPrice: 750000,
    stock: 5,
    condition: 'brand_new',
    badge: '15% OFF',
    specifications: {
      Display: '6.8 inch 120Hz AMOLED',
      Camera: '200MP + 50MP + 10MP',
      Battery: '5000mAh',
      Processor: 'Snapdragon 8 Gen 3',
      RAM: '12GB',
      Storage: '256GB',
    },
    vendorId: 'vendor-001',
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest Apple flagship with titanium design, A17 Pro chip, and exceptional camera system',
    category: 'electronics',
    subcategory: 'mobile_phones',
    brand: 'apple',
    price: 800000,
    oldPrice: 899999,
    stock: 3,
    condition: 'brand_new',
    badge: 'New',
    specifications: {
      Display: '6.7 inch Super Retina XDR',
      Camera: '48MP + 12MP + 12MP',
      Battery: '4685mAh',
      Processor: 'A17 Pro',
      RAM: '8GB',
      Storage: '512GB',
    },
    vendorId: 'vendor-002',
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: 'Powerful 15.6" laptop with RTX 4070, perfect for professionals and creators',
    category: 'electronics',
    subcategory: 'laptops',
    brand: 'dell',
    price: 1500000,
    oldPrice: 1800000,
    stock: 2,
    condition: 'brand_new',
    badge: '20% OFF',
    specifications: {
      Display: '15.6 inch FHD 165Hz',
      GPU: 'RTX 4070',
      CPU: 'Intel Core i9-13900H',
      RAM: '32GB DDR5',
      Storage: '1TB SSD NVMe',
      Weight: '2.04 kg',
    },
    vendorId: 'vendor-001',
  },
  {
    name: 'LG OLED 55" Smart TV',
    description: 'Premium OLED display with 4K resolution and webOS smart platform',
    category: 'appliances',
    subcategory: 'home_appliances',
    brand: 'lg',
    price: 900000,
    oldPrice: 1100000,
    stock: 1,
    condition: 'brand_new',
    badge: '18% OFF',
    specifications: {
      Display: '55 inch 4K OLED',
      Resolution: '3840 x 2160',
      'Refresh Rate': '120Hz',
      'Smart TV': 'webOS 24',
      'Ports': 'HDMI 2.1, USB 3.0',
      'Weight': '19 kg',
    },
    vendorId: 'vendor-003',
  },
  {
    name: 'Samsung 55" QLED TV',
    description: 'Bright and vivid 4K QLED display with quantum dots technology',
    category: 'appliances',
    subcategory: 'home_appliances',
    brand: 'samsung',
    price: 750000,
    oldPrice: 950000,
    stock: 4,
    condition: 'brand_new',
    badge: '21% OFF',
    specifications: {
      Display: '55 inch 4K QLED',
      Resolution: '3840 x 2160',
      'Quantum Dots': 'Yes',
      'Smart TV': 'Tizen',
      'Ports': 'HDMI 2.1, USB 3.0',
      'Weight': '17 kg',
    },
    vendorId: 'vendor-002',
  },
];

async function seedProducts() {
  console.log('\n🌱 Starting Product Seeding...\n');

  for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
    const product = SAMPLE_PRODUCTS[i];
    const imageUrl = SAMPLE_IMAGES[i % SAMPLE_IMAGES.length];

    try {
      // Fetch image and convert to File
      console.log(`⏳ Creating product ${i + 1}/${SAMPLE_PRODUCTS.length}: ${product.name}`);

      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      // Create FormData
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('subcategory', product.subcategory);
      formData.append('brand', product.brand);
      formData.append('price', product.price.toString());
      formData.append('oldPrice', product.oldPrice.toString());
      formData.append('stock', product.stock.toString());
      formData.append('condition', product.condition);
      formData.append('badge', product.badge);
      formData.append('specifications', JSON.stringify(product.specifications));
      formData.append('vendorId', product.vendorId);
      formData.append('image', imageBlob, 'product-image.jpg');

      // Send POST request
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Success! Product ID: ${data.product.id}\n`);
      } else {
        const error = await response.json();
        console.log(`   ❌ Error: ${error.error}\n`);
        console.log(`   Details: ${error.details}\n`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
    }
  }

  console.log('✅ Product seeding complete!\n');
  console.log('Next steps:');
  console.log('  1. Go to http://localhost:3000/');
  console.log('  2. You should now see products on the homepage');
  console.log('  3. Click on any product to view its detail page');
  console.log('  4. Check browser console (F12) to see fetch logs\n');
}

async function checkStatus() {
  try {
    console.log('\n📊 Checking API Status...\n');

    // Check if API is running
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is running');
      console.log(`📦 Total products: ${data.count}`);
      console.log(`🏢 Vendors: ${new Set(data.products.map((p) => p.vendorId)).size}`);
      console.log(`📂 Categories: ${new Set(data.products.map((p) => p.category)).size}\n`);

      if (data.count === 0) {
        console.log('ℹ️  No products found. Starting seeding...\n');
        await seedProducts();
      } else {
        console.log(`ℹ️  Found ${data.count} existing products\n`);
        console.log('Sample products:');
        data.products.slice(0, 3).forEach((p) => {
          console.log(`  - ${p.name} (${p.category} > ${p.subcategory})`);
        });
        console.log();
      }
    } else {
      console.log('❌ API returned error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Failed to connect to API');
    console.log(`⚠️  Make sure the dev server is running: npm run dev`);
    console.log(`⚠️  Error: ${error.message}\n`);
  }
}

// Run the script
checkStatus();
