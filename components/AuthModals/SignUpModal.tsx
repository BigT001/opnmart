'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Loader } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignUpSuccess?: (email: string, token: string) => void;
}

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin, onSignUpSuccess }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phonePrefix: '+234',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const phoneCountries = [
    { code: '+234', country: 'Nigeria' },
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+61', country: 'Australia' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be between 2 and 50 characters';
    }

    if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be between 2 and 50 characters';
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must contain uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phonePrefix: formData.phonePrefix,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      console.log('[SIGNUP MODAL] Form data being submitted:', {
        email: dataToSubmit.email,
        firstName: dataToSubmit.firstName,
        lastName: dataToSubmit.lastName,
        phone: `${dataToSubmit.phonePrefix}${dataToSubmit.phone}`,
        hasPassword: !!dataToSubmit.password,
        passwordLength: dataToSubmit.password?.length || 0,
      });

      // Call NestJS backend directly (skip Next.js API route)
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: dataToSubmit.email,
          password: dataToSubmit.password,
          firstName: dataToSubmit.firstName,
          lastName: dataToSubmit.lastName,
          phonePrefix: dataToSubmit.phonePrefix,
          phone: dataToSubmit.phone,
          role: 'buyer',
        }),
      });

      console.log('[SIGNUP MODAL] Raw response status:', response.status);
      console.log('[SIGNUP MODAL] Raw response ok:', response.ok);
      
      let data;
      try {
        data = await response.json();
        console.log('[SIGNUP MODAL] Parsed response data:', data);
      } catch (parseError) {
        console.error('[SIGNUP MODAL] Failed to parse JSON response:', parseError);
        setErrors({ submit: 'Server returned invalid response' });
        setLoading(false);
        return;
      }

      if (!response.ok) {
        console.error('[SIGNUP MODAL] Signup failed with status', response.status, ':', data.error || data);
        setErrors({ submit: data.error || data.message || 'Failed to create account' });
        setLoading(false);
        return;
      }

      console.log('[SIGNUP MODAL] Signup successful!');
      
      // Store the token and user info
      const token = data.access_token;
      const email = formData.email;
      localStorage.setItem('token', token);
      localStorage.setItem('buyer', JSON.stringify(data.user));
      
      console.log('[SIGNUP MODAL] Stored token and user to localStorage');
      console.log('[SIGNUP MODAL] Verification email already sent with signup');
      
      // Show success message
      setSuccessMessage('Account created! Check your email for the verification code...');
      setLoading(false);
      
      // Trigger verification modal
      if (onSignUpSuccess) {
        setTimeout(() => {
          onSignUpSuccess(email, token);
        }, 1500);
      }
    } catch (error) {
      console.error('[SIGNUP MODAL] Error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Join OpnMart today</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number with Country Code */}
          <div>
            <div className="flex gap-2">
              <select
                name="phonePrefix"
                value={formData.phonePrefix}
                onChange={handleChange}
                className="px-3 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 font-semibold text-gray-900 dark:text-white"
              >
                {phoneCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                maxLength={10}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              10 digits without country code
            </p>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-green-500/50 transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader className="h-5 w-5 animate-spin" />}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Switch to Login */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}
              className="text-green-600 dark:text-green-400 hover:underline font-semibold"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
