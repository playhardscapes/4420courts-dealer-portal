'use client';

import { useState, useEffect } from 'react';
import { Customer, getAllCustomers, getCustomerDisplayName } from '../../data/customers';
import { 
  CalendarIcon, 
  PlusIcon, 
  VideoCameraIcon, 
  PhoneIcon, 
  MapPinIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'appointment' | 'project_milestone' | 'project_start' | 'project_end' | 'consultation' | 'site_visit';
  customerId?: string;
  customer: string;
  projectId?: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

interface Project {
  id: string;
  projectNumber: string;
  customer: string;
  startDate: Date;
  estimatedCompletion: Date;
  status: 'planning' | 'in_progress' | 'completed';
  milestones: {
    name: string;
    dueDate: Date;
    completed: boolean;
  }[];
}

// Mock calendar events - linked to actual customers
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Initial Consultation - Riverside Estates HOA',
    customerId: 'cust_hoa_001',
    customer: 'Sarah Davis',
    type: 'consultation',
    startTime: new Date(2025, 1, 3, 10, 0), // Feb 3, 10:00 AM
    endTime: new Date(2025, 1, 3, 11, 0),
    status: 'confirmed',
    location: '5678 Riverside Drive, Cary, NC 27519',
    notes: 'Board approved consultation for tennis court resurfacing project',
    priority: 'high',
    assignedTo: 'John Doe'
  },
  {
    id: '2',
    title: 'Site Visit - Botetourt County Courts 3 & 4',
    customerId: 'cust_municipality_001',
    customer: 'John Smith',
    type: 'site_visit',
    startTime: new Date(2025, 1, 5, 14, 0), // Feb 5, 2:00 PM
    endTime: new Date(2025, 1, 5, 15, 30),
    status: 'scheduled',
    location: '150 Scruggs Road, Cloverdale, VA 24077',
    priority: 'high',
    notes: 'Site assessment for courts 3 & 4 resurfacing project',
    projectId: 'P-2025-001'
  },
  {
    id: '3',
    title: 'Project Start - Elite Sports Academy',
    customerId: 'cust_business_001',
    customer: 'Elite Sports Academy',
    type: 'project_start',
    startTime: new Date(2025, 1, 10, 8, 0), // Feb 10, 8:00 AM
    endTime: new Date(2025, 1, 10, 17, 0),
    status: 'scheduled',
    priority: 'high',
    location: '1000 Academy Drive, Virginia Beach, VA 23456',
    projectId: 'P-2025-002'
  },
  {
    id: '4',
    title: 'Individual Consultation - Aric Holsinger',
    customerId: 'cust_individual_001',
    customer: 'Aric Holsinger',
    type: 'consultation',
    startTime: new Date(2025, 1, 7, 9, 0), // Feb 7, 9:00 AM
    endTime: new Date(2025, 1, 7, 10, 0),
    status: 'scheduled',
    priority: 'medium',
    location: '123 Residential Court, Individual Home',
    notes: 'Level 3 service consultation for residential court project'
  }
];

// Mock projects for timeline
const mockProjects: Project[] = [
  {
    id: 'P-2025-001',
    projectNumber: 'P-2025-001',
    customer: 'Sarah Smith',
    startDate: new Date(2025, 0, 29),
    estimatedCompletion: new Date(2025, 1, 15),
    status: 'in_progress',
    milestones: [
      { name: 'Site Prep', dueDate: new Date(2025, 1, 2), completed: true },
      { name: 'Surface Preparation', dueDate: new Date(2025, 1, 5), completed: false },
      { name: 'Base Coating', dueDate: new Date(2025, 1, 8), completed: false },
      { name: 'Final Inspection', dueDate: new Date(2025, 1, 15), completed: false }
    ]
  },
  {
    id: 'P-2025-002',
    projectNumber: 'P-2025-002',
    customer: 'Mike Johnson',
    startDate: new Date(2025, 0, 30),
    estimatedCompletion: new Date(2025, 2, 15),
    status: 'planning',
    milestones: [
      { name: 'Planning Phase', dueDate: new Date(2025, 1, 5), completed: false },
      { name: 'Permit Approval', dueDate: new Date(2025, 1, 12), completed: false },
      { name: 'Construction Start', dueDate: new Date(2025, 1, 20), completed: false }
    ]
  }
];

const getEventIcon = (type: string) => {
  switch (type) {
    case 'consultation':
      return VideoCameraIcon;
    case 'site_visit':
      return MapPinIcon;
    case 'project_start':
    case 'project_end':
      return CalendarIcon;
    case 'project_milestone':
      return CheckCircleIcon;
    default:
      return CalendarIcon;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'consultation':
      return 'bg-blue-100 text-blue-800';
    case 'site_visit':
      return 'bg-green-100 text-green-800';
    case 'project_start':
    case 'project_end':
      return 'bg-purple-100 text-purple-800';
    case 'project_milestone':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects] = useState<Project[]>(mockProjects);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month' | 'timeline'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Load customers
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
  }, []);

  // Form state for new events
  const [formData, setFormData] = useState({
    title: '',
    type: 'appointment' as CalendarEvent['type'],
    customer: '',
    projectId: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: '',
    priority: 'medium' as CalendarEvent['priority'],
    assignedTo: ''
  });

  const today = new Date();
  const todayEvents = events.filter(event => 
    event.startTime.toDateString() === today.toDateString()
  );

  const upcomingEvents = events.filter(event => 
    event.startTime > today
  ).slice(0, 5);

  const activeProjects = projects.filter(project => 
    project.status === 'in_progress' || project.status === 'planning'
  );

  const getLinkedCustomer = (event: CalendarEvent): Customer | null => {
    if (!event.customerId) return null;
    return customers.find(c => c.id === event.customerId) || null;
  };

  const getCustomerInfo = (event: CalendarEvent) => {
    const linkedCustomer = getLinkedCustomer(event);
    if (linkedCustomer) {
      return {
        name: getCustomerDisplayName(linkedCustomer),
        organization: linkedCustomer.organizationType !== 'INDIVIDUAL' ? linkedCustomer.companyName : null,
        status: linkedCustomer.customerStatus,
        linked: true
      };
    }
    return {
      name: event.customer,
      organization: null,
      status: null,
      linked: false
    };
  };

  const handleCreateEvent = async () => {
    setIsLoading(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type,
        customer: formData.customer,
        projectId: formData.projectId || undefined,
        startTime: startDateTime,
        endTime: endDateTime,
        status: 'scheduled',
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined
      };

      setEvents([...events, newEvent]);
      setShowNewEventForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEventStatus = async (eventId: string, newStatus: CalendarEvent['status']) => {
    setIsLoading(true);
    try {
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, status: newStatus }
          : event
      ));
    } catch (error) {
      console.error('Error updating event status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsLoading(true);
      try {
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      customer: event.customer,
      projectId: event.projectId || '',
      startDate: event.startTime.toISOString().split('T')[0],
      startTime: event.startTime.toTimeString().slice(0, 5),
      endTime: event.endTime.toTimeString().slice(0, 5),
      location: event.location || '',
      notes: event.notes || '',
      priority: event.priority,
      assignedTo: event.assignedTo || ''
    });
    setShowNewEventForm(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    
    setIsLoading(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

      const updatedEvent: CalendarEvent = {
        ...editingEvent,
        title: formData.title,
        type: formData.type,
        customer: formData.customer,
        projectId: formData.projectId || undefined,
        startTime: startDateTime,
        endTime: endDateTime,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined
      };

      setEvents(events.map(event => 
        event.id === editingEvent.id ? updatedEvent : event
      ));
      setShowNewEventForm(false);
      setEditingEvent(null);
      resetForm();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'appointment',
      customer: '',
      projectId: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      notes: '',
      priority: 'medium',
      assignedTo: ''
    });
    setEditingEvent(null);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar & Scheduling</h1>
              <p className="mt-2 text-gray-600">Manage appointments, project timelines, and milestones</p>
            </div>
            <div className="flex gap-2">
              <div className="flex rounded-md shadow-sm">
                {(['day', 'week', 'month', 'timeline'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`px-3 py-2 text-sm font-medium ${
                      currentView === view
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${view === 'day' ? 'rounded-l-md' : view === 'timeline' ? 'rounded-r-md' : ''} border border-gray-300`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowNewEventForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Schedule Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { 
                    weekday: currentView === 'day' ? 'long' : undefined,
                    year: 'numeric', 
                    month: 'long', 
                    day: currentView === 'day' ? 'numeric' : undefined 
                  })}
                </h2>
                <button 
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Calendar View */}
          <div className="lg:col-span-3">
            {/* Today's Events */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Today's Events</h2>
                <p className="text-sm text-gray-600">{today.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div className="p-6">
                {todayEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No events scheduled for today</p>
                    <button 
                      onClick={() => setShowNewEventForm(true)}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Schedule your first event
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayEvents.map((event) => {
                      const IconComponent = getEventIcon(event.type);
                      const customerInfo = getCustomerInfo(event);
                      const linkedCustomer = getLinkedCustomer(event);
                      
                      return (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                  {customerInfo.linked ? (
                                    <div className="flex items-center space-x-1">
                                      <LinkIcon className="w-4 h-4 text-green-600" />
                                      <span className="text-xs text-green-600 font-medium">Linked Customer</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-1">
                                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                                      <span className="text-xs text-yellow-600 font-medium">No Customer Link</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <UserIcon className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {customerInfo.name}
                                      {customerInfo.organization && (
                                        <span className="text-gray-500"> • {customerInfo.organization}</span>
                                      )}
                                    </span>
                                    {customerInfo.status && (
                                      <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                        {customerInfo.status.replace('_', ' ')}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center mt-1 space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <ClockIcon className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-500">
                                        {event.startTime.toLocaleTimeString('en-US', { 
                                          hour: 'numeric', 
                                          minute: '2-digit',
                                          hour12: true 
                                        })} - {event.endTime.toLocaleTimeString('en-US', { 
                                          hour: 'numeric', 
                                          minute: '2-digit',
                                          hour12: true 
                                        })}
                                      </span>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                                      {event.status}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(event.priority)}`}>
                                      {event.priority}
                                    </span>
                                  </div>
                                </div>
                                
                                {event.location && (
                                  <div className="flex items-start space-x-1 mt-2">
                                    <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-500">{event.location}</p>
                                  </div>
                                )}
                                
                                {event.notes && (
                                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{event.notes}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2 ml-4">
                              <button 
                                onClick={() => setSelectedEvent(event)}
                                className="flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditEvent(event)}
                                className="flex items-center justify-center w-8 h-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-md transition-colors"
                                title="Edit Event"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete Event"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Project Timeline</h2>
                <p className="text-sm text-gray-600">Track active project progress and milestones</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {activeProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.projectNumber}</h3>
                          <p className="text-sm text-gray-600">{project.customer}</p>
                          <p className="text-xs text-gray-500">
                            {project.startDate.toLocaleDateString()} - {project.estimatedCompletion.toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Milestones</h4>
                        {project.milestones.map((milestone, index) => (
                          <div key={milestone.name} className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1">
                              <span className={`text-sm ${
                                milestone.completed ? 'text-green-700 line-through' : 'text-gray-700'
                              }`}>
                                {milestone.name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {milestone.dueDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultations</span>
                  <span className="font-semibold">{events.filter(e => e.type === 'consultation').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Site Visits</span>
                  <span className="font-semibold">{events.filter(e => e.type === 'site_visit').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold text-blue-600">{activeProjects.length}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const IconComponent = getEventIcon(event.type);
                  const customerInfo = getCustomerInfo(event);
                  return (
                    <div key={event.id} className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {customerInfo.name}
                          </p>
                          {customerInfo.linked && (
                            <LinkIcon className="w-3 h-3 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {event.startTime.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {event.startTime.toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </p>
                        {customerInfo.organization && (
                          <p className="text-xs text-gray-400 truncate">{customerInfo.organization}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit Event"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {upcomingEvents.length === 0 && (
                  <p className="text-sm text-gray-500">No upcoming events</p>
                )}
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Active Projects</h3>
              <div className="space-y-3">
                {activeProjects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {project.projectNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project.customer} • Due {project.estimatedCompletion.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status === 'in_progress' ? 'Active' : 'Planning'}
                    </span>
                  </div>
                ))}
                {activeProjects.length === 0 && (
                  <p className="text-sm text-gray-500">No active projects</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setFormData({...formData, type: 'consultation'});
                    setShowNewEventForm(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📞 Schedule Consultation
                </button>
                <button 
                  onClick={() => {
                    setFormData({...formData, type: 'site_visit'});
                    setShowNewEventForm(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📍 Schedule Site Visit
                </button>
                <button 
                  onClick={() => {
                    setFormData({...formData, type: 'project_milestone'});
                    setShowNewEventForm(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  🎯 Add Milestone
                </button>
                <button 
                  onClick={() => setCurrentView('timeline')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  📅 View Full Timeline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Event Form Modal */}
      {showNewEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Schedule New Event'}
                </h2>
                <button 
                  onClick={() => {
                    setShowNewEventForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Event title"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as CalendarEvent['type']})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="site_visit">Site Visit</option>
                      <option value="project_start">Project Start</option>
                      <option value="project_milestone">Project Milestone</option>
                      <option value="project_end">Project End</option>
                      <option value="appointment">General Appointment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                    <input 
                      type="text" 
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      placeholder="Customer name"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project (Optional)</label>
                    <select 
                      value={formData.projectId}
                      onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select project (optional)</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.projectNumber} - {project.customer}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <input 
                        type="time" 
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                      <input 
                        type="time" 
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as CalendarEvent['priority']})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <input 
                      type="text" 
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      placeholder="Team member name"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Meeting location or address"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes or details"
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowNewEventForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  disabled={isLoading || !formData.title || !formData.customer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Event Details
                </h2>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Event Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Title:</span>
                      <span className="ml-2 font-medium">{selectedEvent.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getEventColor(selectedEvent.type)}`}>
                        {selectedEvent.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2">{selectedEvent.customer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedEvent.priority)}`}>
                        {selectedEvent.priority}
                      </span>
                    </div>
                    {selectedEvent.assignedTo && (
                      <div>
                        <span className="text-gray-500">Assigned To:</span>
                        <span className="ml-2">{selectedEvent.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Schedule Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2">{selectedEvent.startTime.toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Time:</span>
                      <span className="ml-2">
                        {selectedEvent.startTime.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })} - {selectedEvent.endTime.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                    {selectedEvent.location && (
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2">{selectedEvent.location}</span>
                      </div>
                    )}
                    {selectedEvent.projectId && (
                      <div>
                        <span className="text-gray-500">Project:</span>
                        <span className="ml-2">{selectedEvent.projectId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvent.notes && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedEvent.notes}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-2">
                  {selectedEvent.status === 'scheduled' && (
                    <>
                      <button 
                        onClick={() => {
                          handleUpdateEventStatus(selectedEvent.id, 'confirmed');
                          setSelectedEvent(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Confirm Event
                      </button>
                      <button 
                        onClick={() => {
                          handleUpdateEventStatus(selectedEvent.id, 'cancelled');
                          setSelectedEvent(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cancel Event
                      </button>
                    </>
                  )}
                  {selectedEvent.status === 'confirmed' && (
                    <button 
                      onClick={() => {
                        handleUpdateEventStatus(selectedEvent.id, 'completed');
                        setSelectedEvent(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Mark Complete
                    </button>
                  )}
                  {selectedEvent.status === 'in_progress' && (
                    <button 
                      onClick={() => {
                        handleUpdateEventStatus(selectedEvent.id, 'completed');
                        setSelectedEvent(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      handleEditEvent(selectedEvent);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}