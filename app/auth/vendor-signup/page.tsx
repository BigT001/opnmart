'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Upload, Eye, EyeOff } from 'lucide-react';

const NIGERIAN_STATES = ['Abia', 'Adamawa', 'Akwa Ibom', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];
const ID_TYPES = ['National ID', "Voter's Card", "Driver's License", 'International Passport'];

export default function VendorSignUpPage() {
  const router = useRouter();
  const [vendorType, setVendorType] = useState<'individual' | 'business' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessCategories, setBusinessCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    vendorType: '',
    // Individual Fields
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    ninNumber: '',
    idType: '',
    storeName: '',
    storeDescription: '',
    businessCategory: '',
    businessCategories: [] as string[], // For multiple category selection
    businessAddress: '',
    state: '',
    city: '',
    pickupAddress: '',
    policyAgreed: false,
    // Business Fields
    businessLegalName: '',
    tradingName: '',
    businessEmail: '',
    businessPhone: '',
    cacNumber: '',
    tinNumber: '',
    businessWebsite: '',
    yearsInOperation: '',
    headOfficeAddress: '',
    warehouseAddress: '',
    repFullName: '',
    repEmail: '',
    repPhone: '',
    repPosition: '',
    bankName: '',
    accountNumber: '',
    bvn: '',
  });

  const totalSteps = vendorType === 'individual' ? 5 : 7;

  // Fetch categories from database and poll for updates
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          const categoryNames = data.data.map((cat: any) => cat.name).sort();
          if (categoryNames.length > 0) {
            setBusinessCategories(categoryNames);
            console.log('[VENDOR_SIGNUP] Loaded categories:', categoryNames);
          } else {
            console.warn('[VENDOR_SIGNUP] No categories found, using defaults');
            setBusinessCategories(['Electronics', 'Fashion & Clothing', 'Home & Garden', 'Sports & Outdoors', 'Books & Media', 'Health & Beauty', 'Toys & Games', 'Food & Beverages', 'Automotive', 'Appliances']);
          }
        } else {
          console.warn('[VENDOR_SIGNUP] Invalid response format:', data);
          // Use default categories if API fails
          setBusinessCategories(['Electronics', 'Fashion & Clothing', 'Home & Garden', 'Sports & Outdoors', 'Books & Media', 'Health & Beauty', 'Toys & Games', 'Food & Beverages', 'Automotive', 'Appliances']);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use default categories on error
        setBusinessCategories(['Electronics', 'Fashion & Clothing', 'Home & Garden', 'Sports & Outdoors', 'Books & Media', 'Health & Beauty', 'Toys & Games', 'Food & Beverages', 'Automotive', 'Appliances']);
      }
    };

    // Initial fetch
    fetchCategories();

    // Poll for new categories every 30 seconds
    const interval = setInterval(fetchCategories, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-populate form with logged-in user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.buyer) {
          // Auto-populate with buyer data
          setFormData((prev) => ({
            ...prev,
            fullName: data.buyer.firstName ? `${data.buyer.firstName} ${data.buyer.lastName || ''}`.trim() : '',
            email: data.buyer.email || '',
            phone: data.buyer.phone || '',
            businessEmail: data.buyer.email || '',
            businessPhone: data.buyer.phone || '',
            repFullName: data.buyer.firstName ? `${data.buyer.firstName} ${data.buyer.lastName || ''}`.trim() : '',
            repEmail: data.buyer.email || '',
            repPhone: data.buyer.phone || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const calculatePasswordStrength = (password: string) => {
    if (!password) return null;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLong = password.length >= 8;
    const score = [hasUpper, hasLower, hasNum, hasSpecial, isLong].filter(Boolean).length;
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (name === 'password') setPasswordStrength(calculatePasswordStrength(value));
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  // Handle multiple category selection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
    setFormData((prev) => ({
      ...prev,
      businessCategories: selectedCategories.includes(category)
        ? selectedCategories.filter((cat) => cat !== category)
        : [...selectedCategories, category],
    }));
    setError('');
  };

  const validateStep = (step: number) => {
    setError('');
    
    // Step 0: Vendor type selection - just needs vendorType to be set
    if (step === 0) {
      if (!formData.vendorType) {
        setError('Please select a vendor type');
        return false;
      }
      return true;
    }
    
    if (vendorType === 'individual') {
      if (step === 1) {
        if (!formData.fullName.trim()) { setError('Full name is required'); return false; }
        if (!formData.email.trim()) { setError('Email is required'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Invalid email'); return false; }
        if (!formData.phone.trim()) { setError('Phone is required'); return false; }
        if (!formData.password || formData.password.length < 8) { setError('Password must be 8+ characters with uppercase, lowercase, numbers, and special characters'); return false; }
        if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) { setError('Password must contain uppercase, lowercase, numbers, and special characters'); return false; }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
      } else if (step === 2) {
        if (!formData.ninNumber.trim()) { setError('NIN is required'); return false; }
        if (!formData.idType) { setError('ID type is required'); return false; }
      } else if (step === 3) {
        if (!formData.storeName.trim()) { setError('Store name is required'); return false; }
        if (selectedCategories.length === 0) { setError('Please select at least one business category'); return false; }
        if (!formData.businessAddress.trim()) { setError('Business address is required'); return false; }
        if (!formData.state) { setError('State is required'); return false; }
        if (!formData.city.trim()) { setError('City is required'); return false; }
      } else if (step === 4) {
        if (!formData.pickupAddress.trim()) { setError('Pickup address is required'); return false; }
      }
    } else if (vendorType === 'business') {
      if (step === 1) {
        if (!formData.businessLegalName.trim()) { setError('Legal business name is required'); return false; }
        if (!formData.tradingName.trim()) { setError('Trading name is required'); return false; }
        if (!formData.businessEmail.trim()) { setError('Business email is required'); return false; }
        if (!formData.businessPhone.trim()) { setError('Business phone is required'); return false; }
        if (selectedCategories.length === 0) { setError('Please select at least one business category'); return false; }
      } else if (step === 2) {
        if (!formData.cacNumber.trim()) { setError('CAC number is required'); return false; }
        if (!formData.tinNumber.trim()) { setError('TIN is required'); return false; }
      } else if (step === 3) {
        if (!formData.headOfficeAddress.trim()) { setError('Head office address is required'); return false; }
        if (!formData.state) { setError('State is required'); return false; }
        if (!formData.city.trim()) { setError('City is required'); return false; }
      } else if (step === 4) {
        if (!formData.repFullName.trim()) { setError('Representative name is required'); return false; }
        if (!formData.repEmail.trim()) { setError('Representative email is required'); return false; }
        if (!formData.repPhone.trim()) { setError('Representative phone is required'); return false; }
      } else if (step === 5) {
        if (!formData.bankName.trim()) { setError('Bank name is required'); return false; }
        if (!formData.accountNumber.trim()) { setError('Account number is required'); return false; }
        if (!formData.bvn.trim()) { setError('BVN is required'); return false; }
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        businessCategories: selectedCategories,
      };

      const response = await fetch('/api/auth/vendor-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      // Get vendor ID from response
      const vendorId = data.vendor._id;

      setSuccessMessage('Vendor account created! Redirecting to your dashboard...');
      setTimeout(() => {
        window.location.href = `/dashboards/vendor/${vendorId}`;
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 dark:from-black dark:to-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <span className="text-3xl">🛒</span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">OpnMart</span>
          </Link>
          {currentStep === 0 ? (
            <>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-cyan-600 dark:from-green-400 dark:to-cyan-400 bg-clip-text text-transparent">Get on Board</h1>
            </>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400">Complete your {vendorType === 'individual' ? 'seller' : 'business'} profile</p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {vendorType && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${i < currentStep ? 'bg-green-500 text-white' : i === currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                    {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && <div className={`flex-1 h-1 mx-2 transition ${i < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-zinc-700'}`} />}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">Step {currentStep} of {totalSteps}</div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-green-200/30 dark:border-green-900/30">
          {successMessage && <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg text-green-700 dark:text-green-400">{successMessage}</div>}
          {error && <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg text-red-700 dark:text-red-400 flex items-start gap-2"><AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" /><span>{error}</span></div>}

          <form onSubmit={handleSubmit}>
            {/* Step 0: Vendor Type - REDESIGNED */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Individual Seller Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setVendorType('individual');
                      setFormData({ ...formData, vendorType: 'individual' });
                    }}
                    className={`relative overflow-hidden rounded-lg p-5 transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                      vendorType === 'individual'
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 shadow-lg'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 border-2 border-gray-300 dark:border-zinc-700 hover:border-green-400'
                    }`}
                  >
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-500/10 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <div className="relative z-10">
                      <div className={`text-3xl mb-2 ${vendorType === 'individual' ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
                        👤
                      </div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Individual Seller</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-left">Start selling right away as an individual</p>
                      <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 text-left">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 text-sm">✓</span> Quick setup
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 text-sm">✓</span> Flexible selling
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 text-sm">✓</span> Low requirements
                        </li>
                      </ul>
                    </div>
                    {vendorType === 'individual' && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>

                  {/* Registered Business Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setVendorType('business');
                      setFormData({ ...formData, vendorType: 'business' });
                    }}
                    className={`relative overflow-hidden rounded-lg p-5 transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                      vendorType === 'business'
                        ? 'bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-500 shadow-lg'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 border-2 border-gray-300 dark:border-zinc-700 hover:border-cyan-400'
                    }`}
                  >
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-cyan-500/10 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <div className="relative z-10">
                      <div className={`text-3xl mb-2 ${vendorType === 'business' ? 'text-cyan-500' : 'text-gray-600 dark:text-gray-400'}`}>
                        🏢
                      </div>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Registered Business</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-left">Professional setup for CAC-registered companies</p>
                      <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300 text-left">
                        <li className="flex items-center gap-2">
                          <span className="text-cyan-500 text-sm">✓</span> CAC verified
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-cyan-500 text-sm">✓</span> Build customer trust
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-cyan-500 text-sm">✓</span> Premium features
                        </li>
                      </ul>
                    </div>
                    {vendorType === 'business' && (
                      <div className="absolute top-3 right-3 bg-cyan-500 text-white rounded-full p-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">ℹ️</span>
                    <span>You can upgrade or switch your account type anytime from your dashboard settings</span>
                  </p>
                </div>
              </div>
            )}

            {/* INDIVIDUAL VENDOR FORM */}
            {vendorType === 'individual' && currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                {formData.fullName || formData.email || formData.phone ? (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                      <span className="font-bold mt-0.5">✓</span>
                      <span>Some information from your account has been pre-filled. Feel free to update if needed.</span>
                    </p>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your full name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="080xxxxxxxx" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Password *</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        placeholder="Strong password" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm Password *</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                        placeholder="Confirm password" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                {formData.password && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs font-semibold mb-2 text-blue-700 dark:text-blue-400">Password Strength: {passwordStrength?.toUpperCase()}</p>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className={`h-2 rounded-full transition ${passwordStrength === 'weak' ? 'w-1/3 bg-red-500' : passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' : 'w-full bg-green-500'}`} />
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">✓ Min 8 characters • ✓ Uppercase • ✓ Lowercase • ✓ Numbers • ✓ Special chars</p>
                  </div>
                )}
              </div>
            )}

            {vendorType === 'individual' && currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Verification Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">NIN Number *</label>
                    <input type="text" name="ninNumber" value={formData.ninNumber} onChange={handleInputChange} placeholder="Your NIN" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">ID Type *</label>
                    <select name="idType" value={formData.idType} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">Select ID type</option>
                      {ID_TYPES.map((id) => <option key={id} value={id}>{id}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Upload ID Document</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag & drop</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {vendorType === 'individual' && currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Business Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Store Name *</label>
                    <input type="text" name="storeName" value={formData.storeName} onChange={handleInputChange} placeholder="Your store name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-3">Business Categories * (Select one or more)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {businessCategories.length > 0 ? (
                        businessCategories.map((cat) => (
                          <div key={cat} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${cat}`}
                              checked={selectedCategories.includes(cat)}
                              onChange={() => handleCategoryToggle(cat)}
                              className="w-4 h-4 rounded border-gray-300 dark:border-zinc-600 text-green-500 cursor-pointer"
                            />
                            <label htmlFor={`category-${cat}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                              {cat}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</p>
                      )}
                    </div>
                    {selectedCategories.length > 0 && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-green-700 dark:text-green-400">
                        Selected: {selectedCategories.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Store Description</label>
                    <textarea name="storeDescription" value={formData.storeDescription} onChange={handleInputChange} placeholder="Describe what you sell..." rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Business Address *</label>
                    <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} placeholder="Street address" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">State *</label>
                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Your city" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {vendorType === 'individual' && currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Pickup & Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Pickup/Return Address *</label>
                    <textarea name="pickupAddress" value={formData.pickupAddress} onChange={handleInputChange} placeholder="Where customers can pick up returns..." rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400">✓ Bank details can be updated in your dashboard after signup</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" name="policyAgreed" checked={formData.policyAgreed} onChange={handleInputChange} className="w-4 h-4 mt-1" />
                    <label className="text-sm text-gray-700 dark:text-gray-300">I agree to the Seller Terms & Conditions and comply with Platform Policies *</label>
                  </div>
                </div>
              </div>
            )}

            {/* REGISTERED BUSINESS VENDOR FORM */}
            {vendorType === 'business' && currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Company Information</h2>
                {formData.businessEmail || formData.businessPhone ? (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                      <span className="font-bold mt-0.5">✓</span>
                      <span>Some information from your account has been pre-filled. Feel free to update if needed.</span>
                    </p>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Business Legal Name *</label>
                    <input type="text" name="businessLegalName" value={formData.businessLegalName} onChange={handleInputChange} placeholder="Official registered name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Trading Name (Store Name) *</label>
                    <input type="text" name="tradingName" value={formData.tradingName} onChange={handleInputChange} placeholder="Display name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Business Email *</label>
                    <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleInputChange} placeholder="business@company.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Business Phone *</label>
                    <input type="tel" name="businessPhone" value={formData.businessPhone} onChange={handleInputChange} placeholder="Business phone" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-3">Business Categories * (Select one or more)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {businessCategories.length > 0 ? (
                        businessCategories.map((cat) => (
                          <div key={cat} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`business-category-${cat}`}
                              checked={selectedCategories.includes(cat)}
                              onChange={() => handleCategoryToggle(cat)}
                              className="w-4 h-4 rounded border-gray-300 dark:border-zinc-600 text-green-500 cursor-pointer"
                            />
                            <label htmlFor={`business-category-${cat}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                              {cat}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</p>
                      )}
                    </div>
                    {selectedCategories.length > 0 && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-green-700 dark:text-green-400">
                        Selected: {selectedCategories.join(', ')}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Years in Operation</label>
                    <input type="number" name="yearsInOperation" value={formData.yearsInOperation} onChange={handleInputChange} placeholder="How many years?" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Business Website</label>
                    <input type="url" name="businessWebsite" value={formData.businessWebsite} onChange={handleInputChange} placeholder="https://yourwebsite.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {vendorType === 'business' && currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">CAC & Tax Verification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">CAC Registration Number *</label>
                    <input type="text" name="cacNumber" value={formData.cacNumber} onChange={handleInputChange} placeholder="CAC number" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">TIN (Tax ID) *</label>
                    <input type="text" name="tinNumber" value={formData.tinNumber} onChange={handleInputChange} placeholder="Tax Identification Number" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Upload CAC Certificate</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag & drop</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Upload TIN Certificate</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag & drop</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {vendorType === 'business' && currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Business Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Head Office Address *</label>
                    <input type="text" name="headOfficeAddress" value={formData.headOfficeAddress} onChange={handleInputChange} placeholder="Full address" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Warehouse Address (if different)</label>
                    <input type="text" name="warehouseAddress" value={formData.warehouseAddress} onChange={handleInputChange} placeholder="Warehouse address" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">State *</label>
                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {vendorType === 'business' && currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Authorized Representative</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input type="text" name="repFullName" value={formData.repFullName} onChange={handleInputChange} placeholder="Representative name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Position/Role *</label>
                    <input type="text" name="repPosition" value={formData.repPosition} onChange={handleInputChange} placeholder="e.g. Owner, Manager" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input type="email" name="repEmail" value={formData.repEmail} onChange={handleInputChange} placeholder="rep@company.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                    <input type="tel" name="repPhone" value={formData.repPhone} onChange={handleInputChange} placeholder="Phone number" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Upload Government ID</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag & drop</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {vendorType === 'business' && currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Bank Account Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Bank Name *</label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Your bank" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Account Number *</label>
                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="10-digit account number" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">BVN (Business Verification Number) *</label>
                    <input type="text" name="bvn" value={formData.bvn} onChange={handleInputChange} placeholder="BVN for verification" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {vendorType === 'business' && currentStep === 6 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Terms & Conditions</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" name="policyAgreed" checked={formData.policyAgreed} onChange={handleInputChange} className="w-4 h-4 mt-1" />
                    <label className="text-sm text-gray-700 dark:text-gray-300">I agree to the Platform Terms & Conditions *</label>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400">✓ Your business information will be verified within 24-48 hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-10 md:mt-12">
              <button 
                type="button" 
                onClick={handlePrevStep} 
                disabled={currentStep === 0} 
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed font-semibold transition flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              {currentStep < totalSteps - 1 ? (
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Creating Account...' : 'Complete Signup'}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/" className="text-green-500 hover:text-green-600 dark:hover:text-green-400 font-semibold transition">
                Return to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
