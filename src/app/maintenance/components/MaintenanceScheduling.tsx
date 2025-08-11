'use client';

import { useState, useEffect } from 'react';
import { 
  WrenchScrewdriverIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon,
  CogIcon
} from '@heroicons/react/24/outline';

type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'EMERGENCY';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type Status = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
type Frequency = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'ONE_TIME';

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: Priority;
  status: Status;
  frequency: Frequency;
  assetId: string;
  assetName: string;
  assignedTo: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  scheduledDate: string;
  completedDate?: string;
  nextDueDate?: string;
  instructions: string;
  requiredParts: string[];
  requiredTools: string[];
  safetyNotes: string;
  cost: number;
  createdBy: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceStats {
  totalTasks: number;
  scheduledTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number; // Next 7 days
  avgCompletionTime: number; // in hours
  preventiveRatio: number; // percentage
}

interface MaintenanceFormData {
  title: string;
  description: string;
  type: MaintenanceType;
  priority: Priority;
  status: Status;
  frequency: Frequency;
  assetId: string;
  assetName: string;
  assignedTo: string;
  estimatedDuration: number;
  scheduledDate: string;
  instructions: string;
  requiredParts: string[];
  requiredTools: string[];
  safetyNotes: string;
  cost: number;
  notes: string;
}

export function MaintenanceScheduling() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [stats, setStats] = useState<MaintenanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<MaintenanceType | 'ALL'>('ALL');
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [formData, setFormData] = useState<MaintenanceFormData>({
    title: '',
    description: '',
    type: 'PREVENTIVE',
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    frequency: 'MONTHLY',
    assetId: '',
    assetName: '',
    assignedTo: '',
    estimatedDuration: 60,
    scheduledDate: '',
    instructions: '',
    requiredParts: [],
    requiredTools: [],
    safetyNotes: '',
    cost: 0,
    notes: ''
  });

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      // Sample maintenance task data
      const sampleTasks: MaintenanceTask[] = [
        {
          id: '1',
          title: 'Pressure Washer Annual Service',
          description: 'Complete annual maintenance including oil change, spark plug replacement, and pump inspection',
          type: 'PREVENTIVE',
          priority: 'HIGH',
          status: 'OVERDUE',
          frequency: 'ANNUAL',
          assetId: '3',
          assetName: 'Commercial Pressure Washer',
          assignedTo: 'Mike Johnson',
          estimatedDuration: 120,
          scheduledDate: '2025-01-15',
          nextDueDate: '2026-01-15',
          instructions: '1. Drain old oil and replace with 10W-30\n2. Replace spark plug (Champion RCJ6Y)\n3. Inspect pump seals and replace if needed\n4. Check pressure relief valve\n5. Test all safety features',
          requiredParts: ['10W-30 Engine Oil (32 oz)', 'Champion RCJ6Y Spark Plug', 'Pump Seal Kit'],
          requiredTools: ['Socket Set', 'Oil Drain Pan', 'Torque Wrench', 'Pressure Gauge'],
          safetyNotes: 'CRITICAL: Ensure engine is cool before starting. Wear safety glasses and gloves. Work in well-ventilated area.',
          cost: 85.50,
          createdBy: 'John Smith',
          notes: 'OVERDUE: Equipment at 255 hours, service due at 250 hours. Schedule immediately.',
          createdAt: '2024-12-01T08:00:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Van Oil Change & Inspection',
          description: 'Routine oil change and 30-point safety inspection for Ford Transit',
          type: 'PREVENTIVE',
          priority: 'MEDIUM',
          status: 'SCHEDULED',
          frequency: 'QUARTERLY',
          assetId: '2',
          assetName: 'Ford Transit Cargo Van',
          assignedTo: 'Sarah Davis',
          estimatedDuration: 90,
          scheduledDate: '2025-02-05',
          nextDueDate: '2025-05-05',
          instructions: '1. Change engine oil and filter\n2. Check all fluid levels\n3. Inspect brakes and tires\n4. Test lights and electrical systems\n5. Check HVAC system\n6. Inspect cargo area organization',
          requiredParts: ['5W-30 Motor Oil (6 qts)', 'Oil Filter', 'Air Filter'],
          requiredTools: ['Jack and Stands', 'Oil Drain Pan', 'Filter Wrench', 'Tire Pressure Gauge'],
          safetyNotes: 'Use proper lifting points. Check brake fluid level - do not overfill.',
          cost: 125.00,
          createdBy: 'Sarah Davis',
          notes: 'Current mileage: 28,500. Next service at 31,500 miles.',
          createdAt: '2025-01-20T14:15:00Z',
          updatedAt: '2025-01-20T14:15:00Z'
        },
        {
          id: '3',
          title: 'Temperature Gun Calibration',
          description: 'Annual calibration service for infrared thermometer to ensure accuracy',
          type: 'PREVENTIVE',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          frequency: 'ANNUAL',
          assetId: '5',
          assetName: 'Court Surface Temperature Gun',
          assignedTo: 'John Smith',
          estimatedDuration: 30,
          actualDuration: 25,
          scheduledDate: '2025-01-28',
          nextDueDate: '2026-01-28',
          instructions: '1. Send unit to certified calibration lab\n2. Request NIST-traceable calibration certificate\n3. Update calibration sticker on device\n4. Record new calibration date in asset log',
          requiredParts: ['Calibration Service'],
          requiredTools: ['Shipping Materials', 'Calibration Log'],
          safetyNotes: 'Handle carefully - precision instrument. Keep original packaging.',
          cost: 85.00,
          createdBy: 'John Smith',
          notes: 'Sent to Precision Instruments on 1/28. Expected return 2/1.',
          createdAt: '2025-01-25T09:30:00Z',
          updatedAt: '2025-01-28T11:45:00Z'
        },
        {
          id: '4',
          title: 'MacBook Pro Software Update & Backup',
          description: 'Monthly system updates, security patches, and data backup verification',
          type: 'PREVENTIVE',
          priority: 'MEDIUM',
          status: 'COMPLETED',
          frequency: 'MONTHLY',
          assetId: '4',
          assetName: 'MacBook Pro M3 - Project Management',
          assignedTo: 'John Smith',
          estimatedDuration: 45,
          actualDuration: 40,
          scheduledDate: '2025-01-15',
          completedDate: '2025-01-15',
          nextDueDate: '2025-02-15',
          instructions: '1. Install macOS updates\n2. Update all applications\n3. Run disk utility first aid\n4. Verify Time Machine backup\n5. Test external monitor connection\n6. Clean desktop and organize files',
          requiredParts: [],
          requiredTools: ['External Backup Drive', 'Cleaning Cloth'],
          safetyNotes: 'Create backup before major updates. Save all work before restarting.',
          cost: 0,
          createdBy: 'John Smith',
          notes: 'Completed successfully. All systems running macOS 14.3.1. Backup verified.',
          createdAt: '2025-01-10T10:00:00Z',
          updatedAt: '2025-01-15T16:20:00Z'
        },
        {
          id: '5',
          title: 'Squeegee Blade Replacement',
          description: 'Replace worn rubber blades on professional squeegee system',
          type: 'CORRECTIVE',
          priority: 'HIGH',
          status: 'OVERDUE',
          frequency: 'ONE_TIME',
          assetId: '1',
          assetName: 'Professional Court Squeegee System',
          assignedTo: 'Mike Johnson',
          estimatedDuration: 30,
          scheduledDate: '2025-01-22',
          instructions: '1. Remove old rubber blades from frame\n2. Clean blade channels thoroughly\n3. Install new blades ensuring proper tension\n4. Test squeegee action on flat surface\n5. Adjust blade angle if necessary',
          requiredParts: ['Replacement Rubber Blades (4)', 'Blade Screws'],
          requiredTools: ['Screwdriver Set', 'Cleaning Cloths', 'Degreaser'],
          safetyNotes: 'Sharp edges on metal frame. Wear gloves when handling.',
          cost: 45.00,
          createdBy: 'Mike Johnson',
          notes: 'URGENT: Current blades leaving streaks. Affecting work quality.',
          createdAt: '2025-01-18T13:20:00Z',
          updatedAt: '2025-01-22T08:15:00Z'
        },
        {
          id: '6',
          title: 'Weekly Safety Equipment Inspection',
          description: 'Weekly inspection of all safety equipment and first aid supplies',
          type: 'PREVENTIVE',
          priority: 'MEDIUM',
          status: 'SCHEDULED',
          frequency: 'WEEKLY',
          assetId: '',
          assetName: 'Safety Equipment',
          assignedTo: 'Sarah Davis',
          estimatedDuration: 20,
          scheduledDate: '2025-02-03',
          nextDueDate: '2025-02-10',
          instructions: '1. Check safety glasses inventory\n2. Inspect first aid kit contents\n3. Verify fire extinguisher pressure\n4. Test emergency eyewash station\n5. Check safety signage visibility\n6. Update inspection log',
          requiredParts: [],
          requiredTools: ['Inspection Checklist', 'Log Book'],
          safetyNotes: 'Report any damaged or expired items immediately.',
          cost: 0,
          createdBy: 'John Smith',
          notes: 'Part of weekly safety protocol. Critical for job site compliance.',
          createdAt: '2025-01-15T07:30:00Z',
          updatedAt: '2025-01-27T09:00:00Z'
        },
        {
          id: '7',
          title: 'Emergency Repair - Van Brake Issue',
          description: 'Investigate and repair reported brake grinding noise in Ford Transit',
          type: 'EMERGENCY',
          priority: 'CRITICAL',
          status: 'OVERDUE',
          frequency: 'ONE_TIME',
          assetId: '2',
          assetName: 'Ford Transit Cargo Van',
          assignedTo: 'Mike Johnson',
          estimatedDuration: 180,
          scheduledDate: '2025-01-29',
          instructions: 'EMERGENCY REPAIR:\n1. Immediately inspect brake pads and rotors\n2. Check brake fluid level and quality\n3. Test brake pedal feel and travel\n4. Replace any worn components\n5. Road test vehicle before returning to service',
          requiredParts: ['Brake Pads (Front/Rear)', 'Brake Rotors', 'Brake Fluid'],
          requiredTools: ['Jack and Stands', 'Brake Tools', 'Torque Wrench', 'Brake Bleeder'],
          safetyNotes: 'CRITICAL SAFETY ISSUE: Vehicle out of service until repairs completed. Use alternate transportation.',
          cost: 450.00,
          createdBy: 'Sarah Davis',
          notes: 'CRITICAL: Grinding noise reported during morning inspection. Vehicle immediately removed from service.',
          createdAt: '2025-01-29T06:45:00Z',
          updatedAt: '2025-01-29T06:45:00Z'
        },
        {
          id: '8',
          title: 'Quarterly Tool Inventory & Organization',
          description: 'Complete inventory of all tools and equipment with organization review',
          type: 'PREVENTIVE',
          priority: 'LOW',
          status: 'SCHEDULED',
          frequency: 'QUARTERLY',
          assetId: '',
          assetName: 'All Tools & Equipment',
          assignedTo: 'Mike Johnson',
          estimatedDuration: 240,
          scheduledDate: '2025-02-15',
          nextDueDate: '2025-05-15',
          instructions: '1. Conduct physical count of all tools\n2. Update asset database with current locations\n3. Identify missing or damaged items\n4. Reorganize tool storage for efficiency\n5. Create replacement shopping list\n6. Update tool checkout log system',
          requiredParts: [],
          requiredTools: ['Inventory Sheets', 'Asset Tags', 'Cleaning Supplies'],
          safetyNotes: 'Check all tools for safety issues. Remove any damaged items from service.',
          cost: 0,
          createdBy: 'John Smith',
          notes: 'Comprehensive review scheduled. Will identify items for shopping list.',
          createdAt: '2025-01-28T15:30:00Z',
          updatedAt: '2025-01-28T15:30:00Z'
        }
      ];

      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const sampleStats: MaintenanceStats = {
        totalTasks: sampleTasks.length,
        scheduledTasks: sampleTasks.filter(task => task.status === 'SCHEDULED').length,
        inProgressTasks: sampleTasks.filter(task => task.status === 'IN_PROGRESS').length,
        completedTasks: sampleTasks.filter(task => task.status === 'COMPLETED').length,
        overdueTasks: sampleTasks.filter(task => task.status === 'OVERDUE').length,
        upcomingTasks: sampleTasks.filter(task => {
          const scheduledDate = new Date(task.scheduledDate);
          return scheduledDate >= today && scheduledDate <= nextWeek && task.status === 'SCHEDULED';
        }).length,
        avgCompletionTime: sampleTasks
          .filter(task => task.actualDuration)
          .reduce((sum, task) => sum + (task.actualDuration || 0), 0) / 
          sampleTasks.filter(task => task.actualDuration).length / 60,
        preventiveRatio: (sampleTasks.filter(task => task.type === 'PREVENTIVE').length / sampleTasks.length) * 100
      };

      setTasks(sampleTasks);
      setStats(sampleStats);
    } catch (error) {
      console.error('Failed to fetch maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const newTask: MaintenanceTask = {
        id: Date.now().toString(),
        ...formData,
        nextDueDate: calculateNextDueDate(formData.scheduledDate, formData.frequency),
        createdBy: 'John Smith',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, newTask]);
      setShowAddModal(false);
      resetForm();
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalTasks: stats.totalTasks + 1,
          scheduledTasks: formData.status === 'SCHEDULED' ? stats.scheduledTasks + 1 : stats.scheduledTasks
        });
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    
    try {
      const updatedTask: MaintenanceTask = {
        ...editingTask,
        ...formData,
        nextDueDate: formData.frequency !== 'ONE_TIME' 
          ? calculateNextDueDate(formData.scheduledDate, formData.frequency)
          : undefined,
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task));
      setEditingTask(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this maintenance task?')) return;
    
    try {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalTasks: stats.totalTasks - 1
        });
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: Status) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              completedDate: newStatus === 'COMPLETED' ? new Date().toISOString().split('T')[0] : task.completedDate,
              updatedAt: new Date().toISOString()
            }
          : task
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const calculateNextDueDate = (scheduledDate: string, frequency: Frequency): string => {
    const date = new Date(scheduledDate);
    
    switch (frequency) {
      case 'WEEKLY':
        date.setDate(date.getDate() + 7);
        break;
      case 'MONTHLY':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'QUARTERLY':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'SEMI_ANNUAL':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'ANNUAL':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'ONE_TIME':
      default:
        return '';
    }
    
    return date.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'PREVENTIVE',
      priority: 'MEDIUM',
      status: 'SCHEDULED',
      frequency: 'MONTHLY',
      assetId: '',
      assetName: '',
      assignedTo: '',
      estimatedDuration: 60,
      scheduledDate: '',
      instructions: '',
      requiredParts: [],
      requiredTools: [],
      safetyNotes: '',
      cost: 0,
      notes: ''
    });
  };

  const openEditModal = (task: MaintenanceTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      status: task.status,
      frequency: task.frequency,
      assetId: task.assetId,
      assetName: task.assetName,
      assignedTo: task.assignedTo,
      estimatedDuration: task.estimatedDuration,
      scheduledDate: task.scheduledDate,
      instructions: task.instructions,
      requiredParts: task.requiredParts,
      requiredTools: task.requiredTools,
      safetyNotes: task.safetyNotes,
      cost: task.cost,
      notes: task.notes
    });
  };

  const getTypeColor = (type: MaintenanceType) => {
    const colors = {
      'PREVENTIVE': 'bg-green-100 text-green-800',
      'CORRECTIVE': 'bg-yellow-100 text-yellow-800',
      'PREDICTIVE': 'bg-blue-100 text-blue-800',
      'EMERGENCY': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'CRITICAL': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: Status) => {
    const colors = {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'OVERDUE': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const isOverdue = (scheduledDate: string, status: Status) => {
    if (status === 'COMPLETED' || status === 'CANCELLED') return false;
    const scheduled = new Date(scheduledDate);
    const today = new Date();
    return scheduled < today;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesType = typeFilter === 'ALL' || task.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading maintenance data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load maintenance data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Maintenance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CogIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Time</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.avgCompletionTime.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Preventive</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.preventiveRatio.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by title, description, asset, or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as MaintenanceType | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="PREVENTIVE">Preventive</option>
              <option value="CORRECTIVE">Corrective</option>
              <option value="PREDICTIVE">Predictive</option>
              <option value="EMERGENCY">Emergency</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule Task
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Tasks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Maintenance Tasks</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className={`hover:bg-gray-50 ${
                  task.status === 'OVERDUE' ? 'bg-red-50' : ''
                } ${task.priority === 'CRITICAL' ? 'border-l-4 border-red-500' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <WrenchScrewdriverIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                          {task.status === 'OVERDUE' && (
                            <ExclamationTriangleIcon className="inline w-4 h-4 text-red-500 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{task.frequency}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task.id, e.target.value as Status)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(task.status)}`}
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="OVERDUE">Overdue</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.assetName || 'General'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isOverdue(task.scheduledDate, task.status) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(task.scheduledDate).toLocaleDateString()}
                    </div>
                    {task.nextDueDate && (
                      <div className="text-xs text-gray-500">
                        Next: {new Date(task.nextDueDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{formatDuration(task.estimatedDuration)}</div>
                    {task.actualDuration && (
                      <div className="text-xs text-gray-500">
                        Actual: {formatDuration(task.actualDuration)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(task.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Task"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Task"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {(showAddModal || editingTask) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => {
              setShowAddModal(false);
              setEditingTask(null);
              resetForm();
            }}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingTask ? 'Edit Maintenance Task' : 'Schedule New Task'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingTask(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter task title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as MaintenanceType})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PREVENTIVE">Preventive</option>
                      <option value="CORRECTIVE">Corrective</option>
                      <option value="PREDICTIVE">Predictive</option>
                      <option value="EMERGENCY">Emergency</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Task description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as Status})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="OVERDUE">Overdue</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value as Frequency})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="SEMI_ANNUAL">Semi-Annual</option>
                      <option value="ANNUAL">Annual</option>
                      <option value="ONE_TIME">One Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      value={formData.assetName}
                      onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Asset this task is for"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned To *
                    </label>
                    <input
                      type="text"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Person assigned to this task"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Est. Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({...formData, estimatedDuration: parseInt(e.target.value) || 60})}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost
                    </label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions
                    </label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Step-by-step instructions for this task..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Parts (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.requiredParts.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData, 
                        requiredParts: e.target.value.split(',').map(part => part.trim()).filter(part => part)
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Oil, Filter, Spark Plug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Tools (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.requiredTools.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData, 
                        requiredTools: e.target.value.split(',').map(tool => tool.trim()).filter(tool => tool)
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Wrench Set, Socket Set"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Safety Notes
                    </label>
                    <textarea
                      value={formData.safetyNotes}
                      onChange={(e) => setFormData({...formData, safetyNotes: e.target.value})}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Safety precautions and warnings..."
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingTask(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingTask ? handleUpdateTask : handleCreateTask}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    {editingTask ? 'Update Task' : 'Schedule Task'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedTask(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{selectedTask.title}</h3>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Task Details</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Description:</dt>
                          <dd className="text-gray-900">{selectedTask.description}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Type:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedTask.type)}`}>{selectedTask.type}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Priority:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTask.priority)}`}>{selectedTask.priority}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Status:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTask.status)}`}>{selectedTask.status}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Frequency:</dt>
                          <dd className="text-gray-900">{selectedTask.frequency}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Asset:</dt>
                          <dd className="text-gray-900">{selectedTask.assetName || 'General'}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Assigned To:</dt>
                          <dd className="text-gray-900">{selectedTask.assignedTo}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Est. Duration:</dt>
                          <dd className="text-gray-900">{formatDuration(selectedTask.estimatedDuration)}</dd>
                        </div>
                        {selectedTask.actualDuration && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Actual Duration:</dt>
                            <dd className="text-gray-900">{formatDuration(selectedTask.actualDuration)}</dd>
                          </div>
                        )}
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Cost:</dt>
                          <dd className="text-gray-900">{formatCurrency(selectedTask.cost)}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Schedule</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Scheduled:</dt>
                          <dd className={`${isOverdue(selectedTask.scheduledDate, selectedTask.status) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {new Date(selectedTask.scheduledDate).toLocaleDateString()}
                            {isOverdue(selectedTask.scheduledDate, selectedTask.status) && ' (OVERDUE)'}
                          </dd>
                        </div>
                        {selectedTask.completedDate && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Completed:</dt>
                            <dd className="text-gray-900">{new Date(selectedTask.completedDate).toLocaleDateString()}</dd>
                          </div>
                        )}
                        {selectedTask.nextDueDate && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Next Due:</dt>
                            <dd className="text-gray-900">{new Date(selectedTask.nextDueDate).toLocaleDateString()}</dd>
                          </div>
                        )}
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Created By:</dt>
                          <dd className="text-gray-900">{selectedTask.createdBy}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Instructions</h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                        {selectedTask.instructions}
                      </div>
                    </div>

                    {selectedTask.requiredParts.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Required Parts</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.requiredParts.map((part, index) => (
                            <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTask.requiredTools.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Required Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.requiredTools.map((tool, index) => (
                            <span key={index} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTask.safetyNotes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                          Safety Notes
                        </h4>
                        <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                          {selectedTask.safetyNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedTask.notes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedTask.notes}</p>
                  </div>
                )}

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(selectedTask.createdAt).toLocaleDateString()} | 
                    Last Updated: {new Date(selectedTask.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}