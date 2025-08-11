'use client';

import { useState, useEffect } from 'react';
import { 
  QueueListIcon,
  ClockIcon,
  MapPinIcon,
  SignalIcon,
  CloudIcon,
  SunIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

interface QueueItem {
  id: string;
  projectCode: string; // Anonymous identifier
  type: 'coating' | 'installation' | 'consultation' | 'site_visit' | 'follow_up';
  phase: string;
  queuePosition: number;
  estimatedDays: number;
  weatherDependent: boolean;
  status: 'waiting' | 'in_progress' | 'weather_hold' | 'completed' | 'delayed';
  location: string;
  addedDate: string;
  estimatedStart?: string;
  actualStart?: string;
  progressNotes?: string;
  delayReason?: string;
  clientNotification?: string;
}

interface QueueStats {
  totalItems: number;
  activeWork: number;
  weatherHolds: number;
  avgWaitTime: number;
  completedThisWeek: number;
  busyScore: number; // 0-100, how busy the schedule is
}

interface WeatherImpact {
  location: string;
  currentTemp: number;
  condition: string;
  workableToday: boolean;
  workableWindow: string;
  nextWorkableDay: string;
  impactedProjects: string[];
}

// Mock queue data
const mockQueue: QueueItem[] = [
  {
    id: "1",
    projectCode: "Court Project #247",
    type: "coating",
    phase: "Base Coat Application",
    queuePosition: 1,
    estimatedDays: 3,
    weatherDependent: true,
    status: "in_progress",
    location: "Raleigh, NC",
    addedDate: "2025-01-15",
    actualStart: "2025-01-29",
    progressNotes: "Day 2 of base coating - 60% complete"
  },
  {
    id: "2",
    projectCode: "Court Project #248", 
    type: "installation",
    phase: "Surface Preparation",
    queuePosition: 2,
    estimatedDays: 5,
    weatherDependent: true,
    status: "waiting",
    location: "Durham, NC",
    addedDate: "2025-01-18",
    estimatedStart: "2025-02-03"
  },
  {
    id: "3",
    projectCode: "Consultation #249",
    type: "consultation",
    phase: "Initial Assessment",
    queuePosition: 3,
    estimatedDays: 1,
    weatherDependent: false,
    status: "waiting",
    location: "Virtual/Zoom",
    addedDate: "2025-01-20",
    estimatedStart: "2025-01-30"
  },
  {
    id: "4",
    projectCode: "Court Project #250",
    type: "coating",
    phase: "Line Painting",
    queuePosition: 4,
    estimatedDays: 2,
    weatherDependent: true,
    status: "weather_hold",
    location: "Chapel Hill, NC",
    addedDate: "2025-01-22",
    delayReason: "Temperature below 50°F for 3 consecutive days",
    clientNotification: "We'll resume as soon as weather permits - monitoring daily"
  },
  {
    id: "5",
    projectCode: "Site Visit #251",
    type: "site_visit", 
    phase: "Property Assessment",
    queuePosition: 5,
    estimatedDays: 1,
    weatherDependent: false,
    status: "waiting",
    location: "Apex, NC",
    addedDate: "2025-01-25",
    estimatedStart: "2025-01-29"
  },
  {
    id: "6",
    projectCode: "Court Project #252",
    type: "installation",
    phase: "Complete Installation",
    queuePosition: 6,
    estimatedDays: 7,
    weatherDependent: true,
    status: "waiting", 
    location: "Cary, NC",
    addedDate: "2025-01-28",
    estimatedStart: "2025-02-10"
  }
];

const mockStats: QueueStats = {
  totalItems: 6,
  activeWork: 1,
  weatherHolds: 1,
  avgWaitTime: 12,
  completedThisWeek: 2,
  busyScore: 87
};

const mockWeatherImpact: WeatherImpact = {
  location: "Triangle Area, NC",
  currentTemp: 42,
  condition: "Clear but Cold",
  workableToday: false,
  workableWindow: "None today - too cold for coating",
  nextWorkableDay: "Friday (Jan 31) - High of 65°F",
  impactedProjects: ["Court Project #250", "Court Project #248"]
};

export default function QueueTrackerPage() {
  const [queue] = useState<QueueItem[]>(mockQueue);
  const [stats] = useState<QueueStats>(mockStats);
  const [weatherImpact] = useState<WeatherImpact>(mockWeatherImpact);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [showOnlyWeatherDependent, setShowOnlyWeatherDependent] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'weather_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'waiting':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coating':
      case 'installation':
        return SunIcon;
      case 'consultation':
        return EyeIcon;
      case 'site_visit':
        return MapPinIcon;
      default:
        return QueueListIcon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return PlayIcon;
      case 'weather_hold':
        return PauseIcon;
      case 'completed':
        return CheckCircleIcon;
      case 'delayed':
        return ExclamationTriangleIcon;
      default:
        return ClockIcon;
    }
  };

  const getBusyScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 70) return 'text-orange-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredQueue = showOnlyWeatherDependent 
    ? queue.filter(item => item.weatherDependent)
    : queue;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">Project Queue Tracker</h1>
              <p className="mt-4 text-xl text-gray-600">
                Anonymous, transparent queue system - see exactly where you stand
              </p>
              <p className="mt-2 text-sm text-gray-500">
                We work like orchids - perfect conditions create perfect results
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Queue Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">Total in Queue</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.activeWork}</div>
            <div className="text-sm text-gray-600">Active Now</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.weatherHolds}</div>
            <div className="text-sm text-gray-600">Weather Holds</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-gray-600">{stats.avgWaitTime}</div>
            <div className="text-sm text-gray-600">Avg Wait (Days)</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.completedThisWeek}</div>
            <div className="text-sm text-gray-600">Completed This Week</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className={`text-3xl font-bold ${getBusyScoreColor(stats.busyScore)}`}>
              {stats.busyScore}%
            </div>
            <div className="text-sm text-gray-600">Capacity Utilization</div>
          </div>
        </div>

        {/* Weather Impact Alert */}
        {!weatherImpact.workableToday && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 mb-2">Weather Impact Alert</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-yellow-700">
                      <strong>Current Conditions:</strong> {weatherImpact.currentTemp}°F - {weatherImpact.condition}
                    </div>
                    <div className="text-yellow-700 mt-1">
                      <strong>Today's Work Window:</strong> {weatherImpact.workableWindow}
                    </div>
                  </div>
                  <div>
                    <div className="text-yellow-700">
                      <strong>Next Workable Day:</strong> {weatherImpact.nextWorkableDay}
                    </div>
                    <div className="text-yellow-700 mt-1">
                      <strong>Impacted Projects:</strong> {weatherImpact.impactedProjects.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Queue Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Current Queue</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlyWeatherDependent}
                  onChange={(e) => setShowOnlyWeatherDependent(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Show only weather-dependent work</span>
              </label>
              <div className="text-sm text-gray-500">
                {filteredQueue.length} items showing
              </div>
            </div>
          </div>
        </div>

        {/* Queue List */}
        <div className="space-y-4">
          {filteredQueue.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            const StatusIcon = getStatusIcon(item.status);
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow border-l-4 border-blue-500">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Position Badge */}
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">#{item.queuePosition}</span>
                      </div>
                      
                      {/* Project Info */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <TypeIcon className="w-5 h-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">{item.projectCode}</h3>
                          {item.status === 'in_progress' && (
                            <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                              ACTIVE
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-4">
                            <span><strong>Phase:</strong> {item.phase}</span>
                            <span><strong>Location:</strong> {item.location}</span>
                            <span><strong>Duration:</strong> {item.estimatedDays} day{item.estimatedDays !== 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span><strong>Added:</strong> {new Date(item.addedDate).toLocaleDateString()}</span>
                            {item.estimatedStart && (
                              <span><strong>Est. Start:</strong> {new Date(item.estimatedStart).toLocaleDateString()}</span>
                            )}
                            {item.weatherDependent && (
                              <span className="flex items-center gap-1">
                                <CloudIcon className="w-4 h-4" />
                                Weather Dependent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(item.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-medium">
                          {item.status === 'in_progress' ? 'In Progress' :
                           item.status === 'weather_hold' ? 'Weather Hold' :
                           item.status === 'waiting' ? 'Waiting' :
                           item.status === 'completed' ? 'Completed' : 'Delayed'}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Notes */}
                  {item.progressNotes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Progress: </span>
                        <span className="text-gray-600">{item.progressNotes}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Delay Reason */}
                  {item.delayReason && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="font-medium text-yellow-700">Delay Reason: </span>
                        <span className="text-gray-600">{item.delayReason}</span>
                      </div>
                      {item.clientNotification && (
                        <div className="text-sm mt-1">
                          <span className="font-medium text-blue-700">Update: </span>
                          <span className="text-gray-600">{item.clientNotification}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Queue Movement Explanation */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How the Queue Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Queue Position</h4>
              <ul className="space-y-1">
                <li>• Projects are worked in order of arrival</li>
                <li>• Weather-dependent work may be skipped during poor conditions</li>
                <li>• Consultations and site visits can be scheduled around weather</li>
                <li>• Your position may improve when weather delays other projects</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Weather Dependencies</h4>
              <ul className="space-y-1">
                <li>• Coating work requires 50°F - 90°F temperatures</li>
                <li>• Surface temperatures cannot exceed 140°F</li>
                <li>• Work typically happens early morning (6:30-10 AM) and evening (6:30-8 PM) in summer</li>
                <li>• Quality over speed - we wait for perfect conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedItem.projectCode} - Details
                </h2>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Queue Position</div>
                  <div className="text-2xl font-bold text-blue-600">#{selectedItem.queuePosition}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Estimated Duration</div>
                  <div className="text-lg font-semibold">{selectedItem.estimatedDays} day{selectedItem.estimatedDays !== 1 ? 's' : ''}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Type</div>
                  <div>{selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Phase</div>
                  <div>{selectedItem.phase}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Location</div>
                  <div>{selectedItem.location}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Weather Dependent</div>
                  <div>{selectedItem.weatherDependent ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Added to Queue</div>
                  <div>{new Date(selectedItem.addedDate).toLocaleDateString()}</div>
                </div>
                {selectedItem.estimatedStart && (
                  <div>
                    <div className="font-medium text-gray-700">Estimated Start</div>
                    <div>{new Date(selectedItem.estimatedStart).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              {selectedItem.progressNotes && (
                <div>
                  <div className="font-medium text-gray-700 mb-2">Current Progress</div>
                  <div className="bg-blue-50 p-3 rounded-lg text-gray-700">
                    {selectedItem.progressNotes}
                  </div>
                </div>
              )}

              {selectedItem.delayReason && (
                <div>
                  <div className="font-medium text-gray-700 mb-2">Delay Information</div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-gray-700 mb-2">{selectedItem.delayReason}</div>
                    {selectedItem.clientNotification && (
                      <div className="text-blue-700 text-sm">
                        <strong>Update:</strong> {selectedItem.clientNotification}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <strong>Transparency Note:</strong> This anonymous tracking system shows you exactly where you stand in our queue. 
                  We believe in complete transparency about our process and any delays that might affect your project timeline.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}