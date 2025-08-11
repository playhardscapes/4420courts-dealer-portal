'use client';

import { useState, useEffect } from 'react';
import { Customer, getAllCustomers, getCustomerDisplayName } from '../data/customers';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface ProjectSchedule {
  id: string;
  customerId: string;
  customerName: string;
  projectTitle: string;
  projectAddress: string;
  startDate: string;
  endDate: string;
  estimatedDuration: number; // days
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'WEATHER_DELAY' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  weatherDependent: boolean;
  specialRequirements?: string;
  contacts: {
    primary?: string;
    onSite?: string;
    billing?: string;
  };
  tasks: ProjectTask[];
  notes?: string;
}

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dependencies?: string[];
  weatherSensitive: boolean;
}

const defaultTasks: ProjectTask[] = [
  {
    id: 'prep',
    title: 'Surface Preparation',
    description: 'Clean and prep existing surface, fill cracks',
    estimatedHours: 8,
    status: 'PENDING',
    weatherSensitive: false
  },
  {
    id: 'prime',
    title: 'Primer Application',
    description: 'Apply primer coat to prepared surface',
    estimatedHours: 4,
    status: 'PENDING',
    dependencies: ['prep'],
    weatherSensitive: true
  },
  {
    id: 'base',
    title: 'Base Coat Application',
    description: 'Apply base acrylic resurfacing material',
    estimatedHours: 6,
    status: 'PENDING',
    dependencies: ['prime'],
    weatherSensitive: true
  },
  {
    id: 'texture',
    title: 'Texture Coat',
    description: 'Apply textured surface coating',
    estimatedHours: 4,
    status: 'PENDING',
    dependencies: ['base'],
    weatherSensitive: true
  },
  {
    id: 'lines',
    title: 'Line Painting',
    description: 'Paint court lines and markings',
    estimatedHours: 6,
    status: 'PENDING',
    dependencies: ['texture'],
    weatherSensitive: true
  },
  {
    id: 'cleanup',
    title: 'Final Cleanup',
    description: 'Site cleanup and final inspection',
    estimatedHours: 2,
    status: 'PENDING',
    dependencies: ['lines'],
    weatherSensitive: false
  }
];

const statusColors = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800', 
  WEATHER_DELAY: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
};

export default function ProjectScheduling() {
  const [projects, setProjects] = useState<ProjectSchedule[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectSchedule | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Load customers
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
    
    // Initialize with sample projects
    setProjects([
      {
        id: 'proj_001',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        projectTitle: 'Tennis Court Complex Resurfacing - Courts 3 & 4',
        projectAddress: '150 Scruggs Road - Tennis Complex, Cloverdale, VA 24077',
        startDate: '2025-02-15',
        endDate: '2025-02-22',
        estimatedDuration: 6,
        status: 'SCHEDULED',
        priority: 'HIGH',
        weatherDependent: true,
        specialRequirements: 'Contact Mike Wilson 48hrs before start. PO #2025-0087 required on all paperwork.',
        contacts: {
          primary: 'John Smith (Parks Director) - jsmith@botetourtva.gov',
          onSite: 'Mike Wilson (Maintenance) - mwilson@botetourtva.gov - 540-473-8250',
          billing: 'Mary Johnson (AP) - mjohnson@botetourtva.gov'
        },
        tasks: [...defaultTasks],
        notes: 'Courts 1 & 2 completed in December. Same specifications and procedures.'
      },
      {
        id: 'proj_002', 
        customerId: 'cust_hoa_001',
        customerName: 'Riverside Estates HOA',
        projectTitle: 'Tennis Court Resurfacing Project',
        projectAddress: '5678 Riverside Drive - Tennis Courts, Cary, NC 27519',
        startDate: '2025-03-01',
        endDate: '2025-03-05',
        estimatedDuration: 4,
        status: 'SCHEDULED',
        priority: 'MEDIUM', 
        weatherDependent: true,
        specialRequirements: 'Board meeting approval obtained. Notify residents 72hrs before start.',
        contacts: {
          primary: 'Sarah Davis (HOA President) - president@riversideestates.com',
          onSite: 'Tom Martinez (Maintenance) - maintenance@riversideestates.com - 919-555-0125',
          billing: 'Robert Thompson (Treasurer) - treasurer@riversideestates.com'
        },
        tasks: [...defaultTasks.slice(0, 5)], // Exclude cleanup for this project
        notes: '2 courts total. Residents prefer morning start times after 8 AM.'
      }
    ]);
  }, []);

  const [formData, setFormData] = useState({
    customerId: '',
    projectTitle: '',
    startDate: '',
    endDate: '',
    priority: 'MEDIUM' as const,
    weatherDependent: true,
    specialRequirements: '',
    notes: ''
  });

  const handleCreateProject = () => {
    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    if (!selectedCustomer) return;

    const newProject: ProjectSchedule = {
      id: `proj_${Date.now()}`,
      customerId: formData.customerId,
      customerName: getCustomerDisplayName(selectedCustomer),
      projectTitle: formData.projectTitle,
      projectAddress: selectedCustomer.projectAddress 
        ? `${selectedCustomer.projectAddress.street}, ${selectedCustomer.projectAddress.city}, ${selectedCustomer.projectAddress.state} ${selectedCustomer.projectAddress.zipCode}`
        : `${selectedCustomer.billingAddress.street}, ${selectedCustomer.billingAddress.city}, ${selectedCustomer.billingAddress.state} ${selectedCustomer.billingAddress.zipCode}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      estimatedDuration: Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      status: 'SCHEDULED',
      priority: formData.priority,
      weatherDependent: formData.weatherDependent,
      specialRequirements: formData.specialRequirements,
      contacts: {
        primary: selectedCustomer.primaryContact.email,
        onSite: selectedCustomer.projectContact?.email,
        billing: selectedCustomer.billingContact?.email
      },
      tasks: [...defaultTasks],
      notes: formData.notes
    };

    setProjects([newProject, ...projects]);
    setShowNewProjectForm(false);
    setFormData({
      customerId: '',
      projectTitle: '',
      startDate: '',
      endDate: '',
      priority: 'MEDIUM',
      weatherDependent: true,
      specialRequirements: '',
      notes: ''
    });
  };

  const filteredProjects = projects.filter(project => {
    return !filterStatus || project.status === filterStatus;
  });

  const getWeatherAlert = (project: ProjectSchedule) => {
    if (!project.weatherDependent) return null;
    
    const startDate = new Date(project.startDate);
    const today = new Date();
    const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilStart <= 3 && daysUntilStart > 0) {
      return (
        <div className="flex items-center text-orange-600 text-sm mt-1">
          <CloudIcon className="h-4 w-4 mr-1" />
          Check weather forecast - project starts in {daysUntilStart} days
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Scheduling</h1>
              <p className="text-gray-600 mt-1">Manage project timelines and coordination</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'calendar' ? 'bg-white shadow-sm' : ''}`}
                >
                  Calendar
                </button>
              </div>
              <button
                onClick={() => setShowNewProjectForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="WEATHER_DELAY">Weather Delay</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Weather Dependent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span>High Priority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.projectTitle}</h3>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[project.priority]}`}>
                      {project.priority}
                    </span>
                    {project.weatherDependent && (
                      <CloudIcon className="h-4 w-4 text-orange-500" title="Weather Dependent" />
                    )}
                  </div>
                  <p className="text-gray-600 font-medium">{project.customerName}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {project.projectAddress}
                  </div>
                  {getWeatherAlert(project)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.estimatedDuration} days estimated
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contacts */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contacts</h4>
                  <div className="space-y-2 text-sm">
                    {project.contacts.primary && (
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Primary: {project.contacts.primary}</span>
                      </div>
                    )}
                    {project.contacts.onSite && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">On-site: {project.contacts.onSite}</span>
                      </div>
                    )}
                    {project.contacts.billing && (
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Billing: {project.contacts.billing}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tasks Progress */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Task Progress</h4>
                  <div className="space-y-1">
                    {project.tasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-center text-sm">
                        {task.status === 'COMPLETED' ? (
                          <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                        ) : task.status === 'IN_PROGRESS' ? (
                          <ClockIcon className="h-4 w-4 mr-2 text-yellow-500" />
                        ) : (
                          <div className="w-4 h-4 mr-2 border border-gray-300 rounded"></div>
                        )}
                        <span className={task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-700'}>
                          {task.title}
                        </span>
                        {task.weatherSensitive && (
                          <CloudIcon className="h-3 w-3 ml-1 text-orange-400" />
                        )}
                      </div>
                    ))}
                    {project.tasks.length > 4 && (
                      <div className="text-sm text-gray-500">
                        +{project.tasks.length - 4} more tasks
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                  {project.specialRequirements && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800">{project.specialRequirements}</p>
                      </div>
                    </div>
                  )}
                  {project.notes && (
                    <p className="text-sm text-gray-600">{project.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <CalendarDaysIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Create a new project or adjust your filters</p>
          </div>
        )}
      </div>

      {/* New Project Form Modal */}
      {showNewProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">New Project Schedule</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select customer...</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {getCustomerDisplayName(customer)}
                        {customer.organizationType && customer.organizationType !== 'INDIVIDUAL' ? ` (${customer.organizationType})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Tennis Court Resurfacing Project"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="weatherDependent"
                      checked={formData.weatherDependent}
                      onChange={(e) => setFormData({...formData, weatherDependent: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="weatherDependent" className="text-sm font-medium text-gray-700">
                      Weather Dependent
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                  <textarea
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Contact site supervisor 48hrs before start, PO number required"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Additional project notes"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewProjectForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!formData.customerId || !formData.projectTitle || !formData.startDate || !formData.endDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}