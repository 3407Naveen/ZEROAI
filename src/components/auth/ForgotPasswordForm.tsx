import React, { useState } from 'react';
import { validateEmail } from '../../utils/validation';
import { auth } from '../../lib/supabase';
import { AuthMode } from '../../types/auth';
import FormInput from './FormInput';

interface ForgotPasswordFormProps {
  onModeChange: (mode: AuthMode) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onModeChange }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await auth.resetPassword(email);
      
      if (error) {
        setErrors({ submit: error.message });
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-gray-600 mt-2">
            Click the link in the email to reset your password. If you don't see it, check your spam folder.
          </p>
        </div>

        <button
          onClick={() => onModeChange('signin')}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
        <p className="text-gray-600">Enter your email address and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          error={errors.email}
          disabled={loading}
        />

        {errors.submit && (
          <div className="text-red-500 text-sm text-center">{errors.submit}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => onModeChange('signin')}
              disabled={loading}
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;