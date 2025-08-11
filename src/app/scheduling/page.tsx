'use client';

import { useState } from 'react';
import { CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const upcomingEvents = [
  {
    id: 1,
    title: 'Site Consultation - Johnson Residence',
    date: '2025-01-30',
    time: '10:00 AM',
    type: 'consultation',
    location: '123 Oak Street, Raleigh, NC',
    customer: 'Mike Johnson',
    phone: '(919) 555-0123',
    notes: 'Initial consultation for backyard pickleball court. Premium service level interest.'
  },
  {
    id: 2,
    title: 'Concrete Pour - Smith Project',
    date: '2025-01-31',
    time: '7:00 AM',
    type: 'construction',
    location: '456 Pine Ave, Cary, NC',
    customer: 'Sarah Smith',
    phone: '(919) 555-0456',
    notes: 'Weather dependent. Backup date: Feb 3rd. Contractor: ABC Concrete.'
  },
  {
    id: 3,
    title: 'Surface Coating - Davis Court',
    date: '2025-02-03',
    time: '9:00 AM',
    type: 'finishing',
    location: '789 Maple Dr, Durham, NC',
    customer: 'Robert Davis',
    phone: '(919) 555-0789',
    notes: 'Final phase - coating and line painting. Weather must be clear.'
  }
];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'consultation':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'construction':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'finishing':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function SchedulingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
        <p className="text-gray-600">Manage your appointments, site visits, and project milestones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View - Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Calendar View</h2>
              <div className="flex items-center gap-4">
                <select className="rounded-md border-gray-300 text-sm">
                  <option>Week View</option>
                  <option>Month View</option>
                  <option>Day View</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  New Event
                </button>
              </div>
            </div>
            
            {/* Calendar Integration Placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Google Calendar Integration</h3>
              <p className="text-gray-500 mb-4">
                Connect your Google Calendar to sync events and manage scheduling seamlessly.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Connect Google Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{event.date}</span>
                      <ClockIcon className="h-4 w-4 ml-2" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{event.customer}</span>
                      <PhoneIcon className="h-4 w-4 ml-2" />
                      <span>{event.phone}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-4 w-4 mt-0.5" />
                      <span>{event.location}</span>
                    </div>
                    
                    {event.notes && (
                      <div className="bg-gray-50 rounded p-2 mt-2">
                        <p className="text-xs text-gray-600">{event.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-3 gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">Reschedule</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 border border-gray-200">
                <div className="font-medium text-sm">Schedule Site Visit</div>
                <div className="text-xs text-gray-600">Book initial consultation</div>
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 border border-gray-200">
                <div className="font-medium text-sm">Plan Construction Phase</div>
                <div className="text-xs text-gray-600">Set concrete pour dates</div>
              </button>
              <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 border border-gray-200">
                <div className="font-medium text-sm">Schedule Follow-up</div>
                <div className="text-xs text-gray-600">Post-completion check-in</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}