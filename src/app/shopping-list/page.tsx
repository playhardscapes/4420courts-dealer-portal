'use client';

import { Suspense } from 'react';
import { ShoppingListManagement } from './components/ShoppingListManagement';

export default function ShoppingListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 font-orbitron">
                Shopping List
              </h1>
              <div className="ml-4 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                8 Items Pending
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Item
              </button>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Export List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-8">Loading shopping list...</div>}>
          <ShoppingListManagement />
        </Suspense>
      </div>
    </div>
  );
}