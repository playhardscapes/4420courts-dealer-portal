'use client';

import { Suspense } from 'react';
import { SupplierManagement } from './components/SupplierManagement';

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 font-orbitron">
                Supplier Management
              </h1>
              <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                6 Active Suppliers
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Supplier
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
        <Suspense fallback={<div className="text-center py-8">Loading supplier data...</div>}>
          <SupplierManagement />
        </Suspense>
      </div>
    </div>
  );
}