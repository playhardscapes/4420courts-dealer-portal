'use client';

import { useState } from 'react';
import { 
  BanknotesIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: string;
  projectId: string;
  projectNumber: string;
  amount: number;
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  paymentMethod?: string;
  paymentTerms: string;
  notes?: string;
  lineItems: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    customer: 'Sarah Smith',
    projectNumber: 'P-2025-001',
    amount: 6250,
    status: 'paid',
    issueDate: '2025-02-01',
    dueDate: '2025-02-15',
    paidDate: '2025-02-10',
    customerId: '2',
    projectId: '1',
    description: '50% down payment - Level 3 Coating & Lining',
    paymentMethod: 'Bank Transfer',
    paymentTerms: 'net15',
    lineItems: [
      { description: 'Down Payment (50%)', quantity: 1, rate: 6250, amount: 6250 }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    customer: 'Mike Johnson',
    projectNumber: 'P-2025-002',
    amount: 21250,
    status: 'pending',
    issueDate: '2025-02-15',
    dueDate: '2025-03-01',
    paidDate: null,
    customerId: '1',
    projectId: '2',
    description: '50% down payment - Level 5 Full Project Management',
    paymentMethod: null,
    paymentTerms: 'net30',
    lineItems: [
      { description: 'Down Payment (50%)', quantity: 1, rate: 21250, amount: 21250 }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-003',
    customer: 'Davis Family',
    projectNumber: 'P-2024-045',
    amount: 11000,
    status: 'overdue',
    issueDate: '2025-01-15',
    dueDate: '2025-01-30',
    paidDate: null,
    customerId: '3',
    projectId: '3',
    description: 'Final payment - Level 4 Project completion',
    paymentMethod: null,
    paymentTerms: 'net30',
    lineItems: [
      { description: 'Final Payment (50%)', quantity: 1, rate: 11000, amount: 11000 }
    ]
  }
];

const paymentTermsOptions = [
  { value: 'net15', label: 'Net 15 days' },
  { value: 'net30', label: 'Net 30 days' },
  { value: 'due_on_receipt', label: 'Due on receipt' },
  { value: 'milestone', label: 'Milestone-based' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return <CheckCircleIcon className="h-4 w-4" />;
    case 'pending':
      return <ClockIcon className="h-4 w-4" />;
    case 'overdue':
      return <ExclamationTriangleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    projectId: '',
    invoiceType: 'down_payment',
    amount: 0,
    paymentTerms: 'net30',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
    notes: ''
  });

  // Available projects for invoice creation
  const availableProjects = [
    { id: 'P-2025-003', customer: 'Robert Davis', customerId: '3', contractValue: 22000 },
    { id: 'P-2025-004', customer: 'Linda Wilson', customerId: '4', contractValue: 15000 }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = async () => {
    setIsLoading(true);
    try {
      const selectedProject = availableProjects.find(p => p.id === formData.projectId);
      if (!selectedProject) return;

      let calculatedAmount = formData.amount;
      if (formData.invoiceType === 'down_payment') {
        calculatedAmount = selectedProject.contractValue * 0.5;
      } else if (formData.invoiceType === 'final_payment') {
        calculatedAmount = selectedProject.contractValue * 0.5;
      }

      const dueDate = new Date(formData.issueDate);
      if (formData.paymentTerms === 'net15') {
        dueDate.setDate(dueDate.getDate() + 15);
      } else if (formData.paymentTerms === 'net30') {
        dueDate.setDate(dueDate.getDate() + 30);
      }

      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`,
        customerId: selectedProject.customerId,
        customer: selectedProject.customer,
        projectId: selectedProject.id,
        projectNumber: selectedProject.id,
        amount: calculatedAmount,
        status: 'draft',
        issueDate: formData.issueDate,
        dueDate: dueDate.toISOString().split('T')[0],
        description: formData.description,
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
        lineItems: [
          {
            description: formData.description,
            quantity: 1,
            rate: calculatedAmount,
            amount: calculatedAmount
          }
        ]
      };
      
      setInvoices([newInvoice, ...invoices]);
      setShowNewInvoiceForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, newStatus: Invoice['status']) => {
    setIsLoading(true);
    try {
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId 
          ? { 
              ...inv, 
              status: newStatus,
              paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : inv.paidDate
            }
          : inv
      ));
    } catch (error) {
      console.error('Error updating invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    setIsLoading(true);
    try {
      // Email sending logic would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: 'sent' as Invoice['status'] }
          : inv
      ));
      
      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setIsLoading(true);
      try {
        setInvoices(invoices.filter(inv => inv.id !== invoiceId));
      } catch (error) {
        console.error('Error deleting invoice:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      projectId: '',
      invoiceType: 'down_payment',
      amount: 0,
      paymentTerms: 'net30',
      issueDate: new Date().toISOString().split('T')[0],
      description: '',
      notes: ''
    });
  };

  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">Manage billing and payment tracking for your projects</p>
          </div>
          <button 
            onClick={() => setShowNewInvoiceForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Paid This Month</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">${totalOutstanding.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Outstanding</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
          <div className="text-sm text-gray-600">Total Invoices</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search invoices..."
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
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <BanknotesIcon className="h-8 w-8 text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Milestone Invoice</div>
            <div className="text-sm text-gray-600">Generate invoice for project milestone</div>
          </button>
          <button className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <PaperAirplaneIcon className="h-8 w-8 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Send Reminders</div>
            <div className="text-sm text-gray-600">Send payment reminders to overdue clients</div>
          </button>
          <button className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <ArrowDownTrayIcon className="h-8 w-8 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">Export Reports</div>
            <div className="text-sm text-gray-600">Download financial reports for accounting</div>
          </button>
        </div>
      </div>

      {/* New Invoice Form */}
      {showNewInvoiceForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Create New Invoice</h2>
            <button 
              onClick={() => setShowNewInvoiceForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select 
                  value={formData.projectId}
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select project</option>
                  {availableProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.id} - {project.customer} (${project.contractValue.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Type</label>
                <select 
                  value={formData.invoiceType}
                  onChange={(e) => setFormData({...formData, invoiceType: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="down_payment">Down Payment (50%)</option>
                  <option value="milestone">Milestone Payment</option>
                  <option value="final_payment">Final Payment</option>
                  <option value="custom">Custom Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    disabled={formData.invoiceType !== 'custom'}
                    className="w-full pl-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <select 
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {paymentTermsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                <input 
                  type="date" 
                  value={formData.issueDate}
                  onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  placeholder="Description of services invoiced..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea 
                  placeholder="Payment instructions, project details, etc."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={() => {
                setShowNewInvoiceForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateInvoice}
              disabled={isLoading || !formData.projectId || !formData.description}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Save as Draft'}
            </button>
            <button 
              onClick={async () => {
                await handleCreateInvoice();
                // Auto-send logic could go here
              }}
              disabled={isLoading || !formData.projectId || !formData.description}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create & Send'}
            </button>
          </div>
        </div>
      )}

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices ({filteredInvoices.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{invoice.issueDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.projectNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.dueDate}
                    {invoice.paidDate && (
                      <div className="text-xs text-green-600">Paid: {invoice.paidDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {(invoice.status === 'draft' || invoice.status === 'sent') && (
                        <button 
                          onClick={() => handleSendInvoice(invoice.id)}
                          className="text-green-600 hover:text-green-900" 
                          title="Send Invoice"
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      )}
                      {invoice.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateInvoiceStatus(invoice.id, 'paid')}
                          className="text-green-600 hover:text-green-900" 
                          title="Mark as Paid"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-yellow-600 hover:text-yellow-900" title="Edit">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Download">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInvoice(invoice.id)}
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

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Invoice Details - {selectedInvoice.invoiceNumber}
                </h2>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Invoice Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <span className="ml-2 font-medium">{selectedInvoice.customer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Project:</span>
                      <span className="ml-2">{selectedInvoice.projectNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedInvoice.status)}`}>
                        {selectedInvoice.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 font-bold text-green-600">${selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Terms:</span>
                      <span className="ml-2">{paymentTermsOptions.find(opt => opt.value === selectedInvoice.paymentTerms)?.label}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Issue Date:</span>
                      <span className="ml-2">{selectedInvoice.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <span className="ml-2">{selectedInvoice.dueDate}</span>
                    </div>
                    {selectedInvoice.paidDate && (
                      <div>
                        <span className="text-gray-500">Paid Date:</span>
                        <span className="ml-2 text-green-600">{selectedInvoice.paidDate}</span>
                      </div>
                    )}
                    {selectedInvoice.paymentMethod && (
                      <div>
                        <span className="text-gray-500">Payment Method:</span>
                        <span className="ml-2">{selectedInvoice.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedInvoice.description}
                </p>
              </div>

              {selectedInvoice.notes && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-4">Line Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedInvoice.lineItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">${item.rate.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-2">
                  {selectedInvoice.status === 'draft' && (
                    <button 
                      onClick={() => {
                        handleSendInvoice(selectedInvoice.id);
                        setSelectedInvoice(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send Invoice
                    </button>
                  )}
                  {selectedInvoice.status === 'pending' && (
                    <button 
                      onClick={() => {
                        handleUpdateInvoiceStatus(selectedInvoice.id, 'paid');
                        setSelectedInvoice(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Mark as Paid
                    </button>
                  )}
                  {selectedInvoice.status === 'overdue' && (
                    <>
                      <button 
                        onClick={() => {
                          handleUpdateInvoiceStatus(selectedInvoice.id, 'paid');
                          setSelectedInvoice(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Mark as Paid
                      </button>
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                        Send Reminder
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedInvoice(null)}
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
  );
}