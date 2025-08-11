'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Customer, getAllCustomers, getCustomerDisplayName, getCustomerEmail, getProjectAddress, getBillingContactName } from '../../data/customers';

interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customer: string;
  email: string;
  serviceLevel: string;
  estimatedPrice: number;
  status: 'draft' | 'pending' | 'accepted' | 'rejected' | 'expired';
  createdDate: string;
  validUntil: string;
  description: string;
  propertyDetails?: {
    address: string;
    spaceSize: string;
    currentSurface: string;
    timeline: string;
    specialRequirements: string;
  };
}

const sampleQuotes: Quote[] = [];

const serviceLevels = [
  { value: 'level1', label: 'Level 1 - Free DIY Resources ($0)', price: 0 },
  { value: 'level2', label: 'Level 2 - Monthly Membership ($49.99/month)', price: 49.99 },
  { value: 'level3', label: 'Level 3 - Coating & Lining Specialist ($10k-15k)', price: 12500 },
  { value: 'level4', label: 'Level 4 - Project Management + Finish ($15k-25k)', price: 20000 },
  { value: 'level5', label: 'Level 5 - Full Project Management ($30k-45k)', price: 37500 },
  { value: 'level5.5', label: 'Level 5.5 - Premium Personalized (Custom)', price: 0 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'expired':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <ClockIcon className="h-4 w-4" />;
    case 'accepted':
      return <CheckCircleIcon className="h-4 w-4" />;
    case 'rejected':
      return <XCircleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(sampleQuotes);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClaudeAssistant, setShowClaudeAssistant] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    customerName: '',
    email: '',
    phone: '',
    projectAddress: '',
    courtType: '',
    spaceSize: '',
    currentSurface: '',
    specialRequirements: '',
    timeline: '',
    budget: ''
  });
  const [claudeConversation, setClaudeConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    propertyAddress: '',
    spaceSize: '',
    currentSurface: '',
    timeline: '',
    specialRequirements: '',
    serviceLevel: '',
    description: ''
  });

  // Load all customers from shared data source
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
  }, []);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || quote.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateQuote = async () => {
    setIsLoading(true);
    try {
      // AI-powered quote generation would happen here
      const selectedLevel = serviceLevels.find(l => l.value === formData.serviceLevel);
      const basePrice = selectedLevel?.price || 0;
      
      // Simulate AI pricing logic
      let finalPrice = basePrice;
      if (formData.spaceSize.includes('60')) finalPrice *= 1.2; // Larger space
      if (formData.currentSurface === 'grass') finalPrice *= 1.3; // More prep needed
      if (formData.specialRequirements.toLowerCase().includes('lighting')) finalPrice += 5000;
      if (formData.specialRequirements.toLowerCase().includes('custom')) finalPrice += 3000;

      const newQuote: Quote = {
        id: Date.now().toString(),
        quoteNumber: `Q-2025-${String(quotes.length + 1).padStart(3, '0')}`,
        customerId: formData.customerId || Date.now().toString(),
        customer: formData.customerName,
        email: formData.customerEmail,
        serviceLevel: selectedLevel?.label || '',
        estimatedPrice: Math.round(finalPrice),
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        description: formData.description,
        propertyDetails: {
          address: formData.propertyAddress,
          spaceSize: formData.spaceSize,
          currentSurface: formData.currentSurface,
          timeline: formData.timeline,
          specialRequirements: formData.specialRequirements
        }
      };
      
      setQuotes([newQuote, ...quotes]);
      setShowNewQuoteForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: Quote['status']) => {
    setIsLoading(true);
    try {
      setQuotes(quotes.map(q => 
        q.id === quoteId 
          ? { ...q, status: newStatus }
          : q
      ));
    } catch (error) {
      console.error('Error updating quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setIsLoading(true);
      try {
        setQuotes(quotes.filter(q => q.id !== quoteId));
      } catch (error) {
        console.error('Error deleting quote:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setProjectDetails({
      customerName: quote.customer,
      email: quote.email,
      phone: '',
      projectAddress: quote.propertyDetails?.address || '',
      courtType: '',
      spaceSize: quote.propertyDetails?.spaceSize || '',
      currentSurface: quote.propertyDetails?.currentSurface || '',
      specialRequirements: quote.propertyDetails?.specialRequirements || '',
      timeline: quote.propertyDetails?.timeline || '',
      budget: quote.estimatedPrice.toString()
    });
    setShowNewQuoteForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingQuote) return;
    
    setIsLoading(true);
    try {
      const updatedQuote: Quote = {
        ...editingQuote,
        customer: projectDetails.customerName,
        email: projectDetails.email,
        estimatedPrice: parseInt(projectDetails.budget) || 0,
        description: projectDetails.specialRequirements,
        propertyDetails: {
          address: projectDetails.projectAddress,
          spaceSize: projectDetails.spaceSize,
          currentSurface: projectDetails.currentSurface,
          timeline: projectDetails.timeline,
          specialRequirements: projectDetails.specialRequirements
        }
      };
      
      setQuotes(quotes.map(q => q.id === editingQuote.id ? updatedQuote : q));
      setEditingQuote(null);
      setShowNewQuoteForm(false);
      resetForm();
    } catch (error) {
      console.error('Error updating quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      customerEmail: '',
      propertyAddress: '',
      spaceSize: '',
      currentSurface: '',
      timeline: '',
      specialRequirements: '',
      serviceLevel: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
              <p className="text-gray-600">Create and manage project quotes with AI assistance</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowClaudeAssistant(true)}
                className="bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 flex items-center gap-2 border border-purple-600"
              >
                <SparklesIcon className="h-4 w-4" />
                Claude Assistant
              </button>
              <button 
                onClick={() => setShowNewQuoteForm(true)}
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 flex items-center gap-2 border border-blue-600"
              >
                <PlusIcon className="h-4 w-4" />
                New Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">{quotes.length}</div>
          <div className="text-sm text-gray-600">Total Quotes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            ${quotes.reduce((sum, q) => sum + q.estimatedPrice, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {quotes.filter(q => q.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {quotes.length > 0 ? Math.round((quotes.filter(q => q.status === 'accepted').length / quotes.length) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Acceptance Rate</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Quote Generator Section */}
      {showNewQuoteForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">AI-Powered Quote Generator</h2>
            <button 
              onClick={() => setShowNewQuoteForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer *</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => {
                    const selectedCustomer = customers.find(c => c.id === e.target.value);
                    if (selectedCustomer) {
                      const projectAddress = getProjectAddress(selectedCustomer);
                      setFormData({
                        ...formData,
                        customerId: selectedCustomer.id,
                        customerName: getCustomerDisplayName(selectedCustomer),
                        customerEmail: getCustomerEmail(selectedCustomer),
                        // Prefill project address from customer data
                        propertyAddress: `${projectAddress.street}, ${projectAddress.city}, ${projectAddress.state} ${projectAddress.zipCode}`.trim()
                      });
                    } else {
                      setFormData({
                        ...formData,
                        customerId: '',
                        customerName: '',
                        customerEmail: ''
                      });
                    }
                  }}
                  className="w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a customer...</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {getCustomerDisplayName(customer)} - {getCustomerEmail(customer)}
                      {customer.organizationType && customer.organizationType !== 'INDIVIDUAL' ? ` (${customer.organizationType})` : ''}
                    </option>
                  ))}
                </select>
                {formData.customerId && (() => {
                  const selectedCustomer = customers.find(c => c.id === formData.customerId);
                  return selectedCustomer ? (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-medium text-blue-800">Selected Customer</p>
                      <div className="text-sm text-blue-700 mt-1">
                        <div><strong>{getCustomerDisplayName(selectedCustomer)}</strong></div>
                        <div>Email: {getCustomerEmail(selectedCustomer)}</div>
                        {selectedCustomer.primaryContact.phone && (
                          <div>Phone: {selectedCustomer.primaryContact.phone}</div>
                        )}
                        {selectedCustomer.organizationType && selectedCustomer.organizationType !== 'INDIVIDUAL' && (
                          <div>Type: {selectedCustomer.organizationType}</div>
                        )}
                        {selectedCustomer.projectAddress && (
                          <div className="mt-1">
                            <strong>Project Location:</strong><br/>
                            {selectedCustomer.projectAddress.street}<br/>
                            {selectedCustomer.projectAddress.city}, {selectedCustomer.projectAddress.state} {selectedCustomer.projectAddress.zipCode}
                          </div>
                        )}
                        {selectedCustomer.billingContact && (
                          <div className="mt-1">
                            <strong>Billing Contact:</strong> {getBillingContactName(selectedCustomer)}
                          </div>
                        )}
                        {selectedCustomer.notes && (
                          <div className="mt-1 text-xs text-blue-600">
                            <strong>Notes:</strong> {selectedCustomer.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Property Address"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Level</label>
                <select 
                  value={formData.serviceLevel}
                  onChange={(e) => setFormData({...formData, serviceLevel: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Service Level</option>
                  {serviceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Details</label>
                <input 
                  type="text" 
                  placeholder="Available space (e.g., 30x60 feet)"
                  value={formData.spaceSize}
                  onChange={(e) => setFormData({...formData, spaceSize: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Current surface (e.g., grass, concrete)"
                  value={formData.currentSurface}
                  onChange={(e) => setFormData({...formData, currentSurface: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Preferred timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea 
                  placeholder="Custom colors, lighting, drainage needs, etc."
                  rows={3}
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quote Description</label>
            <textarea 
              placeholder="Brief description of the proposed work..."
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => {
                setShowNewQuoteForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={editingQuote ? handleSaveEdit : handleCreateQuote}
              disabled={isLoading || !formData.customerId || !formData.serviceLevel}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (editingQuote ? 'Updating...' : 'Generating...') : (editingQuote ? 'Update Quote' : 'Generate Quote with AI')}
            </button>
          </div>
        </div>
      )}

      {/* Quotes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Quotes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.quoteNumber}</div>
                      <div className="text-sm text-gray-500">{quote.createdDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.customer}</div>
                      <div className="text-sm text-gray-500">{quote.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{quote.serviceLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${quote.estimatedPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {getStatusIcon(quote.status)}
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.validUntil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedQuote(quote)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {quote.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateQuoteStatus(quote.id, 'accepted')}
                            className="text-green-600 hover:text-green-900" 
                            title="Accept"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateQuoteStatus(quote.id, 'rejected')}
                            className="text-red-600 hover:text-red-900" 
                            title="Reject"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleEditQuote(quote)}
                        className="text-yellow-600 hover:text-yellow-900" 
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuote(quote.id)}
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

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quote Details - {selectedQuote.quoteNumber}
                </h2>
                <button 
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium">{selectedQuote.customer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2">{selectedQuote.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Service Level:</span>
                      <span className="ml-2">{selectedQuote.serviceLevel}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedQuote.status)}`}>
                        {selectedQuote.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimated Price:</span>
                      <span className="ml-2 font-bold text-green-600">${selectedQuote.estimatedPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Property Details</h3>
                  {selectedQuote.propertyDetails && (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <span className="ml-2">{selectedQuote.propertyDetails.address}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Space Size:</span>
                        <span className="ml-2">{selectedQuote.propertyDetails.spaceSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Surface:</span>
                        <span className="ml-2">{selectedQuote.propertyDetails.currentSurface}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeline:</span>
                        <span className="ml-2">{selectedQuote.propertyDetails.timeline}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Special Requirements:</span>
                        <span className="ml-2">{selectedQuote.propertyDetails.specialRequirements}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedQuote.description}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2">{selectedQuote.createdDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">Valid Until:</span>
                  <span className="ml-2">{selectedQuote.validUntil}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-2">
                  {selectedQuote.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => {
                          handleUpdateQuoteStatus(selectedQuote.id, 'accepted');
                          setSelectedQuote(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Accept Quote
                      </button>
                      <button 
                        onClick={() => {
                          handleUpdateQuoteStatus(selectedQuote.id, 'rejected');
                          setSelectedQuote(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Reject Quote
                      </button>
                    </>
                  )}
                  {selectedQuote.status === 'accepted' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Convert to Contract
                    </button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedQuote(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claude Assistant Modal */}
      {showClaudeAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SparklesIcon className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Claude Quote Assistant</h2>
                </div>
                <button 
                  onClick={() => setShowClaudeAssistant(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                AI-powered quote generation using your pricing database and seasonal adjustments
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Project Details Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                        <input 
                          type="text" 
                          value={projectDetails.customerName}
                          onChange={(e) => setProjectDetails({...projectDetails, customerName: e.target.value})}
                          className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          type="email" 
                          value={projectDetails.email}
                          onChange={(e) => setProjectDetails({...projectDetails, email: e.target.value})}
                          className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                          placeholder="customer@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Address</label>
                      <input 
                        type="text" 
                        value={projectDetails.projectAddress}
                        onChange={(e) => setProjectDetails({...projectDetails, projectAddress: e.target.value})}
                        className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        placeholder="Full project address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Court Type</label>
                        <select 
                          value={projectDetails.courtType}
                          onChange={(e) => setProjectDetails({...projectDetails, courtType: e.target.value})}
                          className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        >
                          <option value="">Select court type</option>
                          <option value="tennis">Tennis Court</option>
                          <option value="pickleball">Pickleball Court</option>
                          <option value="basketball">Basketball Court</option>
                          <option value="multi-sport">Multi-Sport Court</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Space Size</label>
                        <input 
                          type="text" 
                          value={projectDetails.spaceSize}
                          onChange={(e) => setProjectDetails({...projectDetails, spaceSize: e.target.value})}
                          className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                          placeholder="e.g., 60x120 ft, 2400 sq ft"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Surface Condition</label>
                      <textarea 
                        value={projectDetails.currentSurface}
                        onChange={(e) => setProjectDetails({...projectDetails, currentSurface: e.target.value})}
                        className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        rows={3}
                        placeholder="Describe current surface, cracks, drainage issues, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                      <textarea 
                        value={projectDetails.specialRequirements}
                        onChange={(e) => setProjectDetails({...projectDetails, specialRequirements: e.target.value})}
                        className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        rows={3}
                        placeholder="Custom colors, logos, drainage, lighting, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                        <input 
                          type="text" 
                          value={projectDetails.timeline}
                          onChange={(e) => setProjectDetails({...projectDetails, timeline: e.target.value})}
                          className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                          placeholder="e.g., ASAP, Spring 2025"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (Optional)</label>
                        <input 
                          type="text" 
                          value={projectDetails.budget}
                          onChange={(e) => setProjectDetails({...projectDetails, budget: e.target.value})}
                          className="w-full border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                          placeholder="e.g., $25,000-$35,000"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsGenerating(true);
                        // Add quote generation logic here
                        setTimeout(() => {
                          setClaudeConversation([
                            {role: 'assistant', content: `Based on your project details, I'll help create a comprehensive quote. Here's my analysis:

**Project Summary:**
- Customer: ${projectDetails.customerName}
- Project: ${projectDetails.courtType} resurfacing
- Size: ${projectDetails.spaceSize}
- Location: ${projectDetails.projectAddress}

**Recommended Scope of Work:**
1. **Surface Preparation** ($2.80/sq ft)
   - Pressure washing and cleaning
   - Crack repair and patching
   - Surface leveling as needed

2. **Court Surfacing** ($5.15/sq ft) 
   - 2 coats of acrylic resurfacer
   - Includes surface preparation and base coat

3. **Color Coating** ($3.25/sq ft)
   - 2 coats of premium color coating
   - Standard colors available

4. **Line Painting** ($850/court)
   - Professional layout and regulation lines
   - ${projectDetails.courtType} specifications

**Estimated Total: $18,500 - $22,000**

*Note: Final pricing depends on exact measurements and site conditions. Active seasonal adjustments: Winter timeline extension (+25%), Weather risk factor (+$500-1000).*

Would you like me to adjust anything or create variations of this quote?`}
                          ]);
                          setIsGenerating(false);
                        }, 2000);
                      }}
                      disabled={isGenerating || !projectDetails.customerName || !projectDetails.courtType}
                      className="w-full bg-purple-600 text-white px-4 py-3 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-purple-600"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Generating Quote...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4" />
                          Generate Quote with Claude
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Claude Conversation */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Claude Assistant</h3>
                  <div className="border border-gray-200 h-96 overflow-y-auto p-4 bg-gray-50">
                    {claudeConversation.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Fill in the project details and click "Generate Quote" to start your conversation with Claude.</p>
                        <p className="text-sm mt-2">Claude will use your pricing database and seasonal adjustments to create accurate quotes.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {claudeConversation.map((message, index) => (
                          <div key={index} className={`${message.role === 'assistant' ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} border p-3`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold text-white ${message.role === 'assistant' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                {message.role === 'assistant' ? 'C' : 'U'}
                              </div>
                              <div className="flex-1">
                                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {claudeConversation.length > 0 && (
                    <div className="mt-4 flex gap-3">
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 hover:bg-green-700 border border-green-600">
                        Create Quote from This
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50">
                        Start Over
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}