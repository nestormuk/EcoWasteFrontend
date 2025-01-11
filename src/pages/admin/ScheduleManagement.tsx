import React, { useState } from 'react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import type { CollectionSchedule } from '../../types/admin';

export const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<CollectionSchedule[]>([
    {
      id: '1',
      location: 'Downtown Area',
      date: '2024-01-20',
      time: '09:00',
      type: 'REGULAR',
      notes: 'Regular collection route',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<CollectionSchedule | null>(null);

  const handleEdit = (schedule: CollectionSchedule) => {
    setEditSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditSchedule(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleSave = (scheduleData: Partial<CollectionSchedule>) => {
    if (editSchedule) {
      // Edit existing schedule
      setSchedules(schedules.map(schedule => 
        schedule.id === editSchedule.id 
          ? { ...schedule, ...scheduleData }
          : schedule
      ));
    } else {
      // Add new schedule
      const newSchedule: CollectionSchedule = {
        id: Date.now().toString(),
        location: scheduleData.location || '',
        date: scheduleData.date || '',
        time: scheduleData.time || '',
        type: scheduleData.type || 'REGULAR',
        notes: scheduleData.notes || '',
      };
      setSchedules([...schedules, newSchedule]);
    }
    setIsModalOpen(false);
    setEditSchedule(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Collection Schedule</h1>
        <button 
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add New Schedule
        </button>
      </div>

      <div className="grid gap-6">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{schedule.location}</h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {schedule.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {schedule.location}
                    </div>
                  </div>
                  {schedule.notes && (
                    <p className="mt-2 text-sm text-gray-600">{schedule.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(schedule)}
                  className="text-green-600 hover:text-green-900"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(schedule.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editSchedule ? 'Edit Schedule' : 'Add New Schedule'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <ScheduleForm 
              initialData={editSchedule}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ScheduleForm = ({ 
  initialData, 
  onSave, 
  onCancel 
}: { 
  initialData: CollectionSchedule | null;
  onSave: (data: Partial<CollectionSchedule>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    location: initialData?.location || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    type: initialData?.type || 'REGULAR',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {initialData ? 'Save Changes' : 'Add Schedule'}
        </button>
      </div>
    </form>
  );
};