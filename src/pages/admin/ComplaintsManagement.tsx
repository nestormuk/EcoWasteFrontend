import React, { useState } from 'react';
import { MessageSquare, Mail, MapPin } from 'lucide-react';
import type { Complaint } from '../../types/admin';

// Define the valid status values as a union type
type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

// Extend the base Complaint type with additional fields
interface EnhancedComplaint extends Omit<Complaint, 'status'> {
  status: ComplaintStatus;
  userEmail: string;
  location: string;
  lastUpdated?: string;
}

export const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState<EnhancedComplaint[]>([
    {
      id: '1',
      userId: '1',
      userEmail: 'john.doe@example.com',
      location: '123 Main St, Downtown Area',
      type: 'Missed Collection',
      description: 'Waste was not collected on scheduled date',
      status: 'PENDING',
      createdAt: '2024-01-20',
      lastUpdated: '2024-01-20',
    },
    // Add more mock data as needed
  ]);

  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | ''>('');

  const getStatusColor = (status: ComplaintStatus) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
    };
    return colors[status];
  };

  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus) => {
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return complaint;
    }));
  };

  const filteredComplaints = complaints.filter(complaint => 
    !statusFilter || complaint.status === statusFilter
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Complaints Management</h1>
        <select 
          className="w-full sm:w-auto border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | '')}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900">{complaint.type}</h3>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{complaint.description}</p>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" />
                      {complaint.userEmail}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {complaint.location}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>Submitted on {complaint.createdAt}</p>
                    {complaint.lastUpdated && complaint.lastUpdated !== complaint.createdAt && (
                      <p>Last updated on {complaint.lastUpdated}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[150px]">
                <select 
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint.id, e.target.value as ComplaintStatus)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                {complaint.status === 'IN_PROGRESS' && (
                  <button className="w-full text-sm text-blue-600 hover:text-blue-800">
                    Add Progress Note
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};