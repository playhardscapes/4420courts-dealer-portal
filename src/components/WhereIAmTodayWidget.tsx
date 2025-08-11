'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPinIcon,
  ClockIcon,
  CameraIcon,
  ArrowRightIcon,
  PlayIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface TodayActivity {
  currentProject?: {
    projectCode: string;
    phase: string;
    location: string;
  };
  currentPhase: string;
  location: string;
  temperature: number;
  workWindow: 'morning' | 'evening' | 'weather_hold' | 'consultation';
  nextActivity?: {
    time: string;
    type: string;
    projectCode: string;
  };
  isLive: boolean;
  cameraCount: number;
  workStatus: string;
}

// Mock data - will be replaced with real API
const mockTodayActivity: TodayActivity = {
  currentProject: {
    projectCode: "Court Project #247",
    phase: "Base Coat Application",
    location: "Raleigh, NC"
  },
  currentPhase: "Applying base coat - Hour 2 of 4",
  location: "Raleigh, NC",
  temperature: 72,
  workWindow: "morning",
  nextActivity: {
    time: "2:00 PM",
    type: "Site Visit",
    projectCode: "Project #251"
  },
  isLive: true,
  cameraCount: 4,
  workStatus: "Perfect Coating Weather"
};

export default function WhereIAmTodayWidget() {
  const [activity, setActivity] = useState<TodayActivity>(mockTodayActivity);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getWorkWindowDisplay = () => {
    const hour = currentTime.getHours();
    
    if (activity.workWindow === 'morning' && hour >= 6 && hour < 10) {
      return {
        label: "Morning Session Active",
        time: "6:30 AM - 10:00 AM",
        status: "active",
        color: "text-green-600"
      };
    } else if (activity.workWindow === 'evening' && hour >= 18 && hour < 20) {
      return {
        label: "Evening Session Active", 
        time: "6:30 PM - 8:00 PM",
        status: "active",
        color: "text-green-600"
      };
    } else if (activity.workWindow === 'weather_hold') {
      return {
        label: "Weather Hold",
        time: "Waiting for conditions",
        status: "hold",
        color: "text-yellow-600"
      };
    } else {
      return {
        label: "Between Sessions",
        time: "Next: 6:30 PM - 8:00 PM",
        status: "waiting",
        color: "text-gray-600"
      };
    }
  };

  const workWindow = getWorkWindowDisplay();

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-xl text-white p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white rounded-full"></div>
      </div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-bold">WHERE I AM TODAY</h2>
          </div>
          
          {activity.isLive && (
            <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Current Location & Project */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold">{activity.location}</span>
            </div>
            
            {activity.currentProject && (
              <div className="text-lg font-bold mb-1">
                {activity.currentProject.projectCode}
              </div>
            )}
            
            <div className="text-sm opacity-90 mb-3">
              {activity.currentPhase}
            </div>
          </div>

          {/* Weather & Work Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FireIcon className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-semibold">{activity.temperature}°F</div>
                <div className="text-xs opacity-90">{activity.workStatus}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CameraIcon className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-semibold">{activity.cameraCount} Cameras</div>
                <div className="text-xs opacity-90">Documenting</div>
              </div>
            </div>
          </div>

          {/* Work Window */}
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className={`font-semibold ${workWindow.color === 'text-green-600' ? 'text-green-300' : workWindow.color === 'text-yellow-600' ? 'text-yellow-300' : 'text-gray-300'}`}>
                {workWindow.label}
              </div>
              <div className="text-sm opacity-90">{workWindow.time}</div>
            </div>
          </div>

          {/* Next Activity */}
          {activity.nextActivity && (
            <div className="pt-3 border-t border-blue-500">
              <div className="text-sm opacity-90 mb-1">Next:</div>
              <div className="font-semibold">
                {activity.nextActivity.type} - {activity.nextActivity.projectCode}
              </div>
              <div className="text-sm opacity-90">
                {activity.nextActivity.time}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link 
            href="/public-schedule"
            className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <span>View Full Schedule</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Work Indicator */}
        {workWindow.status === 'active' && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <PlayIcon className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}