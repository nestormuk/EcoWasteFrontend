import React, { useState } from 'react';
import { Layout, ChevronRight, Menu, X } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { title: 'Users Management', path: 'users', icon: 'Users' },
    { title: 'Payments', path: 'payments', icon: 'CreditCard' },
    { title: 'Collection Schedule', path: 'schedule', icon: 'Calendar' },
    { title: 'Complaints', path: 'complaints', icon: 'MessageSquare' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Layout className="h-6 w-6 text-green-600" />
            <span className="text-xl font-semibold">Admin Panel</span>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span>{item.title}</span>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};