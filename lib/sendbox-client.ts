/**
 * SendBox API Client
 * Handles all API requests to SendBox with authentication and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

interface SendBoxConfig {
  baseURL: string;
  accessToken: string;
  clientSecret: string;
  appId: string;
}

interface ShippingQuoteRequest {
  origin_country: string;
  origin_country_code: string;
  origin_state: string;
  origin_state_code: string;
  destination_country: string;
  destination_country_code: string;
  destination_state: string;
  destination_state_code: string;
  weight: number;
  items?: Array<{
    description: string;
    quantity: number;
    weight?: number;
  }>;
}

interface DeliveryQuote {
  provider: string;
  amount: number;
  currency: string;
  estimated_delivery_days: number;
  delivery_type?: string;
}

interface ShippingQuoteResponse {
  success: boolean;
  quotes?: DeliveryQuote[];
  error?: string;
  message?: string;
}

interface ShipmentData {
  reference: string;
  origin: {
    country: string;
    state: string;
    address: string;
    phone?: string;
    name?: string;
  };
  destination: {
    country: string;
    state: string;
    address: string;
    phone?: string;
    name?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    weight: number;
    value?: number;
  }>;
  weight: number;
  selected_courier?: string;
  insurance?: boolean;
}

class SendBoxClient {
  private client: AxiosInstance;
  private config: SendBoxConfig;

  constructor(config: SendBoxConfig) {
    this.config = config;

    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.accessToken}`
      },
      timeout: 30000 // 30 second timeout
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }

  /**
   * Get delivery quotes for a shipment
   */
  async getDeliveryQuotes(request: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    try {
      console.log('📤 Sending request to SendBox API:', {
        baseURL: this.config.baseURL,
        endpoint: '/quotes',
        request
      });

      const response = await this.client.post('/quotes', request);
      
      console.log('✅ SendBox API Response:', response.data);
      
      return {
        success: true,
        quotes: response.data.quotes || response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ SendBox getDeliveryQuotes Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch delivery quotes'
      };
    }
  }

  /**
   * Create a new shipment
   */
  async createShipment(shipment: ShipmentData) {
    try {
      const response = await this.client.post('/shipments', shipment);
      return {
        success: true,
        data: response.data,
        shipment_id: response.data.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create shipment'
      };
    }
  }

  /**
   * Get shipment details by ID
   */
  async getShipment(shipmentId: string) {
    try {
      const response = await this.client.get(`/shipments/${shipmentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch shipment'
      };
    }
  }

  /**
   * Get all shipments with optional filtering
   */
  async getShipments(filters?: { status?: string; limit?: number; offset?: number }) {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const response = await this.client.get(`/shipments${params.size > 0 ? '?' + params : ''}`);
      return {
        success: true,
        data: response.data,
        shipments: response.data.shipments || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch shipments'
      };
    }
  }

  /**
   * Track a shipment
   */
  async trackShipment(shipmentId: string) {
    try {
      const response = await this.client.get(`/shipments/${shipmentId}/tracking`);
      return {
        success: true,
        data: response.data,
        status: response.data.status,
        location: response.data.current_location,
        estimated_delivery: response.data.estimated_delivery
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track shipment'
      };
    }
  }

  /**
   * Cancel a shipment
   */
  async cancelShipment(shipmentId: string, reason: string) {
    try {
      const response = await this.client.post(`/shipments/${shipmentId}/cancel`, { reason });
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel shipment'
      };
    }
  }

  /**
   * Get available states/regions
   */
  async getStates(country: string) {
    try {
      const response = await this.client.get(`/locations/states?country=${country}`);
      return {
        success: true,
        states: response.data.states || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch states'
      };
    }
  }

  /**
   * Private method to handle errors consistently
   */
  private handleError(error: AxiosError) {
    console.error('SendBox API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject(error);
  }

  /**
   * Health check - verify API connectivity
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health', {
        headers: {
          // Health check might not need auth
          Authorization: undefined
        }
      });
      return { success: true, message: 'Connected to SendBox API' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to SendBox API'
      };
    }
  }
}

/**
 * Singleton instance of SendBox client
 * Initialize on server startup
 */
let sendBoxClient: SendBoxClient | null = null;

export function initializeSendBoxClient(): SendBoxClient {
  if (!sendBoxClient) {
    const requiredEnvVars = [
      'SENDBOX_API_BASE_URL',
      'SENDBOX_ACCESS_TOKEN',
      'SENDBOX_CLIENT_SECRET',
      'NEXT_PUBLIC_SENDBOX_APP_ID'
    ];

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required SendBox environment variables: ${missing.join(', ')}`
      );
    }

    sendBoxClient = new SendBoxClient({
      baseURL: process.env.SENDBOX_API_BASE_URL!,
      accessToken: process.env.SENDBOX_ACCESS_TOKEN!,
      clientSecret: process.env.SENDBOX_CLIENT_SECRET!,
      appId: process.env.NEXT_PUBLIC_SENDBOX_APP_ID!
    });
  }

  return sendBoxClient;
}

/**
 * Get the singleton SendBox client
 */
export function getSendBoxClient(): SendBoxClient {
  if (!sendBoxClient) {
    return initializeSendBoxClient();
  }
  return sendBoxClient;
}

export type { ShippingQuoteRequest, DeliveryQuote, ShippingQuoteResponse, ShipmentData };
export { SendBoxClient };
