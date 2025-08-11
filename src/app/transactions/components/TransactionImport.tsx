'use client';

import { useState, useRef } from 'react';
import { 
  CloudArrowUpIcon,
  DocumentArrowUpIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CogIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface ImportSummary {
  totalTransactions: number;
  categorized: number;
  needsReview: number;
  assetsCreated: number;
  billsMatched: number;
  journalEntries: number;
}

interface ProcessedTransaction {
  transaction: {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    subcategory: string;
    confidence: number;
    needsReview: boolean;
    processed: boolean;
  };
  result: {
    category: string;
    analysis: string;
    actions?: string[];
    error?: string;
  };
}

export function TransactionImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    summary: ImportSummary;
    transactions: ProcessedTransaction[];
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bankAccount, setBankAccount] = useState<'bluevine' | 'amex'>('bluevine');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('bankAccount', bankAccount);

      const response = await fetch('/api/transactions/import', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const results = await response.json();
        setImportResults(results);
      } else {
        const error = await response.json();
        alert(`Import failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ASSET_PURCHASE':
        return <WrenchScrewdriverIcon className="w-5 h-5" />;
      case 'COST_OF_GOODS_SOLD':
        return <ChartBarIcon className="w-5 h-5" />;
      case 'OPERATING_EXPENSE':
        return <CogIcon className="w-5 h-5" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5" />;
    }
  };

  const getActionBadge = (action: string) => {
    const badges = {
      'CREATE_ASSET': { text: 'Asset Created', color: 'bg-blue-100 text-blue-800' },
      'MATCH_BILL': { text: 'Bill Matched', color: 'bg-green-100 text-green-800' },
      'CREATE_JOURNAL_ENTRY': { text: 'Journal Entry', color: 'bg-purple-100 text-purple-800' },
      'UPDATE_INVENTORY': { text: 'Inventory Updated', color: 'bg-orange-100 text-orange-800' }
    };
    
    const badge = badges[action as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Import Bank Transactions</h2>
            <p className="text-gray-600 mt-1">
              Upload your bank CSV files for AI-powered categorization and automatic asset creation
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBankAccount('bluevine')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  bankAccount === 'bluevine' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BanknotesIcon className="w-4 h-4 mr-2" />
                Bluevine
              </button>
              <button
                onClick={() => setBankAccount('amex')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  bankAccount === 'amex' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CreditCardIcon className="w-4 h-4 mr-2" />
                AmEx
              </button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedFile ? selectedFile.name : `Upload ${bankAccount === 'bluevine' ? 'Bluevine' : 'AmEx'} CSV File`}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {bankAccount === 'bluevine' 
                  ? 'Expected format: Date, Description, Amount, Balance, Transaction Type'
                  : 'Expected format: Date, Description, Card Member, Account #, Amount'
                }
              </p>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                Select File
              </button>
              
              {selectedFile && (
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Import & Categorize
                    </>
                  )}
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* AI Features Explanation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">Auto Asset Creation</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Tool purchases from Lowes/HD automatically become assets
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ChartBarIcon className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-green-900">Bill Matching</h4>
                <p className="text-sm text-green-700 mt-1">
                  ICP payments automatically mark bills as paid
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CogIcon className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <h4 className="font-medium text-purple-900">Smart Categorization</h4>
                <p className="text-sm text-purple-700 mt-1">
                  AI categorizes expenses (COGS, Operating, etc.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentArrowUpIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Imported</h3>
                  <p className="text-2xl font-bold text-gray-900">{importResults.summary.totalTransactions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">AI Categorized</h3>
                  <p className="text-2xl font-bold text-gray-900">{importResults.summary.categorized}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Needs Review</h3>
                  <p className="text-2xl font-bold text-gray-900">{importResults.summary.needsReview}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Assets Created</h3>
                  <p className="text-2xl font-bold text-gray-900">{importResults.summary.assetsCreated}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Bills Matched</h3>
                  <p className="text-2xl font-bold text-gray-900">{importResults.summary.billsMatched}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Journal Entries</h3>
                  <p className="text-2xl font-bold text-gray-900">{importResults.summary.journalEntries}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Processed Transactions</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Actions</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importResults.transactions.map((item, index) => (
                    <tr key={index} className={item.transaction.needsReview ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.transaction.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            {getCategoryIcon(item.transaction.category)}
                          </div>
                          <div>
                            <div className="font-medium">{item.transaction.description}</div>
                            <div className="text-xs text-gray-500">{item.result.analysis}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.transaction.category}</div>
                          <div className="text-xs text-gray-500">{item.transaction.subcategory}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(item.transaction.confidence)}`}>
                          {Math.round(item.transaction.confidence * 100)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {item.result.actions?.map((action, i) => (
                            <div key={i}>
                              {getActionBadge(action)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.transaction.needsReview ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                            Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}