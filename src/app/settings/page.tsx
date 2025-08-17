'use client';

import { useState, useEffect } from 'react';
import { SettingsDashboard } from './components/SettingsDashboard';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
        setOriginalSettings(JSON.parse(JSON.stringify(result.data))); // Deep copy
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOriginalSettings(JSON.parse(JSON.stringify(settings))); // Update original to current
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        alert('Error saving settings: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(JSON.parse(JSON.stringify(originalSettings))); // Deep copy
      setSaveMessage('Settings reset to last saved state.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSettingsChange = (newSettings: any) => {
    setSettings(newSettings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-8">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 font-orbitron">
                Business Settings
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {saveMessage && (
                <span className="text-green-600 text-sm font-medium">
                  {saveMessage}
                </span>
              )}
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleReset}
                disabled={isSaving}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {settings && (
          <SettingsDashboard 
            initialSettings={settings}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </div>
    </div>
  );
}