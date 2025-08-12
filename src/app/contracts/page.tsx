'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentDuplicateIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  TrashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Customer, getAllCustomers, getCustomerDisplayName, getCustomerEmail, getBillingEmail, getBillingContactName } from '../../data/customers';

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

// Customer data is now imported from shared source

const sampleQuotes: Quote[] = [
  {
    id: '1',
    quoteNumber: 'Q-2025-001',
    customerId: 'cust_001',
    customer: 'Aric Holsinger',
    email: 'aricholsinger@verizon.net',
    serviceLevel: 'Level 5 - Full Project Management',
    estimatedPrice: 42500,
    status: 'accepted',
    createdDate: '2025-01-28',
    validUntil: '2025-02-28',
    description: 'Full basketball court resurfacing with line painting',
    propertyDetails: {
      address: '2066 Ambrose Commons, Charlottesville, VA 22903',
      spaceSize: '94ft x 50ft',
      currentSurface: 'Cracked asphalt',
      timeline: '2-3 weeks',
      specialRequirements: 'Custom logo design'
    }
  },
  {
    id: '2',
    quoteNumber: 'Q-2025-002',
    customerId: 'cust_002',
    customer: 'Bill Hadley',
    email: 'bhadley@Thehadcos.com',
    serviceLevel: 'Level 4 - Project Management + Finish',
    estimatedPrice: 18750,
    status: 'accepted',
    createdDate: '2025-01-29',
    validUntil: '2025-03-01',
    description: 'Tennis court resurfacing and net installation',
    propertyDetails: {
      address: '8260 Hemlock Ridge Road, Blowing Rock, NC 28605',
      spaceSize: '78ft x 36ft',
      currentSurface: 'Faded acrylic',
      timeline: '1-2 weeks',
      specialRequirements: 'Weather permitting'
    }
  }
];

interface Contract {
  id: string;
  contractNumber: string;
  customerId: string;
  customer: string;
  email: string;
  serviceLevel: string;
  contractValue: number;
  status: 'draft' | 'pending_signature' | 'signed' | 'completed' | 'cancelled';
  createdDate: string;
  signedDate?: string;
  startDate: string;
  estimatedCompletion: string;
  quoteId: string;
  paymentTerms: string;
  warrantyTerms: string;
  specialConditions?: string;
  contractContent?: string;
  signatureData?: {
    customerSignature?: string;
    customerSignedAt?: string;
    contractorSignature?: string;
    contractorSignedAt?: string;
  };
}

const sampleContracts: Contract[] = [
  {
    id: '1',
    contractNumber: 'C-2025-001',
    customerId: '2',
    customer: 'Sarah Smith',
    email: 'sarah@email.com',
    serviceLevel: 'Level 3 - Coating & Lining Specialist',
    contractValue: 12500,
    status: 'signed',
    createdDate: '2025-01-26',
    signedDate: '2025-01-28',
    startDate: '2025-02-01',
    estimatedCompletion: '2025-02-15',
    quoteId: 'Q-2025-002',
    paymentTerms: '50% down, 50% on completion',
    warrantyTerms: '1 year materials, 2 years workmanship',
    specialConditions: 'Weather dependent scheduling',
    contractContent: 'Professional surface coating and line painting services...'
  },
  {
    id: '2',
    contractNumber: 'C-2025-002',
    customerId: '1',
    customer: 'Mike Johnson',
    email: 'mike@email.com',
    serviceLevel: 'Level 5 - Full Project Management',
    contractValue: 42500,
    status: 'pending_signature',
    createdDate: '2025-01-29',
    startDate: '2025-02-15',
    estimatedCompletion: '2025-03-30',
    quoteId: 'Q-2025-001',
    paymentTerms: '33% down, 33% midpoint, 34% completion',
    warrantyTerms: '2 year comprehensive warranty',
    specialConditions: 'Custom logo installation, LED lighting integration',
    contractContent: 'Complete project management services including...'
  }
];

const contractTemplates = [
  {
    id: 1,
    name: 'Level 1-2 Service Agreement',
    description: 'DIY and membership service agreements',
    serviceLevel: ['level1', 'level2']
  },
  {
    id: 2,
    name: 'Level 3 Coating & Lining Contract',
    description: 'Professional finishing services contract',
    serviceLevel: ['level3']
  },
  {
    id: 3,
    name: 'Level 4-5 Full Service Contract',
    description: 'Comprehensive project management agreement',
    serviceLevel: ['level4', 'level5', 'level5.5']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'pending_signature':
      return 'bg-yellow-100 text-yellow-800';
    case 'signed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'signed':
      return <CheckCircleIcon className="h-4 w-4" />;
    case 'pending_signature':
      return <ClockIcon className="h-4 w-4" />;
    default:
      return <DocumentIcon className="h-4 w-4" />;
  }
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(sampleContracts);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showNewContractForm, setShowNewContractForm] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showClaudeAssistant, setShowClaudeAssistant] = useState(false);
  const [claudeConversation, setClaudeConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

  // Form state
  const [formData, setFormData] = useState({
    quoteId: '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    serviceLevel: '',
    contractValue: 0,
    startDate: '',
    estimatedCompletion: '',
    paymentTerms: '50% down, 50% on completion',
    warrantyTerms: '1 year materials, 2 years workmanship',
    specialConditions: '',
    templateId: ''
  });

  // Only show accepted quotes for contract creation
  const availableQuotes = sampleQuotes.filter(quote => quote.status === 'accepted').map(quote => ({
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    customerId: quote.customerId,
    customer: quote.customer,
    serviceLevel: quote.serviceLevel,
    value: quote.estimatedPrice,
    status: quote.status,
    description: quote.description
  }));

  // Load all customers from shared data source
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || contract.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateContract = async () => {
    setIsLoading(true);
    try {
      // AI contract generation would happen here
      const contractContent = await generateContractWithAI(formData);

      const newContract: Contract = {
        id: Date.now().toString(),
        contractNumber: `C-2025-${String(contracts.length + 1).padStart(3, '0')}`,
        customerId: formData.customerId,
        customer: formData.customerName,
        email: formData.customerEmail,
        serviceLevel: formData.serviceLevel,
        contractValue: formData.contractValue,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        startDate: formData.startDate,
        estimatedCompletion: formData.estimatedCompletion,
        quoteId: formData.quoteId,
        paymentTerms: formData.paymentTerms,
        warrantyTerms: formData.warrantyTerms,
        specialConditions: formData.specialConditions,
        contractContent: contractContent
      };
      
      setContracts([newContract, ...contracts]);
      setShowNewContractForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContractWithAI = async (data: any): Promise<string> => {
    // In a real implementation, this would call Claude API
    // For now, we'll use the template from settings with populated data
    const templateData = {
      contract_date: new Date().toLocaleDateString(),
      company_name: 'Pro Court Solutions',
      company_state: 'Florida',
      customer_name: data.customerName,
      customer_address: '123 Customer St, City, State 12345', // Would come from customer data
      customer_phone: '(555) 123-4567', // Would come from customer data
      customer_email: data.customerEmail,
      project_address: 'Project Location TBD', // Would come from quote data
      court_type: 'Pickleball Court', // Would come from quote data
      square_footage: '2,000 sq ft', // Would come from quote data
      surface_type: 'Acrylic Surfacing', // Would come from quote data
      scope_of_work: `Complete court resurfacing including surface preparation, crack repair, primer application, and color coating with professional line marking.`,
      pricing_breakdown: `Surface Preparation: $2,500
Crack Repair: $800
Primer Application: $1,200
Color Coating (2 coats): $3,500
Line Marking: $850
Materials & Equipment: $3,650
Total: $${data.contractValue.toLocaleString()}`,
      total_amount: data.contractValue.toLocaleString(),
      deposit_amount: Math.round(data.contractValue * 0.3).toLocaleString(),
      deposit_percentage: '30',
      progress_payment: Math.round(data.contractValue * 0.4).toLocaleString(),
      progress_milestone: 'at 50% completion',
      final_payment: Math.round(data.contractValue * 0.3).toLocaleString(),
      start_date: data.startDate,
      completion_date: data.estimatedCompletion,
      warranty_period: '2 years',
      additional_terms: data.specialConditions || 'Standard terms and conditions apply.',
      contractor_name: 'John Smith'
    };

    // This is where Claude API would be called to generate the contract
    // using the template and data above
    const contractTemplate = `COURT RESURFACING CONTRACT

This Contract is entered into on \{\{contract_date\}\} between \{\{company_name\}\}, a \{\{company_state\}\} corporation ("Contractor"), and \{\{customer_name\}\} ("Customer").

CUSTOMER INFORMATION:
Name: \{\{customer_name\}\}
Address: \{\{customer_address\}\}
Phone: \{\{customer_phone\}\}
Email: \{\{customer_email\}\}

PROJECT DETAILS:
Project Location: \{\{project_address\}\}
Court Type: \{\{court_type\}\}
Square Footage: \{\{square_footage\}\}
Surface Type: \{\{surface_type\}\}

SCOPE OF WORK:
\{\{scope_of_work\}\}

MATERIALS AND PRICING:
\{\{pricing_breakdown\}\}

TOTAL CONTRACT AMOUNT: $\{\{total_amount\}\}

PAYMENT TERMS:
- Deposit: $\{\{deposit_amount\}\} (\{\{deposit_percentage\}\}%) due upon signing
- Progress Payment: $\{\{progress_payment\}\} due \{\{progress_milestone\}\}
- Final Payment: $\{\{final_payment\}\} due upon completion

TIMELINE:
Start Date: \{\{start_date\}\}
Estimated Completion: \{\{completion_date\}\}
Weather delays may extend timeline as necessary.

WARRANTY:
Contractor warrants all work and materials for \{\{warranty_period\}\} from completion date.

STANDARD CONDITIONS:
- Weather delays beyond contractor control will extend timeline accordingly.
- Customer is responsible for providing clear access to work area.
- Any changes to scope of work must be approved in writing.
- Contractor is not responsible for underground utilities not marked.
- Customer must maintain proper drainage around court surface.
- Final payment due within 30 days of project completion.
- Contractor carries general liability insurance of $1,000,000.
- Customer agrees to final walk-through inspection before completion.

ADDITIONAL TERMS:
\{\{additional_terms\}\}

By signing below, both parties agree to the terms and conditions of this contract.

Customer Signature: _________________________ Date: _______
\{\{customer_name\}\}

Contractor Signature: _________________________ Date: _______
\{\{contractor_name\}\}, \{\{company_name\}\}`;

    // Replace template variables with actual data
    let populatedContract = contractTemplate;
    Object.entries(templateData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      populatedContract = populatedContract.replace(regex, value.toString());
    });

    return populatedContract;
  };

  const handleUpdateContractStatus = async (contractId: string, newStatus: Contract['status']) => {
    setIsLoading(true);
    try {
      setContracts(contracts.map(c => 
        c.id === contractId 
          ? { 
              ...c, 
              status: newStatus,
              signedDate: newStatus === 'signed' ? new Date().toISOString().split('T')[0] : c.signedDate
            }
          : c
      ));
    } catch (error) {
      console.error('Error updating contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendContract = async (contractId: string) => {
    setIsLoading(true);
    try {
      // Email sending logic would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setContracts(contracts.map(c => 
        c.id === contractId 
          ? { ...c, status: 'pending_signature' as Contract['status'] }
          : c
      ));
      
      alert('Contract sent successfully!');
    } catch (error) {
      console.error('Error sending contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      setIsLoading(true);
      try {
        setContracts(contracts.filter(c => c.id !== contractId));
      } catch (error) {
        console.error('Error deleting contract:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      quoteId: contract.quoteId,
      customerId: contract.customerId,
      customerName: contract.customer,
      customerEmail: contract.email,
      serviceLevel: contract.serviceLevel,
      contractValue: contract.contractValue,
      startDate: contract.startDate,
      estimatedCompletion: contract.estimatedCompletion,
      paymentTerms: contract.paymentTerms,
      warrantyTerms: contract.warrantyTerms,
      specialConditions: contract.specialConditions || '',
      templateId: '1'
    });
    setShowNewContractForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingContract) return;
    
    setIsLoading(true);
    try {
      const updatedContract: Contract = {
        ...editingContract,
        customer: formData.customerName,
        email: formData.customerEmail,
        serviceLevel: formData.serviceLevel,
        contractValue: formData.contractValue,
        startDate: formData.startDate,
        estimatedCompletion: formData.estimatedCompletion,
        paymentTerms: formData.paymentTerms,
        warrantyTerms: formData.warrantyTerms,
        specialConditions: formData.specialConditions
      };
      
      setContracts(contracts.map(c => c.id === editingContract.id ? updatedContract : c));
      setEditingContract(null);
      setShowNewContractForm(false);
      resetForm();
    } catch (error) {
      console.error('Error updating contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      quoteId: '',
      customerId: '',
      customerName: '',
      customerEmail: '',
      serviceLevel: '',
      contractValue: 0,
      startDate: '',
      estimatedCompletion: '',
      paymentTerms: '50% down, 50% on completion',
      warrantyTerms: '1 year materials, 2 years workmanship',
      specialConditions: '',
      templateId: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
              <p className="text-gray-600">Generate and manage project contracts with AI assistance</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowNewContractForm(true)}
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 flex items-center gap-2 border border-blue-600"
              >
                <PlusIcon className="h-4 w-4" />
                New Contract
              </button>
              <button 
                onClick={() => {
                  setShowNewContractForm(true);
                  // Pre-populate with available quote if any
                  if (availableQuotes.length > 0) {
                    const firstQuote = availableQuotes[0];
                    setFormData({
                      ...formData,
                      quoteId: firstQuote.id,
                      customerName: firstQuote.customer,
                      serviceLevel: firstQuote.serviceLevel,
                      contractValue: firstQuote.value
                    });
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 flex items-center gap-2 border border-green-600"
              >
                <SparklesIcon className="h-4 w-4" />
                Generate from Quote
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
          <div className="text-2xl font-bold text-blue-600">{contracts.length}</div>
          <div className="text-sm text-gray-600">Active Contracts</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            ${contracts.reduce((sum, c) => sum + c.contractValue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {contracts.filter(c => c.status === 'pending_signature').length}
          </div>
          <div className="text-sm text-gray-600">Pending Signature</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {contracts.filter(c => c.status === 'signed' && new Date(c.signedDate || '') > new Date(Date.now() - 30*24*60*60*1000)).length}
          </div>
          <div className="text-sm text-gray-600">Signed This Month</div>
        </div>
      </div>

      {/* AI Contract Generator Section */}
      {showNewContractForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">AI Contract Generator</h2>
            <button 
              onClick={() => setShowNewContractForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Quote</label>
                <select 
                  value={formData.quoteId}
                  onChange={(e) => {
                    const selectedQuote = availableQuotes.find(q => q.id === e.target.value);
                    if (selectedQuote) {
                      const customer = customers.find(c => c.id === selectedQuote.customerId);
                      setFormData({
                        ...formData,
                        quoteId: e.target.value,
                        customerId: selectedQuote.customerId,
                        customerName: customer ? getCustomerDisplayName(customer) : selectedQuote.customer,
                        customerEmail: customer ? getBillingEmail(customer) : '',
                        serviceLevel: selectedQuote.serviceLevel,
                        contractValue: selectedQuote.value
                      });
                    } else {
                      setFormData({
                        ...formData, 
                        quoteId: e.target.value,
                        customerId: '',
                        customerName: '',
                        customerEmail: '',
                        serviceLevel: '',
                        contractValue: 0
                      });
                    }
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select existing quote</option>
                  {availableQuotes.map((quote) => (
                    <option key={quote.id} value={quote.id}>
                      {quote.quoteNumber} - {quote.customer} (${quote.value.toLocaleString()}) - {quote.serviceLevel}
                    </option>
                  ))}
                </select>
                {formData.quoteId && formData.customerName && (() => {
                  const selectedQuote = availableQuotes.find(q => q.id === formData.quoteId);
                  const customer = selectedQuote ? customers.find(c => c.id === selectedQuote.customerId) : null;
                  return (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium text-green-800">Selected Quote & Customer Details</p>
                      <div className="text-sm text-green-700 mt-1">
                        <div><strong>Quote:</strong> {selectedQuote?.quoteNumber}</div>
                        <div><strong>Customer:</strong> {formData.customerName}</div>
                        {customer && customer.organizationType && customer.organizationType !== 'INDIVIDUAL' && (
                          <div><strong>Type:</strong> {customer.organizationType}</div>
                        )}
                        <div><strong>Billing Email:</strong> {formData.customerEmail}</div>
                        {customer && customer.primaryContact.phone && (
                          <div><strong>Phone:</strong> {customer.primaryContact.phone}</div>
                        )}
                        <div><strong>Service Level:</strong> {formData.serviceLevel}</div>
                        <div><strong>Contract Value:</strong> ${formData.contractValue?.toLocaleString()}</div>
                        {customer && customer.billingContact && (
                          <div className="mt-1">
                            <strong>Billing Contact:</strong> {getBillingContactName(customer)}
                            {customer.billingContact.email && ` (${customer.billingContact.email})`}
                          </div>
                        )}
                        {customer && customer.notes && (
                          <div className="mt-1 text-xs text-green-600">
                            <strong>Notes:</strong> {customer.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Template</label>
                <select 
                  value={formData.templateId}
                  onChange={(e) => setFormData({...formData, templateId: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select template</option>
                  {contractTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Start Date</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Completion</label>
                <input 
                  type="date" 
                  value={formData.estimatedCompletion}
                  onChange={(e) => setFormData({...formData, estimatedCompletion: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <select 
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>50% down, 50% on completion</option>
                  <option>33% down, 33% midpoint, 34% completion</option>
                  <option>25% down, 25% each milestone</option>
                  <option>Custom terms</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Terms</label>
                <select 
                  value={formData.warrantyTerms}
                  onChange={(e) => setFormData({...formData, warrantyTerms: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>1 year materials, 2 years workmanship</option>
                  <option>2 year comprehensive warranty</option>
                  <option>5 year premium warranty</option>
                  <option>Custom warranty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Conditions</label>
                <textarea 
                  placeholder="Weather dependencies, permit requirements, etc."
                  rows={3}
                  value={formData.specialConditions}
                  onChange={(e) => setFormData({...formData, specialConditions: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button 
              onClick={() => setShowClaudeAssistant(!showClaudeAssistant)}
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2 border border-purple-600"
            >
              <SparklesIcon className="h-4 w-4" />
              {showClaudeAssistant ? 'Hide' : 'Show'} Claude Assistant
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowNewContractForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={editingContract ? handleSaveEdit : handleCreateContract}
                disabled={isLoading || !formData.quoteId || !formData.serviceLevel}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 border border-blue-600"
              >
                {isLoading ? (editingContract ? 'Updating...' : 'Generating...') : (editingContract ? 'Update Contract' : 'Generate Contract with AI')}
              </button>
            </div>
          </div>

          {/* Claude Assistant */}
          {showClaudeAssistant && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="bg-purple-50 border border-purple-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium text-purple-900">Claude Contract Assistant</h3>
                </div>
                <p className="text-sm text-purple-800">
                  Claude can help you generate customized contracts using your template, pricing database, and seasonal adjustments. The assistant will automatically populate contract fields based on the quote data and your standard terms.
                </p>
              </div>

              <div className="mt-4 space-y-4">
                {claudeConversation.length === 0 ? (
                  <div className="bg-gray-50 p-4 border text-sm text-gray-600">
                    <div className="font-medium text-gray-900 mb-2">Contract Generation Preview:</div>
                    <div className="space-y-1">
                      <div>• Using template: Standard Court Resurfacing Contract</div>
                      <div>• Customer: {formData.customerName || 'Not selected'}</div>
                      <div>• Service Level: {formData.serviceLevel || 'Not selected'}</div>
                      <div>• Contract Value: ${formData.contractValue?.toLocaleString() || '0'}</div>
                      <div>• Payment Terms: {formData.paymentTerms}</div>
                      <div>• Warranty: {formData.warrantyTerms}</div>
                      {formData.specialConditions && <div>• Special Conditions: {formData.specialConditions}</div>}
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200">
                      <div className="text-blue-900 font-medium text-xs">Claude Integration Ready</div>
                      <div className="text-blue-800 text-xs mt-1">
                        When you generate the contract, Claude will populate the template with:
                      </div>
                      <div className="text-blue-700 text-xs mt-1 ml-4">
                        ✓ Customer information from selected quote<br/>
                        ✓ Project details and pricing breakdown<br/>
                        ✓ Standard terms and clauses from settings<br/>
                        ✓ Required fields with appropriate defaults<br/>
                        ✓ Legal language optimized for your business
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {claudeConversation.map((message, index) => (
                      <div key={index} className={`p-3 border ${
                        message.role === 'user' 
                          ? 'bg-blue-50 border-blue-200 ml-8' 
                          : 'bg-gray-50 border-gray-200 mr-8'
                      }`}>
                        <div className="text-xs font-medium text-gray-600 mb-1">
                          {message.role === 'user' ? 'You' : 'Claude'}
                        </div>
                        <div className="text-sm text-gray-900 whitespace-pre-line">
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contract Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contractTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {template.serviceLevel.join(', ')}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search contracts..."
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
              <option value="pending_signature">Pending Signature</option>
              <option value="signed">Signed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Contracts ({filteredContracts.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.contractNumber}</div>
                      <div className="text-sm text-gray-500">Created {contract.createdDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contract.customer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{contract.serviceLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${contract.contractValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {getStatusIcon(contract.status)}
                      {contract.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{contract.startDate} -</div>
                    <div>{contract.estimatedCompletion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedContract(contract)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {contract.status === 'draft' && (
                        <button 
                          onClick={() => handleSendContract(contract.id)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="Send Contract"
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditContract(contract)}
                        className="text-yellow-600 hover:text-yellow-900" 
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Download">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteContract(contract.id)}
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
      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Contract Details - {selectedContract.contractNumber}
                </h2>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Contract Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium">{selectedContract.customer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2">{selectedContract.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Service Level:</span>
                      <span className="ml-2">{selectedContract.serviceLevel}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedContract.status)}`}>
                        {selectedContract.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contract Value:</span>
                      <span className="ml-2 font-bold text-green-600">${selectedContract.contractValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Project Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <span className="ml-2">{selectedContract.startDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimated Completion:</span>
                      <span className="ml-2">{selectedContract.estimatedCompletion}</span>
                    </div>
                    {selectedContract.signedDate && (
                      <div>
                        <span className="text-gray-500">Signed Date:</span>
                        <span className="ml-2">{selectedContract.signedDate}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Payment Terms:</span>
                      <span className="ml-2">{selectedContract.paymentTerms}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Warranty:</span>
                      <span className="ml-2">{selectedContract.warrantyTerms}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedContract.specialConditions && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Special Conditions</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedContract.specialConditions}
                  </p>
                </div>
              )}

              {selectedContract.contractContent && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Contract Content</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                    {selectedContract.contractContent}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-2">
                  {selectedContract.status === 'draft' && (
                    <button 
                      onClick={() => {
                        handleSendContract(selectedContract.id);
                        setSelectedContract(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send Contract
                    </button>
                  )}
                  {selectedContract.status === 'pending_signature' && (
                    <>
                      <button 
                        onClick={() => {
                          handleUpdateContractStatus(selectedContract.id, 'signed');
                          setSelectedContract(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Mark as Signed
                      </button>
                      <button 
                        onClick={() => {
                          handleUpdateContractStatus(selectedContract.id, 'cancelled');
                          setSelectedContract(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cancel Contract
                      </button>
                    </>
                  )}
                  {selectedContract.status === 'signed' && (
                    <button 
                      onClick={() => {
                        handleUpdateContractStatus(selectedContract.id, 'completed');
                        setSelectedContract(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedContract(null)}
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
        </div>
      </div>
    </div>
  );
}