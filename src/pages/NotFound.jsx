import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <AlertTriangle className="w-10 h-10 text-orange-600" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition shadow-lg hover:shadow-xl hover:-translate-y-1">
        <Home className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;