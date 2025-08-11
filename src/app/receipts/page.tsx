import { Suspense } from 'react';
import { ReceiptCapture } from './components/ReceiptCapture';

export default function ReceiptsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 font-orbitron">
                📷 Receipt Capture
              </h1>
              <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                AI Vision Powered
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Snap → Extract → Categorize → Enter
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-8">Loading receipt capture...</div>}>
          <ReceiptCapture />
        </Suspense>
      </div>
    </div>
  );
}