/**
 * Shipping Options Selector Component
 * Displays available shipping options with costs breakdown
 * Lets user select preferred courier
 */

'use client';

import { useState, useEffect } from 'react';
import { Truck, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import {
  getShippingOptions,
  calculateOrderTotal,
  formatShippingBreakdown,
  type ShippingOption,
} from '@/utils/shippingWithSendBox';

interface ShippingOptionsSelectorProps {
  destinationState: string;
  weight?: number;
  baseShippingCost: number;
  subtotal: number;
  onOptionSelected: (option: ShippingOption) => void;
  selectedOption?: ShippingOption;
}

export function ShippingOptionsSelector({
  destinationState,
  weight = 1,
  baseShippingCost,
  subtotal,
  onOptionSelected,
  selectedOption,
}: ShippingOptionsSelectorProps) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBreakdown, setShowBreakdown] = useState<string | null>(null);

  // Fetch shipping options when destination changes
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await getShippingOptions(
          'Lagos', // Default origin (your warehouse)
          destinationState,
          weight,
          baseShippingCost
        );

        if (result.success) {
          setOptions(result.options);
          // Auto-select cheapest option
          if (result.defaultOption) {
            onOptionSelected(result.defaultOption);
          }
        } else {
          setError(result.error || 'Failed to load shipping options');
          setOptions(result.options);
        }
      } catch (err) {
        setError('Connection error. Using standard shipping.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (destinationState.trim()) {
      fetchOptions();
    }
  }, [destinationState, weight, baseShippingCost, onOptionSelected]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Loader className="w-5 h-5 animate-spin text-blue-600" />
          <h3 className="font-semibold text-lg">Loading shipping options...</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Unable to load shipping options</h3>
            <p className="text-sm text-red-700">{error || 'Please try again later'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-6 h-6 text-blue-600" />
        <h3 className="font-semibold text-lg">Select Shipping Method</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          const breakdown = formatShippingBreakdown(option);
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
                <div className="flex items-start justify-between">
                  {/* Left: Option Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">{option.name}</span>
                      {option.provider === 'sendbox' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Real-time Quote
                        </span>
                      )}
                      {option.provider === 'standard' && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          Standard
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>

                  {/* Right: Cost & Selection */}
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      ₦{option.totalCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      includes platform fee
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                    )}
                  </div>
                </div>

                {/* Cost Breakdown on Hover/Selection */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Courier Cost</p>
                      <p className="font-semibold text-gray-900">
                        {breakdown.courierCost}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Platform Fee</p>
                      <p className="font-semibold text-gray-900">
                        {breakdown.platformFee}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Shipping</p>
                      <p className="font-semibold text-blue-600">
                        {breakdown.total}
                      </p>
                    </div>
                  </div>
                )}
              </button>

              {/* Details Toggle */}
              {isSelected && (
                <button
                  onClick={() =>
                    setShowBreakdown(
                      showBreakdown === option.id ? null : option.id
                    )
                  }
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showBreakdown === option.id ? '▼ Hide' : '▶ Show'} Order Summary
                </button>
              )}

              {/* Full Order Breakdown */}
              {isSelected && showBreakdown === option.id && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ₦{orderTotal.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Courier Cost:</span>
                    <span className="font-medium">
                      ₦{orderTotal.shippingBase.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee (Shipping):</span>
                    <span className="font-medium text-blue-600">
                      ₦{orderTotal.platformFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (7.5%):</span>
                    <span className="font-medium">
                      ₦{orderTotal.tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      ₦{orderTotal.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ How it works:</strong> Shipping costs are calculated based on
          real-time courier quotes from SendBox plus our 5% platform fee. You
          always get the best rate!
        </p>
      </div>
    </div>
  );
}
