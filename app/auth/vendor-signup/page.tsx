'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const BUSINESS_CATEGORIES = [
  'Electronics',
  'Fashion & Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Toys & Games',
  'Food & Beverages',
  'Automotive',
  'Other',
];

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Federal Capital Territory',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export default function VendorSignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    storeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Business Info
    businessRegistration: '',
    businessCategory: '',
    businessDescription: '',

    // Step 3: Bank Info
    bankAccount: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      bankCode: '',
    },

    // Step 4: Address Info
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      zipCode: '',
    },

    // Step 5: Store Details
    storeLogo: '',
    storeDescription: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name.startsWith('bankAccount.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        bankAccount: {
          ...prev.bankAccount,
          [field]: value,
        },
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError('');
  };

  const validateStep = (step: number) => {
    setError('');

    switch (step) {
      case 1:
        if (!formData.storeName.trim()) {
          setError('Store name is required');
          return false;
        }
        if (formData.storeName.length < 3) {
          setError('Store name must be at least 3 characters');
          return false;
        }
        if (!formData.email.trim()) {
          setError('Email is required');
          return false;
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please provide a valid email');
          return false;
        }
        if (!formData.phone.trim()) {
          setError('Phone number is required');
          return false;
        }
        if (!formData.password) {
          setError('Password is required');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;

      case 2:
        if (!formData.businessRegistration.trim()) {
          setError('Business registration number is required');
          return false;
        }
        if (!formData.businessCategory) {
          setError('Please select a business category');
          return false;
        }
        return true;

      case 3:
        if (!formData.bankAccount.accountName.trim()) {
          setError('Account name is required');
          return false;
        }
        if (!formData.bankAccount.accountNumber.trim()) {
          setError('Account number is required');
          return false;
        }
        if (!formData.bankAccount.bankName.trim()) {
          setError('Bank name is required');
          return false;
        }
        if (!formData.bankAccount.bankCode.trim()) {
          setError('Bank code is required');
          return false;
        }
        return true;

      case 4:
        if (!formData.address.street.trim()) {
          setError('Street address is required');
          return false;
        }
        if (!formData.address.city.trim()) {
          setError('City is required');
          return false;
        }
        if (!formData.address.state) {
          setError('State is required');
          return false;
        }
        if (!formData.address.zipCode.trim()) {
          setError('Zip code is required');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('[VENDOR_SIGNUP_FORM] Submitting vendor signup:', formData);

      const response = await fetch('/api/auth/vendor-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log('[VENDOR_SIGNUP_FORM] Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setSuccessMessage('Vendor account created successfully! Redirecting to dashboard...');

      console.log('[VENDOR_SIGNUP_FORM] Signup successful for vendor:', data.vendor._id);

      const vendorId = data.vendor._id;
      setTimeout(() => {
        window.location.href = `/dashboards/vendor/${vendorId}`;
      }, 1500);
    } catch (err: any) {
      console.error('[VENDOR_SIGNUP_FORM] Error:', err);
      setError(err.message || 'Error creating vendor account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 dark:from-black dark:to-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
            <span className="text-3xl">🛒</span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              OpnMart
            </span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Vendor Sign Up</h1>
          <p className="text-gray-600 dark:text-gray-400">Join our marketplace and start selling</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${
                      step < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-zinc-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of 5
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8 border border-green-200/30 dark:border-green-900/30">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg text-green-700 dark:text-green-400">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="Enter your store name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password (min. 6 characters)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Business Information</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    name="businessRegistration"
                    value={formData.businessRegistration}
                    onChange={handleInputChange}
                    placeholder="Enter your business registration number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Business Category</label>
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a category</option>
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Business Description (Optional)
                  </label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your business (max. 500 characters)"
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.businessDescription.length}/500 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Bank Account Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Bank Account Information</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">Account Name</label>
                  <input
                    type="text"
                    name="bankAccount.accountName"
                    value={formData.bankAccount.accountName}
                    onChange={handleInputChange}
                    placeholder="Enter account holder name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Account Number</label>
                  <input
                    type="text"
                    name="bankAccount.accountNumber"
                    value={formData.bankAccount.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankAccount.bankName"
                    value={formData.bankAccount.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bank Code</label>
                  <input
                    type="text"
                    name="bankAccount.bankCode"
                    value={formData.bankAccount.bankCode}
                    onChange={handleInputChange}
                    placeholder="Enter bank code"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Address Information */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Address Information</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter zip code"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <select
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a state</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Store Details */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Store Details</h2>

                <div>
                  <label className="block text-sm font-semibold mb-2">Store Logo URL (Optional)</label>
                  <input
                    type="url"
                    name="storeLogo"
                    value={formData.storeLogo}
                    onChange={handleInputChange}
                    placeholder="Enter your store logo URL"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Store Description (Optional)
                  </label>
                  <textarea
                    name="storeDescription"
                    value={formData.storeDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your store (max. 1000 characters)"
                    maxLength={1000}
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.storeDescription.length}/1000 characters
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    ✓ You have completed all required information. Click submit to create your vendor account.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition flex items-center justify-center gap-2 font-semibold"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/" className="text-green-500 hover:text-green-600 font-semibold">
                Go back home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
