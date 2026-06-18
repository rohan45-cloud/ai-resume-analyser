import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
    <div className="text-center px-4">
      <h1 className="text-7xl font-extrabold text-blue-600">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-6">
        <FiHome /> Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
