'use client';

import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  email: string;
  token: string;
  onVerificationComplete: () => void;
  onClose: () => void;
}

export default function VerificationModal({
  isOpen,
  email,
  token,
  onVerificationComplete,
  onClose,
}: VerificationModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[VERIFICATION] Verifying code:', code);
      const response = await fetch('http://localhost:3001/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[VERIFICATION] Verification failed:', data);
        setError(data.message || 'Invalid verification code');
        setLoading(false);
        return;
      }

      console.log('[VERIFICATION] Email verified successfully!');
      setSuccess(true);
      setLoading(false);

      // Update localStorage to reflect verified status
      const buyerData = localStorage.getItem('buyer');
      if (buyerData) {
        const buyer = JSON.parse(buyerData);
        buyer.isVerified = true;
        localStorage.setItem('buyer', JSON.stringify(buyer));
      }

      setTimeout(() => {
        onVerificationComplete();
      }, 2000);
    } catch (err) {
      console.error('[VERIFICATION] Error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      console.log('[VERIFICATION] Requesting new code...');
      const response = await fetch('http://localhost:3001/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('[VERIFICATION] New code sent!');
        setError('');
        setCode('');
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } catch (err) {
      console.error('[VERIFICATION] Resend error:', err);
      setError('Failed to resend code.');
    }
    setResendLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
        >
          <X className="h-6 w-6" />
        </button>

        {success ? (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your account is now fully verified. You can start shopping!
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Verification Form */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We sent a verification code to <strong>{email}</strong>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-green-500 text-center text-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-green-500 hover:text-green-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {resendLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
