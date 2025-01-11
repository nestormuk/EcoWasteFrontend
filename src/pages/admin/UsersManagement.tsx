import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Search, X } from 'lucide-react';

// Types
export type AccountStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type UserRole = 'USER' | 'ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  location: string;
  accountStatus: AccountStatus;
  role: UserRole;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/admin',  // Remove /admin from base URL
  timeout: 5000,
});

export const UsersManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AccountStatus | ''>('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get JWT token from localStorage
  const jwt_token = localStorage.getItem('jwt_token');

  // Configure API interceptor for authentication
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (jwt_token) {
        config.headers.Authorization = `Bearer ${jwt_token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [jwt_token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/admin/users');
      console.log('API Response:', response.data);
  
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (typeof response.data === 'object' && response.data !== null) {
        setUsers(Array.isArray(response.data.users) ? response.data.users : [response.data]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setError('Access denied. Please make sure you have admin privileges.');
        } else if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
          setError('No response received from server. Please check your connection.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (editingUser) {
      try {
        setError(null);
        // Format the data to match your backend expectations
        const userDataToUpdate = {
          name: editingUser.name,
          email: editingUser.email,
          location: editingUser.location,
          accountStatus: editingUser.accountStatus,
          role: editingUser.role
        };

        const response = await api.put(`/usersUpdate/${editingUser.email}`, userDataToUpdate);
        console.log('User updated:', response.data);
        setEditingUser(null);
        await fetchUsers(); // Refresh the list after update
      } catch (error) {
        console.error('Error updating user:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setError('User not found. The user may have been deleted.');
          } else if (error.response?.status === 403) {
            setError('Access denied. Please make sure you have admin privileges.');
          } else {
            setError(error.response?.data || 'Failed to save changes. Please try again later.');
          }
        } else {
          setError('An unexpected error occurred while saving changes.');
        }
      }
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError(null);
        await api.delete(`/admin/usersDelete/${email}`);
        await fetchUsers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            setError('Access denied. Please make sure you have admin privileges.');
          } else {
            setError('Failed to delete user. Please try again later.');
          }
        } else {
          setError('An unexpected error occurred while deleting the user.');
        }
      }
    }
  };

  useEffect(() => {
    if (jwt_token) {
      fetchUsers();
    }
  }, [jwt_token]);

  const getStatusColor = (status: AccountStatus) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users
    .filter(user => !selectedStatus || user.accountStatus === selectedStatus)
    .filter(user => 
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!jwt_token) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Authentication Required</h2>
        <p className="text-gray-600">Please log in to access the users management panel.</p>
      </div>
    );
  }

  // Main JSX for the component
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as AccountStatus | '')}
            className="w-full sm:w-auto border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit User</h2>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editingUser.location}
                  onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <select
                  value={editingUser.accountStatus}
                  onChange={(e) => setEditingUser({ ...editingUser, accountStatus: e.target.value as AccountStatus })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleEditSave}
                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className={`text-sm ${getStatusColor(user.accountStatus)}`}>{user.accountStatus}</p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingUser(user)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.email)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;
