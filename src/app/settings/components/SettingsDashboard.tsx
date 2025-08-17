'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface DealerSettings {
  profile: {
    companyName: string;
    dealerCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  business: {
    businessAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    licenseNumber: string;
    taxId: string;
    commissionRate: number;
  };
  territory: {
    states: string[];
    regions: string[];
    exclusiveZip: string[];
  };
  notifications: {
    orderAlerts: boolean;
    commissionUpdates: boolean;
    customerMessages: boolean;
    systemUpdates: boolean;
  };
  preferences: {
    timezone: string;
    currency: string;
    dateFormat: string;
    language: string;
  };
  pricing: {
    items: PricingItem[];
  };
  seasonalAdjustments: {
    adjustments: SeasonalAdjustment[];
  };
  contractTemplate: {
    template: ContractTemplate;
    standardClauses: string[];
  };
}

interface PricingItem {
  id: string;
  category: string;
  description: string;
  unit: string;
  basePrice: number;
  notes?: string;
}

interface SeasonalAdjustment {
  id: string;
  title: string;
  description: string;
  type: 'margin' | 'timeline' | 'pricing' | 'availability';
  adjustment: string;
  active: boolean;
}

interface ContractTemplate {
  id: string;
  name: string;
  template: string;
  requiredFields: ContractField[];
}

interface ContractField {
  id: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'textarea';
  label: string;
  required: boolean;
  defaultValue?: string;
  options?: string[]; // for select fields
}

interface SettingsDashboardProps {
  initialSettings: any;
  onSettingsChange: (settings: any) => void;
}

export function SettingsDashboard({ initialSettings, onSettingsChange }: SettingsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'territory' | 'notifications' | 'preferences' | 'pricing' | 'seasonal' | 'contract'>('profile');
  const [settings, setSettings] = useState<DealerSettings>(() => {
    return {
      profile: initialSettings?.profile || {},
      business: initialSettings?.business || {},
      territory: initialSettings?.territory || {},
      notifications: initialSettings?.notifications || {},
      preferences: initialSettings?.preferences || {},
    pricing: {
      items: [
        { id: '1', category: 'Court Surfacing', description: '2 coats of acrylic resurfacer', unit: 'per sq ft', basePrice: 5.15, notes: 'Includes surface preparation and base coat' },
        { id: '2', category: 'Court Surfacing', description: 'Color coating (2 coats)', unit: 'per sq ft', basePrice: 3.25, notes: 'Standard colors available' },
        { id: '3', category: 'Court Surfacing', description: 'Line painting (tennis/pickleball)', unit: 'per court', basePrice: 850, notes: 'Includes layout and regulation lines' },
        { id: '4', category: 'Equipment', description: 'Basketball hoop installation', unit: 'per hoop', basePrice: 1500, notes: 'Includes concrete footers and hardware' },
        { id: '5', category: 'Equipment', description: 'Tennis net posts and net', unit: 'per set', basePrice: 450, notes: 'Professional grade equipment' },
        { id: '6', category: 'Equipment', description: 'Pickleball net system', unit: 'per set', basePrice: 320, notes: 'Portable or permanent installation' },
        { id: '7', category: 'Site Preparation', description: 'Crack repair (major)', unit: 'per linear ft', basePrice: 8.50, notes: 'Includes cleaning and sealing' },
        { id: '8', category: 'Site Preparation', description: 'Pressure washing', unit: 'per sq ft', basePrice: 0.35, notes: 'Deep clean and prep' },
        { id: '9', category: 'Site Preparation', description: 'Surface leveling compound', unit: 'per sq ft', basePrice: 2.80, notes: 'For minor depressions' },
        { id: '10', category: 'Additional Services', description: 'Fence repair/tensioning', unit: 'per linear ft', basePrice: 12.00, notes: 'Chain link fence service' }
      ]
    },
    seasonalAdjustments: {
      adjustments: [
        { id: '1', title: 'Winter Schedule Extension', description: 'Cold weather extends curing times and project duration', type: 'timeline', adjustment: 'Add 25% to project timeline for temperatures below 50°F', active: true },
        { id: '2', title: 'Peak Season Premium', description: 'High demand period with increased margins', type: 'margin', adjustment: 'Increase margins by 15% during April-September peak season', active: false },
        { id: '3', title: 'Weather Risk Factor', description: 'Additional contingency for unpredictable weather', type: 'pricing', adjustment: 'Add $500-1000 weather contingency for outdoor projects', active: true },
        { id: '4', title: 'Limited Availability', description: 'Reduced crew availability during holidays', type: 'availability', adjustment: 'Limited scheduling November-January, premium rates apply', active: false }
      ]
    },
    contractTemplate: {
      template: {
        id: '1',
        name: 'Standard Court Resurfacing Contract',
        template: `COURT RESURFACING CONTRACT

This Contract is entered into on \{\{contract_date\}\} between \{\{company_name\}\}, a \{\{company_state\}\} corporation ("Contractor"), and \{\{customer_name\}\} ("Customer").

CUSTOMER INFORMATION:
Name: \{\{customer_name\}\}
Address: \{\{customer_address\}\}
Phone: \{\{customer_phone\}\}
Email: \{\{customer_email\}\}

PROJECT DETAILS:
Project Location: \{\{project_address\}\}
Court Type: \{\{court_type\}\}
Square Footage: \{\{square_footage\}\}
Surface Type: \{\{surface_type\}\}

SCOPE OF WORK:
\{\{scope_of_work\}\}

MATERIALS AND PRICING:
\{\{pricing_breakdown\}\}

TOTAL CONTRACT AMOUNT: $\{\{total_amount\}\}

PAYMENT TERMS:
- Deposit: $\{\{deposit_amount\}\} (\{\{deposit_percentage\}\}%) due upon signing
- Progress Payment: $\{\{progress_payment\}\} due \{\{progress_milestone\}\}
- Final Payment: $\{\{final_payment\}\} due upon completion

TIMELINE:
Start Date: \{\{start_date\}\}
Estimated Completion: \{\{completion_date\}\}
Weather delays may extend timeline as necessary.

WARRANTY:
Contractor warrants all work and materials for \{\{warranty_period\}\} from completion date.

ADDITIONAL TERMS:
\{\{additional_terms\}\}

By signing below, both parties agree to the terms and conditions of this contract.

Customer Signature: _________________________ Date: _______
\{\{customer_name\}\}

Contractor Signature: _________________________ Date: _______
\{\{contractor_name\}\}, \{\{company_name\}\}`,
        requiredFields: [
          {
            id: '1',
            fieldName: 'warranty_period',
            fieldType: 'select',
            label: 'Warranty Period',
            required: true,
            defaultValue: '2 years',
            options: ['1 year', '2 years', '3 years', '5 years']
          },
          {
            id: '2',
            fieldName: 'deposit_percentage',
            fieldType: 'number',
            label: 'Deposit Percentage',
            required: true,
            defaultValue: '30'
          },
          {
            id: '3',
            fieldName: 'company_state',
            fieldType: 'text',
            label: 'Company State of Incorporation',
            required: true,
            defaultValue: 'Florida'
          },
          {
            id: '4',
            fieldName: 'progress_milestone',
            fieldType: 'select',
            label: 'Progress Payment Milestone',
            required: true,
            defaultValue: 'at 50% completion',
            options: ['at material delivery', 'at 50% completion', 'at 75% completion', 'before final coat']
          }
        ]
      },
      standardClauses: [
        'Weather delays beyond contractor control will extend timeline accordingly.',
        'Customer is responsible for providing clear access to work area.',
        'Any changes to scope of work must be approved in writing.',
        'Contractor is not responsible for underground utilities not marked.',
        'Customer must maintain proper drainage around court surface.',
        'Final payment due within 30 days of project completion.',
        'Contractor carries general liability insurance of $1,000,000.',
        'Customer agrees to final walk-through inspection before completion.'
      ]
    }
    };
  });

  // Update settings when initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(prev => ({
        ...prev,
        profile: initialSettings.profile || prev.profile,
        business: initialSettings.business || prev.business,
        territory: initialSettings.territory || prev.territory,
        notifications: initialSettings.notifications || prev.notifications,
        preferences: initialSettings.preferences || prev.preferences,
      }));
    }
  }, [initialSettings]);

  // Notify parent component when settings change
  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'business', name: 'Business Info', icon: CogIcon },
    { id: 'territory', name: 'Territory', icon: MapPinIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'preferences', name: 'Preferences', icon: ShieldCheckIcon },
    { id: 'pricing', name: 'Pricing Database', icon: CurrencyDollarIcon },
    { id: 'seasonal', name: 'Seasonal Adjustments', icon: CalendarIcon },
    { id: 'contract', name: 'Contract Template', icon: DocumentTextIcon }
  ] as const;

  const handleInputChange = (section: keyof DealerSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: keyof DealerSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={settings.profile.companyName}
            onChange={(e) => handleInputChange('profile', 'companyName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Code</label>
          <input
            type="text"
            value={settings.profile.dealerCode}
            disabled
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={settings.profile.firstName}
            onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={settings.profile.lastName}
            onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={settings.business.businessAddress.street}
              onChange={(e) => handleNestedInputChange('business', 'businessAddress', 'street', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={settings.business.businessAddress.city}
              onChange={(e) => handleNestedInputChange('business', 'businessAddress', 'city', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={settings.business.businessAddress.state}
              onChange={(e) => handleNestedInputChange('business', 'businessAddress', 'state', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              value={settings.business.businessAddress.zipCode}
              onChange={(e) => handleNestedInputChange('business', 'businessAddress', 'zipCode', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
          <input
            type="text"
            value={settings.business.licenseNumber}
            onChange={(e) => handleInputChange('business', 'licenseNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
          <input
            type="text"
            value={settings.business.taxId}
            onChange={(e) => handleInputChange('business', 'taxId', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={settings.business.commissionRate}
              onChange={(e) => handleInputChange('business', 'commissionRate', parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTerritoryTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned States</h3>
        <div className="flex flex-wrap gap-2">
          {settings.territory.states.map((state) => (
            <span key={state} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {state}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Regions</h3>
        <div className="flex flex-wrap gap-2">
          {settings.territory.regions.map((region) => (
            <span key={region} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {region}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Exclusive ZIP Codes</h3>
        <div className="flex flex-wrap gap-2">
          {settings.territory.exclusiveZip.map((zip) => (
            <span key={zip} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {zip}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Territory Performance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-600 font-medium">Coverage:</span>
            <span className="ml-2 text-blue-800">2 States, 3 Regions</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Exclusive Zips:</span>
            <span className="ml-2 text-blue-800">{settings.territory.exclusiveZip.length} codes</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Growth Rate:</span>
            <span className="ml-2 text-blue-800">+15.7% this quarter</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">
              {key === 'orderAlerts' ? 'Order Alerts' :
               key === 'commissionUpdates' ? 'Commission Updates' :
               key === 'customerMessages' ? 'Customer Messages' :
               'System Updates'}
            </h4>
            <p className="text-sm text-gray-600">
              {key === 'orderAlerts' ? 'Get notified when new orders are placed' :
               key === 'commissionUpdates' ? 'Receive updates on commission calculations and payments' :
               key === 'customerMessages' ? 'Notifications for customer inquiries and messages' :
               'System maintenance and feature update notifications'}
            </p>
          </div>
          <button
            onClick={() => handleInputChange('notifications', key, !value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.preferences.timezone}
            onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.preferences.currency}
            onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">US Dollar ($)</option>
            <option value="CAD">Canadian Dollar (C$)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.preferences.dateFormat}
            onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.preferences.language}
            onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pricing Database</h3>
        <button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 flex items-center gap-2 border border-blue-600">
          <PlusIcon className="h-4 w-4" />
          Add Pricing Item
        </button>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4">
        <h4 className="font-medium text-blue-900 mb-2">Claude Quote Assistant</h4>
        <p className="text-sm text-blue-800">
          These pricing items will be available to Claude when generating quotes. Each item includes base pricing, units, and notes to help with accurate quote generation.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(
          settings.pricing.items.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {} as Record<string, PricingItem[]>)
        ).map(([category, items]) => (
          <div key={category} className="border border-gray-200 bg-white">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">{category}</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{item.description}</h5>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-green-600">
                          ${item.basePrice.toFixed(2)} {item.unit}
                        </span>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSeasonalTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Seasonal Adjustments</h3>
        <button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 flex items-center gap-2 border border-blue-600">
          <PlusIcon className="h-4 w-4" />
          Add Adjustment
        </button>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4">
        <h4 className="font-medium text-blue-900 mb-2">Smart Quote Adjustments</h4>
        <p className="text-sm text-blue-800">
          These seasonal adjustments help Claude understand current business conditions when generating quotes. Toggle adjustments on/off based on current market conditions.
        </p>
      </div>

      <div className="space-y-4">
        {settings.seasonalAdjustments.adjustments.map((adjustment) => (
          <div key={adjustment.id} className={`border-2 p-4 ${adjustment.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">{adjustment.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium ${
                    adjustment.type === 'margin' ? 'bg-blue-100 text-blue-800' :
                    adjustment.type === 'timeline' ? 'bg-yellow-100 text-yellow-800' :
                    adjustment.type === 'pricing' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {adjustment.type.charAt(0).toUpperCase() + adjustment.type.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{adjustment.description}</p>
                <div className="bg-gray-100 p-3 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-gray-900">{adjustment.adjustment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adjustment.active}
                    onChange={() => {
                      // Handle toggle
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <button className="text-red-600 hover:text-red-900">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContractTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Contract Template</h3>
        <button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 flex items-center gap-2 border border-blue-600">
          <PlusIcon className="h-4 w-4" />
          Edit Template
        </button>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4">
        <h4 className="font-medium text-blue-900 mb-2">Claude Contract Assistant</h4>
        <p className="text-sm text-blue-800">
          This contract template will be used by Claude to generate customized contracts for each customer. Data from quotes can be automatically populated into contracts, along with your standard terms and required fields.
        </p>
      </div>

      {/* Contract Template Preview */}
      <div className="border border-gray-200 bg-white">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">{settings.contractTemplate.template.name}</h4>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 p-4 border max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {settings.contractTemplate.template.template}
            </pre>
          </div>
        </div>
      </div>

      {/* Required Fields */}
      <div className="border border-gray-200 bg-white">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Required Contract Fields</h4>
          <p className="text-sm text-gray-600">These fields must be completed for every contract</p>
        </div>
        <div className="divide-y divide-gray-200">
          {settings.contractTemplate.template.requiredFields.map((field) => (
            <div key={field.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{field.label}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 font-mono">
                    {`{{${field.fieldName}}}`}
                  </span>
                  <span className={`text-xs px-2 py-1 font-medium ${
                    field.fieldType === 'text' ? 'bg-blue-100 text-blue-800' :
                    field.fieldType === 'number' ? 'bg-green-100 text-green-800' :
                    field.fieldType === 'date' ? 'bg-purple-100 text-purple-800' :
                    field.fieldType === 'select' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {field.fieldType}
                  </span>
                  {field.required && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 font-medium">Required</span>
                  )}
                </div>
                {field.defaultValue && (
                  <p className="text-sm text-gray-600 mt-1">Default: {field.defaultValue}</p>
                )}
                {field.options && (
                  <p className="text-sm text-gray-600 mt-1">Options: {field.options.join(', ')}</p>
                )}
              </div>
              <button className="text-red-600 hover:text-red-900">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Clauses */}
      <div className="border border-gray-200 bg-white">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Standard Contract Clauses</h4>
          <p className="text-sm text-gray-600">These clauses are included in every contract</p>
        </div>
        <div className="divide-y divide-gray-200">
          {settings.contractTemplate.standardClauses.map((clause, index) => (
            <div key={index} className="p-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-900">{clause}</p>
              </div>
              <button className="text-red-600 hover:text-red-900 ml-4">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button className="text-sm text-blue-600 hover:text-blue-900 flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Standard Clause
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'business' && renderBusinessTab()}
          {activeTab === 'territory' && renderTerritoryTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'pricing' && renderPricingTab()}
          {activeTab === 'seasonal' && renderSeasonalTab()}
          {activeTab === 'contract' && renderContractTab()}
        </div>
      </div>
    </div>
  );
}