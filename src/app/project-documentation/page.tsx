'use client';

import { useState } from 'react';
import { 
  CameraIcon,
  VideoCameraIcon,
  DocumentIcon,
  ShareIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  ThermometerIcon,
  CloudIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface ProjectDocumentation {
  id: string;
  projectCode: string;
  customer: string;
  location: string;
  phase: string;
  documentation: {
    photos: ProjectPhoto[];
    videos: ProjectVideo[];
    dailyReports: DailyReport[];
    weatherLogs: WeatherLog[];
  };
  liveStream?: {
    isActive: boolean;
    cameras: LiveCamera[];
    startTime: string;
  };
}

interface ProjectPhoto {
  id: string;
  filename: string;
  caption: string;
  timestamp: string;
  phase: string;
  camera: string;
  weather: {
    temperature: number;
    condition: string;
  };
  gps: {
    lat: number;
    lng: number;
  };
}

interface ProjectVideo {
  id: string;
  filename: string;
  title: string;
  description: string;
  duration: number;
  timestamp: string;
  type: 'timelapse' | 'process' | 'daily_wrap' | 'explanation';
  thumbnail: string;
  phase: string;
}

interface DailyReport {
  id: string;
  date: string;
  phase: string;
  hoursWorked: number;
  workCompleted: string[];
  weatherImpact: string;
  tomorrowPlan: string;
  photos: string[];
  videos: string[];
  notes: string;
}

interface WeatherLog {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  workability: 'optimal' | 'possible' | 'restricted' | 'impossible';
  decision: string;
}

interface LiveCamera {
  id: string;
  name: string;
  position: string;
  isActive: boolean;
  angle: string;
  quality: '4K' | '1080p' | '720p';
}

// Mock project documentation data
const mockProject: ProjectDocumentation = {
  id: "1",
  projectCode: "Court Project #247",
  customer: "Private Client",
  location: "Raleigh, NC",
  phase: "Base Coat Application",
  documentation: {
    photos: [
      {
        id: "1",
        filename: "surface_prep_morning_001.jpg",
        caption: "Surface preparation complete - ready for base coat",
        timestamp: "2025-01-29T06:45:00Z",
        phase: "Surface Preparation",
        camera: "Canon 5D Mark IV",
        weather: { temperature: 68, condition: "Clear" },
        gps: { lat: 35.7796, lng: -78.6382 }
      },
      {
        id: "2", 
        filename: "base_coat_application_001.jpg",
        caption: "First section of base coat - perfect viscosity",
        timestamp: "2025-01-29T07:15:00Z",
        phase: "Base Coat Application",
        camera: "Canon 5D Mark IV",
        weather: { temperature: 72, condition: "Clear" },
        gps: { lat: 35.7796, lng: -78.6382 }
      },
      {
        id: "3",
        filename: "temperature_check_001.jpg", 
        caption: "Surface temp 78°F - optimal for coating",
        timestamp: "2025-01-29T08:00:00Z",
        phase: "Base Coat Application",
        camera: "iPhone 15 Pro",
        weather: { temperature: 75, condition: "Clear" },
        gps: { lat: 35.7796, lng: -78.6382 }
      }
    ],
    videos: [
      {
        id: "1",
        filename: "daily_timelapse_day3.mp4",
        title: "Day 3 Complete Timelapse",
        description: "Complete day of base coat application from setup to cleanup",
        duration: 180,
        timestamp: "2025-01-29T17:00:00Z",
        type: "timelapse",
        thumbnail: "timelapse_thumb_day3.jpg",
        phase: "Base Coat Application"
      },
      {
        id: "2",
        filename: "coating_technique_explanation.mp4", 
        title: "Base Coat Application Technique",
        description: "Explaining the proper technique for even base coat application",
        duration: 420,
        timestamp: "2025-01-29T09:30:00Z",
        type: "explanation",
        thumbnail: "technique_thumb.jpg",
        phase: "Base Coat Application"
      }
    ],
    dailyReports: [
      {
        id: "1",
        date: "2025-01-29",
        phase: "Base Coat Application",
        hoursWorked: 6.5,
        workCompleted: [
          "Surface temperature monitoring",
          "First 40% of base coat applied",
          "Quality check and touch-ups",
          "Equipment cleaning"
        ],
        weatherImpact: "Perfect conditions - temperature rose from 68°F to 82°F, ideal for coating",
        tomorrowPlan: "Complete remaining 60% of base coat, weather permitting (forecast 70-85°F)",
        photos: ["1", "2", "3"],
        videos: ["1", "2"],
        notes: "Coating viscosity perfect, no thinning required. Client stopped by at 3 PM - very pleased with progress."
      }
    ],
    weatherLogs: [
      {
        id: "1",
        timestamp: "2025-01-29T06:30:00Z",
        temperature: 68,
        humidity: 55,
        windSpeed: 3,
        condition: "Clear",
        workability: "optimal",
        decision: "Perfect start conditions - proceeding with base coat"
      },
      {
        id: "2",
        timestamp: "2025-01-29T10:00:00Z", 
        temperature: 82,
        humidity: 45,
        windSpeed: 5,
        condition: "Sunny",
        workability: "optimal",
        decision: "Temperature rising but still optimal - continuing work"
      }
    ]
  },
  liveStream: {
    isActive: true,
    startTime: "2025-01-29T06:30:00Z",
    cameras: [
      {
        id: "1",
        name: "Overview Camera",
        position: "Northeast Corner",
        isActive: true,
        angle: "Wide Court View",
        quality: "4K"
      },
      {
        id: "2",
        name: "Work Detail Camera",
        position: "Mobile - Following Work",
        isActive: true,
        angle: "Close-up Detail",
        quality: "4K"
      },
      {
        id: "3",
        name: "Weather Station Camera",
        position: "South Side",
        isActive: true,
        angle: "Equipment & Weather",
        quality: "1080p"
      },
      {
        id: "4",
        name: "Time-lapse Camera",
        position: "Fixed Northwest",
        isActive: true,
        angle: "Full Court Progress",
        quality: "4K"
      }
    ]
  }
};

export default function ProjectDocumentationPage() {
  const [project] = useState<ProjectDocumentation>(mockProject);
  const [selectedTab, setSelectedTab] = useState<'live' | 'photos' | 'videos' | 'reports' | 'weather'>('live');
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<ProjectVideo | null>(null);

  const getWorkabilityColor = (workability: string) => {
    switch (workability) {
      case 'optimal':
        return 'text-green-600 bg-green-100';
      case 'possible':
        return 'text-yellow-600 bg-yellow-100';
      case 'restricted':
        return 'text-orange-600 bg-orange-100';
      case 'impossible':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Documentation</h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600">{project.projectCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Phase: {project.phase}</span>
                  </div>
                </div>
              </div>

              {project.liveStream?.isActive && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="font-medium">LIVE DOCUMENTATION</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {project.liveStream.cameras.filter(c => c.isActive).length} cameras active
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {[
                { key: 'live', label: 'Live Cameras', icon: VideoCameraIcon },
                { key: 'photos', label: 'Photos', icon: CameraIcon },
                { key: 'videos', label: 'Videos', icon: PlayIcon },
                { key: 'reports', label: 'Daily Reports', icon: DocumentIcon },
                { key: 'weather', label: 'Weather Log', icon: CloudIcon }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm ${
                      selectedTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Live Cameras Tab */}
        {selectedTab === 'live' && (
          <div className="space-y-8">
            {project.liveStream?.isActive && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Live Camera Feeds</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    Started: {new Date(project.liveStream.startTime).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {project.liveStream.cameras.map((camera) => (
                    <div key={camera.id} className="relative">
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <VideoCameraIcon className="w-12 h-12 mx-auto mb-2" />
                            <div className="font-medium">{camera.name}</div>
                            <div className="text-sm opacity-75">{camera.quality} Live Feed</div>
                          </div>
                        </div>
                        
                        {camera.isActive && (
                          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            LIVE
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3">
                        <h3 className="font-medium text-gray-900">{camera.name}</h3>
                        <div className="text-sm text-gray-600">
                          {camera.position} • {camera.angle} • {camera.quality}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photos Tab */}
        {selectedTab === 'photos' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Project Photos</h2>
              <div className="text-sm text-gray-600">
                {project.documentation.photos.length} photos captured
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.documentation.photos.map((photo) => (
                <div key={photo.id} className="cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <CameraIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{photo.caption}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{new Date(photo.timestamp).toLocaleString()}</div>
                      <div>{photo.phase}</div>
                      <div className="flex items-center gap-2">
                        <ThermometerIcon className="w-4 h-4" />
                        {photo.weather.temperature}°F - {photo.weather.condition}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {selectedTab === 'videos' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Project Videos</h2>
              <div className="text-sm text-gray-600">
                {project.documentation.videos.length} videos captured
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.documentation.videos.map((video) => (
                <div key={video.id} className="cursor-pointer" onClick={() => setSelectedVideo(video)}>
                  <div className="aspect-video bg-gray-900 rounded-lg mb-3 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayIcon className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(video.timestamp).toLocaleString()} • {video.phase}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Reports Tab */}
        {selectedTab === 'reports' && (
          <div className="space-y-6">
            {project.documentation.dailyReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Daily Report - {new Date(report.date).toLocaleDateString()}
                  </h2>
                  <div className="text-sm text-gray-600">
                    {report.hoursWorked} hours worked
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Work Completed</h3>
                    <ul className="space-y-2">
                      {report.workCompleted.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Weather Impact</h3>
                    <p className="text-gray-700 mb-4">{report.weatherImpact}</p>
                    
                    <h3 className="font-medium text-gray-900 mb-3">Tomorrow's Plan</h3>
                    <p className="text-gray-700">{report.tomorrowPlan}</p>
                  </div>
                </div>

                {report.notes && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Additional Notes</h3>
                    <p className="text-gray-700">{report.notes}</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Documentation: {report.photos.length} photos, {report.videos.length} videos
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weather Log Tab */}
        {selectedTab === 'weather' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weather Log</h2>
              <div className="text-sm text-gray-600">
                {project.documentation.weatherLogs.length} weather readings
              </div>
            </div>

            <div className="space-y-4">
              {project.documentation.weatherLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkabilityColor(log.workability)}`}>
                      {log.workability.charAt(0).toUpperCase() + log.workability.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{log.temperature}°F</div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{log.humidity}%</div>
                      <div className="text-sm text-gray-600">Humidity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{log.windSpeed} mph</div>
                      <div className="text-sm text-gray-600">Wind Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{log.condition}</div>
                      <div className="text-sm text-gray-600">Condition</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Decision:</span> {log.decision}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedPhoto.caption}</h3>
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <CameraIcon className="w-16 h-16 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Timestamp</div>
                  <div className="font-medium">{new Date(selectedPhoto.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Phase</div>
                  <div className="font-medium">{selectedPhoto.phase}</div>
                </div>
                <div>
                  <div className="text-gray-600">Camera</div>
                  <div className="font-medium">{selectedPhoto.camera}</div>
                </div>
                <div>
                  <div className="text-gray-600">Weather</div>
                  <div className="font-medium">{selectedPhoto.weather.temperature}°F - {selectedPhoto.weather.condition}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}