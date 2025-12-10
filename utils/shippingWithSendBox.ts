/**
 * Enhanced Shipping Calculator with SendBox Integration
 * Combines: Base shipping zones + SendBox courier quotes + Platform fee
 */

import { ShippingRate } from './shippingCalculator';

export interface SendBoxQuote {
  provider: string;
  amount: number;
  currency: string;
  estimated_delivery_days: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  provider: 'sendbox' | 'standard';
  baseCost: number;
  platformFee: number;
  totalCost: number;
  estimatedDays: number;
  description: string;
}

export interface ShippingQuoteResponse {
  success: boolean;
  options: ShippingOption[];
  defaultOption?: ShippingOption;
  error?: string;
}

// Platform fee configuration
export const PLATFORM_FEES = {
  SENDBOX_FEE: 500, // Fixed fee for SendBox quotes
  STANDARD_FEE: 300, // Fixed fee for standard shipping
  PERCENTAGE: 0.05, // 5% of shipping cost as additional fee
};

/**
 * Get state code mapping for SendBox API
 */
const STATE_CODE_MAP: Record<string, string> = {
  // South West
  'LAGOS': 'LOS',
  'OGUN': 'OG',
  'OYO': 'OY',
  'OSUN': 'OS',
  'EKITI': 'EK',
  'ONDO': 'ON',
  // South South
  'RIVERS': 'RV',
  'DELTA': 'DL',
  'BAYELSA': 'BY',
  'CROSS RIVER': 'CR',
  'AKWA IBOM': 'AK',
  'EDO': 'ED',
  // South East
  'ENUGU': 'EN',
  'ANAMBRA': 'AN',
  'IMO': 'IM',
  'ABIA': 'AB',
  'EBONYI': 'EB',
  // North Central
  'ABUJA': 'ABV',
  'FCT': 'ABV',
  'NIGER': 'NG',
  'NASARAWA': 'NW',
  'BENUE': 'BN',
  'KOGI': 'KG',
  'KWARA': 'KW',
  'PLATEAU': 'PL',
  // North West
  'KADUNA': 'KD',
  'KANO': 'KN',
  'KATSINA': 'KT',
  'SOKOTO': 'SK',
  'KEBBI': 'KB',
  'JIGAWA': 'JG',
  'ZAMFARA': 'ZM',
  // North East
  'YOBE': 'YB',
  'BORNO': 'BR',
  'ADAMAWA': 'AD',
  'TARABA': 'TR',
  'BAUCHI': 'BC',
  'GOMBE': 'GM',
};

/**
 * Get state code for SendBox API
 */
export const getStateCode = (state: string): string => {
  const normalized = state.toUpperCase().trim();
  return STATE_CODE_MAP[normalized] || normalized;
};

/**
 * Fetch quotes from SendBox API
 */
async function fetchSendBoxQuotes(
  originState: string,
  destinationState: string,
  weight: number
): Promise<SendBoxQuote[]> {
  try {
    const response = await fetch('/api/shipping/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: {
          country: 'Nigeria',
          country_code: 'NG',
          state: originState,
          state_code: getStateCode(originState),
        },
        destination: {
          country: 'Nigeria',
          country_code: 'NG',
          state: destinationState,
          state_code: getStateCode(destinationState),
        },
        weight: weight,
      }),
    });

    const data = await response.json();

    if (data.success && data.quotes) {
      return data.quotes;
    }

    return [];
  } catch (error) {
    console.error('SendBox API Error:', error);
    return [];
  }
}

/**
 * Convert SendBox quote to our ShippingOption format
 */
function convertSendBoxQuoteToOption(
  quote: SendBoxQuote,
  index: number
): ShippingOption {
  const baseCost = quote.amount;
  const platformFee =
    PLATFORM_FEES.SENDBOX_FEE +
    Math.round(baseCost * PLATFORM_FEES.PERCENTAGE);
  const totalCost = baseCost + platformFee;

  return {
    id: `sendbox-${index}`,
    name: `${quote.provider}`,
    provider: 'sendbox',
    baseCost,
    platformFee,
    totalCost,
    estimatedDays: quote.estimated_delivery_days,
    description: `${quote.estimated_delivery_days} day(s) delivery via ${quote.provider}`,
  };
}

/**
 * Create a standard shipping option (fallback)
 */
function createStandardOption(baseCost: number): ShippingOption {
  const platformFee =
    PLATFORM_FEES.STANDARD_FEE +
    Math.round(baseCost * PLATFORM_FEES.PERCENTAGE);
  const totalCost = baseCost + platformFee;

  return {
    id: 'standard-shipping',
    name: 'Standard Shipping',
    provider: 'standard',
    baseCost,
    platformFee,
    totalCost,
    estimatedDays: 3,
    description: '3-5 business days delivery',
  };
}

/**
 * Main function: Get all shipping options for checkout
 * @param originState - Origin state (e.g., "Lagos")
 * @param destinationState - Destination state (e.g., "Abuja")
 * @param weight - Package weight in kg
 * @param baseShippingCost - Base shipping cost from your standard calculator
 * @returns Array of shipping options with costs and fees
 */
export async function getShippingOptions(
  originState: string = 'Lagos',
  destinationState: string,
  weight: number = 1,
  baseShippingCost: number
): Promise<ShippingQuoteResponse> {
  if (!destinationState) {
    return {
      success: false,
      options: [],
      error: 'Destination state is required',
    };
  }

  try {
    // Fetch SendBox quotes in parallel
    const sendBoxQuotes = await fetchSendBoxQuotes(
      originState,
      destinationState,
      weight
    );

    let options: ShippingOption[] = [];

    // Convert SendBox quotes to our format
    if (sendBoxQuotes && sendBoxQuotes.length > 0) {
      options = sendBoxQuotes.map((quote, idx) =>
        convertSendBoxQuoteToOption(quote, idx)
      );
    }

    // Always include standard option as fallback
    const standardOption = createStandardOption(baseShippingCost);
    options.push(standardOption);

    // Sort by cost (cheapest first)
    options.sort((a, b) => a.totalCost - b.totalCost);

    return {
      success: true,
      options,
      defaultOption: options[0], // Cheapest option by default
    };
  } catch (error) {
    console.error('Shipping calculation error:', error);

    // Fallback to standard option
    const standardOption = createStandardOption(baseShippingCost);

    return {
      success: false,
      options: [standardOption],
      defaultOption: standardOption,
      error: 'Could not fetch all options. Showing standard shipping.',
    };
  }
}

/**
 * Calculate total order cost including shipping
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingOption: ShippingOption,
  taxRate: number = 0.075
): {
  subtotal: number;
  shippingBase: number;
  platformFee: number;
  tax: number;
  total: number;
} {
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shippingOption.totalCost + tax;

  return {
    subtotal,
    shippingBase: shippingOption.baseCost,
    platformFee: shippingOption.platformFee,
    tax,
    total,
  };
}

/**
 * Format shipping breakdown for display
 */
export function formatShippingBreakdown(shippingOption: ShippingOption): {
  courierCost: string;
  platformFee: string;
  total: string;
} {
  return {
    courierCost: `₦${shippingOption.baseCost.toLocaleString()}`,
    platformFee: `₦${shippingOption.platformFee.toLocaleString()}`,
    total: `₦${shippingOption.totalCost.toLocaleString()}`,
  };
}
