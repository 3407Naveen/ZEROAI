import React, { useState } from 'react';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validation';
import { auth } from '../../lib/supabase';
import { AuthMode } from '../../types/auth';
import FormInput from './FormInput';

interface SignUpFormProps {
  onModeChange: (mode: AuthMode) => void;
  onSuccess: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onModeChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string | string[] } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else {
      const confirmValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (!confirmValidation.isValid) {
        newErrors.confirmPassword = confirmValidation.error || 'Passwords do not match';
      }
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await auth.signUp(formData.email, formData.password);
      
      if (error) {
        setErrors({ submit: error.message });
      } else {
        onSuccess();
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const renderError = (error: string | string[]) => {
    if (Array.isArray(error)) {
      return (
        <ul className="text-red-500 text-sm mt-1 list-disc list-inside">
          {error.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-red-500 text-sm mt-1">{error}</p>;
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
        <p className="text-gray-600">Create your account to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          error={typeof errors.email === 'string' ? errors.email : ''}
          disabled={loading}
        />

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password (8-128 characters) <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            minLength={8}
            maxLength={128}
            required
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.password
                ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
            } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.password.length}/128 characters
          </div>
          {errors.password && renderError(errors.password)}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.confirmPassword
                ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                : formData.confirmPassword && formData.password === formData.confirmPassword
                ? 'border-green-500 focus:ring-green-200 focus:border-green-500'
                : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
            } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
            <p className="text-green-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Passwords match
            </p>
          )}
          {errors.confirmPassword && renderError(errors.confirmPassword)}
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            disabled={loading}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
            I accept the{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
              Privacy Policy
            </a>
            <span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        {errors.acceptTerms && renderError(errors.acceptTerms)}

        {errors.submit && (
          <div className="text-red-500 text-sm text-center">{typeof errors.submit === 'string' ? errors.submit : ''}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
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

export default SignUpForm;