'use client';

import { useState, useRef } from 'react';
import { 
  CameraIcon,
  PhotoIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ProcessedReceipt {
  receipt: {
    id: string;
    vendor: string;
    date: string;
    total: number;
    items: ReceiptItem[];
    confidence: number;
  };
  categorization: {
    category: string;
    subcategory: string;
    confidence: number;
    analysis: string;
    actions?: string[];
    error?: string;
    needsReview?: boolean;
    message?: string;
  };
  transaction?: {
    id: string;
    needsReview: boolean;
  };
}

interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export function ReceiptCapture() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedReceipt, setProcessedReceipt] = useState<ProcessedReceipt | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processReceipt(file);
    }
  };

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processReceipt(file);
    }
  };

  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setProcessedReceipt(null);

    // Show image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('location', location);
      formData.append('notes', notes);

      const response = await fetch('/api/receipts/process', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setProcessedReceipt(result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to process receipt');
      }
    } catch (error) {
      console.error('Receipt processing error:', error);
      setError('Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getActionBadge = (action: string) => {
    const badges = {
      'CREATE_ASSET': { text: 'Asset Created', color: 'bg-blue-100 text-blue-800', icon: WrenchScrewdriverIcon },
      'CREATE_JOURNAL_ENTRY': { text: 'Journal Entry', color: 'bg-purple-100 text-purple-800', icon: DocumentTextIcon },
      'UPDATE_INVENTORY': { text: 'Inventory Updated', color: 'bg-orange-100 text-orange-800', icon: DocumentTextIcon }
    };
    
    const badge = badges[action as keyof typeof badges];
    if (!badge) return null;

    const IconComponent = badge.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  const resetCapture = () => {
    setSelectedImage(null);
    setProcessedReceipt(null);
    setError(null);
    setLocation('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Capture Section */}
      {!selectedImage && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Capture Receipt</h2>
              <p className="text-gray-600">
                Take a photo or upload an image of your receipt for AI processing
              </p>
            </div>

            {/* Location Input */}
            <div className="mb-4 max-w-sm mx-auto">
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes Input */}
            <div className="mb-6 max-w-sm mx-auto">
              <div className="relative">
                <ChatBubbleLeftRightIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Capture Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                Take Photo
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <PhotoIcon className="w-5 h-5 mr-2" />
                Upload Image
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Instructions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CameraIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Clear Photo</span>
                </div>
                <p className="text-blue-700 mt-1">
                  Ensure good lighting and all text is visible
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DocumentTextIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">AI Extraction</span>
                </div>
                <p className="text-green-700 mt-1">
                  Claude Vision reads vendor, items, and totals
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-900">Auto Processing</span>
                </div>
                <p className="text-purple-700 mt-1">
                  Creates assets and journal entries automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && selectedImage && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <div className="mb-4">
              <img src={selectedImage} alt="Receipt" className="max-w-sm mx-auto rounded-lg shadow" />
            </div>
            <div className="flex items-center justify-center mb-4">
              <ArrowPathIcon className="animate-spin w-6 h-6 text-blue-600 mr-3" />
              <span className="text-lg font-medium text-gray-900">Processing with Claude Vision...</span>
            </div>
            <div className="text-gray-600">
              <p>📸 Extracting text from image...</p>
              <p>🤖 Categorizing with AI...</p>
              <p>📝 Creating transaction records...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="font-medium text-red-900">Processing Failed</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={resetCapture}
                className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {processedReceipt && (
        <div className="space-y-6">
          {/* Receipt Preview */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Receipt Processed</h3>
                <button
                  onClick={resetCapture}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Process Another
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Receipt Image */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Original Receipt</h4>
                  {selectedImage && (
                    <img src={selectedImage} alt="Receipt" className="w-full max-w-sm rounded-lg shadow border" />
                  )}
                </div>

                {/* Extracted Data */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Extracted Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-20 text-sm text-gray-500">Vendor:</span>
                      <span className="font-medium">{processedReceipt.receipt.vendor}</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(processedReceipt.receipt.confidence)}`}>
                        {Math.round(processedReceipt.receipt.confidence * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="w-16 text-sm text-gray-500">Date:</span>
                      <span>{formatDate(processedReceipt.receipt.date)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="w-16 text-sm text-gray-500">Total:</span>
                      <span className="font-semibold text-lg">{formatCurrency(processedReceipt.receipt.total)}</span>
                    </div>
                  </div>

                  {/* Items */}
                  {processedReceipt.receipt.items && processedReceipt.receipt.items.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Items</h5>
                      <div className="space-y-1">
                        {processedReceipt.receipt.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.quantity}x {item.description}
                              {item.category && (
                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                  {item.category}
                                </span>
                              )}
                            </span>
                            <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Categorization Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Categorization</h3>
            
            {processedReceipt.categorization.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">{processedReceipt.categorization.error}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Category</div>
                    <div className="font-medium">{processedReceipt.categorization.category}</div>
                    <div className="text-sm text-gray-600">{processedReceipt.categorization.subcategory}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">AI Confidence</div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getConfidenceColor(processedReceipt.categorization.confidence)}`}>
                      {Math.round(processedReceipt.categorization.confidence * 100)}% confident
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">AI Analysis</div>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
                    {processedReceipt.categorization.analysis}
                  </p>
                </div>

                {/* Actions Taken */}
                {processedReceipt.categorization.actions && processedReceipt.categorization.actions.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Actions Taken</div>
                    <div className="flex flex-wrap gap-2">
                      {processedReceipt.categorization.actions.map((action, index) => (
                        <div key={index}>
                          {getActionBadge(action)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Status */}
                <div className="border-t border-gray-200 pt-4">
                  {processedReceipt.categorization.needsReview || processedReceipt.transaction?.needsReview ? (
                    <div className="flex items-center text-yellow-600">
                      <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                      <span className="font-medium">Manual review recommended</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      <span className="font-medium">Automatically processed and recorded</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}