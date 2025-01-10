import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  accountStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentStatus: string;
  role: string;
}

interface DashboardResponse {
  message: string;
  user: User;
}

interface Complaint {
  type: string;
  description: string;
}

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [complaint, setComplaint] = useState<Complaint>({
    type: 'Missed Collection',
    description: ''
  });
  const [submitStatus, setSubmitStatus] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await axios.get<DashboardResponse>('http://localhost:8080/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data.user);
        setDashboardData(response.data);

        if (response.data.user) {
          // Fetch role-based dashboard data
          const roleEndpoint = response.data.user.role === 'ROLE_ADMIN'
            ? 'http://localhost:8080/api/dashboard/admin'
            : 'http://localhost:8080/api/dashboard/user';

          const dashboardResponse = await axios.get<DashboardResponse>(roleEndpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setDashboardData(dashboardResponse.data);
        }
      } catch (error: any) {
        console.error('Dashboard error:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('jwt_token');
          navigate('/signin');
        } else {
          setError(error.response?.data?.message || 'Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('');

    try {
      const token = localStorage.getItem('jwt_token');
      await axios.post('http://localhost:8080/api/dashboard/complaints', complaint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComplaint({ type: 'Missed Collection', description: '' });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">Failed to load user data</p>
          </div>
        </div>
      </div>
    );
  }

  if (user.accountStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your account is pending verification. Please wait for approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {user.name}
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Dashboard Data */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <CreditCard className="h-5 w-5 mr-2" />
            Dashboard Information
          </h2>
          <p>{dashboardData?.message}</p>
        </div>

        {/* Payment Status */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Status
          </h2>
          <div className="flex items-center">
            {user.paymentStatus === 'paid' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span
              className={`capitalize ${
                user.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {user.paymentStatus}
            </span>
          </div>
        </div>

        {/* Report Complaint */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Report a Complaint</h2>
          {submitStatus === 'success' && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <p className="ml-3 text-sm text-green-700">
                  Complaint submitted successfully!
                </p>
              </div>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">
                  Failed to submit complaint. Please try again.
                </p>
              </div>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleComplaintSubmit}>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Complaint Type
              </label>
              <select
                id="type"
                value={complaint.type}
                onChange={(e) => setComplaint({ ...complaint, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option>Missed Collection</option>
                <option>Service Quality</option>
                <option>Staff Behavior</option>
                <option>Payment Status</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={complaint.description}
                onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Please describe your issue..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};