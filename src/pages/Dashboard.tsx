import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle2, XCircle, Calendar, MessageSquare } from 'lucide-react';

interface User {
  name: string;
  email: string;
  accountStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentStatus: string;
  role: string;
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  date: string;
}

interface CollectionSchedule {
  id: number;
  date: string;
  status: string;
  location: string;
}

interface Complaint {
  id?: number;
  type: string;
  description: string;
  status?: string;
  createdAt?: string;
}

interface DashboardResponse {
  message: string;
  user: User;
  payments: Payment[];
  complaints: Complaint[];
  collectionSchedules: CollectionSchedule[];
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          window.location.href = '/signin';
          return;
        }

        const response = await fetch('http://localhost:8080/api/dashboard/user', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('jwt_token');
            window.location.href = '/signin';
            return;
          }
          throw new Error('Failed to load dashboard data');
        }

        const data = await response.json();
        setUser(data.user);
        setDashboardData(data);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('');

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://localhost:8080/api/dashboard/complaints', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(complaint)
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      setComplaint({ type: 'Missed Collection', description: '' });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  // Empty State Component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-6 bg-gray-50 rounded-lg">
      <p className="text-gray-500">{message}</p>
    </div>
  );

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

        {/* Recent Payments */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <CreditCard className="h-5 w-5 mr-2" />
            Recent Payments
          </h2>
          {dashboardData?.payments && dashboardData.payments.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Amount: ${payment.amount}</p>
                    <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No payment history available" />
          )}
        </div>

        {/* Collection Schedules */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2" />
            Collection Schedules
          </h2>
          {dashboardData?.collectionSchedules && dashboardData.collectionSchedules.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.collectionSchedules.map((schedule) => (
                <div key={schedule.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{schedule.location}</p>
                    <p className="text-sm text-gray-500">{new Date(schedule.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    schedule.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {schedule.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No collection schedules available" />
          )}
        </div>

        {/* Previous Complaints */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <MessageSquare className="h-5 w-5 mr-2" />
            Previous Complaints
          </h2>
          {dashboardData?.complaints && dashboardData.complaints.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.complaints.map((complaint) => (
                <div key={complaint.id} className="border-b pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{complaint.type}</p>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{complaint.description}</p>
                  {complaint.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No complaints filed yet" />
          )}
        </div>

        {/* Report New Complaint */}
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

export default Dashboard;