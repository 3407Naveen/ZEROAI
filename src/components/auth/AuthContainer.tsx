import React, { useState } from 'react';
import { AuthMode } from '../../types/auth';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Lock } from 'lucide-react';

interface AuthContainerProps {
  onSuccess: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return <SignInForm onModeChange={handleModeChange} onSuccess={onSuccess} />;
      case 'signup':
        return <SignUpForm onModeChange={handleModeChange} onSuccess={onSuccess} />;
      case 'forgot-password':
        return <ForgotPasswordForm onModeChange={handleModeChange} />;
      default:
        return <SignInForm onModeChange={handleModeChange} onSuccess={onSuccess} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {renderForm()}
        </div>
      </div>

      {/* Right side - Purple gradient with lock icon */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-transparent"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="absolute top-3/4 right-1/3 w-16 h-16 bg-white/10 rounded-full"></div>
        
        {/* Main lock icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Lock size={64} className="text-white/80" />
            </div>
          </div>
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default AuthContainer;