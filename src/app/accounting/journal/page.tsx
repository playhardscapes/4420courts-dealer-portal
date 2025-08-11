'use client';

import { useState } from 'react';
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  reference?: string;
  debitAccountId: string;
  debitAccount: string;
  creditAccountId: string;
  creditAccount: string;
  amount: number;
  source: 'manual' | 'ai_categorized' | 'bank_import' | 'automatic';
  createdBy: string;
  createdAt: string;
  attachments?: string[];
}

const sampleJournalEntries: JournalEntry[] = [
  {
    id: '1',
    entryNumber: 'JE-2025-001',
    date: '2025-01-28',
    description: 'Customer payment - Invoice INV-2025-001',
    reference: 'INV-2025-001',
    debitAccount: 'Cash',
    creditAccount: 'Accounts Receivable',
    debitAccountId: '1001',
    creditAccountId: '1100',
    amount: 6250,
    source: 'manual',
    createdBy: 'John Doe',
    createdAt: '2025-01-28T10:30:00Z'
  },
  {
    id: '2',
    entryNumber: 'JE-2025-002',
    date: '2025-01-29',
    description: 'Material purchase - concrete supplies',
    reference: 'PO-001',
    debitAccount: 'Cost of Goods Sold',
    creditAccount: 'Accounts Payable',
    debitAccountId: '5000',
    creditAccountId: '2000',
    amount: 1500,
    source: 'ai_categorized',
    createdBy: 'AI Assistant',
    createdAt: '2025-01-29T14:15:00Z'
  },
  {
    id: '3',
    entryNumber: 'JE-2025-003',
    date: '2025-01-30',
    description: 'Equipment rental - concrete mixer',
    reference: 'EXP-001',
    debitAccount: 'Operating Expenses',
    creditAccount: 'Cash',
    debitAccountId: '6200',
    creditAccountId: '1001',
    amount: 250,
    source: 'bank_import',
    createdBy: 'Bank Import',
    createdAt: '2025-01-30T09:45:00Z'
  }
];

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
}

const chartOfAccounts: Account[] = [
  { id: '1001', code: '1001', name: 'Cash', type: 'ASSET', balance: 25000 },
  { id: '1100', code: '1100', name: 'Accounts Receivable', type: 'ASSET', balance: 15000 },
  { id: '1200', code: '1200', name: 'Inventory', type: 'ASSET', balance: 8000 },
  { id: '1500', code: '1500', name: 'Equipment', type: 'ASSET', balance: 12000 },
  { id: '2000', code: '2000', name: 'Accounts Payable', type: 'LIABILITY', balance: 7500 },
  { id: '2100', code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY', balance: 2100 },
  { id: '3000', code: '3000', name: 'Owners Equity', type: 'EQUITY', balance: 45000 },
  { id: '4000', code: '4000', name: 'Product Sales', type: 'REVENUE', balance: 0 },
  { id: '4100', code: '4100', name: 'Service Revenue', type: 'REVENUE', balance: 0 },
  { id: '5000', code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE', balance: 0 },
  { id: '6200', code: '6200', name: 'Operating Expenses', type: 'EXPENSE', balance: 0 }
];

const getSourceColor = (source: string) => {
  switch (source) {
    case 'manual':
      return 'bg-blue-100 text-blue-800';
    case 'ai_categorized':
      return 'bg-purple-100 text-purple-800';
    case 'bank_import':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(sampleJournalEntries);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    debitAccountId: '',
    creditAccountId: '',
    amount: 0
  });

  // AI helper state
  const [aiInput, setAiInput] = useState('');

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.debitAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.creditAccount.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = !filterSource || entry.source === filterSource;
    
    const matchesDateRange = !filterDateRange || (
      filterDateRange === 'this_month' && new Date(entry.date) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ) || (
      filterDateRange === 'last_month' && 
      new Date(entry.date) >= new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1) &&
      new Date(entry.date) < new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    
    return matchesSearch && matchesSource && matchesDateRange;
  });

  const handleCreateEntry = async () => {
    setIsLoading(true);
    try {
      const debitAccount = chartOfAccounts.find(acc => acc.id === formData.debitAccountId);
      const creditAccount = chartOfAccounts.find(acc => acc.id === formData.creditAccountId);
      
      if (!debitAccount || !creditAccount) {
        alert('Please select both debit and credit accounts');
        return;
      }

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        entryNumber: `JE-2025-${String(journalEntries.length + 1).padStart(3, '0')}`,
        date: formData.date,
        description: formData.description,
        reference: formData.reference,
        debitAccountId: formData.debitAccountId,
        debitAccount: debitAccount.name,
        creditAccountId: formData.creditAccountId,
        creditAccount: creditAccount.name,
        amount: formData.amount,
        source: 'manual',
        createdBy: 'Current User',
        createdAt: new Date().toISOString()
      };
      
      setJournalEntries([newEntry, ...journalEntries]);
      setShowNewEntryForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      setIsLoading(true);
      try {
        setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
      } catch (error) {
        console.error('Error deleting journal entry:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      debitAccountId: '',
      creditAccountId: '',
      amount: 0
    });
  };

  const handleAIHelp = async () => {
    setIsLoading(true);
    try {
      // Simulate AI assistance for categorization
      let debitAccountId = '';
      let creditAccountId = '';
      let suggestedDescription = aiInput;

      if (aiInput.toLowerCase().includes('payment') || aiInput.toLowerCase().includes('received')) {
        debitAccountId = '1001'; // Cash
        creditAccountId = '1100'; // Accounts Receivable
        suggestedDescription = 'Customer payment received';
      } else if (aiInput.toLowerCase().includes('material') || aiInput.toLowerCase().includes('supply') || aiInput.toLowerCase().includes('purchase')) {
        debitAccountId = '5000'; // Cost of Goods Sold
        creditAccountId = '2000'; // Accounts Payable
        suggestedDescription = 'Material/supply purchase';
      } else if (aiInput.toLowerCase().includes('expense') || aiInput.toLowerCase().includes('rental') || aiInput.toLowerCase().includes('office')) {
        debitAccountId = '6200'; // Operating Expenses
        creditAccountId = '1001'; // Cash
        suggestedDescription = 'Operating expense payment';
      } else if (aiInput.toLowerCase().includes('sale') || aiInput.toLowerCase().includes('revenue') || aiInput.toLowerCase().includes('invoice')) {
        debitAccountId = '1100'; // Accounts Receivable
        creditAccountId = '4000'; // Product Sales
        suggestedDescription = 'Product sale';
      } else if (aiInput.toLowerCase().includes('service')) {
        debitAccountId = '1100'; // Accounts Receivable
        creditAccountId = '4100'; // Service Revenue
        suggestedDescription = 'Service revenue';
      }

      // Extract amount if present
      const amountMatch = aiInput.match(/\$?([0-9,]+\.?[0-9]*)/g);
      const extractedAmount = amountMatch ? parseFloat(amountMatch[0].replace(/[,$]/g, '')) : 0;

      setFormData({
        ...formData,
        debitAccountId,
        creditAccountId,
        description: suggestedDescription,
        amount: extractedAmount
      });
      
      setShowAIHelper(false);
      setAiInput('');
    } catch (error) {
      console.error('Error with AI categorization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
            <p className="text-gray-600">Record and manage accounting transactions with AI assistance</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAIHelper(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
            >
              <SparklesIcon className="h-4 w-4" />
              AI Categorize
            </button>
            <button 
              onClick={() => setShowNewEntryForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {journalEntries.filter(entry => new Date(entry.date) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length}
          </div>
          <div className="text-sm text-gray-600">Entries This Month</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            ${journalEntries.reduce((sum, entry) => sum + entry.amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Debits</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            ${journalEntries.reduce((sum, entry) => sum + entry.amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Credits</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-purple-600">
            {journalEntries.filter(entry => entry.source === 'ai_categorized').length}
          </div>
          <div className="text-sm text-gray-600">AI Categorized</div>
        </div>
      </div>

      {/* AI Helper Modal */}
      {showAIHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <SparklesIcon className="h-6 w-6 text-purple-600" />
                  AI Transaction Categorizer
                </h2>
                <button 
                  onClick={() => setShowAIHelper(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Transaction Details
                  </label>
                  <textarea 
                    placeholder="Paste bank transaction details, receipt info, or describe the transaction..."
                    rows={4}
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">How AI Categorization Works:</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Analyzes transaction descriptions and amounts</li>
                    <li>• Suggests appropriate debit and credit accounts</li>
                    <li>• Learns from your previous categorizations</li>
                    <li>• Handles common business transactions automatically</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setShowAIHelper(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAIHelp}
                  disabled={isLoading || !aiInput.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isLoading ? 'Analyzing...' : 'Categorize with AI'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Journal Entry Form */}
      {showNewEntryForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">New Journal Entry</h2>
            <button 
              onClick={() => setShowNewEntryForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description of the transaction"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                <input 
                  type="text" 
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                  placeholder="Invoice #, PO #, etc."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    className="w-full pl-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Debit Account</label>
                <select 
                  value={formData.debitAccountId}
                  onChange={(e) => setFormData({...formData, debitAccountId: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select debit account</option>
                  {chartOfAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credit Account</label>
                <select 
                  value={formData.creditAccountId}
                  onChange={(e) => setFormData({...formData, creditAccountId: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select credit account</option>
                  {chartOfAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Double-Entry Check:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>Debit: {chartOfAccounts.find(acc => acc.id === formData.debitAccountId)?.name || 'Not selected'} ${formData.amount.toLocaleString()}</div>
                  <div>Credit: {chartOfAccounts.find(acc => acc.id === formData.creditAccountId)?.name || 'Not selected'} ${formData.amount.toLocaleString()}</div>
                  <div className="font-medium mt-2">
                    Balance: {formData.debitAccountId && formData.creditAccountId && formData.amount ? '✓ Balanced' : '⚠ Not balanced'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => {
                setShowNewEntryForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => setShowAIHelper(true)}
              className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
            >
              Use AI Helper
            </button>
            <button 
              onClick={handleCreateEntry}
              disabled={isLoading || !formData.description || !formData.debitAccountId || !formData.creditAccountId || !formData.amount}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Entry'}
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="">All Sources</option>
              <option value="manual">Manual</option>
              <option value="ai_categorized">AI Categorized</option>
              <option value="bank_import">Bank Import</option>
              <option value="automatic">Automatic</option>
            </select>
            <select 
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="">All Time</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Journal Entries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Journal Entries ({filteredEntries.length})</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.entryNumber}</div>
                      <div className="text-sm text-gray-500">{entry.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{entry.description}</div>
                    {entry.reference && (
                      <div className="text-sm text-gray-500">Ref: {entry.reference}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.debitAccount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.creditAccount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${entry.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(entry.source)}`}>
                      {entry.source.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedEntry(entry)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900" title="Edit">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-900" 
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Journal Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Journal Entry - {selectedEntry.entryNumber}
                </h2>
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Entry Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Entry Number:</span>
                      <span className="ml-2 font-medium">{selectedEntry.entryNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2">{selectedEntry.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Description:</span>
                      <span className="ml-2">{selectedEntry.description}</span>
                    </div>
                    {selectedEntry.reference && (
                      <div>
                        <span className="text-gray-500">Reference:</span>
                        <span className="ml-2">{selectedEntry.reference}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Source:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSourceColor(selectedEntry.source)}`}>
                        {selectedEntry.source.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created By:</span>
                      <span className="ml-2">{selectedEntry.createdBy}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Double-Entry Details</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Debit Entry</h4>
                      <div className="text-sm">
                        <div className="text-green-800">
                          {chartOfAccounts.find(acc => acc.id === selectedEntry.debitAccountId)?.code} - {selectedEntry.debitAccount}
                        </div>
                        <div className="font-bold text-green-900">${selectedEntry.amount.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-2">Credit Entry</h4>
                      <div className="text-sm">
                        <div className="text-red-800">
                          {chartOfAccounts.find(acc => acc.id === selectedEntry.creditAccountId)?.code} - {selectedEntry.creditAccount}
                        </div>
                        <div className="font-bold text-red-900">${selectedEntry.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Entry Summary</h3>
                <div className="text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Total Debits:</span>
                    <span className="font-medium">${selectedEntry.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Credits:</span>
                    <span className="font-medium">${selectedEntry.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t border-blue-300">
                    <span className="font-medium">Balance:</span>
                    <span className="font-medium text-green-600">✓ Balanced</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}