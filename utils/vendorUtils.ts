/**
 * Utility functions for vendor operations
 */

/**
 * Fetch vendor information by vendor ID
 * Uses client-side API call to fetch vendor details
 */
export async function getVendorName(vendorId: string): Promise<string> {
  if (!vendorId) return 'OpenMart';
  
  try {
    const response = await fetch(`/api/vendors/${vendorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    });

    if (!response.ok) {
      return 'Unknown Vendor';
    }

    const data = await response.json();
    
    // Return store name if available, otherwise return business name or full name
    if (data.storeName) return data.storeName;
    if (data.tradingName) return data.tradingName;
    if (data.businessLegalName) return data.businessLegalName;
    if (data.fullName) return data.fullName;
    
    return 'OpenMart';
  } catch (error) {
    console.error('Error fetching vendor name:', error);
    return 'OpenMart';
  }
}

/**
 * Fetch multiple vendor names in batch
 * More efficient than fetching one by one
 */
export async function getVendorNames(vendorIds: string[]): Promise<Record<string, string>> {
  if (!vendorIds || vendorIds.length === 0) return {};
  
  try {
    const response = await fetch('/api/vendors/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorIds: [...new Set(vendorIds)] }), // Remove duplicates
      cache: 'force-cache',
    });

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vendor names:', error);
    return {};
  }
}
