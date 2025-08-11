'use client';

import AppointmentRequests from '../../components/AppointmentRequests';

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Requests</h1>
              <p className="text-gray-600 mt-1">Manage incoming consultation and project requests from customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <AppointmentRequests />
      </div>
    </div>
  );
}