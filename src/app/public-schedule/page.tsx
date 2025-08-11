'use client';

import { useState, useEffect } from 'react';
import { 
  MapPinIcon,
  ClockIcon,
  SignalIcon,
  SunIcon,
  CloudIcon,
  VideoCameraIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    workWindow: 'optimal' | 'possible' | 'restricted' | 'impossible';
  }[];
}

interface QueueProject {
  id: string;
  projectCode: string; // Anonymous identifier like "Court Project #247"
  type: 'coating' | 'installation' | 'consultation' | 'site_visit';
  phase: string;
  queuePosition: number;
  estimatedDays: number;
  weatherDependent: boolean;
  status: 'waiting' | 'in_progress' | 'weather_hold' | 'completed';
  location: string;
  workWindows?: {
    morning: { start: string; end: string };
    evening: { start: string; end: string };
  };
}

interface TodayActivity {
  currentProject?: QueueProject;
  currentPhase: string;
  location: string;
  workWindow: 'morning' | 'evening' | 'weather_hold' | 'consultation';
  nextActivity?: {
    time: string;
    type: string;
    projectCode: string;
  };
  isLive: boolean;
  cameraCount: number;
}

// Mock data - will be replaced with real API calls
const mockWeather: WeatherData = {
  location: "Raleigh, NC",
  temperature: 72,
  condition: "Sunny",
  humidity: 45,
  windSpeed: 8,
  forecast: [
    { date: "2025-01-29", high: 78, low: 52, condition: "Sunny", workWindow: "optimal" },
    { date: "2025-01-30", high: 45, low: 35, condition: "Cloudy", workWindow: "impossible" },
    { date: "2025-01-31", high: 55, low: 40, condition: "Partly Cloudy", workWindow: "restricted" },
    { date: "2025-02-01", high: 68, low: 48, condition: "Sunny", workWindow: "possible" },
    { date: "2025-02-02", high: 75, low: 55, condition: "Sunny", workWindow: "optimal" }
  ]
};

const mockTodayActivity: TodayActivity = {
  currentProject: {
    id: "1",
    projectCode: "Court Project #247",
    type: "coating",
    phase: "Base Coat Application",
    queuePosition: 1,
    estimatedDays: 3,
    weatherDependent: true,
    status: "in_progress",
    location: "Raleigh, NC",
    workWindows: {
      morning: { start: "6:30 AM", end: "10:00 AM" },
      evening: { start: "6:30 PM", end: "8:00 PM" }
    }
  },
  currentPhase: "Applying base coat - Hour 2 of 4",
  location: "Raleigh, NC",
  workWindow: "morning",
  nextActivity: {
    time: "2:00 PM",
    type: "Site Visit",
    projectCode: "Project #251"
  },
  isLive: true,
  cameraCount: 4
};

const mockQueue: QueueProject[] = [
  {
    id: "1",
    projectCode: "Court Project #247",
    type: "coating",
    phase: "Base Coat Application",
    queuePosition: 1,
    estimatedDays: 3,
    weatherDependent: true,
    status: "in_progress",
    location: "Raleigh, NC"
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
    location: "Durham, NC"
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
    location: "Cary, NC"
  },
  {
    id: "4",
    projectCode: "Court Project #250",
    type: "coating",
    phase: "Line Painting",
    queuePosition: 4,
    estimatedDays: 2,
    weatherDependent: true,
    status: "waiting",
    location: "Chapel Hill, NC"
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
    location: "Apex, NC"
  }
];

const getWorkWindowColor = (workWindow: string) => {
  switch (workWindow) {
    case 'optimal':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'possible':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'restricted':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'impossible':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getWorkWindowLabel = (workWindow: string) => {
  switch (workWindow) {
    case 'optimal':
      return 'Perfect Coating Weather';
    case 'possible':
      return 'Coating Possible';
    case 'restricted':
      return 'Limited Work Window';
    case 'impossible':
      return 'No Coating (Weather)';
    default:
      return 'Weather Check';
  }
};

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
      return VideoCameraIcon;
    case 'site_visit':
      return MapPinIcon;
    default:
      return CalendarDaysIcon;
  }
};

export default function PublicSchedulePage() {
  const [weather] = useState<WeatherData>(mockWeather);
  const [todayActivity] = useState<TodayActivity>(mockTodayActivity);
  const [queue] = useState<QueueProject[]>(mockQueue);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasScheduledWork = (date: Date) => {
    // Mock logic - in real implementation, check against actual schedule
    return Math.random() > 0.7;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Live Work Schedule</h1>
            <p className="mt-4 text-xl text-gray-600">
              Transparent, weather-dependent court construction
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Quality work requires perfect conditions - see exactly where we are and what's next
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Where I Am Today - Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold">WHERE I AM TODAY</h2>
                {todayActivity.isLive && (
                  <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span className="font-semibold">{todayActivity.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <SignalIcon className="w-5 h-5" />
                    <span>{weather.temperature}°F Rising → Perfect Coating</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-5 h-5" />
                    <span>6:30 AM - 10:00 AM (Active)</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CameraIcon className="w-5 h-5" />
                    <span>{todayActivity.cameraCount} Cameras Documenting</span>
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {todayActivity.currentProject?.projectCode}
                  </div>
                  <div className="text-sm opacity-90">
                    {todayActivity.currentPhase}
                  </div>
                </div>
              </div>
              
              {todayActivity.nextActivity && (
                <div className="mt-4 pt-4 border-t border-blue-500">
                  <div className="text-sm opacity-90">Next:</div>
                  <div className="font-semibold">
                    {todayActivity.nextActivity.projectCode} - {todayActivity.nextActivity.time}
                  </div>
                </div>
              )}
            </div>
            
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center">
                <PlayIcon className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Next 5 Days Weather & Work Windows */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next 5 Days - Weather & Work Windows</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weather.forecast.map((day, index) => (
              <div key={day.date} className="text-center">
                <div className="font-medium text-gray-900 mb-2">
                  {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    {day.condition === 'Sunny' ? (
                      <SunIcon className="w-8 h-8 text-yellow-500" />
                    ) : (
                      <CloudIcon className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="text-lg font-bold text-gray-900">
                    {day.high}°
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Low {day.low}°
                  </div>
                  
                  <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${getWorkWindowColor(day.workWindow)}`}>
                    {getWorkWindowLabel(day.workWindow)}
                  </div>
                  
                  {day.workWindow === 'optimal' && (
                    <div className="mt-2 text-xs text-gray-600">
                      <div>6:30-10:00 AM</div>
                      <div>6:30-8:00 PM</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Queue */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Queue - Your Position</h2>
          
          <div className="space-y-4">
            {queue.map((project, index) => {
              const IconComponent = getTypeIcon(project.type);
              return (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-900">
                          #{project.queuePosition} - {project.projectCode}
                        </div>
                        <div className="text-sm text-gray-600">
                          {project.phase} • {project.location}
                        </div>
                        <div className="text-xs text-gray-500">
                          Estimated: {project.estimatedDays} day{project.estimatedDays !== 1 ? 's' : ''}
                          {project.weatherDependent && ' (weather dependent)'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status === 'in_progress' ? 'Active Now' : 
                         project.status === 'weather_hold' ? 'Weather Hold' :
                         project.status === 'waiting' ? 'In Queue' : 'Complete'}
                      </div>
                      
                      {project.status === 'in_progress' && (
                        <div className="flex items-center gap-1 text-red-600">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">LIVE</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Schedule
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Today
              </button>
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isTodayDate = isToday(date);
              const hasWork = hasScheduledWork(date);
              
              return (
                <div
                  key={index}
                  className={`
                    p-3 min-h-16 border border-gray-100 cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                    ${isTodayDate ? 'bg-blue-50 border-blue-200' : ''}
                    ${selectedDate?.toDateString() === date.toDateString() ? 'bg-blue-100 border-blue-300' : ''}
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className={`text-sm ${isTodayDate ? 'font-bold text-blue-600' : ''}`}>
                    {date.getDate()}
                  </div>
                  {hasWork && isCurrentMonth && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Scheduled Work</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span>Live Documentation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Why This Level of Transparency?</h3>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Court coating is like growing orchids - it requires perfect conditions. We can't work below 50°F or above 90°F, 
            and surface temperatures can't exceed 140°F. Rather than make excuses, we show you exactly why we work when we do. 
            Your project deserves perfect conditions, and you deserve to know exactly where you stand.
          </p>
        </div>
      </div>
    </div>
  );
}