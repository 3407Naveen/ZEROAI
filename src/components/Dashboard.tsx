import React from 'react';
import { auth } from '../lib/supabase';
import { LogOut, User } from 'lucide-react';

interface DashboardProps {
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSignOut }) => {
  const handleSignOut = async () => {
    await auth.signOut();
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully signed in to your account. This is a protected area that requires authentication.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Authentication Complete</h3>
              <p className="text-purple-100">Your authentication system is working perfectly!</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
              <p className="text-blue-100">Your data is protected with Supabase authentication.</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Ready to Build</h3>
              <p className="text-green-100">Start building your application features!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;