/**
 * Appliances Category Structure
 * Air Conditioners, Refrigerators, Generators, and Other Large Appliances
 */

export const APPLIANCES_CATEGORIES = {
  AC: {
    id: 'ac',
    name: 'Air Conditioners',
    description: 'Split, Window, Standing, and Portable AC units',
    icon: '❄️',
    subcategories: {
      SPLIT_AC: { id: 'split-ac', name: 'Split AC', hpRatings: ['1HP', '1.5HP', '2HP', '2.5HP', '3HP'] },
      STANDING_AC: { id: 'standing-ac', name: 'Standing AC' },
      WINDOW_AC: { id: 'window-ac', name: 'Window AC' },
      PORTABLE_AC: { id: 'portable-ac', name: 'Portable AC' },
      AC_ACCESSORIES: { id: 'ac-accessories', name: 'AC Accessories' },
    },
    brands: ['LG', 'Samsung', 'Hisense', 'Scanfrost', 'Haier Thermocool', 'Panasonic', 'Polystar', 'Midea', 'Royal', 'Gree'],
    filters: {
      hpRating: ['1HP', '1.5HP', '2HP', '2.5HP', '3HP'],
      inverterType: ['Inverter', 'Non-Inverter'],
      coolingCapacity: ['12000 BTU', '18000 BTU', '24000 BTU', '36000 BTU', '48000 BTU'],
      energyRating: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
      condition: ['New', 'Used', 'Refurbished'],
    },
  },

  REFRIGERATORS: {
    id: 'refrigerators',
    name: 'Refrigerators & Freezers',
    description: 'Fridges, Freezers, and Cooling Solutions',
    icon: '🧊',
    subcategories: {
      SINGLE_DOOR_FRIDGE: { id: 'single-door-fridge', name: 'Single Door Fridge' },
      DOUBLE_DOOR_FRIDGE: { id: 'double-door-fridge', name: 'Double Door Fridge' },
      SIDE_BY_SIDE_FRIDGE: { id: 'side-by-side-fridge', name: 'Side-by-Side Fridge' },
      TOP_FREEZER: { id: 'top-freezer', name: 'Top Freezer' },
      BOTTOM_FREEZER: { id: 'bottom-freezer', name: 'Bottom Freezer' },
      MINI_FRIDGE: { id: 'mini-fridge', name: 'Mini Fridge' },
      DISPLAY_FRIDGE: { id: 'display-fridge', name: 'Display Fridge (Shop)' },
      WINE_COOLER: { id: 'wine-cooler', name: 'Wine Cooler' },
      CHEST_FREEZER: { id: 'chest-freezer', name: 'Chest Freezer' },
      STANDING_FREEZER: { id: 'standing-freezer', name: 'Standing Freezer' },
      DEEP_FREEZER: { id: 'deep-freezer', name: 'Deep Freezer' },
      PORTABLE_COOLER: { id: 'portable-cooler', name: 'Portable Cooler' },
      FRIDGE_ACCESSORIES: { id: 'fridge-accessories', name: 'Fridge Accessories' },
    },
    brands: ['Hisense', 'LG', 'Samsung', 'Haier Thermocool', 'Scanfrost', 'Midea', 'Polystar', 'Nexus', 'Royal'],
    filters: {
      capacity: ['100L', '150L', '200L', '250L', '300L', '350L', '400L', '500L+'],
      numberOfDoors: ['Single', 'Double', 'Triple', 'Side-by-Side'],
      energyConsumption: ['Low', 'Medium', 'High'],
      inverterType: ['Inverter', 'Non-Inverter'],
      condition: ['New', 'Used', 'Refurbished'],
    },
  },

  GENERATORS: {
    id: 'generators',
    name: 'Generators & Power Solutions',
    description: 'Generators, Inverters, Solar, and Power Equipment',
    icon: '⚡',
    subcategories: {
      PETROL_GENERATOR: { id: 'petrol-gen', name: 'Petrol Generator', kvaRatings: ['1kVA', '3kVA', '5kVA', '10kVA'] },
      DIESEL_GENERATOR: { id: 'diesel-gen', name: 'Diesel Generator' },
      INVERTER_GENERATOR: { id: 'inverter-gen', name: 'Inverter Generator (Silent)' },
      KEY_START_GEN: { id: 'key-start-gen', name: 'Key Start Generator' },
      RECOIL_START_GEN: { id: 'recoil-start-gen', name: 'Recoil Start Generator' },
      INVERTERS: { id: 'inverters', name: 'Inverters' },
      SOLAR_INVERTERS: { id: 'solar-inverters', name: 'Solar Inverters' },
      INVERTER_BATTERIES: { id: 'inverter-batteries', name: 'Inverter Batteries' },
      AVR: { id: 'avr', name: 'Automatic Voltage Regulators' },
      STABILIZERS: { id: 'stabilizers', name: 'Stabilizers' },
      SOLAR_PANELS: { id: 'solar-panels', name: 'Solar Panels' },
      CHARGE_CONTROLLERS: { id: 'charge-controllers', name: 'Charge Controllers' },
      UPS: { id: 'ups', name: 'UPS Systems' },
      GEN_ACCESSORIES: { id: 'gen-accessories', name: 'Generator Accessories' },
    },
    brands: ['Elepaq', 'Firman (Sumec)', 'Tiger', 'Honda', 'Lutian', 'Mikano', 'Thermocool', 'Maxmech', 'Kipor'],
    filters: {
      kvaRating: ['1kVA', '2kVA', '3kVA', '5kVA', '10kVA', '15kVA', '20kVA+'],
      fuelType: ['Petrol', 'Diesel'],
      noiseLevel: ['Silent', 'Standard'],
      inverterGenerator: ['Yes', 'No'],
      startType: ['Key Start', 'Recoil Start', 'Both'],
      condition: ['New', 'Used', 'Refurbished'],
    },
  },

  KITCHEN_APPLIANCES: {
    id: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    description: 'Microwave, Cookers, Blenders, and Kitchen Gadgets',
    icon: '🍳',
    subcategories: {
      MICROWAVE: { id: 'microwave', name: 'Microwave Ovens' },
      ELECTRIC_COOKER: { id: 'electric-cooker', name: 'Electric Cookers' },
      GAS_COOKER: { id: 'gas-cooker', name: 'Gas Cookers' },
      BLENDER: { id: 'blender', name: 'Blenders' },
      ELECTRIC_KETTLE: { id: 'electric-kettle', name: 'Electric Kettles' },
      TOASTER: { id: 'toaster', name: 'Toasters' },
      AIR_FRYER: { id: 'air-fryer', name: 'Air Fryers' },
    },
    brands: ['Panasonic', 'LG', 'Samsung', 'Hisense', 'Scanfrost', 'Midea', 'Binatone', 'Hotpoint', 'Nasco'],
    filters: {
      capacity: ['Single', 'Double', '1.5L', '2L', '3L', '4L', '5L+'],
      powerRating: ['500W', '750W', '1000W', '1500W', '2000W', '3000W+'],
      condition: ['New', 'Used'],
    },
  },

  HOME_APPLIANCES: {
    id: 'home-appliances',
    name: 'Home Appliances',
    description: 'Washing Machines, Dishwashers, Water Dispensers, and Cleaners',
    icon: '🏠',
    subcategories: {
      WASHING_MACHINE: { id: 'washing-machine', name: 'Washing Machines', types: ['Front Load', 'Top Load'] },
      DISHWASHER: { id: 'dishwasher', name: 'Dishwashers' },
      WATER_DISPENSER: { id: 'water-dispenser', name: 'Water Dispensers' },
      VACUUM_CLEANER: { id: 'vacuum-cleaner', name: 'Vacuum Cleaners' },
      IRON: { id: 'iron', name: 'Electric Irons' },
      HAIR_DRYER: { id: 'hair-dryer', name: 'Hair Dryers' },
    },
    brands: ['LG', 'Samsung', 'Haier', 'Hisense', 'Scanfrost', 'Midea', 'Indesit', 'Ariston'],
    filters: {
      capacity: ['Single', '6kg', '8kg', '10kg', '12kg', '15kg', '20kg+'],
      type: ['Front Load', 'Top Load', 'Semi-Automatic', 'Fully Automatic'],
      energyRating: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
      condition: ['New', 'Used'],
    },
  },
} as const;

export type AppliancesCategory = keyof typeof APPLIANCES_CATEGORIES;
export type ACSubcategory = keyof typeof APPLIANCES_CATEGORIES.AC.subcategories;
export type RefrigeratorSubcategory = keyof typeof APPLIANCES_CATEGORIES.REFRIGERATORS.subcategories;
export type GeneratorSubcategory = keyof typeof APPLIANCES_CATEGORIES.GENERATORS.subcategories;
export type KitchenSubcategory = keyof typeof APPLIANCES_CATEGORIES.KITCHEN_APPLIANCES.subcategories;
export type HomeSubcategory = keyof typeof APPLIANCES_CATEGORIES.HOME_APPLIANCES.subcategories;

// Get all appliance brands
export const getAllApplianceBrands = (): string[] => {
  const brands = new Set<string>();
  Object.values(APPLIANCES_CATEGORIES).forEach(category => {
    category.brands.forEach(brand => brands.add(brand));
  });
  return Array.from(brands).sort();
};

// Get category by ID
export const getApplianceCategory = (categoryId: string) => {
  return Object.entries(APPLIANCES_CATEGORIES).find(([_, category]) => category.id === categoryId);
};
