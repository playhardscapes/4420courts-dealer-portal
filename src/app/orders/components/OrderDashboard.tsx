'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCartIcon,
  TruckIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PrinterIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  dealerId: string;
  dealerName: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  shippingMethod: string;
  trackingNumber: string;
  shippedAt: string;
  deliveredAt: string;
  paymentStatus: PaymentStatus;
  paidAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      // Sample order data matching the schema
      const sampleOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          customerId: 'cust-1',
          customerName: 'ABC Home Courts',
          customerEmail: 'mike@abchomecourts.com',
          dealerId: 'dealer-1',
          dealerName: 'Pro Court Solutions',
          status: 'SHIPPED',
          subtotal: 4050.00,
          taxAmount: 324.00,
          shippingAmount: 150.00,
          discountAmount: 0.00,
          totalAmount: 4524.00,
          billingAddress: {
            street: '123 Sports Complex Dr',
            city: 'Tampa',
            state: 'FL',
            zipCode: '33601'
          },
          shippingAddress: {
            street: '123 Sports Complex Dr',
            city: 'Tampa',
            state: 'FL',
            zipCode: '33601'
          },
          items: [
            {
              id: '1',
              productId: 'prod-1',
              productName: 'Complete Court Resurfacing Kit',
              productSku: 'CCK-001',
              quantity: 3,
              unitPrice: 1350.00,
              totalPrice: 4050.00
            }
          ],
          shippingMethod: 'Freight Delivery',
          trackingNumber: '1Z9999999999999999',
          shippedAt: '2025-01-27T14:30:00Z',
          deliveredAt: '',
          paymentStatus: 'PAID',
          paidAt: '2025-01-25T16:20:00Z',
          notes: 'Customer requested Saturday delivery',
          createdAt: '2025-01-25T10:15:00Z',
          updatedAt: '2025-01-27T14:30:00Z'
        },
        {
          id: '2',
          orderNumber: 'ORD-2025-002',
          customerId: 'cust-2',
          customerName: 'Elite Sports Surfaces',
          customerEmail: 'sarah@elitesports.com',
          dealerId: 'dealer-1',
          dealerName: 'Pro Court Solutions',
          status: 'PROCESSING',
          subtotal: 2790.00,
          taxAmount: 223.20,
          shippingAmount: 95.00,
          discountAmount: 135.00,
          totalAmount: 2973.20,
          billingAddress: {
            street: '456 Athletic Way',
            city: 'Orlando',
            state: 'FL',
            zipCode: '32801'
          },
          shippingAddress: {
            street: '789 Court Construction Rd',
            city: 'Orlando',
            state: 'FL',
            zipCode: '32805'
          },
          items: [
            {
              id: '2',
              productId: 'prod-1',
              productName: 'Complete Court Resurfacing Kit',
              productSku: 'CCK-001',
              quantity: 2,
              unitPrice: 1350.00,
              totalPrice: 2700.00
            },
            {
              id: '3',
              productId: 'prod-3',
              productName: 'Professional Squeegee Set',
              productSku: 'TE-310',
              quantity: 1,
              unitPrice: 285.00,
              totalPrice: 285.00
            }
          ],
          shippingMethod: 'Standard Ground',
          trackingNumber: '',
          shippedAt: '',
          deliveredAt: '',
          paymentStatus: 'PAID',
          paidAt: '2025-01-26T09:45:00Z',
          notes: '5% dealer discount applied',
          createdAt: '2025-01-26T08:30:00Z',
          updatedAt: '2025-01-28T11:15:00Z'
        },
        {
          id: '3',
          orderNumber: 'ORD-2025-003',
          customerId: 'cust-3',
          customerName: 'Court Masters LLC',
          customerEmail: 'info@courtmasters.com',
          dealerId: 'dealer-2',
          dealerName: 'Southeast Courts',
          status: 'PENDING',
          subtotal: 1875.00,
          taxAmount: 150.00,
          shippingAmount: 75.00,
          discountAmount: 0.00,
          totalAmount: 2100.00,
          billingAddress: {
            street: '321 Recreation Blvd',
            city: 'Atlanta',
            state: 'GA',
            zipCode: '30309'
          },
          shippingAddress: {
            street: '321 Recreation Blvd',
            city: 'Atlanta',
            state: 'GA',
            zipCode: '30309'
          },
          items: [
            {
              id: '4',
              productId: 'prod-2',
              productName: 'Premium Acrylic Coating - 5 Gallon',
              productSku: 'RM-205',
              quantity: 15,
              unitPrice: 125.00,
              totalPrice: 1875.00
            }
          ],
          shippingMethod: 'Expedited',
          trackingNumber: '',
          shippedAt: '',
          deliveredAt: '',
          paymentStatus: 'PENDING',
          paidAt: '',
          notes: 'Payment authorization pending',
          createdAt: '2025-01-28T13:45:00Z',
          updatedAt: '2025-01-28T13:45:00Z'
        },
        {
          id: '4',
          orderNumber: 'ORD-2025-004',
          customerId: 'cust-4',
          customerName: 'Residential Courts Inc',
          customerEmail: 'orders@residentialcourts.com',
          dealerId: 'dealer-1',
          dealerName: 'Pro Court Solutions',
          status: 'DELIVERED',
          subtotal: 1500.00,
          taxAmount: 120.00,
          shippingAmount: 125.00,
          discountAmount: 75.00,
          totalAmount: 1670.00,
          billingAddress: {
            street: '654 Home Sports Ave',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '32207'
          },
          shippingAddress: {
            street: '987 Residential Court Way',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '32208'
          },
          items: [
            {
              id: '5',
              productId: 'prod-1',
              productName: 'Complete Court Resurfacing Kit',
              productSku: 'CCK-001',
              quantity: 1,
              unitPrice: 1350.00,
              totalPrice: 1350.00
            },
            {
              id: '6',
              productId: 'prod-4',
              productName: 'Video Consultation - 1 Hour',
              productSku: 'SV-150',
              quantity: 1,
              unitPrice: 150.00,
              totalPrice: 150.00
            }
          ],
          shippingMethod: 'White Glove Delivery',
          trackingNumber: '1Z8888888888888888',
          shippedAt: '2025-01-24T10:00:00Z',
          deliveredAt: '2025-01-26T15:30:00Z',
          paymentStatus: 'PAID',
          paidAt: '2025-01-23T14:20:00Z',
          notes: 'Customer very satisfied with delivery',
          createdAt: '2025-01-23T12:00:00Z',
          updatedAt: '2025-01-26T15:30:00Z'
        }
      ];

      const sampleStats: OrderStats = {
        totalOrders: sampleOrders.length,
        pendingOrders: sampleOrders.filter(o => o.status === 'PENDING').length,
        shippedOrders: sampleOrders.filter(o => o.status === 'SHIPPED').length,
        completedOrders: sampleOrders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length,
        totalRevenue: sampleOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        avgOrderValue: sampleOrders.reduce((sum, o) => sum + o.totalAmount, 0) / sampleOrders.length
      };

      setOrders(sampleOrders);
      setStats(sampleStats);
    } catch (error) {
      console.error('Failed to fetch order data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'PROCESSING': 'bg-purple-100 text-purple-800',
      'SHIPPED': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'PARTIALLY_PAID': 'bg-blue-100 text-blue-800',
      'FAILED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading order data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load order data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.shippedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Order</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgOrderValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by number, customer, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Payments</option>
              <option value="PENDING">Payment Pending</option>
              <option value="PAID">Paid</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="FAILED">Payment Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.dealerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Print Order"
                      >
                        <PrinterIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedOrder(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Order Details - {selectedOrder.orderNumber}</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Status:</dt>
                        <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Payment:</dt>
                        <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>{selectedOrder.paymentStatus}</span></dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Created:</dt>
                        <dd className="text-gray-900">{formatDate(selectedOrder.createdAt)}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Shipped:</dt>
                        <dd className="text-gray-900">{formatDate(selectedOrder.shippedAt)}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Tracking:</dt>
                        <dd className="text-gray-900">{selectedOrder.trackingNumber || '—'}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Customer & Dealer</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Customer:</dt>
                        <dd className="text-gray-900">{selectedOrder.customerName}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Email:</dt>
                        <dd className="text-gray-900">{selectedOrder.customerEmail}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Dealer:</dt>
                        <dd className="text-gray-900">{selectedOrder.dealerName}</dd>
                      </div>
                      <div className="mt-4">
                        <dt className="text-gray-500 mb-1">Shipping Address:</dt>
                        <dd className="text-gray-900">
                          {selectedOrder.shippingAddress.street}<br/>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                <div className="text-sm text-gray-500">SKU: {item.productSku}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-right text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-2 text-right text-sm text-gray-900">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Order Totals */}
                  <div className="mt-4 flex justify-end">
                    <div className="w-64">
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Subtotal:</dt>
                          <dd className="text-gray-900">{formatCurrency(selectedOrder.subtotal)}</dd>
                        </div>
                        {selectedOrder.discountAmount > 0 && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Discount:</dt>
                            <dd className="text-red-600">-{formatCurrency(selectedOrder.discountAmount)}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Tax:</dt>
                          <dd className="text-gray-900">{formatCurrency(selectedOrder.taxAmount)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Shipping:</dt>
                          <dd className="text-gray-900">{formatCurrency(selectedOrder.shippingAmount)}</dd>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-1 font-medium">
                          <dt className="text-gray-900">Total:</dt>
                          <dd className="text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}