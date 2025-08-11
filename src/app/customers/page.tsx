'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  UserGroupIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  reference?: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  taxTotal: number;
  amountPaid: number;
  amountDue: number;
  status: 'Paid' | 'Awaiting Payment' | 'Unsent' | 'Viewed' | 'Sent';
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface InvoiceItem {
  id: string;
  inventoryItemCode?: string;
  description: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
}

import { prisma } from '../../lib/prisma';

// Customer interface matching Prisma schema
interface Customer {
  id: string;
  userId: string;
  companyName?: string;
  billingAddress?: any; // JSON field
  shippingAddress?: any; // JSON field
  taxId?: string;
  customerGroup: 'RETAIL' | 'CONTRACTOR' | 'DEALER' | 'WHOLESALE';
  metadata?: {
    convertedFromProspect?: boolean;
    conversionDate?: string;
    originalTicketId?: string;
    prospectData?: {
      originalInquiry?: string;
      inquiryDate?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  orders?: any[];
  invoices?: any[];
  _count?: {
    orders: number;
  };
}

const customerGroupColors = {
  RETAIL: 'bg-blue-100 text-blue-800',
  CONTRACTOR: 'bg-green-100 text-green-800',
  DEALER: 'bg-purple-100 text-purple-800',
  WHOLESALE: 'bg-orange-100 text-orange-800',
  LEVEL_3_RESURFACING: 'bg-red-100 text-red-800'
};

const customerStatusColors = {
  LEAD: 'bg-yellow-100 text-yellow-800',
  PROSPECT: 'bg-blue-100 text-blue-800',
  LEVEL_1: 'bg-gray-100 text-gray-800',
  LEVEL_2: 'bg-indigo-100 text-indigo-800',
  LEVEL_3: 'bg-purple-100 text-purple-800',
  LEVEL_4: 'bg-pink-100 text-pink-800',
  LEVEL_5: 'bg-red-100 text-red-800',
  LEVEL_5_5: 'bg-rose-100 text-rose-800',
  CLIENT: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  LOST: 'bg-red-100 text-red-800',
  CLOSED: 'bg-gray-100 text-gray-800'
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showConvertProspectModal, setShowConvertProspectModal] = useState(false);
  const [availableProspects, setAvailableProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load customers from database on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/customers');
        if (response.ok) {
          const data = await response.json();
          setCustomers(data.customers); // API returns { customers: [...], pagination: {...} }
        } else {
          console.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Helper functions for customer data
  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.user.firstName && customer.user.lastName) {
      return `${customer.user.firstName} ${customer.user.lastName}`;
    }
    return customer.companyName || customer.user.email || 'Unknown';
  };

  const isRecentlyConverted = (customer: Customer) => {
    if (!customer.metadata?.convertedFromProspect) return false;
    const conversionDate = new Date(customer.metadata.conversionDate);
    const daysSinceConversion = (Date.now() - conversionDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceConversion <= 7; // Show badge for 7 days
  };

  // Filter customers based on search term and group
  const filteredCustomers = customers.filter(customer => {
    const displayName = getCustomerDisplayName(customer);
    const matchesSearch = 
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = filterGroup === 'all' || customer.customerGroup === filterGroup;
    
    return matchesSearch && matchesGroup;
  });

  const handleCreateCustomer = async (customerData: any) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      
      if (response.ok) {
        const newCustomer = await response.json();
        setCustomers([...customers, newCustomer]);
        setShowNewCustomerForm(false);
        alert('Customer created successfully!');
      } else {
        const error = await response.json();
        alert(`Error creating customer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Error creating customer. Please try again.');
    }
  };

  const handleUpdateCustomer = async (customerId: string, customerData: any) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      
      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomers(customers.map(c => c.id === customerId ? updatedCustomer : c));
        setShowNewCustomerForm(false);
        setEditingCustomer(null);
        alert('Customer updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error updating customer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer. Please try again.');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowNewCustomerForm(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`/api/customers/${customerId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCustomers(customers.filter(c => c.id !== customerId));
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const loadProspects = async () => {
    try {
      const response = await fetch('/api/support-tickets?status=OPEN');
      if (response.ok) {
        const data = await response.json();
        setAvailableProspects(data.tickets);
      }
    } catch (error) {
      console.error('Error loading prospects:', error);
    }
  };

  const handleConvertProspect = async (prospectTicket: any) => {
    try {
      const response = await fetch('/api/prospects/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: prospectTicket.customer.id,
          ticketId: prospectTicket.id 
        })
      });
      
      if (response.ok) {
        // Refresh customers list
        const customersResponse = await fetch('/api/customers');
        if (customersResponse.ok) {
          const data = await customersResponse.json();
          setCustomers(data.customers);
        }
        
        setShowConvertProspectModal(false);
        alert(`${prospectTicket.customer.user.firstName} ${prospectTicket.customer.user.lastName} has been converted to a customer!`);
      } else {
        const error = await response.json();
        alert(`Error converting prospect: ${error.error}`);
      }
    } catch (error) {
      console.error('Error converting prospect:', error);
      alert('Error converting prospect. Please try again.');
    }
  };

  const openConvertProspectModal = () => {
    loadProspects();
    setShowConvertProspectModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">Manage your customer relationships and contacts</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={openConvertProspectModal}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Convert Prospect</span>
              </button>
              <button
                onClick={() => setShowNewCustomerForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Groups</option>
              <option value="RETAIL">Retail</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="DEALER">Dealer</option>
              <option value="WHOLESALE">Wholesale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading customers...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first customer.</p>
            <button
              onClick={() => setShowNewCustomerForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Customer
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">
                            {getCustomerDisplayName(customer)}
                          </div>
                          {isRecentlyConverted(customer) && (
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              New Customer
                            </span>
                          )}
                        </div>
                        {customer.companyName && (
                          <div className="text-sm text-gray-500">{customer.companyName}</div>
                        )}
                        {customer.metadata?.convertedFromProspect && (
                          <div className="text-xs text-blue-600">
                            Converted from prospect: {new Date(customer.metadata.conversionDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.user.email}</div>
                      {customer.user.phone && (
                        <div className="text-sm text-gray-500">{customer.user.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${customerGroupColors[customer.customerGroup]}`}>
                        {customer.customerGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer._count?.orders || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Convert Prospect Modal */}
      {showConvertProspectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Convert Prospect to Customer
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select a prospect to convert to a customer. All their information will be preserved.
                  </p>
                </div>
                <button
                  onClick={() => setShowConvertProspectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                {availableProspects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active prospects available for conversion.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Prospects will appear here when they submit the contact form on your website.
                    </p>
                  </div>
                ) : (
                  availableProspects.map((prospect: any) => (
                    <div key={prospect.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {prospect.customer.user.firstName} {prospect.customer.user.lastName}
                            </h4>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800`}>
                              {prospect.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{prospect.customer.user.email}</p>
                          {prospect.customer.user.phone && (
                            <p className="text-sm text-gray-600">{prospect.customer.user.phone}</p>
                          )}
                          <p className="text-sm text-gray-700 mt-2 font-medium">{prospect.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Inquiry received: {new Date(prospect.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleConvertProspect(prospect)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                        >
                          <PlusIcon className="w-4 h-4" />
                          <span>Convert</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {showNewCustomerForm && (
        <CustomerFormModal
          customer={editingCustomer}
          onSubmit={editingCustomer ? 
            (data: any) => handleUpdateCustomer(editingCustomer.id, data) : 
            handleCreateCustomer
          }
          onClose={() => {
            setShowNewCustomerForm(false);
            setEditingCustomer(null);
          }}
        />
      )}
    </div>
  );
}

// Customer Form Modal Component
interface CustomerFormModalProps {
  customer?: Customer | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

function CustomerFormModal({ customer, onSubmit, onClose }: CustomerFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: customer?.user.firstName || '',
    lastName: customer?.user.lastName || '',
    email: customer?.user.email || '',
    phone: customer?.user.phone || '',
    companyName: customer?.companyName || '',
    customerGroup: customer?.customerGroup || 'RETAIL',
    taxId: customer?.taxId || '',
    billingAddress: customer?.billingAddress ? JSON.stringify(customer.billingAddress, null, 2) : '',
    shippingAddress: customer?.shippingAddress ? JSON.stringify(customer.shippingAddress, null, 2) : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse JSON fields
    let billingAddress = null;
    let shippingAddress = null;
    
    try {
      if (formData.billingAddress.trim()) {
        billingAddress = JSON.parse(formData.billingAddress);
      }
      if (formData.shippingAddress.trim()) {
        shippingAddress = JSON.parse(formData.shippingAddress);
      }
    } catch (error) {
      alert('Invalid JSON in address fields. Please check your formatting.');
      return;
    }

    onSubmit({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      companyName: formData.companyName || null,
      customerGroup: formData.customerGroup,
      taxId: formData.taxId || null,
      billingAddress,
      shippingAddress
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {customer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Group
                </label>
                <select
                  name="customerGroup"
                  value={formData.customerGroup}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="RETAIL">Retail</option>
                  <option value="CONTRACTOR">Contractor</option>
                  <option value="DEALER">Dealer</option>
                  <option value="WHOLESALE">Wholesale</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax ID
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="Tax ID or EIN"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address (JSON format)
              </label>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                rows={3}
                placeholder='{"street": "123 Main St", "city": "City", "state": "ST", "zip": "12345"}'
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address (JSON format)
              </label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                rows={3}
                placeholder='{"street": "123 Main St", "city": "City", "state": "ST", "zip": "12345"}'
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {customer ? 'Update Customer' : 'Create Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
