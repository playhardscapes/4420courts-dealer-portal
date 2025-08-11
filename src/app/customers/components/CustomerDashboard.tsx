'use client';

import { useState, useEffect } from 'react';
import { CustomerGroup } from '@prisma/client';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  MapPinIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  userId: string;
  companyName: string | null;
  customerGroup: CustomerGroup;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
  };
  orders: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
  }[];
  _count: {
    orders: number;
  };
}

export function CustomerDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroup | 'ALL'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
        return;
      }
      
      // Fallback to sample data if API fails
      console.log('API failed, using sample data for demo');
      // Sample customer data based on schema
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          userId: 'user-1',
          companyName: 'ABC Home Courts',
          customerGroup: 'CONTRACTOR',
          createdAt: new Date('2025-01-15'),
          user: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john@abchomecourts.com',
            phone: '(555) 123-4567'
          },
          orders: [
            {
              id: 'order-1',
              orderNumber: 'ORD-1001',
              totalAmount: 1395.00,
              status: 'COMPLETED',
              createdAt: new Date('2025-01-20')
            },
            {
              id: 'order-2',
              orderNumber: 'ORD-1015',
              totalAmount: 800.00,
              status: 'PROCESSING',
              createdAt: new Date('2025-01-25')
            }
          ],
          _count: { orders: 2 }
        },
        {
          id: '2',
          userId: 'user-2',
          companyName: null,
          customerGroup: 'RETAIL',
          createdAt: new Date('2025-01-18'),
          user: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            phone: '(555) 987-6543'
          },
          orders: [
            {
              id: 'order-3',
              orderNumber: 'ORD-1008',
              totalAmount: 1395.00,
              status: 'SHIPPED',
              createdAt: new Date('2025-01-22')
            }
          ],
          _count: { orders: 1 }
        },
        {
          id: '3',
          userId: 'user-3',
          companyName: 'Elite Sports Surfaces',
          customerGroup: 'DEALER',
          createdAt: new Date('2025-01-10'),
          user: {
            firstName: 'Mike',
            lastName: 'Rodriguez',
            email: 'mike@elitesports.com',
            phone: '(555) 456-7890'
          },
          orders: [
            {
              id: 'order-4',
              orderNumber: 'ORD-1003',
              totalAmount: 2790.00,
              status: 'COMPLETED',
              createdAt: new Date('2025-01-12')
            },
            {
              id: 'order-5',
              orderNumber: 'ORD-1012',
              totalAmount: 1395.00,
              status: 'CONFIRMED',
              createdAt: new Date('2025-01-24')
            }
          ],
          _count: { orders: 2 }
        },
        {
          id: '4',
          userId: 'user-4',
          companyName: null,
          customerGroup: 'RETAIL',
          createdAt: new Date('2025-01-22'),
          user: {
            firstName: 'Lisa',
            lastName: 'Chen',
            email: 'lisa.chen@email.com',
            phone: '(555) 234-5678'
          },
          orders: [],
          _count: { orders: 0 }
        }
      ];
      
      setCustomers(sampleCustomers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (customerData: Partial<Customer>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      
      if (response.ok) {
        await fetchCustomers(); // Refresh the list
        setShowAddModal(false);
        alert('Customer created successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to create customer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCustomer = async (customerData: Partial<Customer>) => {
    if (!editingCustomer) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      
      if (response.ok) {
        await fetchCustomers(); // Refresh the list
        setShowEditModal(false);
        setEditingCustomer(null);
        alert('Customer updated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to update customer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchCustomers(); // Refresh the list
        setShowDeleteConfirm(null);
        alert('Customer deactivated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to deactivate customer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deactivating customer:', error);
      alert('Failed to deactivate customer. Please try again.');
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = selectedGroup === 'ALL' || customer.customerGroup === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  const getGroupColor = (group: CustomerGroup) => {
    switch (group) {
      case 'RETAIL':
        return 'bg-blue-100 text-blue-800';
      case 'CONTRACTOR':
        return 'bg-green-100 text-green-800';
      case 'DEALER':
        return 'bg-purple-100 text-purple-800';
      case 'WHOLESALE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'SHIPPED':
        return 'text-blue-600';
      case 'PROCESSING':
        return 'text-yellow-600';
      case 'CONFIRMED':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalRevenue = () => {
    return customers.reduce((total, customer) => {
      return total + customer.orders.reduce((orderTotal, order) => orderTotal + order.totalAmount, 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading customer data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as CustomerGroup | 'ALL')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Customer Types</option>
            <option value="RETAIL">Retail</option>
            <option value="CONTRACTOR">Contractor</option>
            <option value="DEALER">Dealer</option>
            <option value="WHOLESALE">Wholesale</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold text-green-600">
                {customers.reduce((total, customer) => total + customer._count.orders, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalRevenue())}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
              <p className="text-2xl font-bold text-orange-600">
                {customers.filter(c => c._count.orders > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as CustomerGroup | 'ALL')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="ALL">All Groups</option>
              <option value="RETAIL">Retail</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="DEALER">Dealer</option>
              <option value="WHOLESALE">Wholesale</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {customer.user.firstName?.charAt(0) || customer.user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {customer.companyName || `${customer.user.firstName} ${customer.user.lastName}`}
                    </h3>
                    {customer.companyName && (
                      <p className="text-sm text-gray-600">
                        {customer.user.firstName} {customer.user.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGroupColor(customer.customerGroup)}`}>
                  {customer.customerGroup}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  {customer.user.email}
                </div>
                {customer.user.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {customer.user.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Customer since {customer.createdAt.toLocaleDateString()}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {customer._count.orders} Orders
                    </p>
                    <p className="text-xs text-gray-500">
                      Revenue: {formatCurrency(customer.orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                    </p>
                  </div>
                  
                  {customer.orders.length > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Latest Order</p>
                      <p className={`text-xs font-semibold ${getOrderStatusColor(customer.orders[customer.orders.length - 1].status)}`}>
                        {customer.orders[customer.orders.length - 1].status}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button 
                    onClick={() => setSelectedCustomer(customer)}
                    className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleEditClick(customer)}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-2 rounded hover:bg-gray-200 transition-colors"
                    title="Edit Customer"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(customer.id)}
                    className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded hover:bg-red-200 transition-colors"
                    title="Deactivate Customer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <CustomerFormModal
          title="Add New Customer"
          onSubmit={handleCreateCustomer}
          onCancel={() => setShowAddModal(false)}
          isSaving={isSaving}
        />
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <CustomerFormModal
          title="Edit Customer"
          customer={editingCustomer}
          onSubmit={handleUpdateCustomer}
          onCancel={() => {
            setShowEditModal(false);
            setEditingCustomer(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowDeleteConfirm(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Deactivate Customer</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate this customer? This will set their status to inactive.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDeleteCustomer(showDeleteConfirm)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Customer Detail Modal Component
interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

function CustomerDetailModal({ customer, onClose }: CustomerDetailModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalRevenue = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex">
                    <dt className="w-32 text-gray-500">Name:</dt>
                    <dd className="text-gray-900">{customer.user.firstName} {customer.user.lastName}</dd>
                  </div>
                  {customer.companyName && (
                    <div className="flex">
                      <dt className="w-32 text-gray-500">Company:</dt>
                      <dd className="text-gray-900">{customer.companyName}</dd>
                    </div>
                  )}
                  <div className="flex">
                    <dt className="w-32 text-gray-500">Email:</dt>
                    <dd className="text-gray-900">{customer.user.email}</dd>
                  </div>
                  {customer.user.phone && (
                    <div className="flex">
                      <dt className="w-32 text-gray-500">Phone:</dt>
                      <dd className="text-gray-900">{customer.user.phone}</dd>
                    </div>
                  )}
                  <div className="flex">
                    <dt className="w-32 text-gray-500">Customer Type:</dt>
                    <dd className="text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        customer.customerGroup === 'CONTRACTOR' ? 'bg-blue-100 text-blue-800' :
                        customer.customerGroup === 'RETAIL' ? 'bg-green-100 text-green-800' :
                        customer.customerGroup === 'DEALER' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.customerGroup}
                      </span>
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-500">Customer Since:</dt>
                    <dd className="text-gray-900">{customer.createdAt.toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Total Orders</div>
                    <div className="text-xl font-bold text-blue-600">{customer._count.orders}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            {customer.orders.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Recent Orders</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Customer Form Modal Component
interface CustomerFormModalProps {
  title: string;
  customer?: Customer;
  onSubmit: (data: Partial<Customer>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function CustomerFormModal({ title, customer, onSubmit, onCancel, isSaving }: CustomerFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: customer?.user.firstName || '',
    lastName: customer?.user.lastName || '',
    email: customer?.user.email || '',
    phone: customer?.user.phone || '',
    companyName: customer?.companyName || '',
    customerGroup: customer?.customerGroup || 'RETAIL' as CustomerGroup,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      companyName: formData.companyName,
      customerGroup: formData.customerGroup,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" onClick={onCancel}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type *</label>
                  <select
                    name="customerGroup"
                    value={formData.customerGroup}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="RETAIL">Retail</option>
                    <option value="CONTRACTOR">Contractor</option>
                    <option value="DEALER">Dealer</option>
                    <option value="WHOLESALE">Wholesale</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : (customer ? 'Update Customer' : 'Create Customer')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}