'use client';

import { useState } from 'react';
import { 
  WrenchScrewdriverIcon, 
  PlusIcon, 
  EyeIcon, 
  CameraIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  projectNumber: string;
  contractId: string;
  customerId: string;
  customer: string;
  address: string;
  serviceLevel: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  phase: string;
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  contractValue: number;
  currentCosts: number;
  nextMilestone: string;
  projectManager?: string;
  notes?: string;
  keyContacts?: string;
  photos: number;
  lastUpdate: string;
  milestones: {
    name: string;
    dueDate: string;
    completed: boolean;
    completedDate?: string;
  }[];
}

const sampleProjects: Project[] = [
  {
    id: '1',
    projectNumber: 'P-2025-001',
    customer: 'Sarah Smith',
    address: '456 Pine Ave, Cary, NC',
    serviceLevel: 'Level 3 - Coating & Lining Specialist',
    status: 'in_progress',
    phase: 'Surface Preparation',
    progress: 65,
    startDate: '2025-02-01',
    estimatedCompletion: '2025-02-15',
    contractValue: 12500,
    currentCosts: 8200,
    contractId: 'C-2025-001',
    customerId: '2',
    projectManager: 'John Doe',
    nextMilestone: 'Apply base coating',
    photos: 8,
    lastUpdate: '2025-01-29',
    milestones: [
      { name: 'Site Prep', dueDate: '2025-02-02', completed: true, completedDate: '2025-02-01' },
      { name: 'Surface Preparation', dueDate: '2025-02-05', completed: true, completedDate: '2025-02-04' },
      { name: 'Base Coating', dueDate: '2025-02-08', completed: false },
      { name: 'Line Painting', dueDate: '2025-02-12', completed: false },
      { name: 'Final Inspection', dueDate: '2025-02-15', completed: false }
    ]
  },
  {
    id: '2',
    projectNumber: 'P-2025-002',
    customer: 'Mike Johnson',
    address: '123 Oak Street, Raleigh, NC',
    serviceLevel: 'Level 5 - Full Project Management',
    status: 'planning',
    phase: 'Site Planning',
    progress: 15,
    startDate: '2025-02-15',
    estimatedCompletion: '2025-03-30',
    contractValue: 42500,
    currentCosts: 3200,
    contractId: 'C-2025-002',
    customerId: '1',
    projectManager: 'Jane Smith',
    nextMilestone: 'Finalize contractor selection',
    photos: 3,
    lastUpdate: '2025-01-28',
    milestones: [
      { name: 'Site Planning', dueDate: '2025-02-05', completed: false },
      { name: 'Design Approval', dueDate: '2025-02-10', completed: false },
      { name: 'Permit Applications', dueDate: '2025-02-18', completed: false },
      { name: 'Contractor Selection', dueDate: '2025-02-25', completed: false },
      { name: 'Construction Start', dueDate: '2025-03-01', completed: false }
    ]
  },
  {
    id: '3',
    projectNumber: 'P-2024-045',
    customer: 'Davis Family',
    address: '789 Maple Dr, Durham, NC',
    serviceLevel: 'Level 4 - Project Management + Finish',
    status: 'completed',
    phase: 'Project Complete',
    progress: 100,
    startDate: '2024-12-01',
    estimatedCompletion: '2025-01-15',
    contractValue: 22000,
    currentCosts: 21800,
    contractId: 'C-2024-045',
    customerId: '3',
    projectManager: 'Mike Davis',
    actualCompletion: '2025-01-18',
    nextMilestone: 'Follow-up inspection',
    photos: 25,
    lastUpdate: '2025-01-20',
    milestones: [
      { name: 'Planning', dueDate: '2024-12-05', completed: true, completedDate: '2024-12-03' },
      { name: 'Contractor Selection', dueDate: '2024-12-12', completed: true, completedDate: '2024-12-10' },
      { name: 'Site Prep', dueDate: '2024-12-20', completed: true, completedDate: '2024-12-18' },
      { name: 'Construction', dueDate: '2025-01-10', completed: true, completedDate: '2025-01-08' },
      { name: 'Finishing', dueDate: '2025-01-15', completed: true, completedDate: '2025-01-14' },
      { name: 'Final Inspection', dueDate: '2025-01-15', completed: true, completedDate: '2025-01-18' }
    ]
  }
];

const projectPhases = {
  'Level 3': ['Site Prep', 'Surface Preparation', 'Base Coating', 'Line Painting', 'Final Inspection'],
  'Level 4': ['Planning', 'Contractor Selection', 'Site Prep', 'Construction', 'Finishing', 'Final Inspection'],
  'Level 5': ['Planning', 'Design', 'Permits', 'Contractor Management', 'Construction', 'Finishing', 'Completion']
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'on_hold':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'planning':
      return <ClockIcon className="h-4 w-4" />;
    case 'in_progress':
      return <WrenchScrewdriverIcon className="h-4 w-4" />;
    case 'on_hold':
      return <ExclamationTriangleIcon className="h-4 w-4" />;
    case 'completed':
      return <CheckCircleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    contractId: '',
    projectManager: '',
    startDate: '',
    notes: '',
    keyContacts: ''
  });

  // Available contracts for project creation
  const availableContracts = [
    { id: 'C-2025-003', customer: 'Robert Davis', serviceLevel: 'Level 4', value: 22000, status: 'signed' },
    { id: 'C-2025-004', customer: 'Linda Wilson', serviceLevel: 'Level 3', value: 15000, status: 'signed' }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      const selectedContract = availableContracts.find(c => c.id === formData.contractId);
      if (!selectedContract) return;

      const newProject: Project = {
        id: Date.now().toString(),
        projectNumber: `P-2025-${String(projects.length + 1).padStart(3, '0')}`,
        contractId: formData.contractId,
        customerId: Date.now().toString(),
        customer: selectedContract.customer,
        address: 'Address from contract',
        serviceLevel: selectedContract.serviceLevel,
        status: 'planning',
        phase: 'Project Initiation',
        progress: 0,
        startDate: formData.startDate,
        estimatedCompletion: new Date(new Date(formData.startDate).getTime() + 45*24*60*60*1000).toISOString().split('T')[0],
        contractValue: selectedContract.value,
        currentCosts: 0,
        nextMilestone: 'Initial planning phase',
        projectManager: formData.projectManager,
        notes: formData.notes,
        keyContacts: formData.keyContacts,
        photos: 0,
        lastUpdate: new Date().toISOString().split('T')[0],
        milestones: [
          { name: 'Project Initiation', dueDate: formData.startDate, completed: false },
          { name: 'Planning Phase', dueDate: new Date(new Date(formData.startDate).getTime() + 7*24*60*60*1000).toISOString().split('T')[0], completed: false }
        ]
      };
      
      setProjects([newProject, ...projects]);
      setShowNewProjectForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, newStatus: Project['status']) => {
    setIsLoading(true);
    try {
      setProjects(projects.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              status: newStatus,
              lastUpdate: new Date().toISOString().split('T')[0],
              actualCompletion: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : p.actualCompletion
            }
          : p
      ));
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProgress = async (projectId: string, newProgress: number, newPhase: string) => {
    setIsLoading(true);
    try {
      setProjects(projects.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              progress: newProgress,
              phase: newPhase,
              lastUpdate: new Date().toISOString().split('T')[0]
            }
          : p
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setIsLoading(true);
      try {
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      contractId: '',
      projectManager: '',
      startDate: '',
      notes: '',
      keyContacts: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Track active court construction and management projects</p>
          </div>
          <button 
            onClick={() => setShowNewProjectForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
          <div className="text-sm text-gray-600">Total Projects</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {projects.filter(p => p.status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            ${projects.reduce((sum, p) => sum + p.contractValue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {projects.length > 0 ? Math.round((projects.filter(p => p.status === 'completed' || new Date(p.estimatedCompletion) >= new Date()).length / projects.length) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">On Schedule</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            {/* Project Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.projectNumber}</h3>
                  <p className="text-sm text-gray-600">{project.customer}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{project.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>{project.serviceLevel}</span>
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">Current Phase: {project.phase}</span>
                  <span className="text-gray-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Due: {project.estimatedCompletion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Next: {project.nextMilestone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CameraIcon className="h-4 w-4" />
                  <span>{project.photos} photos</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  ${project.contractValue.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="text-blue-600 hover:text-blue-800" 
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  {project.status === 'planning' && (
                    <button 
                      onClick={() => handleUpdateProjectStatus(project.id, 'in_progress')}
                      className="text-green-600 hover:text-green-800" 
                      title="Start Project"
                    >
                      <PlayIcon className="h-4 w-4" />
                    </button>
                  )}
                  {project.status === 'in_progress' && (
                    <button 
                      onClick={() => handleUpdateProjectStatus(project.id, 'on_hold')}
                      className="text-yellow-600 hover:text-yellow-800" 
                      title="Pause Project"
                    >
                      <PauseIcon className="h-4 w-4" />
                    </button>
                  )}
                  <button className="text-blue-600 hover:text-blue-800" title="Edit">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-800" 
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Details - {selectedProject.projectNumber}
                </h2>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Project Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium">{selectedProject.customer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <span className="ml-2">{selectedProject.address}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Service Level:</span>
                      <span className="ml-2">{selectedProject.serviceLevel}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Project Manager:</span>
                      <span className="ml-2">{selectedProject.projectManager}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <span className="ml-2 font-medium">{selectedProject.progress}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contract Value:</span>
                      <span className="ml-2 font-bold text-green-600">${selectedProject.contractValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Costs:</span>
                      <span className="ml-2 font-medium">${selectedProject.currentCosts.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Project Timeline */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Project Milestones</h3>
                  <div className="space-y-3">
                    {selectedProject.milestones.map((milestone, index) => (
                      <div key={milestone.name} className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 ${
                          milestone.completed ? 'bg-green-500' : 
                          index === selectedProject.milestones.findIndex(m => !m.completed) ? 'bg-blue-500' : 
                          'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${
                            milestone.completed ? 'text-green-700' : 
                            index === selectedProject.milestones.findIndex(m => !m.completed) ? 'text-blue-700' : 
                            'text-gray-500'
                          }`}>
                            {milestone.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Due: {milestone.dueDate}
                            {milestone.completed && milestone.completedDate && (
                              <span className="ml-2 text-green-600">✓ Completed {milestone.completedDate}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Photos */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Progress Photos ({selectedProject.photos})</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                      <ArrowUpTrayIcon className="h-4 w-4" />
                      Upload
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(Math.min(selectedProject.photos, 9))].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <CameraIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    ))}
                    {selectedProject.photos > 9 && (
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
                        +{selectedProject.photos - 9} more
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline and Notes */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Timeline</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Start Date: {selectedProject.startDate}</div>
                    <div>Estimated Completion: {selectedProject.estimatedCompletion}</div>
                    {selectedProject.actualCompletion && (
                      <div>Actual Completion: {selectedProject.actualCompletion}</div>
                    )}
                    <div>Last Updated: {selectedProject.lastUpdate}</div>
                  </div>
                </div>
                
                {selectedProject.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Project Notes</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedProject.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-2">
                  {selectedProject.status === 'planning' && (
                    <button 
                      onClick={() => {
                        handleUpdateProjectStatus(selectedProject.id, 'in_progress');
                        setSelectedProject(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Start Project
                    </button>
                  )}
                  {selectedProject.status === 'in_progress' && (
                    <>
                      <button 
                        onClick={() => {
                          handleUpdateProjectStatus(selectedProject.id, 'completed');
                          setSelectedProject(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Mark Complete
                      </button>
                      <button 
                        onClick={() => {
                          handleUpdateProjectStatus(selectedProject.id, 'on_hold');
                          setSelectedProject(null);
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                      >
                        Put on Hold
                      </button>
                    </>
                  )}
                  {selectedProject.status === 'on_hold' && (
                    <button 
                      onClick={() => {
                        handleUpdateProjectStatus(selectedProject.id, 'in_progress');
                        setSelectedProject(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Resume Project
                    </button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Form */}
      {showNewProjectForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
            <button 
              onClick={() => {
                setShowNewProjectForm(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Contract</label>
                <select 
                  value={formData.contractId}
                  onChange={(e) => setFormData({...formData, contractId: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select existing contract</option>
                  {availableContracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.id} - {contract.customer} (${contract.value.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Manager</label>
                <input 
                  type="text" 
                  placeholder="Assigned project manager"
                  value={formData.projectManager}
                  onChange={(e) => setFormData({...formData, projectManager: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Notes</label>
                <textarea 
                  placeholder="Special requirements, weather considerations, etc."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Contacts</label>
                <input 
                  type="text" 
                  placeholder="Contractors, suppliers, etc."
                  value={formData.keyContacts}
                  onChange={(e) => setFormData({...formData, keyContacts: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => {
                setShowNewProjectForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateProject}
              disabled={isLoading || !formData.contractId || !formData.projectManager || !formData.startDate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}