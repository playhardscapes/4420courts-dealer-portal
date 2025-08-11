'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CubeIcon,
  ShoppingCartIcon,
  BuildingOfficeIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Customers', href: '/customers', icon: UserGroupIcon },
  { name: 'Prospects', href: '/prospects', icon: ChatBubbleLeftRightIcon },
  { name: 'Quotes', href: '/quotes', icon: DocumentTextIcon },
  { name: 'Contracts', href: '/contracts', icon: DocumentDuplicateIcon },
  { name: 'Projects', href: '/projects', icon: WrenchScrewdriverIcon },
  { name: 'Invoices', href: '/invoices', icon: BanknotesIcon },
  { 
    name: 'AI Transactions', 
    href: '/transactions', 
    icon: CpuChipIcon,
    badge: 'AI',
    children: [
      { name: 'Import & Categorize', href: '/transactions' },
      { name: 'Review Transactions', href: '/transactions/review' },
      { name: 'Bills & Payments', href: '/transactions/bills' }
    ]
  },
  { 
    name: '📷 Receipt Capture', 
    href: '/receipts', 
    icon: CameraIcon,
    badge: 'NEW',
    children: [
      { name: 'Capture Receipts', href: '/receipts' },
      { name: 'Receipt History', href: '/receipts/history' }
    ]
  },
  { 
    name: 'Asset Management', 
    href: '/assets', 
    icon: CubeIcon,
    children: [
      { name: 'Assets', href: '/assets' },
      { name: 'Suppliers', href: '/suppliers' },
      { name: 'Shopping List', href: '/shopping-list' },
      { name: 'Maintenance', href: '/maintenance' }
    ]
  },
  { 
    name: 'Accounting', 
    href: '/accounting', 
    icon: BookOpenIcon,
    children: [
      { name: 'Chart of Accounts', href: '/accounting/accounts' },
      { name: 'Journal Entries', href: '/accounting/journal' },
      { name: 'Financial Reports', href: '/accounting/reports' },
      { name: 'Import Data', href: '/accounting/import' }
    ]
  },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export function SidebarNavigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Accounting']);
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 shrink-0 items-center justify-between px-6 shadow-sm">
              <img className="h-6 w-auto max-w-32" src="/4420courtslogowide.jpg" alt="4420 Courts" />
              <button
                type="button"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
              <ul className="flex flex-1 flex-col gap-y-2">
                {navigation.map((item) => {
                  const hasChildren = 'children' in item && item.children;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const isExpanded = expandedItems.includes(item.name);
                  
                  return (
                    <li key={item.name}>
                      {hasChildren ? (
                        <div>
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className={`group flex w-full justify-between items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                              isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                          >
                            <div className="flex items-center gap-x-3">
                              <item.icon className="h-6 w-6 shrink-0" />
                              {item.name}
                            </div>
                            {isExpanded ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4" />
                            )}
                          </button>
                          {isExpanded && (
                            <ul className="mt-1 ml-6 space-y-1">
                              {item.children?.map((child) => {
                                const childIsActive = pathname === child.href;
                                return (
                                  <li key={child.name}>
                                    <Link
                                      href={child.href}
                                      className={`block rounded-md px-3 py-2 text-sm ${
                                        childIsActive
                                          ? 'bg-blue-50 text-blue-600 font-medium'
                                          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                      }`}
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      {child.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 py-4">
          <div className="flex h-16 shrink-0 items-center">
            <img className="h-6 w-auto max-w-32" src="/4420courtslogowide.jpg" alt="4420 Courts" />
            <div className="ml-3">
              <h1 className="text-sm font-bold text-gray-900">Dealer Portal</h1>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const hasChildren = 'children' in item && item.children;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const isExpanded = expandedItems.includes(item.name);
                
                return (
                  <li key={item.name}>
                    {hasChildren ? (
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={`group flex w-full justify-between items-center gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          <div className="flex items-center gap-x-3">
                            <item.icon className="h-6 w-6 shrink-0" />
                            {item.name}
                          </div>
                          {isExpanded ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </button>
                        {isExpanded && (
                          <ul className="mt-1 ml-9 space-y-1">
                            {item.children?.map((child) => {
                              const childIsActive = pathname === child.href;
                              return (
                                <li key={child.name}>
                                  <Link
                                    href={child.href}
                                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                      childIsActive
                                        ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* User info at bottom */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">D</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Dealer User</p>
                <p className="text-xs text-gray-500">dealer@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
        <button
          type="button"
          className="text-gray-700 hover:text-gray-900"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <div className="flex flex-1 items-center justify-between">
          <img className="h-6 w-auto max-w-32" src="/4420courtslogowide.jpg" alt="4420 Courts" />
          <div className="text-sm font-medium text-gray-900">Dealer Portal</div>
        </div>
      </div>
    </>
  );
}