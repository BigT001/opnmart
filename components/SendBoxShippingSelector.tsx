/**
 * SendBox Shipping Selector Component
 * Gets REAL shipping costs from SendBox based on weight and dimensions
 */

'use client';

import { useState, useEffect } from 'react';
import { Truck, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import {
  getShippingOptionsFromSendBox,
  calculateOrderTotal,
  formatShippingOption,
  type ShippingOption,
  type ShippingItem,
} from '@/utils/sendboxCalculator';

interface SendBoxShippingSelectorProps {
  originState?: string;
  destinationState: string;
  items: ShippingItem[];
  subtotal: number;
  onOptionSelected: (option: ShippingOption) => void;
  selectedOption?: ShippingOption;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function SendBoxShippingSelector({
  originState = 'Lagos',
  destinationState,
  items,
  subtotal,
  onOptionSelected,
  selectedOption,
  onLoadingChange,
}: SendBoxShippingSelectorProps) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Fetch shipping options whenever destination or items change
  useEffect(() => {
    if (!destinationState?.trim() || !items || items.length === 0) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      onLoadingChange?.(true);
      setError('');

      try {
        const result = await getShippingOptionsFromSendBox(
          originState,
          destinationState,
          items
        );

        if (result.success) {
          setOptions(result.options);
          setDebugInfo(result.debug);
          // Auto-select cheapest option
          if (result.selectedOption) {
            onOptionSelected(result.selectedOption);
          }
        } else {
          setError(result.error || 'Failed to fetch shipping options');
          setOptions([]);
        }
      } catch (err) {
        setError('Connection error. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    // Add small delay to avoid too many requests
    const timer = setTimeout(fetchOptions, 500);
    return () => clearTimeout(timer);
  }, [destinationState, items, originState, onOptionSelected, onLoadingChange]);

  if (!destinationState?.trim() || !items || items.length === 0) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          Add items and select a delivery location to see shipping options
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <Loader className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-700 font-medium">
            Calculating shipping costs from SendBox...
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Analyzing weight, dimensions, and distance
        </p>
      </div>
    );
  }

  if (error && options.length === 0) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">{error}</p>
            <p className="text-sm text-red-700 mt-1">
              Please check your location and try again, or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p className="text-sm text-yellow-900">
          No shipping options available for this location. Please try another state.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-semibold text-lg">Select Shipping Method</h3>
          <p className="text-xs text-gray-500">
            Real-time rates from SendBox ({items.length} item{items.length > 1 ? 's' : ''})
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-3 mb-4">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          const orderTotal = calculateOrderTotal(subtotal, option);

          return (
            <div key={option.id}>
              {/* Option Button */}
              <button
                onClick={() => onOptionSelected(option)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Details */}
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">
                      {option.courierName}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>

                  {/* Right: Price */}
                  <div className="text-right whitespace-nowrap">
                    <div className="text-2xl font-bold text-blue-600">
                      ₦{option.totalCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      includes fee
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-2 mx-auto" />
                    )}
                  </div>
                </div>

                {/* Breakdown when selected */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Courier</p>
                      <p className="font-semibold">
                        ₦{option.baseCost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Platform</p>
                      <p className="font-semibold text-blue-600">
                        +₦{option.platformFee.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Days</p>
                      <p className="font-semibold">{option.estimatedDays}</p>
                    </div>
                  </div>
                )}
              </button>

              {/* Expand Details */}
              {isSelected && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showDetails ? '▼' : '▶'} Full Breakdown
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Order Breakdown */}
      {selectedOption && showDetails && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-sm">
          <h4 className="font-semibold text-gray-900 mb-3">Order Total</h4>
          {(() => {
            const total = calculateOrderTotal(subtotal, selectedOption);
            return (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ₦{total.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Courier ({selectedOption.courierName}):</span>
                  <span className="font-medium">
                    ₦{total.courierCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium text-blue-600">
                    +₦{total.platformFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5%):</span>
                  <span className="font-medium">
                    ₦{total.tax.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-base">
                  <span>Total to Pay:</span>
                  <span className="text-blue-600">
                    ₦{total.total.toLocaleString()}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900">
        <p>
          <strong>Real-time shipping:</strong> Costs are calculated by SendBox based
          on actual weight, dimensions, distance, and courier availability.
        </p>
      </div>

      {/* Debug Info (development only) */}
      {debugInfo && process.env.NODE_ENV === 'development' && (
        <details className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <summary className="cursor-pointer font-mono font-semibold">Debug Info</summary>
          <pre className="mt-2 overflow-auto text-gray-700">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export default SendBoxShippingSelector;
