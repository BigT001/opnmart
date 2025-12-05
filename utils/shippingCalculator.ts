/**
 * Shipping Cost Calculator
 * Calculates shipping costs based on delivery location (State/City)
 * Uses a zone-based system optimized for Nigeria
 */

export interface ShippingRate {
  zone: string;
  states: string[];
  baseCost: number;
  perKmCost: number;
  description: string;
}

export interface ShippingCalculation {
  zone: string;
  baseCost: number;
  estimatedDelivery: string;
  description: string;
  discount?: number;
  finalCost: number;
}

// Define shipping zones and rates for Nigeria
// Based on delivery distance from Lagos warehouse (base location)
export const SHIPPING_ZONES: ShippingRate[] = [
  {
    zone: 'Zone 1 - Lagos Metropolis',
    states: ['Lagos', 'VI', 'Lekki', 'Ikoyi', 'Ajah', 'Epe'],
    baseCost: 2000,
    perKmCost: 50,
    description: 'Same day or next day delivery',
  },
  {
    zone: 'Zone 2 - Lagos Outskirts',
    states: ['Ikorodu', 'Epe', 'Badagry', 'Lekki Epe', 'Ibeju-Lekki'],
    baseCost: 3000,
    perKmCost: 75,
    description: '1-2 days delivery',
  },
  {
    zone: 'Zone 3 - South West',
    states: ['Ogun', 'Oyo', 'Osun', 'Ekiti', 'Ondo'],
    baseCost: 4000,
    perKmCost: 100,
    description: '2-3 days delivery',
  },
  {
    zone: 'Zone 4 - South South',
    states: ['Rivers', 'Delta', 'Bayelsa', 'Cross River', 'Akwa Ibom', 'Edo'],
    baseCost: 5000,
    perKmCost: 120,
    description: '3-4 days delivery',
  },
  {
    zone: 'Zone 5 - South East',
    states: ['Enugu', 'Anambra', 'Imo', 'Abia', 'Ebonyi'],
    baseCost: 5500,
    perKmCost: 130,
    description: '3-4 days delivery',
  },
  {
    zone: 'Zone 6 - North Central',
    states: ['Abuja', 'FCT', 'Niger', 'Nasarawa', 'Benue', 'Kogi', 'Kwara', 'Plateau'],
    baseCost: 6000,
    perKmCost: 150,
    description: '3-5 days delivery',
  },
  {
    zone: 'Zone 7 - North West',
    states: ['Kaduna', 'Kano', 'Katsina', 'Sokoto', 'Kebbi', 'Jigawa', 'Zamfara'],
    baseCost: 7000,
    perKmCost: 180,
    description: '4-5 days delivery',
  },
  {
    zone: 'Zone 8 - North East',
    states: ['Yobe', 'Borno', 'Adamawa', 'Taraba', 'Bauchi', 'Gombe'],
    baseCost: 7500,
    perKmCost: 200,
    description: '4-6 days delivery',
  },
];

/**
 * Find the shipping zone based on state/city
 */
export const findShippingZone = (state: string): ShippingRate | null => {
  const normalizedState = state.toUpperCase().trim();
  
  return SHIPPING_ZONES.find(zone =>
    zone.states.some(s => s.toUpperCase() === normalizedState)
  ) || null;
};

/**
 * Calculate shipping cost based on location
 * @param state - User's state
 * @param subtotal - Subtotal amount in Naira
 * @returns ShippingCalculation object
 */
export const calculateShipping = (
  state: string,
  subtotal: number
): ShippingCalculation => {
  const zone = findShippingZone(state);

  if (!zone) {
    // Default to Zone 3 if not found
    return {
      zone: 'Standard',
      baseCost: 4000,
      estimatedDelivery: '2-3 days',
      description: 'Standard shipping to your location',
      finalCost: 4000,
    };
  }

  // Calculate with potential discounts
  let shippingCost = zone.baseCost;
  let discount = 0;

  // Free shipping discount for orders above ₦50,000
  if (subtotal >= 50000) {
    discount = shippingCost * 0.5; // 50% discount
    shippingCost = shippingCost - discount;
  }
  // Partial discount for orders above ₦30,000
  else if (subtotal >= 30000) {
    discount = shippingCost * 0.25; // 25% discount
    shippingCost = shippingCost - discount;
  }

  return {
    zone: zone.zone,
    baseCost: zone.baseCost,
    estimatedDelivery: zone.description,
    description: `${zone.zone} - ${zone.description}`,
    discount: discount > 0 ? discount : undefined,
    finalCost: Math.max(500, shippingCost), // Minimum ₦500 shipping
  };
};

/**
 * Get all available zones for display
 */
export const getAvailableZones = (): ShippingRate[] => {
  return SHIPPING_ZONES;
};

/**
 * Calculate estimated delivery date based on zone
 */
export const getEstimatedDeliveryDate = (state: string): Date | null => {
  const zone = findShippingZone(state);
  if (!zone) return null;

  const today = new Date();
  
  // Extract minimum days from description (e.g., "2-3 days" -> 2)
  const match = zone.description.match(/(\d+)-(\d+)\s*days/i);
  if (!match) return null;

  const minDays = parseInt(match[1], 10);
  const estimatedDate = new Date(today);
  estimatedDate.setDate(estimatedDate.getDate() + minDays + 1); // +1 for processing

  return estimatedDate;
};

/**
 * Format shipping info for display
 */
export const formatShippingInfo = (calculation: ShippingCalculation): string => {
  const parts = [calculation.zone];
  if (calculation.discount) {
    parts.push(`(${calculation.discount > 0 ? '-' : '+'}₦${Math.abs(calculation.discount).toLocaleString()})`);
  }
  parts.push(`= ₦${calculation.finalCost.toLocaleString()}`);
  return parts.join(' ');
};
