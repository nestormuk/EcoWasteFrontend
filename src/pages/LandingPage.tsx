import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Sparkles, Trash2 } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[600px]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Sustainable Waste Management Solutions
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            We provide comprehensive waste management services to keep our communities clean and sustainable.
          </p>
          <div className="mt-10">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Services</h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive waste management solutions for a cleaner tomorrow
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-green-600 text-white">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Waste Collection</h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Regular and reliable waste collection services for residential and commercial properties.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-green-600 text-white">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Recycling Services</h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Sustainable recycling solutions to minimize environmental impact.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-green-600 text-white">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Cleaning Services</h3>
              <p className="mt-2 text-base text-gray-600 text-center">
                Professional cleaning and disinfection services for all types of spaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}