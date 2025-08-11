'use client';

import { useState, useEffect } from 'react';
import { 
  CubeIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ProductCategory, ProductType, ProductStatus, InventoryMoveType } from '@prisma/client';

type InventoryType = 'INSTALL_MATERIALS' | 'RETAIL_PRODUCTS' | 'DROPSHIP_ITEMS';

interface EnhancedProduct extends Product {
  inventoryType: InventoryType;
  isRetailAvailable: boolean;
  isDropShipAvailable: boolean;
  dropShipSupplierId?: string;
  dropShipSupplierName?: string;
  dropShipLeadTime?: number;
  minOrderQuantity?: number;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  type: ProductType;
  retailPrice: number;
  dealerPrice: number;
  wholesalePrice: number;
  cost: number;
  stockQuantity: number;
  lowStockAlert: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  status: ProductStatus;
}

interface InventoryMove {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: InventoryMoveType;
  quantity: number;
  reference: string;
  notes: string;
  performedBy: string;
  createdAt: string;
}

interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  recentMoves: number;
}

export function InventoryDashboard() {
  const [products, setProducts] = useState<EnhancedProduct[]>([]);
  const [recentMoves, setRecentMoves] = useState<InventoryMove[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState<InventoryType | 'ALL'>('ALL');

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      // Sample inventory data with enhanced product types
      const sampleProducts: EnhancedProduct[] = [
        {
          id: '1',
          sku: 'CCK-001',
          name: 'Complete Court Resurfacing Kit',
          description: '20x 5-gallon buckets with premium court coating material. Covers one full court (80 gallons total).',
          category: 'COMPLETE_COURT_KIT',
          type: 'PHYSICAL',
          retailPrice: 1350.00,
          dealerPrice: 1080.00,
          wholesalePrice: 950.00,
          cost: 485.00,
          stockQuantity: 45,
          lowStockAlert: 10,
          trackInventory: true,
          allowBackorders: false,
          weight: 95.5,
          dimensions: { length: 48.0, width: 32.0, height: 24.0 },
          images: ['/products/court-kit-1.jpg', '/products/court-kit-2.jpg'],
          status: 'ACTIVE',
          inventoryType: 'RETAIL_PRODUCTS',
          isRetailAvailable: true,
          isDropShipAvailable: false
        },
        {
          id: '2',
          sku: 'RM-205',
          name: 'Premium Acrylic Coating - 5 Gallon',
          description: 'High-performance acrylic court coating. Professional grade durability and color retention.',
          category: 'RESURFACING_MATERIALS',
          type: 'PHYSICAL',
          retailPrice: 125.00,
          dealerPrice: 100.00,
          wholesalePrice: 85.00,
          cost: 45.00,
          stockQuantity: 8,
          lowStockAlert: 15,
          trackInventory: true,
          allowBackorders: true,
          weight: 52.3,
          dimensions: { length: 12.5, width: 12.5, height: 15.0 },
          images: ['/products/acrylic-coating.jpg'],
          status: 'ACTIVE',
          inventoryType: 'INSTALL_MATERIALS',
          isRetailAvailable: true,
          isDropShipAvailable: true,
          dropShipSupplierId: 'SUP-001',
          dropShipSupplierName: 'CourtCoat Direct',
          dropShipLeadTime: 5,
          minOrderQuantity: 4
        },
        {
          id: '3',
          sku: 'TE-310',
          name: 'Professional Squeegee Set',
          description: 'Complete squeegee set with multiple blade sizes for optimal surface preparation.',
          category: 'TOOLS_EQUIPMENT',
          type: 'PHYSICAL',
          retailPrice: 285.00,
          dealerPrice: 228.00,
          wholesalePrice: 195.00,
          cost: 125.00,
          stockQuantity: 0,
          lowStockAlert: 5,
          trackInventory: true,
          allowBackorders: false,
          weight: 12.8,
          dimensions: { length: 36.0, width: 8.0, height: 4.0 },
          images: ['/products/squeegee-set.jpg'],
          status: 'ACTIVE',
          inventoryType: 'INSTALL_MATERIALS',
          isRetailAvailable: false,
          isDropShipAvailable: false
        },
        {
          id: '4',
          sku: 'SV-150',
          name: 'Video Consultation - 1 Hour',
          description: 'One-on-one video consultation with court resurfacing expert. Troubleshooting and guidance.',
          category: 'SERVICES',
          type: 'SERVICE',
          retailPrice: 150.00,
          dealerPrice: 120.00,
          wholesalePrice: 150.00,
          cost: 25.00,
          stockQuantity: 999,
          lowStockAlert: 0,
          trackInventory: false,
          allowBackorders: true,
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          images: [],
          status: 'ACTIVE',
          inventoryType: 'RETAIL_PRODUCTS',
          isRetailAvailable: true,
          isDropShipAvailable: false
        },
        {
          id: '5',
          sku: 'DR-001',
          name: 'Court Prep Video Library',
          description: 'Complete digital library of court preparation and application videos.',
          category: 'DIGITAL_RESOURCES',
          type: 'DIGITAL',
          retailPrice: 49.99,
          dealerPrice: 39.99,
          wholesalePrice: 49.99,
          cost: 5.00,
          stockQuantity: 999,
          lowStockAlert: 0,
          trackInventory: false,
          allowBackorders: true,
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          images: ['/products/video-library.jpg'],
          status: 'ACTIVE',
          inventoryType: 'RETAIL_PRODUCTS',
          isRetailAvailable: true,
          isDropShipAvailable: false
        },
        {
          id: '6',
          sku: 'RM-310',
          name: 'Court Patch Material - 50lb Bag',
          description: 'Professional-grade patching compound for repairing cracks and surface imperfections',
          category: 'RESURFACING_MATERIALS',
          type: 'PHYSICAL',
          retailPrice: 85.00,
          dealerPrice: 68.00,
          wholesalePrice: 55.00,
          cost: 28.00,
          stockQuantity: 24,
          lowStockAlert: 10,
          trackInventory: true,
          allowBackorders: false,
          weight: 50.0,
          dimensions: { length: 18.0, width: 12.0, height: 6.0 },
          images: ['/products/patch-material.jpg'],
          status: 'ACTIVE',
          inventoryType: 'INSTALL_MATERIALS',
          isRetailAvailable: false,
          isDropShipAvailable: false
        },
        {
          id: '7',
          sku: 'DS-CLT001',
          name: 'Premium Court Line Tape - Drop Ship',
          description: 'Professional court marking tape - drop shipped from manufacturer',
          category: 'ACCESSORIES',
          type: 'PHYSICAL',
          retailPrice: 150.00,
          dealerPrice: 120.00,
          wholesalePrice: 150.00,
          cost: 75.00,
          stockQuantity: 0,
          lowStockAlert: 0,
          trackInventory: false,
          allowBackorders: true,
          weight: 5.2,
          dimensions: { length: 24.0, width: 24.0, height: 4.0 },
          images: ['/products/court-line-tape.jpg'],
          status: 'ACTIVE',
          inventoryType: 'DROPSHIP_ITEMS',
          isRetailAvailable: true,
          isDropShipAvailable: true,
          dropShipSupplierId: 'SUP-002',
          dropShipSupplierName: 'SportLine Manufacturing',
          dropShipLeadTime: 7,
          minOrderQuantity: 1
        }
      ];

      const sampleMoves: InventoryMove[] = [
        {
          id: '1',
          productId: '1',
          productName: 'Complete Court Resurfacing Kit',
          productSku: 'CCK-001',
          type: 'SALE',
          quantity: -3,
          reference: 'ORD-2025-001',
          notes: 'Sold to ABC Home Courts',
          performedBy: 'John Smith',
          createdAt: '2025-01-28T10:30:00Z'
        },
        {
          id: '2',
          productId: '2',
          productName: 'Premium Acrylic Coating - 5 Gallon',
          productSku: 'RM-205',
          type: 'PURCHASE',
          quantity: 25,
          reference: 'PO-2025-012',
          notes: 'Restocked from supplier',
          performedBy: 'System',
          createdAt: '2025-01-28T08:15:00Z'
        },
        {
          id: '3',
          productId: '3',
          productName: 'Professional Squeegee Set',
          productSku: 'TE-310',
          type: 'SALE',
          quantity: -2,
          reference: 'ORD-2025-002',
          notes: 'Last units sold - now out of stock',
          performedBy: 'Sarah Davis',
          createdAt: '2025-01-27T16:45:00Z'
        },
        {
          id: '4',
          productId: '1',
          productName: 'Complete Court Resurfacing Kit',
          productSku: 'CCK-001',
          type: 'ADJUSTMENT',
          quantity: -1,
          reference: 'ADJ-2025-003',
          notes: 'Damaged during shipping - wrote off',
          performedBy: 'Mike Johnson',
          createdAt: '2025-01-27T14:20:00Z'
        }
      ];

      const sampleStats: InventoryStats = {
        totalProducts: sampleProducts.length,
        totalValue: sampleProducts.reduce((sum, p) => sum + (p.stockQuantity * p.cost), 0),
        lowStockItems: sampleProducts.filter(p => p.trackInventory && p.stockQuantity <= p.lowStockAlert).length,
        outOfStockItems: sampleProducts.filter(p => p.trackInventory && p.stockQuantity === 0).length,
        recentMoves: sampleMoves.length
      };

      setProducts(sampleProducts);
      setRecentMoves(sampleMoves);
      setStats(sampleStats);
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: ProductCategory) => {
    const labels = {
      'COMPLETE_COURT_KIT': 'Complete Kits',
      'RESURFACING_MATERIALS': 'Materials',
      'TOOLS_EQUIPMENT': 'Tools & Equipment',
      'SERVICES': 'Services',
      'DIGITAL_RESOURCES': 'Digital Resources',
      'ACCESSORIES': 'Accessories'
    };
    return labels[category] || category;
  };

  const getInventoryTypeColor = (type: InventoryType) => {
    const colors = {
      'INSTALL_MATERIALS': 'bg-orange-100 text-orange-800',
      'RETAIL_PRODUCTS': 'bg-green-100 text-green-800',
      'DROPSHIP_ITEMS': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getInventoryTypeLabel = (type: InventoryType) => {
    const labels = {
      'INSTALL_MATERIALS': 'Install Materials',
      'RETAIL_PRODUCTS': 'Retail Products',
      'DROPSHIP_ITEMS': 'Drop Ship'
    };
    return labels[type] || type;
  };

  const getMoveTypeColor = (type: InventoryMoveType) => {
    const colors = {
      'SALE': 'text-red-600 bg-red-50',
      'PURCHASE': 'text-green-600 bg-green-50',
      'ADJUSTMENT': 'text-yellow-600 bg-yellow-50',
      'RETURN': 'text-blue-600 bg-blue-50',
      'DAMAGED': 'text-red-600 bg-red-50',
      'TRANSFER': 'text-purple-600 bg-purple-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const getStockStatusColor = (product: Product) => {
    if (!product.trackInventory) return 'text-gray-500';
    if (product.stockQuantity === 0) return 'text-red-600';
    if (product.stockQuantity <= product.lowStockAlert) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
    const matchesInventoryType = inventoryTypeFilter === 'ALL' || product.inventoryType === inventoryTypeFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesInventoryType;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading inventory data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load inventory data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Recent Moves</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.recentMoves}</p>
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
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="COMPLETE_COURT_KIT">Complete Kits</option>
              <option value="RESURFACING_MATERIALS">Materials</option>
              <option value="TOOLS_EQUIPMENT">Tools & Equipment</option>
              <option value="SERVICES">Services</option>
              <option value="DIGITAL_RESOURCES">Digital Resources</option>
              <option value="ACCESSORIES">Accessories</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>

            <select
              value={inventoryTypeFilter}
              onChange={(e) => setInventoryTypeFilter(e.target.value as InventoryType | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="INSTALL_MATERIALS">Install Materials</option>
              <option value="RETAIL_PRODUCTS">Retail Products</option>
              <option value="DROPSHIP_ITEMS">Drop Ship Items</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Products</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Retail Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInventoryTypeColor(product.inventoryType)}`}>
                        {getInventoryTypeLabel(product.inventoryType)}
                      </span>
                      <div className="flex space-x-1">
                        {product.isRetailAvailable && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Retail
                          </span>
                        )}
                        {product.isDropShipAvailable && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Drop Ship
                          </span>
                        )}
                      </div>
                      {product.dropShipSupplierName && (
                        <div className="text-xs text-gray-500">
                          Supplier: {product.dropShipSupplierName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${getStockStatusColor(product)}`}>
                      {product.trackInventory ? product.stockQuantity : '∞'}
                    </div>
                    {product.trackInventory && product.stockQuantity <= product.lowStockAlert && (
                      <div className="text-xs text-yellow-600">Low stock</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(product.retailPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(product.dealerPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {product.trackInventory ? formatCurrency(product.stockQuantity * product.cost) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      product.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Inventory Moves */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Inventory Moves</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentMoves.map((move) => (
                <tr key={move.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{move.productName}</div>
                      <div className="text-sm text-gray-500">SKU: {move.productSku}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMoveTypeColor(move.type)}`}>
                      {move.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${
                      move.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {move.quantity > 0 ? '+' : ''}{move.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {move.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {move.performedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(move.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}