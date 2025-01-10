import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Recycle className="h-8 w-8" />
            <span className="font-bold text-xl">EcoWaste</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/signin" className="hover:text-green-200">Sign In</Link>
            <Link to="/signup" className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}