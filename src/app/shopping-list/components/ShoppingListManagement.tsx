'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCartIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type Status = 'PENDING' | 'ORDERED' | 'DELIVERED' | 'CANCELLED';

interface ShoppingListItem {
  id: string;
  itemName: string;
  description: string;
  category: string;
  quantity: number;
  estimatedPrice: number;
  priority: Priority;
  status: Status;
  supplierId: string;
  supplierName: string;
  assetId?: string;
  assetName?: string;
  requestedBy: string;
  dateAdded: string;
  dateNeeded: string;
  dateOrdered?: string;
  dateDelivered?: string;
  actualPrice?: number;
  orderNumber?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ShoppingListStats {
  totalItems: number;
  pendingItems: number;
  orderedItems: number;
  deliveredItems: number;
  totalEstimatedValue: number;
  highPriorityItems: number;
  overdueItems: number;
}

interface ShoppingListFormData {
  itemName: string;
  description: string;
  category: string;
  quantity: number;
  estimatedPrice: number;
  priority: Priority;
  status: Status;
  supplierId: string;
  supplierName: string;
  assetId: string;
  assetName: string;
  requestedBy: string;
  dateNeeded: string;
  notes: string;
}

export function ShoppingListManagement() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [stats, setStats] = useState<ShoppingListStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [formData, setFormData] = useState<ShoppingListFormData>({
    itemName: '',
    description: '',
    category: '',
    quantity: 1,
    estimatedPrice: 0,
    priority: 'MEDIUM',
    status: 'PENDING',
    supplierId: '',
    supplierName: '',
    assetId: '',
    assetName: '',
    requestedBy: '',
    dateNeeded: '',
    notes: ''
  });

  useEffect(() => {
    fetchShoppingListData();
  }, []);

  const fetchShoppingListData = async () => {
    try {
      // Sample shopping list data
      const sampleItems: ShoppingListItem[] = [
        {
          id: '1',
          itemName: 'Professional Squeegee Replacement Blades',
          description: 'Replacement rubber blades for 36" aluminum frame squeegee system',
          category: 'Tools & Equipment',
          quantity: 4,
          estimatedPrice: 45.00,
          priority: 'HIGH',
          status: 'PENDING',
          supplierId: '1',
          supplierName: 'Amazon Business',
          assetId: '1',
          assetName: 'Professional Court Squeegee System',
          requestedBy: 'Mike Johnson',
          dateAdded: '2025-01-25',
          dateNeeded: '2025-02-01',
          notes: 'Current blades are worn and leaving streaks. Need before next major project.',
          createdAt: '2025-01-25T10:30:00Z',
          updatedAt: '2025-01-25T10:30:00Z'
        },
        {
          id: '2',
          itemName: 'Pressure Washer Oil Change Kit',
          description: 'Engine oil and filter kit for PowerClean 4000X pressure washer',
          category: 'Maintenance Supplies',
          quantity: 1,
          estimatedPrice: 28.99,
          priority: 'MEDIUM',
          status: 'ORDERED',
          supplierId: '3',
          supplierName: 'Home Depot Pro',
          assetId: '3',
          assetName: 'Commercial Pressure Washer',
          requestedBy: 'Sarah Davis',
          dateAdded: '2025-01-20',
          dateNeeded: '2025-02-15',
          dateOrdered: '2025-01-22',
          orderNumber: 'HD-2025-001234',
          actualPrice: 32.45,
          notes: 'Scheduled maintenance due at 250 hours. Current: 245 hours.',
          createdAt: '2025-01-20T14:15:00Z',
          updatedAt: '2025-01-22T09:20:00Z'
        },
        {
          id: '3',
          itemName: 'Industrial Extension Cords (12 AWG, 50ft)',
          description: 'Heavy-duty outdoor extension cords with GFCI protection',
          category: 'Electrical',
          quantity: 2,
          estimatedPrice: 89.00,
          priority: 'MEDIUM',
          status: 'PENDING',
          supplierId: '2',
          supplierName: 'Lowes Pro',
          requestedBy: 'Mike Johnson',
          dateAdded: '2025-01-23',
          dateNeeded: '2025-02-10',
          notes: 'Need for job site power distribution. Current cords showing wear.',
          createdAt: '2025-01-23T16:45:00Z',
          updatedAt: '2025-01-23T16:45:00Z'
        },
        {
          id: '4',
          itemName: 'Court Surface Temperature Calibration',
          description: 'Professional calibration service for TempPro IR-500 thermometer',
          category: 'Services',
          quantity: 1,
          estimatedPrice: 85.00,
          priority: 'HIGH',
          status: 'PENDING',
          supplierId: '5',
          supplierName: 'Precision Instruments',
          assetId: '5',
          assetName: 'Court Surface Temperature Gun',
          requestedBy: 'John Smith',
          dateAdded: '2025-01-24',
          dateNeeded: '2025-02-05',
          notes: 'Annual calibration due. Critical for quality control.',
          createdAt: '2025-01-24T11:20:00Z',
          updatedAt: '2025-01-24T11:20:00Z'
        },
        {
          id: '5',
          itemName: 'MacBook Pro External Monitor',
          description: '27" 4K monitor for project management workstation setup',
          category: 'Technology',
          quantity: 1,
          estimatedPrice: 299.00,
          priority: 'LOW',
          status: 'DELIVERED',
          supplierId: '1',
          supplierName: 'Amazon Business',
          assetId: '4',
          assetName: 'MacBook Pro M3 - Project Management',
          requestedBy: 'John Smith',
          dateAdded: '2025-01-15',
          dateNeeded: '2025-01-25',
          dateOrdered: '2025-01-16',
          dateDelivered: '2025-01-19',
          orderNumber: 'AMZ-B-2025-005678',
          actualPrice: 289.99,
          notes: 'Productivity enhancement. Delivered and installed successfully.',
          createdAt: '2025-01-15T09:30:00Z',
          updatedAt: '2025-01-19T15:45:00Z'
        },
        {
          id: '6',
          itemName: 'Safety Glasses (12-pack)',
          description: 'ANSI Z87.1 safety glasses with anti-fog coating',
          category: 'Safety Equipment',
          quantity: 12,
          estimatedPrice: 45.00,
          priority: 'MEDIUM',
          status: 'PENDING',
          supplierId: '3',
          supplierName: 'Home Depot Pro',
          requestedBy: 'Sarah Davis',
          dateAdded: '2025-01-26',
          dateNeeded: '2025-02-08',
          notes: 'Stock replenishment for job sites. Current supply running low.',
          createdAt: '2025-01-26T13:10:00Z',
          updatedAt: '2025-01-26T13:10:00Z'
        },
        {
          id: '7',
          itemName: 'Premium Court Coating (5 gallons)',
          description: 'High-performance acrylic court surface coating - Blue',
          category: 'Materials',
          quantity: 5,
          estimatedPrice: 245.00,
          priority: 'URGENT',
          status: 'PENDING',
          supplierId: '4',
          supplierName: 'ICP Building Solutions',
          requestedBy: 'Mike Johnson',
          dateAdded: '2025-01-27',
          dateNeeded: '2025-01-30',
          notes: 'URGENT: Needed for Riverside project starting Monday. Existing stock insufficient.',
          createdAt: '2025-01-27T08:15:00Z',
          updatedAt: '2025-01-27T08:15:00Z'
        },
        {
          id: '8',
          itemName: 'Van Organization Shelving Unit',
          description: 'Modular shelving system for Ford Transit cargo area optimization',
          category: 'Vehicle Equipment',
          quantity: 1,
          estimatedPrice: 385.00,
          priority: 'LOW',
          status: 'PENDING',
          supplierId: '6',
          supplierName: 'Vevor Equipment',
          assetId: '2',
          assetName: 'Ford Transit Cargo Van',
          requestedBy: 'Sarah Davis',
          dateAdded: '2025-01-28',
          dateNeeded: '2025-02-15',
          notes: 'Efficiency improvement. Current organization system needs upgrade.',
          createdAt: '2025-01-28T10:45:00Z',
          updatedAt: '2025-01-28T10:45:00Z'
        }
      ];

      const sampleStats: ShoppingListStats = {
        totalItems: sampleItems.length,
        pendingItems: sampleItems.filter(item => item.status === 'PENDING').length,
        orderedItems: sampleItems.filter(item => item.status === 'ORDERED').length,
        deliveredItems: sampleItems.filter(item => item.status === 'DELIVERED').length,
        totalEstimatedValue: sampleItems
          .filter(item => item.status === 'PENDING')
          .reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0),
        highPriorityItems: sampleItems.filter(item => 
          (item.priority === 'HIGH' || item.priority === 'URGENT') && item.status === 'PENDING'
        ).length,
        overdueItems: sampleItems.filter(item => {
          const needDate = new Date(item.dateNeeded);
          const today = new Date();
          return needDate < today && item.status === 'PENDING';
        }).length
      };

      setItems(sampleItems);
      setStats(sampleStats);
    } catch (error) {
      console.error('Failed to fetch shopping list data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    try {
      const newItem: ShoppingListItem = {
        id: Date.now().toString(),
        ...formData,
        dateAdded: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setItems(prev => [...prev, newItem]);
      setShowAddModal(false);
      resetForm();
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalItems: stats.totalItems + 1,
          pendingItems: formData.status === 'PENDING' ? stats.pendingItems + 1 : stats.pendingItems,
          totalEstimatedValue: formData.status === 'PENDING' 
            ? stats.totalEstimatedValue + (formData.estimatedPrice * formData.quantity)
            : stats.totalEstimatedValue,
          highPriorityItems: (formData.priority === 'HIGH' || formData.priority === 'URGENT') && formData.status === 'PENDING'
            ? stats.highPriorityItems + 1
            : stats.highPriorityItems
        });
      }
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    
    try {
      const updatedItem: ShoppingListItem = {
        ...editingItem,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalItems: stats.totalItems - 1
        });
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleStatusUpdate = async (itemId: string, newStatus: Status) => {
    try {
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: newStatus,
              dateOrdered: newStatus === 'ORDERED' ? new Date().toISOString().split('T')[0] : item.dateOrdered,
              dateDelivered: newStatus === 'DELIVERED' ? new Date().toISOString().split('T')[0] : item.dateDelivered,
              updatedAt: new Date().toISOString()
            }
          : item
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      description: '',
      category: '',
      quantity: 1,
      estimatedPrice: 0,
      priority: 'MEDIUM',
      status: 'PENDING',
      supplierId: '',
      supplierName: '',
      assetId: '',
      assetName: '',
      requestedBy: '',
      dateNeeded: '',
      notes: ''
    });
  };

  const openEditModal = (item: ShoppingListItem) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      estimatedPrice: item.estimatedPrice,
      priority: item.priority,
      status: item.status,
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      assetId: item.assetId || '',
      assetName: item.assetName || '',
      requestedBy: item.requestedBy,
      dateNeeded: item.dateNeeded,
      notes: item.notes
    });
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: Status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ORDERED': 'bg-blue-100 text-blue-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const isOverdue = (dateNeeded: string, status: Status) => {
    if (status !== 'PENDING') return false;
    const needDate = new Date(dateNeeded);
    const today = new Date();
    return needDate < today;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading shopping list...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load shopping list data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shopping List Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.pendingItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Ordered</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.orderedItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Est. Value</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEstimatedValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">High Priority</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.highPriorityItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.overdueItems}</p>
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
                placeholder="Search items by name, description, category, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ORDERED">Ordered</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Shopping List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Shopping List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needed By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${
                  isOverdue(item.dateNeeded, item.status) ? 'bg-red-50' : ''
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.itemName}
                          {isOverdue(item.dateNeeded, item.status) && (
                            <ExclamationTriangleIcon className="inline w-4 h-4 text-red-500 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                        {item.assetName && (
                          <div className="text-xs text-blue-600">For: {item.assetName}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(item.id, e.target.value as Status)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(item.status)}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ORDERED">Ordered</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.supplierName}</div>
                    {item.orderNumber && (
                      <div className="text-xs text-gray-500">Order: {item.orderNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">{formatCurrency(item.estimatedPrice * item.quantity)}</div>
                    {item.actualPrice && (
                      <div className="text-xs text-gray-500">Actual: {formatCurrency(item.actualPrice * item.quantity)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isOverdue(item.dateNeeded, item.status) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(item.dateNeeded).toLocaleDateString()}
                    </div>
                    {item.dateOrdered && (
                      <div className="text-xs text-gray-500">Ordered: {new Date(item.dateOrdered).toLocaleDateString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.requestedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Item"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Item"
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
      </div>

      {/* Add/Edit Item Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => {
              setShowAddModal(false);
              setEditingItem(null);
              resetForm();
            }}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingItem ? 'Edit Shopping List Item' : 'Add New Item'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter item name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Tools & Equipment"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Item description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Price (each) *
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedPrice}
                      onChange={(e) => setFormData({...formData, estimatedPrice: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as Status})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ORDERED">Ordered</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      value={formData.supplierName}
                      onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requested By *
                    </label>
                    <input
                      type="text"
                      value={formData.requestedBy}
                      onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Person requesting this item"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Needed *
                    </label>
                    <input
                      type="date"
                      value={formData.dateNeeded}
                      onChange={(e) => setFormData({...formData, dateNeeded: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Asset (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.assetName}
                      onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Asset this item is for"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingItem ? handleUpdateItem : handleCreateItem}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedItem(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{selectedItem.itemName}</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Item Details</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Description:</dt>
                          <dd className="text-gray-900">{selectedItem.description}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Category:</dt>
                          <dd className="text-gray-900">{selectedItem.category}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Quantity:</dt>
                          <dd className="text-gray-900">{selectedItem.quantity}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Est. Price:</dt>
                          <dd className="text-gray-900">{formatCurrency(selectedItem.estimatedPrice * selectedItem.quantity)}</dd>
                        </div>
                        {selectedItem.actualPrice && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Actual Price:</dt>
                            <dd className="text-gray-900">{formatCurrency(selectedItem.actualPrice * selectedItem.quantity)}</dd>
                          </div>
                        )}
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Priority:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedItem.priority)}`}>{selectedItem.priority}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Status:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedItem.status)}`}>{selectedItem.status}</span></dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Supplier & Ordering</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Supplier:</dt>
                          <dd className="text-gray-900">{selectedItem.supplierName}</dd>
                        </div>
                        {selectedItem.orderNumber && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Order Number:</dt>
                            <dd className="text-gray-900 font-mono">{selectedItem.orderNumber}</dd>
                          </div>
                        )}
                        {selectedItem.dateOrdered && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Date Ordered:</dt>
                            <dd className="text-gray-900">{new Date(selectedItem.dateOrdered).toLocaleDateString()}</dd>
                          </div>
                        )}
                        {selectedItem.dateDelivered && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Date Delivered:</dt>
                            <dd className="text-gray-900">{new Date(selectedItem.dateDelivered).toLocaleDateString()}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Request Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Requested By:</dt>
                          <dd className="text-gray-900">{selectedItem.requestedBy}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Date Added:</dt>
                          <dd className="text-gray-900">{new Date(selectedItem.dateAdded).toLocaleDateString()}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Date Needed:</dt>
                          <dd className={`${isOverdue(selectedItem.dateNeeded, selectedItem.status) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {new Date(selectedItem.dateNeeded).toLocaleDateString()}
                            {isOverdue(selectedItem.dateNeeded, selectedItem.status) && ' (OVERDUE)'}
                          </dd>
                        </div>
                        {selectedItem.assetName && (
                          <div className="flex">
                            <dt className="w-32 text-gray-500">Related Asset:</dt>
                            <dd className="text-blue-600">{selectedItem.assetName}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>

                {selectedItem.notes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedItem.notes}</p>
                  </div>
                )}

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(selectedItem.createdAt).toLocaleDateString()} | 
                    Last Updated: {new Date(selectedItem.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}