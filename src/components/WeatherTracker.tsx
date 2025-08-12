'use client';

import { useState, useEffect } from 'react';
import { 
  CloudIcon,
  SunIcon,
  CloudIcon as CloudRainIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

interface WeatherData {
  date: string;
  high: number;
  low: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  uvIndex: number;
}

interface ProjectWeatherAlert {
  projectId: string;
  projectName: string;
  startDate: string;
  alert: 'GOOD' | 'CAUTION' | 'DELAY' | 'CANCEL';
  reason: string;
  recommendation: string;
}

const weatherConditions = {
  sunny: { icon: SunIcon, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  cloudy: { icon: CloudIcon, color: 'text-gray-500', bg: 'bg-gray-50' },
  rainy: { icon: CloudRainIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
  stormy: { icon: ExclamationTriangleIcon, color: 'text-red-500', bg: 'bg-red-50' }
};

const alertColors = {
  GOOD: 'bg-green-100 text-green-800 border-green-200',
  CAUTION: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DELAY: 'bg-orange-100 text-orange-800 border-orange-200',
  CANCEL: 'bg-red-100 text-red-800 border-red-200'
};

export default function WeatherTracker() {
  const [weatherForecast, setWeatherForecast] = useState<WeatherData[]>([]);
  const [projectAlerts, setProjectAlerts] = useState<ProjectWeatherAlert[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    // Simulate weather data - in production, this would come from a weather API
    const generateWeatherForecast = () => {
      const forecast: WeatherData[] = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Simulate weather conditions
        const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'stormy'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          high: Math.floor(Math.random() * 20) + 65, // 65-85°F
          low: Math.floor(Math.random() * 15) + 45,  // 45-60°F
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          precipitation: randomCondition === 'rainy' ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 20),
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
          condition: randomCondition,
          uvIndex: Math.floor(Math.random() * 8) + 1
        });
      }
      
      return forecast;
    };

    const forecast = generateWeatherForecast();
    setWeatherForecast(forecast);

    // Generate project alerts based on weather
    const alerts: ProjectWeatherAlert[] = [
      {
        projectId: 'proj_001',
        projectName: 'Botetourt County - Tennis Courts 3 & 4',
        startDate: '2025-02-15',
        alert: 'CAUTION',
        reason: '40% chance of rain on day 2',
        recommendation: 'Monitor forecast. Consider delaying primer application if rain expected.'
      },
      {
        projectId: 'proj_002',
        projectName: 'Riverside Estates HOA - Tennis Courts',
        startDate: '2025-03-01',
        alert: 'GOOD',
        reason: 'Clear skies, optimal temperature (72°F)',
        recommendation: 'Excellent conditions for all phases of work.'
      }
    ];
    
    setProjectAlerts(alerts);
  }, []);

  const isWorkingCondition = (weather: WeatherData): boolean => {
    return (
      weather.precipitation < 30 && // Less than 30% chance of rain
      weather.high >= 50 && // At least 50°F
      weather.high <= 90 && // No more than 90°F
      weather.windSpeed < 20 && // Less than 20 mph wind
      weather.condition !== 'stormy'
    );
  };

  const getWorkingConditionsText = (weather: WeatherData): string => {
    if (!isWorkingCondition(weather)) {
      const issues = [];
      if (weather.precipitation >= 30) issues.push('rain risk');
      if (weather.high < 50) issues.push('too cold');
      if (weather.high > 90) issues.push('too hot');
      if (weather.windSpeed >= 20) issues.push('windy');
      if (weather.condition === 'stormy') issues.push('storms');
      
      return `Poor: ${issues.join(', ')}`;
    }
    
    if (weather.high >= 65 && weather.high <= 80 && weather.precipitation < 10) {
      return 'Excellent';
    }
    
    return 'Good';
  };

  const getOptimalWorkTasks = (weather: WeatherData): string[] => {
    const tasks = [];
    
    if (weather.condition === 'sunny' && weather.precipitation < 10) {
      tasks.push('Surface prep', 'Primer application', 'Base coat', 'Line painting');
    } else if (weather.condition === 'cloudy' && weather.precipitation < 20) {
      tasks.push('Surface prep', 'Primer application');
    } else if (weather.precipitation < 30 && weather.condition !== 'rainy') {
      tasks.push('Surface prep', 'Equipment maintenance');
    } else {
      tasks.push('Indoor prep work', 'Material organization');
    }
    
    return tasks;
  };

  return (
    <div className="space-y-6">
      {/* Weather Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-orange-500" />
          Project Weather Alerts
        </h2>
        
        <div className="space-y-3">
          {projectAlerts.map((alert) => (
            <div key={alert.projectId} className={`border rounded-lg p-4 ${alertColors[alert.alert]}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium">{alert.projectName}</h3>
                    <span className="text-sm">
                      Start: {new Date(alert.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mb-1">
                    <strong>Alert:</strong> {alert.reason}
                  </p>
                  <p className="text-sm">
                    <strong>Recommendation:</strong> {alert.recommendation}
                  </p>
                </div>
                <div className="ml-4">
                  {alert.alert === 'GOOD' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                  {alert.alert === 'CAUTION' && <ClockIcon className="h-5 w-5 text-yellow-600" />}
                  {alert.alert === 'DELAY' && <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />}
                  {alert.alert === 'CANCEL' && <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CloudIcon className="h-5 w-5 mr-2 text-blue-500" />
          7-Day Work Conditions Forecast
        </h2>
        
        <div className="grid grid-cols-7 gap-2">
          {weatherForecast.map((weather, index) => {
            const date = new Date(weather.date);
            const WeatherIcon = weatherConditions[weather.condition].icon;
            const isWorkable = isWorkingCondition(weather);
            
            return (
              <div
                key={weather.date}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedDate === weather.date 
                    ? 'border-blue-500 bg-blue-50' 
                    : isWorkable 
                      ? 'border-green-200 bg-green-50 hover:bg-green-100'
                      : 'border-red-200 bg-red-50 hover:bg-red-100'
                }`}
                onClick={() => setSelectedDate(selectedDate === weather.date ? '' : weather.date)}
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {index === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </div>
                  
                  <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full mb-2 ${weatherConditions[weather.condition].bg}`}>
                    <WeatherIcon className={`h-5 w-5 ${weatherConditions[weather.condition].color}`} />
                  </div>
                  
                  <div className="text-xs">
                    <div className="font-medium">{weather.high}°</div>
                    <div className="text-gray-500">{weather.low}°</div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {weather.precipitation}% rain
                  </div>
                  
                  <div className={`text-xs mt-1 font-medium ${isWorkable ? 'text-green-600' : 'text-red-600'}`}>
                    {getWorkingConditionsText(weather)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Day View */}
      {selectedDate && (() => {
        const selectedWeather = weatherForecast.find(w => w.date === selectedDate);
        if (!selectedWeather) return null;
        
        const WeatherIcon = weatherConditions[selectedWeather.condition].icon;
        const optimalTasks = getOptimalWorkTasks(selectedWeather);
        
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Detailed Conditions - {new Date(selectedDate).toLocaleDateString('en', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Weather Overview */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Weather Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <WeatherIcon className={`h-8 w-8 mr-3 ${weatherConditions[selectedWeather.condition].color}`} />
                    <div>
                      <div className="font-medium">{selectedWeather.condition.charAt(0).toUpperCase() + selectedWeather.condition.slice(1)}</div>
                      <div className="text-sm text-gray-500">
                        {selectedWeather.high}°F / {selectedWeather.low}°F
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Precipitation</div>
                      <div className="font-medium">{selectedWeather.precipitation}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Humidity</div>
                      <div className="font-medium">{selectedWeather.humidity}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Wind Speed</div>
                      <div className="font-medium">{selectedWeather.windSpeed} mph</div>
                    </div>
                    <div>
                      <div className="text-gray-500">UV Index</div>
                      <div className="font-medium">{selectedWeather.uvIndex}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Suitability */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Work Suitability</h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border ${
                    isWorkingCondition(selectedWeather) 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className={`font-medium ${
                      isWorkingCondition(selectedWeather) ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {getWorkingConditionsText(selectedWeather)}
                    </div>
                    <div className={`text-sm mt-1 ${
                      isWorkingCondition(selectedWeather) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isWorkingCondition(selectedWeather) 
                        ? 'Suitable for most court resurfacing work'
                        : 'Not recommended for outdoor court work'
                      }
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-2">Safety Considerations:</div>
                    <ul className="text-gray-600 space-y-1">
                      {selectedWeather.uvIndex > 6 && (
                        <li>• High UV - ensure worker sun protection</li>
                      )}
                      {selectedWeather.high > 85 && (
                        <li>• Hot conditions - provide frequent breaks</li>
                      )}
                      {selectedWeather.windSpeed > 15 && (
                        <li>• Windy - secure loose materials</li>
                      )}
                      {selectedWeather.precipitation > 20 && (
                        <li>• Rain risk - have tarps ready</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommended Tasks */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recommended Tasks</h3>
                <div className="space-y-2">
                  {optimalTasks.map((task, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 mb-1">Pro Tip:</div>
                    <div className="text-blue-700">
                      {selectedWeather.condition === 'sunny' 
                        ? "Perfect day for acrylic application. Start early to avoid midday heat."
                        : selectedWeather.condition === 'cloudy'
                        ? "Overcast conditions are ideal for primer work - slower drying prevents cracking."
                        : selectedWeather.precipitation > 30
                        ? "Use this time for equipment maintenance and material preparation."
                        : "Monitor conditions throughout the day for changes."
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}