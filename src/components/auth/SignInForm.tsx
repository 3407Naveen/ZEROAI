import React, { useState } from 'react';
import { validateEmail } from '../../utils/validation';
import { auth } from '../../lib/supabase';
import { AuthMode } from '../../types/auth';
import FormInput from './FormInput';

interface SignInFormProps {
  onModeChange: (mode: AuthMode) => void;
  onSuccess: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onModeChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await auth.signIn(formData.email, formData.password);
      
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

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600">Log in to your account using your credentials.</p>
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
          error={errors.email}
          disabled={loading}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          error={errors.password}
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember for 30 days
            </label>
          </div>
          <button
            type="button"
            onClick={() => onModeChange('forgot-password')}
            disabled={loading}
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            Forgot Password
          </button>
        </div>

        {errors.submit && (
          <div className="text-red-500 text-sm text-center">{errors.submit}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onModeChange('signup')}
              disabled={loading}
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;