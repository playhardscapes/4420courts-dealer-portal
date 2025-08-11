import { CalendarIcon, UserGroupIcon, ChartBarIcon, CogIcon, BookOpenIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Accounting System',
    description: 'Complete double-entry bookkeeping with Chart of Accounts, Journal Entries, and Financial Reports.',
    icon: BookOpenIcon,
    href: '/accounting',
    color: 'bg-emerald-500',
  },
  {
    name: 'Commission Tracking',
    description: 'Track dealer commissions, territory performance, and payment schedules.',
    icon: CurrencyDollarIcon,
    href: '/commissions',
    color: 'bg-green-500',
  },
  {
    name: 'Calendar & Scheduling',
    description: 'Manage consultations, site visits, and project timelines in one place.',
    icon: CalendarIcon,
    href: '/calendar',
    color: 'bg-blue-500',
  },
  {
    name: 'Customer Management',
    description: 'Track leads, manage customer relationships, and monitor project progress.',
    icon: UserGroupIcon,
    href: '/customers',
    color: 'bg-purple-500',
  },
  {
    name: 'Analytics & Reports',
    description: 'View performance metrics, revenue tracking, and territory insights.',
    icon: ChartBarIcon,
    href: '/analytics',
    color: 'bg-orange-500',
  },
  {
    name: 'Business Settings',
    description: 'Configure your territory, pricing, and operational preferences.',
    icon: CogIcon,
    href: '/settings',
    color: 'bg-gray-500',
  },
];

export default function DealerPortalHome() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 font-orbitron">
                Dealer Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Welcome back!</span>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Build Your Court Business
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Everything you need to manage customers, schedule consultations, and grow your 4420 Courts franchise territory.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">12</div>
            <div className="text-gray-600">Active Projects</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">$24,500</div>
            <div className="text-gray-600">Monthly Revenue</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">8</div>
            <div className="text-gray-600">This Week's Calls</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">94%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Manage Your Business
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access all the tools you need to run a successful 4420 Courts franchise territory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.name} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.name}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <a
                      href={feature.href}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg ${feature.color} hover:opacity-90 transition-opacity`}
                    >
                      Get Started
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}