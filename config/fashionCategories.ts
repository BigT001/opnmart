/**
 * Fashion Category Structure
 * Clothing, Footwear, Accessories, and More
 */

export const FASHION_CATEGORIES = {
  CLOTHING: {
    id: 'clothing',
    name: 'Clothing',
    description: 'Men, Women, and Kids Clothing',
    icon: '👕',
    subcategories: {
      MENS_CLOTHING: { id: 'mens-clothing', name: "Men's Clothing" },
      WOMENS_CLOTHING: { id: 'womens-clothing', name: "Women's Clothing" },
      KIDS_CLOTHING: { id: 'kids-clothing', name: "Kids' Clothing" },
      ACTIVEWEAR: { id: 'activewear', name: 'Activewear & Sports' },
    },
    brands: [
      'Nike', 'Adidas', 'Puma', 'Gucci', 'Zara', 'H&M', 'Tommy Hilfiger', 'Ralph Lauren',
      'Levis', 'Calvin Klein', 'Polo', 'ASOS', 'Urban Outfitters', 'Uniqlo', 'Lacoste',
      'Burberry', 'Fendi', 'Louis Vuitton', 'Dolce & Gabbana', 'Versace'
    ],
    filters: {
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      color: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray'],
      material: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Denim', 'Leather', 'Linen', 'Blend'],
      style: ['Casual', 'Formal', 'Party', 'Sports', 'Traditional', 'Ethnic'],
      priceRange: ['₦0 - ₦5,000', '₦5,000 - ₦10,000', '₦10,000 - ₦20,000', '₦20,000 - ₦50,000', '₦50,000+'],
    },
  },

  FOOTWEAR: {
    id: 'footwear',
    name: 'Footwear',
    description: 'Shoes, Sneakers, Boots, and Sandals',
    icon: '👟',
    subcategories: {
      MENS_SHOES: { id: 'mens-shoes', name: "Men's Shoes" },
      WOMENS_SHOES: { id: 'womens-shoes', name: "Women's Shoes" },
      KIDS_SHOES: { id: 'kids-shoes', name: "Kids' Shoes" },
      SNEAKERS: { id: 'sneakers', name: 'Sneakers' },
      BOOTS: { id: 'boots', name: 'Boots' },
      SANDALS: { id: 'sandals', name: 'Sandals & Slippers' },
      SPORTS_SHOES: { id: 'sports-shoes', name: 'Sports Shoes' },
    },
    brands: [
      'Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance', 'Reebok', 'Clarks',
      'Dr. Martens', 'Timberland', 'Gucci', 'Louis Vuitton', 'Crocs', 'Skechers', 'Fila'
    ],
    filters: {
      size: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'],
      color: ['Black', 'White', 'Red', 'Blue', 'Brown', 'Gray', 'Green', 'Pink', 'Yellow'],
      style: ['Casual', 'Formal', 'Sports', 'Heels', 'Flats', 'Boots', 'Sandals'],
      material: ['Leather', 'Suede', 'Canvas', 'Synthetic', 'Rubber', 'Mesh'],
      priceRange: ['₦2,000 - ₦10,000', '₦10,000 - ₦20,000', '₦20,000 - ₦50,000', '₦50,000+'],
    },
  },

  ACCESSORIES: {
    id: 'accessories',
    name: 'Fashion Accessories',
    description: 'Bags, Belts, Scarves, and More',
    icon: '👜',
    subcategories: {
      BAGS: { id: 'bags', name: 'Bags & Backpacks' },
      BELTS: { id: 'belts', name: 'Belts & Suspenders' },
      SCARVES: { id: 'scarves', name: 'Scarves & Shawls' },
      HATS: { id: 'hats', name: 'Hats & Caps' },
      GLOVES: { id: 'gloves', name: 'Gloves & Mittens' },
      JEWELRY: { id: 'jewelry', name: 'Jewelry' },
      SUNGLASSES: { id: 'sunglasses', name: 'Sunglasses' },
      WATCHES: { id: 'watches', name: 'Watches' },
    },
    brands: [
      'Gucci', 'Louis Vuitton', 'Prada', 'Burberry', 'Coach', 'Michael Kors', 'Tommy Hilfiger',
      'Fossil', 'Timex', 'Seiko', 'Casio', 'Rolex', 'Pandora', 'Swarovski'
    ],
    filters: {
      style: ['Casual', 'Formal', 'Sports', 'Designer', 'Vintage'],
      material: ['Leather', 'Suede', 'Canvas', 'Metal', 'Plastic', 'Fabric'],
      color: ['Black', 'Brown', 'Red', 'Blue', 'Gold', 'Silver', 'Multicolor'],
      priceRange: ['₦2,000 - ₦10,000', '₦10,000 - ₦25,000', '₦25,000 - ₦50,000', '₦50,000+'],
    },
  },

  TRADITIONAL_WEAR: {
    id: 'traditional-wear',
    name: 'Traditional & Cultural Wear',
    description: 'Nigerian, African & International Traditional Clothing',
    icon: '👘',
    subcategories: {
      MENS_TRADITIONAL: { id: 'mens-traditional', name: "Men's Traditional Wear" },
      WOMENS_TRADITIONAL: { id: 'womens-traditional', name: "Women's Traditional Wear" },
      KIDS_TRADITIONAL: { id: 'kids-traditional', name: "Kids' Traditional Wear" },
      FABRICS: { id: 'fabrics', name: 'Traditional Fabrics' },
    },
    brands: [
      'Vlisco', 'Ankara Premium', 'Akuaba', 'Lekela London', 'Mami Wata London',
      'Oxfam Nigeria', 'Dala Designs', 'Rhoweaa'
    ],
    filters: {
      style: ['Ankara', 'Adire', 'Lace', 'Damask', 'Batik', 'Kente', 'Aso Oke'],
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      color: ['Multicolor', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Purple'],
      occasion: ['Wedding', 'Festival', 'Casual', 'Formal', 'Daily Wear'],
      priceRange: ['₦5,000 - ₦15,000', '₦15,000 - ₦30,000', '₦30,000 - ₦50,000', '₦50,000+'],
    },
  },

  SWIMWEAR: {
    id: 'swimwear',
    name: 'Swimwear & Beachwear',
    description: 'Bikinis, Swim Trunks, and Beach Accessories',
    icon: '🩱',
    subcategories: {
      WOMENS_SWIMWEAR: { id: 'womens-swimwear', name: "Women's Swimwear" },
      MENS_SWIMWEAR: { id: 'mens-swimwear', name: "Men's Swimwear" },
      KIDS_SWIMWEAR: { id: 'kids-swimwear', name: "Kids' Swimwear" },
      BEACH_ACCESSORIES: { id: 'beach-accessories', name: 'Beach Accessories' },
    },
    brands: ['Speedo', 'Rip Curl', 'Billabong', 'Tommy Bahama', 'O\'Neill', 'Hurley'],
    filters: {
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      color: ['Black', 'Blue', 'Red', 'Pink', 'White', 'Multicolor'],
      style: ['One Piece', 'Bikini', 'High Waisted', 'Shorts', 'Rash Guard'],
      material: ['Nylon', 'Spandex', 'Polyester', 'Lycra'],
    },
  },

  INNERWEAR: {
    id: 'innerwear',
    name: 'Innerwear & Lingerie',
    description: 'Bras, Briefs, Boxers, and More',
    icon: '👙',
    subcategories: {
      BRAS: { id: 'bras', name: 'Bras' },
      BRIEFS: { id: 'briefs', name: 'Briefs & Panties' },
      BOXERS: { id: 'boxers', name: "Men's Boxers & Briefs" },
      LINGERIE: { id: 'lingerie', name: 'Lingerie' },
      SLEEPWEAR: { id: 'sleepwear', name: 'Sleepwear & Loungewear' },
    },
    brands: ['Victoria\'s Secret', 'Triumph', 'Playtex', 'Jockey', 'Calvin Klein', 'Tommy John'],
    filters: {
      size: ['32A', '32B', '34A', '34B', '36A', '36B', '38A', '38B', 'XS', 'S', 'M', 'L', 'XL'],
      color: ['Black', 'White', 'Nude', 'Red', 'Blue', 'Pink', 'Purple'],
      style: ['Classic', 'Thong', 'Boyshort', 'Bikini', 'Bra', 'Balconette'],
      material: ['Cotton', 'Polyester', 'Lace', 'Satin', 'Silk'],
    },
  },
} as const;

export const FASHION_SUBCATEGORIES = {
  // Clothing
  MENS_CLOTHING: 'mens-clothing',
  WOMENS_CLOTHING: 'womens-clothing',
  KIDS_CLOTHING: 'kids-clothing',
  ACTIVEWEAR: 'activewear',

  // Footwear
  MENS_SHOES: 'mens-shoes',
  WOMENS_SHOES: 'womens-shoes',
  KIDS_SHOES: 'kids-shoes',
  SNEAKERS: 'sneakers',
  BOOTS: 'boots',
  SANDALS: 'sandals',
  SPORTS_SHOES: 'sports-shoes',

  // Accessories
  BAGS: 'bags',
  BELTS: 'belts',
  SCARVES: 'scarves',
  HATS: 'hats',
  GLOVES: 'gloves',
  JEWELRY: 'jewelry',
  SUNGLASSES: 'sunglasses',
  WATCHES: 'watches',

  // Traditional
  MENS_TRADITIONAL: 'mens-traditional',
  WOMENS_TRADITIONAL: 'womens-traditional',
  KIDS_TRADITIONAL: 'kids-traditional',
  FABRICS: 'fabrics',

  // Swimwear
  WOMENS_SWIMWEAR: 'womens-swimwear',
  MENS_SWIMWEAR: 'mens-swimwear',
  KIDS_SWIMWEAR: 'kids-swimwear',
  BEACH_ACCESSORIES: 'beach-accessories',

  // Innerwear
  BRAS: 'bras',
  BRIEFS: 'briefs',
  BOXERS: 'boxers',
  LINGERIE: 'lingerie',
  SLEEPWEAR: 'sleepwear',
} as const;
