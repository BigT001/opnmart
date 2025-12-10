/**
 * Electronics Marketplace Category Structure
 * Tailored for Computer Village, Ikeja & Nigerian market
 */

export enum CONDITION {
  BRAND_NEW = 'brand_new',
  UK_USED = 'uk_used',
  REFURBISHED = 'refurbished',
  USED = 'used',
}

export enum WARRANTY_PERIOD {
  NO_WARRANTY = 'no_warranty',
  THREE_MONTHS = '3_months',
  SIX_MONTHS = '6_months',
  ONE_YEAR = '1_year',
  TWO_YEARS = '2_years',
  THREE_YEARS = '3_years',
}

export const CATEGORIES = {
  ELECTRONICS: 'electronics',
  APPLIANCES: 'appliances',
  FASHION: 'fashion',
} as const;

export const SUBCATEGORIES = {
  // ==================== ELECTRONICS ====================
  // 1. Mobile Phones & Accessories
  MOBILE_PHONES: 'mobile_phones',
  PHONE_ACCESSORIES: 'phone_accessories',

  // 2. Computers, Laptops & Accessories
  LAPTOPS: 'laptops',
  DESKTOP_COMPUTERS: 'desktop_computers',
  COMPUTER_ACCESSORIES: 'computer_accessories',

  // 3. Tablets & Accessories
  TABLETS: 'tablets',

  // 4. Audio & Music Devices
  AUDIO_MUSIC: 'audio_music',

  // 5. Gaming
  GAMING: 'gaming',

  // 6. Cameras & Photography
  CAMERAS: 'cameras',

  // 7. Networking & Internet Devices
  NETWORKING: 'networking',

  // 8. CCTV & Security Cameras
  CCTV: 'cctv',

  // 9. Smart Gadgets
  SMART_GADGETS: 'smart_gadgets',

  // 9. Office Electronics
  OFFICE_ELECTRONICS: 'office_electronics',

  // 10. Power & Energy
  POWER_ENERGY: 'power_energy',

  // 11. Power Banks
  POWER_BANKS: 'power_banks',

  // 12. Microphones
  MICROPHONES: 'microphones',

  // 13. Televisions
  TELEVISIONS: 'televisions',

  // ==================== APPLIANCES ====================
  // 1. Refrigerators & Freezers
  REFRIGERATORS: 'refrigerators',

  // 2. Air Conditioners
  AC: 'ac',

  // 3. Generators & Power Solutions
  GENERATORS: 'generators',

  // 4. Washing Machines & Dryers
  WASHING_MACHINES: 'washing_machines',

  // 5. Cookers & Ovens
  COOKERS_OVENS: 'cookers_ovens',

  // 6. Home Cleaning Appliances
  CLEANING_APPLIANCES: 'cleaning_appliances',

  // 7. Fans & Cooling Appliances
  FANS_COOLING: 'fans_cooling',

  // 8. Inverter & Solar Appliances
  INVERTER_SOLAR: 'inverter_solar',

  // 9. Kitchen Appliances
  KITCHEN_APPLIANCES: 'kitchen_appliances',

  // 10. Home Appliances
  HOME_APPLIANCES: 'home_appliances',

  // ==================== FASHION ====================
  // 1. Clothing
  MENS_CLOTHING: 'mens_clothing',
  WOMENS_CLOTHING: 'womens_clothing',
  KIDS_CLOTHING: 'kids_clothing',
  ACTIVEWEAR: 'activewear',

  // 2. Footwear
  MENS_SHOES: 'mens_shoes',
  WOMENS_SHOES: 'womens_shoes',
  KIDS_SHOES: 'kids_shoes',
  SNEAKERS: 'sneakers',
  BOOTS: 'boots',
  SANDALS: 'sandals',
  SPORTS_SHOES: 'sports_shoes',

  // 3. Accessories
  BAGS: 'bags',
  BELTS: 'belts',
  SCARVES: 'scarves',
  HATS: 'hats',
  GLOVES: 'gloves',
  JEWELRY: 'jewelry',
  SUNGLASSES: 'sunglasses',
  WATCHES: 'watches',

  // 4. Traditional & Cultural Wear
  MENS_TRADITIONAL: 'mens_traditional',
  WOMENS_TRADITIONAL: 'womens_traditional',
  KIDS_TRADITIONAL: 'kids_traditional',
  FABRICS: 'fabrics',

  // 5. Swimwear & Beachwear
  WOMENS_SWIMWEAR: 'womens_swimwear',
  MENS_SWIMWEAR: 'mens_swimwear',
  KIDS_SWIMWEAR: 'kids_swimwear',
  BEACH_ACCESSORIES: 'beach_accessories',

  // 6. Innerwear & Lingerie
  BRAS: 'bras',
  BRIEFS: 'briefs',
  BOXERS: 'boxers',
  LINGERIE: 'lingerie',
  SLEEPWEAR: 'sleepwear',
} as const;

export const SUBCATEGORY_DETAILS = {
  // ==================== 1. MOBILE PHONES & ACCESSORIES ====================
  [SUBCATEGORIES.MOBILE_PHONES]: {
    name: 'Mobile Phones',
    icon: 'smartphone',
    description: 'Smartphones and feature phones',
    types: [
      { id: 'smartphones', name: 'Smartphones', brands: ['Samsung', 'iPhone', 'Xiaomi', 'Tecno', 'Infinix', 'Oppo', 'Vivo', 'Huawei', 'Motorola', 'OnePlus'] },
      { id: 'feature_phones', name: 'Feature Phones', brands: ['Nokia', 'Itel', 'Techno'] },
    ],
    filters: ['brand', 'condition', 'price_range', 'color', 'storage', 'warranty'],
  },

  [SUBCATEGORIES.PHONE_ACCESSORIES]: {
    name: 'Phone Accessories',
    icon: 'zap',
    description: 'Chargers, cables, cases, and more',
    types: [
      { id: 'chargers', name: 'Chargers & Cables', items: ['Fast Chargers (20W, 33W, 45W, 65W)', 'Type-C Cables', 'Lightning Cables', 'USB Hubs'] },
      { id: 'batteries', name: 'Batteries & Power', items: ['Phone Batteries (Original/Replacement)', 'Power Banks (10k, 20k, 30k mAh)', 'Wireless Chargers', 'Charging Docks'] },
      { id: 'protection', name: 'Protection & Cases', items: ['Screen Guards (Tempered, Hydrogel)', 'Phone Cases (Silicone, Rugged, Flip)', 'Camera Lens Protectors'] },
      { id: 'audio', name: 'Audio', items: ['Earphones', 'Bluetooth Earbuds', 'In-ear Monitors'] },
      { id: 'storage', name: 'Storage', items: ['Memory Cards (SD, microSD)', 'Card Readers'] },
      { id: 'others', name: 'Other Accessories', items: ['Pop Sockets', 'Phone Stands', 'Phone Grips'] },
    ],
    filters: ['type', 'brand', 'price_range', 'color'],
  },

  // ==================== 2. COMPUTERS, LAPTOPS & ACCESSORIES ====================
  [SUBCATEGORIES.LAPTOPS]: {
    name: 'Laptops',
    icon: 'laptop',
    description: 'Gaming, business, and student laptops',
    types: [
      { id: 'gaming_laptops', name: 'Gaming Laptops', brands: ['Asus ROG', 'MSI', 'Razer', 'Lenovo Legion', 'HP Omen', 'Dell Alienware'] },
      { id: 'business_laptops', name: 'Business Laptops', brands: ['HP', 'Dell', 'Lenovo ThinkPad', 'Asus', 'Acer'] },
      { id: 'student_laptops', name: 'Student Laptops', brands: ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer'] },
      { id: 'macbooks', name: 'MacBooks', brands: ['MacBook Air', 'MacBook Pro'] },
    ],
    filters: ['brand', 'condition', 'price_range', 'ram', 'storage', 'processor', 'screen_size', 'warranty'],
  },

  [SUBCATEGORIES.DESKTOP_COMPUTERS]: {
    name: 'Desktop Computers',
    icon: 'monitor',
    description: 'CPUs, All-in-One PCs, and gaming desktops',
    types: [
      { id: 'cpus', name: 'CPUs & Processors', items: ['Intel Core i3/i5/i7/i9', 'AMD Ryzen 3/5/7/9', 'AMD Threadripper'] },
      { id: 'all_in_one', name: 'All-in-One PCs', brands: ['Apple iMac', 'Dell Inspiron', 'HP Pavilion'] },
      { id: 'gaming_desktops', name: 'Gaming Desktops', brands: ['Custom Built', 'ASUS', 'MSI', 'Corsair'] },
    ],
    filters: ['type', 'brand', 'condition', 'price_range', 'processor', 'ram', 'storage'],
  },

  [SUBCATEGORIES.COMPUTER_ACCESSORIES]: {
    name: 'Computer Accessories',
    icon: 'keyboard',
    description: 'Chargers, RAM, SSD, keyboards, monitors, and more',
    types: [
      { id: 'power', name: 'Power & Charging', items: ['Laptop Chargers (Original/Compatible)', 'Laptop Batteries', 'Power Supply (PSU)', 'Power Banks', 'Cables (HDMI, VGA, DisplayPort)'] },
      { id: 'storage', name: 'Storage', items: ['SSDs (SATA, NVMe)', 'HDDs', 'External Storage', 'Card Readers'] },
      { id: 'memory', name: 'Memory', items: ['RAM (DDR3, DDR4, DDR5)', 'Cache Memory'] },
      { id: 'peripherals', name: 'Peripherals', items: ['Keyboards (Wired, Wireless, Mechanical)', 'Mouse (Wired, Wireless, Gaming)', 'Webcams', 'Monitors'] },
      { id: 'connectivity', name: 'Connectivity', items: ['USB Hubs', 'Docking Stations', 'Network Cables', 'HDMI Cables', 'USB Cables'] },
      { id: 'cooling', name: 'Cooling & Maintenance', items: ['Laptop Cooling Pads', 'CPU Coolers', 'Fans', 'Thermal Paste'] },
      { id: 'graphics', name: 'Graphics & Expansion', items: ['Graphics Cards (NVIDIA, AMD)', 'Motherboards', 'Sound Cards'] },
      { id: 'protection', name: 'Protection & Transport', items: ['Laptop Bags/Sleeves', 'Laptop Stands', 'Screen Protectors'] },
    ],
    filters: ['type', 'brand', 'price_range', 'compatibility'],
  },

  // ==================== 3. TABLETS & ACCESSORIES ====================
  [SUBCATEGORIES.TABLETS]: {
    name: 'Tablets & Accessories',
    icon: 'tablet',
    description: 'iPads, Samsung tablets, and accessories',
    types: [
      { id: 'tablets', name: 'Tablets', items: ['iPad (All Series)', 'iPad Air', 'iPad Pro', 'iPad Mini', 'Samsung Galaxy Tab', 'Lenovo Tab', 'Amazon Fire Tab'] },
      { id: 'tablet_accessories', name: 'Accessories', items: ['Tablet Keyboards', 'Tablet Cases', 'Stylus Pens (Apple Pencil, Samsung S Pen)', 'Screen Protectors', 'Charging Cables'] },
    ],
    filters: ['brand', 'condition', 'price_range', 'screen_size', 'storage', 'warranty'],
  },

  // ==================== 4. AUDIO & MUSIC DEVICES ====================
  [SUBCATEGORIES.AUDIO_MUSIC]: {
    name: 'Audio & Music Devices',
    icon: 'music',
    description: 'Speakers, headphones, and audio equipment',
    types: [
      { id: 'speakers', name: 'Speakers', items: ['Bluetooth Speakers', 'Portable Speakers', 'Smart Speakers', 'Home Theatre Systems', 'Soundbars'] },
      { id: 'headphones', name: 'Headphones & Earbuds', items: ['Wireless Headphones', 'Wired Headphones', 'Studio Headphones', 'Gaming Headsets', 'Earbuds'] },
      { id: 'audio_equipment', name: 'Audio Equipment', items: ['Studio Microphones', 'DJ Equipment', 'Karaoke Machines', 'Audio Interfaces', 'Mixing Boards'] },
      { id: 'car_audio', name: 'Car Audio', items: ['Car Speakers', 'Car Amplifiers', 'Car Subwoofers', 'Car Audio Systems'] },
    ],
    filters: ['type', 'brand', 'price_range', 'connectivity', 'warranty'],
  },

  // ==================== 5. GAMING ====================
  [SUBCATEGORIES.GAMING]: {
    name: 'Gaming',
    icon: 'gamepad2',
    description: 'Gaming consoles, controllers, and accessories',
    types: [
      { id: 'consoles', name: 'Gaming Consoles', brands: ['Sony PlayStation', 'Microsoft Xbox', 'Nintendo', 'Steam Deck', 'Valve'] },
      { id: 'controllers', name: 'Controllers & Accessories', items: ['PlayStation Controllers', 'Xbox Controllers', 'Gaming Keyboards', 'Gaming Mouse', 'Gaming Headsets'] },
      { id: 'gaming_gear', name: 'Gaming Gear', items: ['Gaming Chairs', 'Gaming Desks', 'Monitor Arms', 'Cable Management'] },
      { id: 'vr', name: 'VR & Extended Reality', items: ['VR Headsets', 'VR Controllers', 'Motion Trackers'] },
      { id: 'games', name: 'Games & Software', items: ['Game CDs (FIFA, GTA, COD, etc.)', 'Digital Game Codes', 'Game Pass Subscriptions'] },
    ],
    filters: ['type', 'brand', 'condition', 'price_range'],
  },

  // ==================== 6. CAMERAS & PHOTOGRAPHY ====================
  [SUBCATEGORIES.CAMERAS]: {
    name: 'Cameras & Photography',
    icon: 'camera',
    description: 'DSLR, mirrorless, and photography equipment',
    types: [
      { id: 'dslr', name: 'DSLR Cameras', brands: ['Canon', 'Nikon', 'Pentax'] },
      { id: 'mirrorless', name: 'Mirrorless Cameras', brands: ['Sony Alpha', 'Canon EOS R', 'Nikon Z', 'Panasonic', 'Fujifilm'] },
      { id: 'compact', name: 'Compact Digital Cameras', brands: ['Canon', 'Nikon', 'Sony', 'Panasonic'] },
      { id: 'photography', name: 'Photography Accessories', items: ['Camera Lenses', 'Tripods', 'Ring Lights', 'Camera Bags', 'Batteries', 'Memory Cards', 'Flashlights & Speedlites', 'Reflectors', 'Lighting Kits'] },
    ],
    filters: ['type', 'brand', 'condition', 'price_range', 'megapixels', 'sensor_size'],
  },

  // ==================== 7. NETWORKING & INTERNET DEVICES ====================
  [SUBCATEGORIES.NETWORKING]: {
    name: 'Networking & Internet Devices',
    icon: 'wifi',
    description: 'Routers, MiFi, and networking equipment',
    types: [
      { id: 'mobile_data', name: 'Mobile Data Devices', items: ['MiFi (MTN, Airtel, Glo, 9mobile, Huawei)', 'USB Data Dongles', 'Mobile Hotspots'] },
      { id: 'routers', name: 'Routers & Modems', brands: ['TP-Link', 'D-Link', 'Huawei', 'Mikrotik', 'Ubiquiti', 'Cisco', 'ZTE', 'Netgear', 'Linksys', 'Tenda'] },
      { id: 'fiber', name: 'Fiber & Broadband', items: ['Fiber ONT Devices', 'Ethernet Switches', 'Network Cables', 'Access Points'] },
      { id: 'voip', name: 'VoIP & Communication', items: ['IP Phones', 'VoIP Devices', 'Intercom Systems'] },
      { id: 'power', name: 'Power & Backup', items: ['UPS Systems', 'Inverters', 'Stabilizers', 'Voltage Regulators'] },
    ],
    filters: ['type', 'brand', 'price_range', 'speed', 'coverage'],
  },

  // ==================== 8. CCTV & SECURITY CAMERAS ====================
  [SUBCATEGORIES.CCTV]: {
    name: 'CCTV & Security Cameras',
    icon: 'camera',
    description: 'Security cameras, DVR/NVR systems, and surveillance equipment',
    types: [
      { id: 'cctv_cameras', name: 'CCTV Cameras', brands: ['Hikvision', 'Dahua', 'Reolink', 'Zosi', 'Uniview', 'CP Plus'] },
      { id: 'camera_types', name: 'Camera Types', items: ['Bullet Cameras', 'Dome Cameras', 'Turret Cameras', 'PTZ Cameras', 'Fisheye Cameras', '360 Cameras'] },
      { id: 'dvr_nvr', name: 'DVR / NVR Systems', items: ['4-Channel DVR', '8-Channel DVR', '16-Channel DVR', 'Network Video Recorders (NVR)', 'Cloud Storage Systems'] },
      { id: 'accessories', name: 'Accessories & Cables', items: ['Coaxial Cables', 'HDMI Cables', 'Connectors', 'Power Supplies', 'Mounts', 'Cable Ties'] },
      { id: 'monitoring', name: 'Monitoring Software', items: ['Web Access Software', 'Mobile App Software', 'Remote Viewing Systems'] },
    ],
    filters: ['camera_type', 'brand', 'resolution', 'connectivity', 'price_range'],
  },

  // ==================== 9. SMART GADGETS ====================
  [SUBCATEGORIES.SMART_GADGETS]: {
    name: 'Smart Gadgets',
    icon: 'zap-off',
    description: 'Smartwatches, fitness bands, and IoT devices',
    types: [
      { id: 'smartwatches', name: 'Smartwatches', brands: ['Apple Watch', 'Samsung Galaxy Watch', 'Fitbit', 'Garmin', 'Oraimo', 'Huawei', 'Xiaomi'] },
      { id: 'fitness', name: 'Fitness Trackers & Bands', items: ['Fitness Bands', 'Activity Trackers', 'Health Monitors'] },
      { id: 'smart_home', name: 'Smart Home Devices', items: ['Smart Speakers (Google Nest, Alexa)', 'Smart Bulbs', 'Smart Plugs', 'Smart Thermostats', 'Smart Locks', 'Smart Doorbells'] },
      { id: 'tracking', name: 'Tracking & Location', items: ['GPS Trackers', 'Bluetooth Trackers', 'Air Tags'] },
      { id: 'health', name: 'Health & Wellness', items: ['Digital Thermometers', 'Blood Pressure Monitors', 'Fitness Scales', 'Sleep Trackers'] },
    ],
    filters: ['type', 'brand', 'price_range', 'color', 'battery_life'],
  },

  // ==================== 10. OFFICE ELECTRONICS ====================
  [SUBCATEGORIES.OFFICE_ELECTRONICS]: {
    name: 'Office Electronics',
    icon: 'briefcase',
    description: 'Printers, scanners, and office equipment',
    types: [
      { id: 'printers', name: 'Printers', items: ['LaserJet Printers', 'InkJet Printers', 'Multifunctional Printers', 'Photo Printers', 'Label Printers'] },
      { id: 'imaging', name: 'Imaging Devices', items: ['Scanners', 'Photocopiers', 'Fax Machines'] },
      { id: 'projection', name: 'Projection & Display', items: ['Projectors', 'Interactive Whiteboards', 'Digital Signage'] },
      { id: 'document', name: 'Document Management', items: ['Laminating Machines', 'Shredders', 'Binding Machines', 'Paper Cutters'] },
      { id: 'pos', name: 'Point of Sale', items: ['POS Machines', 'Receipt Printers', 'Barcode Scanners', 'Card Readers'] },
      { id: 'other_office', name: 'Other Office Equipment', items: ['Calculators', 'Cash Drawers', 'Time Clocks'] },
    ],
    filters: ['type', 'brand', 'price_range', 'print_speed'],
  },

  // ==================== 10. POWER & ENERGY ====================
  [SUBCATEGORIES.POWER_ENERGY]: {
    name: 'Power & Energy',
    icon: 'battery-charging-2',
    description: 'Power supplies, inverters, and energy solutions',
    types: [
      { id: 'power_supplies', name: 'Power Supplies', items: ['Power Supply Units (PSU)', 'Surge Protectors', 'Extension Boxes', 'Voltage Stabilizers', 'Regulators'] },
      { id: 'backup_power', name: 'Backup Power', items: ['Inverter Batteries', 'UPS Systems', 'Inverters', 'Battery Chargers', 'Solar Chargers'] },
      { id: 'renewable', name: 'Renewable Energy', items: ['Solar Panels', 'Solar Kits', 'Wind Turbines (Small)', 'Hybrid Inverters'] },
      { id: 'lighting', name: 'Lighting', items: ['LED Light Bulbs', 'Energy Saving Bulbs', 'Rechargeable Lamps', 'Torch Lights', 'Work Lights'] },
      { id: 'fans', name: 'Ventilation', items: ['Rechargeable Fans', 'Ceiling Fans', 'Desk Fans', 'Standing Fans'] },
    ],
    filters: ['type', 'brand', 'price_range', 'capacity', 'warranty'],
  },

  // ==================== 11. POWER BANKS ====================
  [SUBCATEGORIES.POWER_BANKS]: {
    name: 'Power Banks',
    icon: 'battery',
    description: 'Portable battery chargers and power solutions',
    types: [
      { id: 'standard_powerbank', name: 'Standard Power Banks', brands: ['Anker', 'Xiaomi', 'Oraimo', 'Romoss', 'Baseus', 'RAVPower', 'Aukey', 'Remax'] },
      { id: 'fast_charge', name: 'Fast Charge Power Banks', brands: ['Anker', 'Xiaomi', 'Samsung', 'Baseus', 'RAVPower'] },
      { id: 'solar_powerbank', name: 'Solar Power Banks', items: ['Solar Panel Power Banks', 'Outdoor Power Banks', 'Weatherproof Models'] },
      { id: 'wireless_powerbank', name: 'Wireless Power Banks', items: ['Wireless Charging', 'Multi-Device Support'] },
    ],
    filters: ['capacity', 'charging_ports', 'fast_charge', 'brand', 'price_range'],
  },

  // ==================== 12. MICROPHONES ====================
  [SUBCATEGORIES.MICROPHONES]: {
    name: 'Microphones',
    icon: 'mic',
    description: 'Professional and consumer microphones',
    types: [
      { id: 'condenser_mic', name: 'Condenser Microphones', brands: ['Shure', 'Audio-Technica', 'AKG', 'Blue Yeti', 'Neumann'] },
      { id: 'dynamic_mic', name: 'Dynamic Microphones', brands: ['Shure', 'Rode', 'Sennheiser', 'Audio-Technica'] },
      { id: 'usb_mic', name: 'USB Microphones', brands: ['Blue Yeti', 'Audio-Technica', 'Rode', 'Fifine', 'Samson'] },
      { id: 'wireless_mic', name: 'Wireless Microphones', brands: ['Shure', 'Sennheiser', 'Audio-Technica', 'Rode'] },
      { id: 'lavalier_mic', name: 'Lavalier / Lapel Mics', brands: ['Rode', 'Sennheiser', 'Audio-Technica', 'Boya'] },
      { id: 'mic_accessories', name: 'Accessories', items: ['Mic Stands', 'Pop Filters', 'Boom Arms', 'XLR Cables', 'Shock Mounts', 'Windscreens'] },
    ],
    filters: ['type', 'connectivity', 'brand', 'price_range', 'polar_pattern'],
  },

  // ==================== 14. TELEVISIONS ====================
  [SUBCATEGORIES.TELEVISIONS]: {
    name: 'Televisions (TVs)',
    icon: 'tv',
    description: 'Smart TVs, LED, OLED, and 4K televisions',
    types: [
      { id: 'smart_tvs', name: 'Smart TVs', brands: ['Samsung', 'LG', 'Sony', 'Hisense', 'Tcl', 'Panasonic', 'Philips', 'Vitron'] },
      { id: 'led_tvs', name: 'LED TVs' },
      { id: 'oled_tvs', name: 'OLED TVs', brands: ['LG OLED', 'Sony OLED'] },
      { id: '4k_tvs', name: '4K UHD TVs' },
      { id: '8k_tvs', name: '8K TVs' },
      { id: 'curved_tvs', name: 'Curved TVs' },
      { id: 'portable_tvs', name: 'Portable TVs' },
      { id: 'tv_accessories', name: 'TV Accessories', items: ['TV Wall Mounts', 'HDMI Cables', 'Soundbars', 'Remotes', 'Media Adapters', 'Stands'] },
    ],
    filters: ['screen_size', 'resolution', 'display_technology', 'smart_tv', 'refresh_rate', 'hdr_support', 'price_range', 'brand', 'condition'],
  },

  // ==================== APPLIANCES ====================
  [SUBCATEGORIES.AC]: {
    name: 'Air Conditioners',
    icon: 'snowflake',
    description: 'Split, window, standing, and portable AC units',
    types: [
      { id: 'split_ac', name: 'Split AC', hpRatings: ['1HP', '1.5HP', '2HP', '2.5HP', '3HP'] },
      { id: 'standing_ac', name: 'Standing AC' },
      { id: 'window_ac', name: 'Window AC' },
      { id: 'portable_ac', name: 'Portable AC' },
      { id: 'ac_accessories', name: 'AC Accessories', items: ['Remote Controllers', 'Compressors', 'Wall Brackets', 'Gas Refilling Kits', 'Filters'] },
    ],
    filters: ['hp_rating', 'inverter_type', 'cooling_capacity', 'energy_rating', 'condition'],
  },

  [SUBCATEGORIES.REFRIGERATORS]: {
    name: 'Refrigerators & Freezers',
    icon: 'snowflake',
    description: 'Fridges, freezers, and cooling solutions',
    types: [
      { id: 'single_door_fridge', name: 'Single Door Fridge' },
      { id: 'double_door_fridge', name: 'Double Door Fridge' },
      { id: 'side_by_side_fridge', name: 'Side-by-Side Fridge' },
      { id: 'top_freezer', name: 'Top Freezer' },
      { id: 'bottom_freezer', name: 'Bottom Freezer' },
      { id: 'mini_fridge', name: 'Mini Fridge' },
      { id: 'display_fridge', name: 'Display Fridge (Shop)' },
      { id: 'wine_cooler', name: 'Wine Cooler' },
      { id: 'chest_freezer', name: 'Chest Freezer' },
      { id: 'standing_freezer', name: 'Standing Freezer' },
      { id: 'deep_freezer', name: 'Deep Freezer' },
      { id: 'fridge_accessories', name: 'Fridge Accessories', items: ['Compressors', 'Gas Kits', 'Trays & Shelves', 'Filters'] },
    ],
    filters: ['capacity', 'number_of_doors', 'energy_consumption', 'inverter_type', 'condition'],
  },

  [SUBCATEGORIES.GENERATORS]: {
    name: 'Generators & Power Solutions',
    icon: 'zap',
    description: 'Generators, inverters, solar, and power equipment',
    types: [
      { id: 'petrol_gen', name: 'Petrol Generator', kvaRatings: ['1kVA', '3kVA', '5kVA', '10kVA'] },
      { id: 'diesel_gen', name: 'Diesel Generator' },
      { id: 'inverter_gen', name: 'Inverter Generator (Silent)' },
      { id: 'key_start_gen', name: 'Key Start Generator' },
      { id: 'recoil_start_gen', name: 'Recoil Start Generator' },
      { id: 'inverters', name: 'Inverters' },
      { id: 'solar_inverters', name: 'Solar Inverters' },
      { id: 'inverter_batteries', name: 'Inverter Batteries' },
      { id: 'avr', name: 'Automatic Voltage Regulators' },
      { id: 'stabilizers', name: 'Stabilizers' },
      { id: 'solar_panels', name: 'Solar Panels' },
      { id: 'charge_controllers', name: 'Charge Controllers' },
      { id: 'ups', name: 'UPS Systems' },
      { id: 'gen_accessories', name: 'Generator Accessories', items: ['Carburetors', 'Coils', 'Plugs', 'Starter Ropes', 'Wheels', 'Fuel Filters'] },
    ],
    filters: ['kva_rating', 'fuel_type', 'noise_level', 'inverter_generator', 'start_type', 'condition'],
  },

  [SUBCATEGORIES.WASHING_MACHINES]: {
    name: 'Washing Machines & Dryers',
    icon: 'droplets',
    description: 'Top-load, front-load, and compact washing machines',
    types: [
      { id: 'top_load_washer', name: 'Top Load Washing Machine' },
      { id: 'front_load_washer', name: 'Front Load Washing Machine' },
      { id: 'washer_dryer_combo', name: 'Washer-Dryer Combo' },
      { id: 'compact_washer', name: 'Compact Mini-Washer' },
      { id: 'washer_accessories', name: 'Washer Accessories', items: ['Water Pumps', 'Motors', 'Drums', 'Hoses', 'Filters'] },
    ],
    filters: ['capacity', 'type', 'energy_rating', 'condition'],
  },

  [SUBCATEGORIES.COOKERS_OVENS]: {
    name: 'Cookers & Ovens',
    icon: 'flame',
    description: 'Gas, electric cookers, microwaves, air fryers, and ovens',
    types: [
      { id: 'gas_cooker', name: 'Gas Cooker' },
      { id: 'electric_cooker', name: 'Electric Cooker' },
      { id: 'gas_electric_cooker', name: 'Gas + Electric Cooker' },
      { id: 'microwave_oven', name: 'Microwave Oven' },
      { id: 'air_fryer', name: 'Air Fryer' },
      { id: 'toaster', name: 'Toaster' },
      { id: 'industrial_oven', name: 'Industrial Oven' },
      { id: 'cooker_accessories', name: 'Cooker Accessories', items: ['Burners', 'Thermostats', 'Heating Elements', 'Trays'] },
    ],
    filters: ['type', 'burner_count', 'power_rating', 'condition'],
  },

  [SUBCATEGORIES.CLEANING_APPLIANCES]: {
    name: 'Home Cleaning Appliances',
    icon: 'sparkles',
    description: 'Vacuum cleaners, steam mops, carpet cleaners, and more',
    types: [
      { id: 'vacuum_cleaner', name: 'Vacuum Cleaner' },
      { id: 'steam_mop', name: 'Steam Mop' },
      { id: 'carpet_cleaner', name: 'Carpet Cleaner' },
      { id: 'cleaning_accessories', name: 'Cleaning Accessories', items: ['Brushes', 'Filters', 'Bags', 'Hoses', 'Nozzles'] },
    ],
    filters: ['type', 'power_rating', 'tank_capacity', 'condition'],
  },

  [SUBCATEGORIES.FANS_COOLING]: {
    name: 'Fans & Cooling Appliances',
    icon: 'wind',
    description: 'Standing fans, rechargeable fans, ceiling fans, and more',
    types: [
      { id: 'standing_fan', name: 'Standing Fan' },
      { id: 'rechargeable_fan', name: 'Rechargeable Fan' },
      { id: 'ceiling_fan', name: 'Ceiling Fan' },
      { id: 'industrial_fan', name: 'Industrial Fan' },
      { id: 'mist_fan', name: 'Mist Fan' },
      { id: 'fan_accessories', name: 'Fan Accessories', items: ['Blades', 'Motors', 'Switches', 'Stands'] },
    ],
    filters: ['type', 'power_rating', 'speed_settings', 'condition'],
  },

  [SUBCATEGORIES.INVERTER_SOLAR]: {
    name: 'Inverter & Solar Appliances',
    icon: 'sun',
    description: 'Inverters, solar panels, charge controllers, and batteries',
    types: [
      { id: 'inverter', name: 'Inverter' },
      { id: 'solar_panel', name: 'Solar Panel' },
      { id: 'charge_controller', name: 'Charge Controller' },
      { id: 'inverter_battery', name: 'Inverter Battery' },
      { id: 'solar_accessories', name: 'Solar Accessories', items: ['Cables', 'Connectors', 'Mounts', 'Combiner Boxes'] },
    ],
    filters: ['type', 'power_rating', 'capacity', 'condition'],
  },

  [SUBCATEGORIES.KITCHEN_APPLIANCES]: {
    name: 'Kitchen Appliances',
    icon: 'utensils',
    description: 'Blenders, kettles, rice cookers, juicers, mixers, and more',
    types: [
      { id: 'blender', name: 'Blender' },
      { id: 'electric_kettle', name: 'Electric Kettle' },
      { id: 'rice_cooker', name: 'Rice Cooker' },
      { id: 'juicer', name: 'Juicer' },
      { id: 'mixer', name: 'Mixer' },
      { id: 'coffee_maker', name: 'Coffee Maker' },
      { id: 'sandwich_maker', name: 'Sandwich Maker' },
      { id: 'kitchen_accessories', name: 'Kitchen Accessories', items: ['Blades', 'Jugs', 'Filters', 'Heating Elements'] },
    ],
    filters: ['type', 'power_rating', 'capacity', 'condition'],
  },

  [SUBCATEGORIES.HOME_APPLIANCES]: {
    name: 'Home Appliances',
    icon: 'home',
    description: 'Dishwashers, water dispensers, electric irons, and more',
    types: [
      { id: 'dishwasher', name: 'Dishwasher' },
      { id: 'water_dispenser', name: 'Water Dispenser' },
      { id: 'electric_iron', name: 'Electric Iron' },
      { id: 'hair_dryer', name: 'Hair Dryer' },
      { id: 'other_appliances', name: 'Other Appliances' },
    ],
    filters: ['type', 'power_rating', 'capacity', 'condition'],
  },
} as const;

// Filter options
export const FILTER_OPTIONS = {
  condition: [
    { value: CONDITION.BRAND_NEW, label: 'Brand New' },
    { value: CONDITION.UK_USED, label: 'UK Used' },
    { value: CONDITION.REFURBISHED, label: 'Refurbished' },
    { value: CONDITION.USED, label: 'Used' },
  ],

  warranty: [
    { value: WARRANTY_PERIOD.NO_WARRANTY, label: 'No Warranty' },
    { value: WARRANTY_PERIOD.THREE_MONTHS, label: '3 Months' },
    { value: WARRANTY_PERIOD.SIX_MONTHS, label: '6 Months' },
    { value: WARRANTY_PERIOD.ONE_YEAR, label: '1 Year' },
    { value: WARRANTY_PERIOD.TWO_YEARS, label: '2 Years' },
    { value: WARRANTY_PERIOD.THREE_YEARS, label: '3 Years' },
  ],

  priceRanges: [
    { min: 0, max: 10000, label: '₦0 - ₦10,000' },
    { min: 10000, max: 50000, label: '₦10,000 - ₦50,000' },
    { min: 50000, max: 100000, label: '₦50,000 - ₦100,000' },
    { min: 100000, max: 500000, label: '₦100,000 - ₦500,000' },
    { min: 500000, max: 1000000, label: '₦500,000 - ₦1,000,000' },
    { min: 1000000, max: null, label: '₦1,000,000+' },
  ],

  colors: [
    'Black', 'Silver', 'Gold', 'Rose Gold', 'White', 'Blue', 'Red', 'Green',
    'Purple', 'Pink', 'Gray', 'Gunmetal', 'Space Gray', 'Midnight', 'Starlight',
  ],

  storageOptions: [
    '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB', '4TB',
  ],

  ramOptions: [
    '2GB', '4GB', '8GB', '16GB', '32GB', '64GB',
  ],

  processorBrands: [
    'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9',
    'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9',
    'Apple M1', 'Apple M2', 'Apple M3',
  ],

  screenSizes: [
    '11 inch', '13 inch', '14 inch', '15 inch', '15.6 inch', '16 inch', '17 inch', '27 inch', '32 inch',
  ],

  deliveryOptions: [
    'Lagos Pickup',
    'Lagos Delivery (Same Day)',
    'Lagos Delivery (Next Day)',
    'National Delivery',
    'International Delivery',
  ],
} as const;

// Brands by subcategory
export const BRANDS_BY_SUBCATEGORY = {
  [SUBCATEGORIES.MOBILE_PHONES]: {
    smartphones: ['Apple', 'Samsung', 'Xiaomi', 'Tecno', 'Infinix', 'Itel', 'Oppo', 'Vivo', 'OnePlus', 'Huawei', 'Nokia', 'Lenovo', 'Google Pixel', 'Realme', 'Sony', 'Motorola', 'ZTE', 'Honor', 'Gionee', 'InFocus'],
    feature_phones: ['Nokia', 'Itel', 'Tecno', 'Infinix', 'Lenovo'],
  },
  [SUBCATEGORIES.LAPTOPS]: ['Apple MacBook', 'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Razer', 'Microsoft Surface', 'Huawei MateBook', 'LG Gram', 'Toshiba', 'Gigabyte', 'Alienware', 'Samsung', 'Chuwi', 'Teclast', 'Clevo', 'System76', 'Panasonic Toughbook'],
  [SUBCATEGORIES.TABLETS]: ['Apple iPad', 'Samsung Galaxy Tab', 'Huawei', 'Lenovo', 'Microsoft Surface', 'Amazon Fire', 'Xiaomi', 'Tecno', 'Infinix', 'Alldocube', 'Chuwi'],
  [SUBCATEGORIES.AUDIO_MUSIC]: ['Sony', 'Bose', 'JBL', 'Beats', 'Apple AirPods', 'Sennheiser', 'Anker Soundcore', 'Skullcandy', 'Razer', 'HyperX', 'SteelSeries', 'Logitech', 'Marshall', 'Xiaomi', 'Philips', 'Beyerdynamic', 'AKG', 'Audio-Technica', 'Bang & Olufsen'],
  [SUBCATEGORIES.GAMING]: ['Sony PlayStation', 'Microsoft Xbox', 'Nintendo', 'Asus ROG', 'MSI', 'Razer', 'Corsair', 'SteelSeries', 'HyperX', 'Turtle Beach'],
  [SUBCATEGORIES.CAMERAS]: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic Lumix', 'Olympus', 'Leica', 'Pentax', 'Blackmagic Design', 'RED', 'ARRI', 'Z CAM', 'GoPro', 'DJI', 'Insta360', 'Akaso', 'Autel Robotics', 'Yuneec', 'Sigma', 'Tamron', 'Zeiss', 'Tokina', 'Samyang', 'Laowa', 'Atomos', 'SmallHD', 'Tilta', 'Zhiyun'],
  [SUBCATEGORIES.NETWORKING]: ['TP-Link', 'D-Link', 'Huawei', 'Mikrotik', 'Ubiquiti', 'Cisco', 'ZTE', 'Netgear', 'Linksys', 'Tenda'],
  [SUBCATEGORIES.CCTV]: ['Hikvision', 'Dahua', 'Reolink', 'Zosi', 'Uniview', 'CP Plus'],
  [SUBCATEGORIES.SMART_GADGETS]: ['Apple', 'Samsung', 'Fitbit', 'Garmin', 'Oraimo', 'Xiaomi', 'Google', 'Amazon', 'Huawei'],
  [SUBCATEGORIES.OFFICE_ELECTRONICS]: ['HP', 'Canon', 'Xerox', 'Brother', 'Epson', 'Ricoh', 'Kyocera'],
  [SUBCATEGORIES.POWER_ENERGY]: ['APC', 'Luminous', 'Inverex', 'Genus', 'Techno', 'Nexus', 'Solar Energy Solutions'],
  [SUBCATEGORIES.POWER_BANKS]: ['Anker', 'Xiaomi Mi', 'Oraimo', 'Romoss', 'Baseus', 'RAVPower', 'Aukey', 'Remax', 'Samsung', 'Tecno', 'Infinix', 'Belkin'],
  [SUBCATEGORIES.MICROPHONES]: ['Shure', 'Rode', 'Blue Yeti', 'Audio-Technica', 'Sennheiser', 'AKG', 'Behringer', 'Zoom', 'Boya', 'Fifine', 'Samson', 'Lewitt', 'Saramonic', 'Sony', 'Takstar', 'Neumann'],
  [SUBCATEGORIES.TELEVISIONS]: ['Samsung', 'LG', 'Sony', 'Hisense', 'TCL', 'Panasonic', 'Philips', 'Sharp', 'Xiaomi', 'Skyworth', 'Toshiba', 'Changhong', 'Konka', 'Vestel'],
  
  // ==================== APPLIANCES ====================
  [SUBCATEGORIES.AC]: ['LG', 'Samsung', 'Hisense', 'Scanfrost', 'Haier Thermocool', 'Panasonic', 'Polystar', 'Midea', 'Royal', 'Gree'],
  [SUBCATEGORIES.REFRIGERATORS]: ['Hisense', 'LG', 'Samsung', 'Haier Thermocool', 'Scanfrost', 'Midea', 'Polystar', 'Nexus', 'Royal'],
  [SUBCATEGORIES.GENERATORS]: ['Elepaq', 'Firman (Sumec)', 'Tiger', 'Honda', 'Lutian', 'Mikano', 'Thermocool', 'Maxmech', 'Kipor'],
  [SUBCATEGORIES.WASHING_MACHINES]: ['LG', 'Samsung', 'Haier', 'Hotpoint', 'Indesit', 'Ariston', 'Hisense', 'Scanfrost'],
  [SUBCATEGORIES.COOKERS_OVENS]: ['Midea', 'Nasco', 'Binatone', 'Scanfrost', 'Hotpoint', 'Hisense', 'Panasonic', 'LG'],
  [SUBCATEGORIES.CLEANING_APPLIANCES]: ['Philips', 'Kärcher', 'Dyson', 'Bissell', 'Scanfrost', 'Midea'],
  [SUBCATEGORIES.FANS_COOLING]: ['Midea', 'Scanfrost', 'Polystar', 'Nexus', 'Panasonic', 'Binatone', 'Hisense'],
  [SUBCATEGORIES.INVERTER_SOLAR]: ['Luminous', 'Inverex', 'APC', 'Genus', 'Techno', 'Nexus', 'Megatech', 'Sunseeker'],
  [SUBCATEGORIES.KITCHEN_APPLIANCES]: ['Panasonic', 'LG', 'Samsung', 'Hisense', 'Scanfrost', 'Midea', 'Binatone', 'Hotpoint', 'Nasco'],
  [SUBCATEGORIES.HOME_APPLIANCES]: ['LG', 'Samsung', 'Haier', 'Hisense', 'Scanfrost', 'Midea', 'Indesit', 'Ariston'],

  // ==================== FASHION ====================
  // Clothing
  [SUBCATEGORIES.MENS_CLOTHING]: ['Nike', 'Adidas', 'Puma', 'Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Lacoste', 'Polo', 'Gucci', 'Versace'],
  [SUBCATEGORIES.WOMENS_CLOTHING]: ['Zara', 'H&M', 'Nike', 'Adidas', 'ASOS', 'Urban Outfitters', 'Calvin Klein', 'Tommy Hilfiger', 'Gucci', 'Prada'],
  [SUBCATEGORIES.KIDS_CLOTHING]: ['Nike Kids', 'Adidas Kids', 'Puma Kids', 'H&M Kids', 'ASOS Kids', 'Carter\'s', 'Old Navy', 'Gap Kids'],
  [SUBCATEGORIES.ACTIVEWEAR]: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Lululemon', 'Gymshark', 'Reebok', 'Alo Yoga'],

  // Footwear
  [SUBCATEGORIES.MENS_SHOES]: ['Nike', 'Adidas', 'Puma', 'Clarks', 'Dr. Martens', 'Timberland', 'Converse', 'Vans', 'Gucci', 'Burberry'],
  [SUBCATEGORIES.WOMENS_SHOES]: ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance', 'Clarks', 'Gucci', 'Louis Vuitton', 'Prada'],
  [SUBCATEGORIES.KIDS_SHOES]: ['Nike Kids', 'Adidas Kids', 'Puma Kids', 'Converse Kids', 'New Balance Kids', 'Clarks Kids'],
  [SUBCATEGORIES.SNEAKERS]: ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance', 'Reebok', 'Fila', 'Skechers'],
  [SUBCATEGORIES.BOOTS]: ['Timberland', 'Dr. Martens', 'UGG', 'Clarks', 'Salomon', 'Caterpillar', 'Wolverine', 'Merrell'],
  [SUBCATEGORIES.SANDALS]: ['Birkenstock', 'Clarks', 'Crocs', 'Teva', 'Reef', 'Birkenstock', 'Skechers', 'Nike'],
  [SUBCATEGORIES.SPORTS_SHOES]: ['Nike', 'Adidas', 'Puma', 'New Balance', 'Asics', 'Saucony', 'Brooks', 'Mizuno'],

  // Accessories
  [SUBCATEGORIES.BAGS]: ['Gucci', 'Louis Vuitton', 'Coach', 'Michael Kors', 'Prada', 'Burberry', 'Fendi', 'Celine', 'Hermes', 'Versace'],
  [SUBCATEGORIES.BELTS]: ['Gucci', 'Louis Vuitton', 'Prada', 'Burberry', 'Coach', 'Tommy Hilfiger', 'Lacoste', 'Hugo Boss'],
  [SUBCATEGORIES.SCARVES]: ['Burberry', 'Hermès', 'Gucci', 'Louis Vuitton', 'Prada', 'Versace', 'Dolce & Gabbana', 'Givenchy'],
  [SUBCATEGORIES.HATS]: ['Nike', 'Adidas', 'Puma', 'New Era', 'Carhartt', 'Tommy Hilfiger', 'Ralph Lauren', 'The North Face'],
  [SUBCATEGORIES.GLOVES]: ['The North Face', 'Columbia', 'Dakine', 'Timberland', 'UGG', 'Marmot', 'Hestra'],
  [SUBCATEGORIES.JEWELRY]: ['Pandora', 'Swarovski', 'Cartier', 'Tiffany & Co', 'Georg Jensen', 'David Yurman', 'Chopard'],
  [SUBCATEGORIES.SUNGLASSES]: ['Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Versace', 'Tom Ford', 'Dolce & Gabbana', 'Burberry'],
  [SUBCATEGORIES.WATCHES]: ['Rolex', 'Omega', 'Tag Heuer', 'Fossil', 'Timex', 'Seiko', 'Casio', 'Citizen'],

  // Traditional & Cultural Wear
  [SUBCATEGORIES.MENS_TRADITIONAL]: ['Vlisco', 'Ankara Premium', 'Akuaba', 'Lekela London', 'Dala Designs'],
  [SUBCATEGORIES.WOMENS_TRADITIONAL]: ['Vlisco', 'Ankara Premium', 'Akuaba', 'Lekela London', 'Mami Wata London', 'Rhoweaa'],
  [SUBCATEGORIES.KIDS_TRADITIONAL]: ['Vlisco', 'Ankara Premium', 'Akuaba', 'Lekela London'],
  [SUBCATEGORIES.FABRICS]: ['Vlisco', 'Ankara Premium', 'Akuaba', 'Super Wax', 'Guaranteed Wax'],

  // Swimwear & Beachwear
  [SUBCATEGORIES.WOMENS_SWIMWEAR]: ['Speedo', 'Rip Curl', 'Billabong', 'O\'Neill', 'Seafolly', 'Vitamin A'],
  [SUBCATEGORIES.MENS_SWIMWEAR]: ['Speedo', 'Billabong', 'Quiksilver', 'Rip Curl', 'Hurley', 'Vans'],
  [SUBCATEGORIES.KIDS_SWIMWEAR]: ['Speedo', 'Rip Curl', 'Billabong', 'O\'Neill', 'Zoggs'],
  [SUBCATEGORIES.BEACH_ACCESSORIES]: ['Rip Curl', 'Billabong', 'O\'Neill', 'Quiksilver', 'Vans'],

  // Innerwear & Lingerie
  [SUBCATEGORIES.BRAS]: ['Victoria\'s Secret', 'Triumph', 'Playtex', 'Calvin Klein', 'Tommy John', 'Spanx'],
  [SUBCATEGORIES.BRIEFS]: ['Calvin Klein', 'Tommy Hilfiger', 'Jockey', 'Hanes', 'Fruit of the Loom', 'Under Armour'],
  [SUBCATEGORIES.BOXERS]: ['Calvin Klein', 'Jockey', 'Tommy Hilfiger', 'Under Armour', 'Hanes', 'Adidas'],
  [SUBCATEGORIES.LINGERIE]: ['Victoria\'s Secret', 'Agent Provocateur', 'La Perla', 'Fleur du Mal', 'Savage X Fenty'],
  [SUBCATEGORIES.SLEEPWEAR]: ['Victoria\'s Secret', 'Calvin Klein', 'Tommy Hilfiger', 'Hanes', 'Jockey', 'Fruit of the Loom'],
} as const;
