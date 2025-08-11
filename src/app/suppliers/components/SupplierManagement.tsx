'use client';

import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type SupplierType = 'RETAILER' | 'DISTRIBUTOR' | 'MANUFACTURER' | 'SERVICE_PROVIDER';
type SupplierStatus = 'ACTIVE' | 'INACTIVE' | 'PREFERRED' | 'SUSPENDED';

interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  status: SupplierStatus;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessType: string;
  paymentTerms: string;
  rating: number;
  totalOrders: number;
  lastOrderDate: string;
  categories: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  preferredSuppliers: number;
  avgRating: number;
  totalOrders: number;
  onTimeDelivery: number;
}

interface SupplierFormData {
  name: string;
  type: SupplierType;
  status: SupplierStatus;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessType: string;
  paymentTerms: string;
  categories: string[];
  notes: string;
}

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<SupplierType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | 'ALL'>('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    type: 'RETAILER',
    status: 'ACTIVE',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    businessType: '',
    paymentTerms: '',
    categories: [],
    notes: ''
  });

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      // Sample supplier data
      const sampleSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Amazon Business',
          type: 'RETAILER',
          status: 'ACTIVE',
          contactPerson: 'Business Support Team',
          phone: '1-888-280-4331',
          email: 'business-support@amazon.com',
          website: 'https://business.amazon.com',
          address: {
            street: '410 Terry Ave N',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98109',
            country: 'USA'
          },
          businessType: 'E-commerce Platform',
          paymentTerms: 'Credit Card - Immediate',
          rating: 4.2,
          totalOrders: 47,
          lastOrderDate: '2025-01-15',
          categories: ['Tools', 'Equipment', 'Safety Gear'],
          notes: 'Primary supplier for general tools and equipment. Business Prime account provides fast shipping.',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2025-01-15T14:30:00Z'
        },
        {
          id: '2',
          name: 'Lowes Pro',
          type: 'RETAILER',
          status: 'PREFERRED',
          contactPerson: 'Sarah Johnson',
          phone: '1-800-445-6937',
          email: 'pro-services@lowes.com',
          website: 'https://www.lowes.com/l/pro',
          address: {
            street: '1000 Lowes Blvd',
            city: 'Mooresville',
            state: 'NC',
            zipCode: '28117',
            country: 'USA'
          },
          businessType: 'Home Improvement Retailer',  
          paymentTerms: 'Net 30',
          rating: 4.5,
          totalOrders: 23,
          lastOrderDate: '2025-01-22',
          categories: ['Construction Materials', 'Tools', 'Hardware'],
          notes: 'Excellent for bulk orders. Pro account provides contractor discounts and dedicated support.',
          createdAt: '2024-02-20T10:15:00Z',
          updatedAt: '2025-01-22T11:45:00Z'
        },
        {
          id: '3',
          name: 'Home Depot Pro',
          type: 'RETAILER',
          status: 'ACTIVE',
          contactPerson: 'Mike Rodriguez',
          phone: '1-800-466-3337',
          email: 'prosales@homedepot.com',
          website: 'https://www.homedepot.com/c/pro',
          address: {
            street: '2455 Paces Ferry Rd NW',
            city: 'Atlanta',
            state: 'GA',
            zipCode: '30339',
            country: 'USA'
          },
          businessType: 'Home Improvement Retailer',
          paymentTerms: 'Net 30',
          rating: 4.3,
          totalOrders: 31,
          lastOrderDate: '2025-01-18',
          categories: ['Construction Materials', 'Tools', 'Paint & Supplies'],
          notes: 'Good for standard construction materials. Pro Xtra program provides volume discounts.',
          createdAt: '2024-02-25T08:30:00Z',
          updatedAt: '2025-01-18T16:20:00Z'
        },
        {
          id: '4', 
          name: 'ICP Building Solutions',
          type: 'DISTRIBUTOR',
          status: 'PREFERRED',
          contactPerson: 'Jennifer Chen',
          phone: '1-877-447-4228',
          email: 'sales@icpbuildingsolutions.com',
          website: 'https://www.icpbuildingsolutions.com',
          address: {
            street: '15 Stevens St',
            city: 'Andover',
            state: 'MA',
            zipCode: '01810',
            country: 'USA'
          },
          businessType: 'Specialty Construction Distributor',
          paymentTerms: 'Net 30',
          rating: 4.8,
          totalOrders: 15,
          lastOrderDate: '2025-01-10',
          categories: ['Specialty Coatings', 'Surface Preparation', 'Application Tools'],
          notes: 'Specialist in court surface materials. Excellent technical support and product knowledge.',
          createdAt: '2024-03-10T11:00:00Z',
          updatedAt: '2025-01-10T09:15:00Z'
        },
        {
          id: '5',
          name: 'Berkley Specialties',  
          type: 'MANUFACTURER',
          status: 'ACTIVE',
          contactPerson: 'Robert Kim',
          phone: '1-510-845-7000',
          email: 'sales@berkleyspec.com',
          website: 'https://www.berkleyspecialties.com',
          address: {
            street: '1985 Fourth St',
            city: 'Berkeley',
            state: 'CA',
            zipCode: '94710',
            country: 'USA'
          },
          businessType: 'Specialty Coatings Manufacturer',
          paymentTerms: 'Net 45',
          rating: 4.6,
          totalOrders: 8,
          lastOrderDate: '2024-12-20',
          categories: ['Premium Coatings', 'Sealers', 'Specialty Chemicals'],
          notes: 'Premium coating manufacturer. Higher cost but superior quality. Direct manufacturer pricing.',
          createdAt: '2024-04-05T13:45:00Z',
          updatedAt: '2024-12-20T10:30:00Z'
        },
        {
          id: '6',
          name: 'Vevor Equipment',
          type: 'MANUFACTURER',
          status: 'ACTIVE', 
          contactPerson: 'Lisa Wang',
          phone: '1-833-638-8699',
          email: 'support@vevor.com',
          website: 'https://www.vevor.com',
          address: {
            street: '2323 S Sepulveda Blvd',
            city: 'Los Angeles',
            state: 'CA', 
            zipCode: '90064',
            country: 'USA'
          },
          businessType: 'Equipment Manufacturer & Distributor',
          paymentTerms: 'Credit Card - Immediate',
          rating: 3.9,
          totalOrders: 12,
          lastOrderDate: '2025-01-05',
          categories: ['Pressure Washers', 'Power Tools', 'Industrial Equipment'],
          notes: 'Good value equipment supplier. Quality varies by product line. Fast shipping from US warehouse.',
          createdAt: '2024-05-15T14:20:00Z',
          updatedAt: '2025-01-05T12:10:00Z'
        }
      ];

      const sampleStats: SupplierStats = {
        totalSuppliers: sampleSuppliers.length,
        activeSuppliers: sampleSuppliers.filter(s => s.status === 'ACTIVE' || s.status === 'PREFERRED').length,
        preferredSuppliers: sampleSuppliers.filter(s => s.status === 'PREFERRED').length,
        avgRating: sampleSuppliers.reduce((sum, s) => sum + s.rating, 0) / sampleSuppliers.length,
        totalOrders: sampleSuppliers.reduce((sum, s) => sum + s.totalOrders, 0),
        onTimeDelivery: 94.2
      };

      setSuppliers(sampleSuppliers);
      setStats(sampleStats);
    } catch (error) {
      console.error('Failed to fetch supplier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async () => {
    try {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...formData,
        rating: 0,
        totalOrders: 0,
        lastOrderDate: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSuppliers(prev => [...prev, newSupplier]);
      setShowAddModal(false);
      resetForm();
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalSuppliers: stats.totalSuppliers + 1,
          activeSuppliers: formData.status === 'ACTIVE' || formData.status === 'PREFERRED' 
            ? stats.activeSuppliers + 1 
            : stats.activeSuppliers,
          preferredSuppliers: formData.status === 'PREFERRED' 
            ? stats.preferredSuppliers + 1 
            : stats.preferredSuppliers
        });
      }
    } catch (error) {
      console.error('Failed to create supplier:', error);
    }
  };

  const handleUpdateSupplier = async () => {
    if (!editingSupplier) return;
    
    try {
      const updatedSupplier: Supplier = {
        ...editingSupplier,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? updatedSupplier : s));
      setEditingSupplier(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update supplier:', error);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      setSuppliers(prev => prev.filter(s => s.id !== supplierId));
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalSuppliers: stats.totalSuppliers - 1
        });
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'RETAILER',
      status: 'ACTIVE',
      contactPerson: '',
      phone: '',
      email: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      businessType: '',
      paymentTerms: '',
      categories: [],
      notes: ''
    });
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      type: supplier.type,
      status: supplier.status,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      website: supplier.website,
      address: supplier.address,
      businessType: supplier.businessType,
      paymentTerms: supplier.paymentTerms,
      categories: supplier.categories,
      notes: supplier.notes
    });
  };

  const getTypeColor = (type: SupplierType) => {
    const colors = {
      'RETAILER': 'bg-blue-100 text-blue-800',
      'DISTRIBUTOR': 'bg-green-100 text-green-800',
      'MANUFACTURER': 'bg-purple-100 text-purple-800',
      'SERVICE_PROVIDER': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: SupplierStatus) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'PREFERRED': 'bg-blue-100 text-blue-800',
      'SUSPENDED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || supplier.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || supplier.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading supplier data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load supplier data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Supplier Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Suppliers</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Preferred</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.preferredSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Avg Rating</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">On-Time %</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.onTimeDelivery}%</p>
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
                placeholder="Search suppliers by name, contact, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as SupplierType | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="RETAILER">Retailer</option>
              <option value="DISTRIBUTOR">Distributor</option>
              <option value="MANUFACTURER">Manufacturer</option>
              <option value="SERVICE_PROVIDER">Service Provider</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SupplierStatus | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PREFERRED">Preferred</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Supplier
            </button>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Suppliers</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.businessType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(supplier.type)}`}>
                      {supplier.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{supplier.contactPerson}</div>
                      <div className="text-sm text-gray-500">{supplier.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{supplier.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {supplier.totalOrders}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {supplier.categories.slice(0, 2).map((category, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {category}
                        </span>
                      ))}
                      {supplier.categories.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{supplier.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedSupplier(supplier)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(supplier)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Supplier"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Supplier"
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

      {/* Add/Edit Supplier Modal */}
      {(showAddModal || editingSupplier) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => {
              setShowAddModal(false);
              setEditingSupplier(null);
              resetForm();
            }}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingSupplier(null);
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
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={formData.businessType}
                      onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Home Improvement Retailer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as SupplierType})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="RETAILER">Retailer</option>
                      <option value="DISTRIBUTOR">Distributor</option>
                      <option value="MANUFACTURER">Manufacturer</option>
                      <option value="SERVICE_PROVIDER">Service Provider</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as SupplierStatus})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PREFERRED">Preferred</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Net 30, Credit Card"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.categories.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData, 
                        categories: e.target.value.split(',').map(cat => cat.trim()).filter(cat => cat)
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Tools, Equipment, Safety Gear"
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
                      placeholder="Additional notes about this supplier..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingSupplier(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingSupplier ? handleUpdateSupplier : handleCreateSupplier}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    {editingSupplier ? 'Update Supplier' : 'Create Supplier'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedSupplier(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{selectedSupplier.name}</h3>
                  <button
                    onClick={() => setSelectedSupplier(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Type:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedSupplier.type)}`}>{selectedSupplier.type}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Status:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSupplier.status)}`}>{selectedSupplier.status}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Business Type:</dt>
                          <dd className="text-gray-900">{selectedSupplier.businessType}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Payment Terms:</dt>
                          <dd className="text-gray-900">{selectedSupplier.paymentTerms}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Contact Person:</dt>
                          <dd className="text-gray-900">{selectedSupplier.contactPerson}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Phone:</dt>
                          <dd className="text-gray-900">{selectedSupplier.phone}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Email:</dt>
                          <dd className="text-gray-900">{selectedSupplier.email}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Website:</dt>
                          <dd>
                            <a href={selectedSupplier.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              {selectedSupplier.website}
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Rating:</dt>
                          <dd className="flex items-center">
                            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-gray-900 font-medium">{selectedSupplier.rating.toFixed(1)}</span>
                          </dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Total Orders:</dt>
                          <dd className="text-gray-900">{selectedSupplier.totalOrders}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Last Order:</dt>
                          <dd className="text-gray-900">
                            {selectedSupplier.lastOrderDate 
                              ? new Date(selectedSupplier.lastOrderDate).toLocaleDateString()
                              : 'No orders yet'
                            }
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.categories.map((category, index) => (
                          <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                      <div className="text-sm text-gray-900">
                        <p>{selectedSupplier.address.street}</p>
                        <p>{selectedSupplier.address.city}, {selectedSupplier.address.state} {selectedSupplier.address.zipCode}</p>
                        <p>{selectedSupplier.address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedSupplier.notes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedSupplier.notes}</p>
                  </div>
                )}

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(selectedSupplier.createdAt).toLocaleDateString()} | 
                    Last Updated: {new Date(selectedSupplier.updatedAt).toLocaleDateString()}
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