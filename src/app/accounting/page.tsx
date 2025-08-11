import { Suspense } from 'react';
import Link from 'next/link';
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const accountingModules = [
  {
    name: 'Chart of Accounts',
    description: 'Manage your complete chart of accounts with hierarchical structure',
    icon: BookOpenIcon,
    href: '/accounting/accounts',
    color: 'bg-blue-500',
    stats: { count: '85 accounts', status: 'Active' }
  },
  {
    name: 'Journal Entries',
    description: 'Create and manage double-entry bookkeeping transactions',
    icon: DocumentTextIcon,
    href: '/accounting/journal',
    color: 'bg-green-500',
    stats: { count: '23 entries', status: 'This month' }
  },
  {
    name: 'Financial Reports',
    description: 'Generate P&L, Balance Sheet, and custom financial reports',
    icon: ChartBarIcon,
    href: '/accounting/reports',
    color: 'bg-purple-500',
    stats: { count: '5 reports', status: 'Available' }
  },
  {
    name: 'Trial Balance',
    description: 'View trial balance and verify your books are in balance',
    icon: CalculatorIcon,
    href: '/accounting/trial-balance',
    color: 'bg-orange-500',
    stats: { count: 'Balanced', status: 'Current' }
  },
  {
    name: 'Commission Tracking',
    description: 'Track dealer commissions and payment schedules',
    icon: CurrencyDollarIcon,
    href: '/accounting/commissions',
    color: 'bg-emerald-500',
    stats: { count: '$12,500', status: 'Pending' }
  },
  {
    name: 'Tax Center',
    description: 'Manage sales tax, reporting, and compliance',
    icon: DocumentChartBarIcon,
    href: '/accounting/tax',
    color: 'bg-red-500',
    stats: { count: '$2,500', status: 'Due' }
  },
];

export default function AccountingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 font-orbitron">
                Accounting Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/accounting/journal"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Journal Entry
              </Link>
              <Link
                href="/accounting/reports"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Generate Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Assets</h3>
                <p className="text-2xl font-bold text-green-600">$97,000</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Liabilities</h3>
                <p className="text-2xl font-bold text-red-600">$10,500</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">$170,000</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CalculatorIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Net Income</h3>
                <p className="text-2xl font-bold text-orange-600">$82,500</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accounting Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountingModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link key={module.name} href={module.href}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">{module.stats.status}</p>
                        <p className="text-lg font-bold text-gray-900">{module.stats.count}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {module.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {module.description}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Click to access
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Accounting Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Customer payment received</p>
                    <p className="text-xs text-gray-500">Order #1001 - $1,395.00</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Commission calculated</p>
                    <p className="text-xs text-gray-500">Dealer PCS001 - $139.50</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Monthly report generated</p>
                    <p className="text-xs text-gray-500">P&L Statement - January 2025</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}