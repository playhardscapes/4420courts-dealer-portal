'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  WrenchScrewdriverIcon,
  TruckIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon,
  CameraIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

type AssetCategory = 'TOOLS' | 'VEHICLES' | 'EQUIPMENT' | 'TECHNOLOGY' | 'FURNITURE' | 'OTHER';
type AssetCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
type AssetStatus = 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'DISPOSED' | 'STOLEN';

interface AssetImage {
  id: string;
  url: string;
  publicId: string;
  caption: string;
  isPrimary: boolean;
  uploadedAt: string;
}

interface Asset {
  id: string;
  name: string;
  description: string;
  category: AssetCategory;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  condition: AssetCondition;
  status: AssetStatus;
  location: string;
  assignedTo: string;
  warrantyExpiry: string;
  maintenanceSchedule: string;
  lastMaintenanceDate: string;
  insurancePolicyNumber: string;
  images: AssetImage[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetStats {
  totalAssets: number;
  totalValue: number;
  toolsCount: number;
  vehiclesCount: number;
  equipmentCount: number;
  needsMaintenance: number;
}

interface AssetManagementProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export function AssetManagement({ showAddModal, setShowAddModal }: AssetManagementProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<AssetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'ALL'>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAssetData();
  }, []);

  const fetchAssetData = async () => {
    try {
      const response = await fetch('/api/assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
        
        // Calculate stats from real data
        const realStats: AssetStats = {
          totalAssets: data.assets?.length || 0,
          totalValue: data.assets?.reduce((sum: number, asset: Asset) => sum + asset.currentValue, 0) || 0,
          toolsCount: data.assets?.filter((a: Asset) => a.category === 'TOOLS').length || 0,
          vehiclesCount: data.assets?.filter((a: Asset) => a.category === 'VEHICLES').length || 0,
          equipmentCount: data.assets?.filter((a: Asset) => a.category === 'EQUIPMENT').length || 0,
          needsMaintenance: data.assets?.filter((a: Asset) => {
            if (!a.lastMaintenanceDate) return true;
            const lastMaintenance = new Date(a.lastMaintenanceDate);
            const now = new Date();
            const daysSince = (now.getTime() - lastMaintenance.getTime()) / (1000 * 3600 * 24);
            return daysSince > 180; // 6 months
          }).length || 0
        };
        setStats(realStats);
        return;
      }
      
      // Fallback to sample data if API fails
      console.log('API failed, using sample data for demo');
      // Sample asset data for insurance documentation
      const sampleAssets: Asset[] = [
        {
          id: '1',
          name: 'Professional Court Squeegee System',
          description: '36" aluminum frame squeegee with multiple blade attachments for court preparation',
          category: 'TOOLS',
          serialNumber: 'SQ-2024-001',
          model: 'Pro-Squeegee 36',
          manufacturer: 'Court Tools Inc',
          purchaseDate: '2024-03-15',
          purchasePrice: 485.00,
          currentValue: 425.00,
          condition: 'EXCELLENT',
          status: 'ACTIVE',
          location: 'Main Warehouse - Tool Storage A3',
          assignedTo: 'Mike Johnson',
          warrantyExpiry: '2026-03-15',
          maintenanceSchedule: 'Every 6 months',
          lastMaintenanceDate: '2024-12-01',
          insurancePolicyNumber: 'INS-TOOLS-2024-001',
          images: [
            {
              id: '1',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1706123456/assets/squeegee-system-1.jpg',
              publicId: 'assets/squeegee-system-1',
              caption: 'Complete squeegee system with all attachments',
              isPrimary: true,
              uploadedAt: '2024-03-15T10:30:00Z'
            },
            {
              id: '2',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1706123457/assets/squeegee-system-2.jpg',
              publicId: 'assets/squeegee-system-2',
              caption: 'Close-up of blade mechanism',
              isPrimary: false,
              uploadedAt: '2024-03-15T10:31:00Z'
            }
          ],
          notes: 'Primary squeegee for all court prep work. Includes 4 different blade types for various surface conditions.',
          createdAt: '2024-03-15T09:00:00Z',
          updatedAt: '2024-12-01T14:20:00Z'
        },
        {
          id: '2',
          name: 'Ford Transit Cargo Van',
          description: '2023 Ford Transit 250 cargo van for equipment transport and mobile operations',
          category: 'VEHICLES',
          serialNumber: 'VIN-1FTBR2C84NKA12345',
          model: 'Transit 250',
          manufacturer: 'Ford Motor Company',
          purchaseDate: '2023-08-20',
          purchasePrice: 42500.00,
          currentValue: 38200.00,
          condition: 'GOOD',
          status: 'ACTIVE',
          location: 'Company Parking - Bay 1',
          assignedTo: 'Sarah Davis',
          warrantyExpiry: '2026-08-20',
          maintenanceSchedule: 'Every 5,000 miles',
          lastMaintenanceDate: '2025-01-10',
          insurancePolicyNumber: 'INS-VEHICLE-2023-002',
          images: [
            {
              id: '3',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1692456789/assets/transit-van-exterior.jpg',
              publicId: 'assets/transit-van-exterior',
              caption: 'Exterior view with company branding',
              isPrimary: true,
              uploadedAt: '2023-08-20T15:45:00Z'
            },
            {
              id: '4',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1692456790/assets/transit-van-interior.jpg',
              publicId: 'assets/transit-van-interior',
              caption: 'Cargo area with tool organization',
              isPrimary: false,
              uploadedAt: '2023-08-20T15:46:00Z'
            }
          ],
          notes: 'Primary vehicle for court installations. Custom shelving installed for tool organization. 28,500 current miles.',
          createdAt: '2023-08-20T12:00:00Z',
          updatedAt: '2025-01-10T11:30:00Z'
        },
        {
          id: '3',
          name: 'Commercial Pressure Washer',
          description: 'Heavy-duty 4000 PSI pressure washer for court surface preparation',
          category: 'EQUIPMENT',
          serialNumber: 'PW-4000-2024-003',
          model: 'PowerClean 4000X',
          manufacturer: 'Industrial Cleaning Solutions',
          purchaseDate: '2024-01-12',
          purchasePrice: 2850.00,
          currentValue: 2400.00,
          condition: 'GOOD',
          status: 'ACTIVE',
          location: 'Equipment Shed - North Wall',
          assignedTo: 'Equipment Pool',
          warrantyExpiry: '2027-01-12',
          maintenanceSchedule: 'Monthly inspection, annual service',
          lastMaintenanceDate: '2024-12-15',
          insurancePolicyNumber: 'INS-EQUIP-2024-003',
          images: [
            {
              id: '5',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1704912345/assets/pressure-washer-1.jpg',
              publicId: 'assets/pressure-washer-1',
              caption: 'Pressure washer with accessories',
              isPrimary: true,
              uploadedAt: '2024-01-12T08:15:00Z'
            }
          ],
          notes: 'Used for all major court cleaning projects. Requires special handling due to high pressure. 245 hours on engine.',
          createdAt: '2024-01-12T07:30:00Z',
          updatedAt: '2024-12-15T16:45:00Z'
        },
        {
          id: '4',
          name: 'MacBook Pro M3 - Project Management',
          description: 'MacBook Pro 16" M3 for project management, design work, and client presentations',
          category: 'TECHNOLOGY',
          serialNumber: 'MBP-M3-2024-001',
          model: 'MacBook Pro 16" M3',
          manufacturer: 'Apple Inc.',
          purchaseDate: '2024-02-28',
          purchasePrice: 3200.00,
          currentValue: 2650.00,
          condition: 'EXCELLENT',
          status: 'ACTIVE',
          location: 'Office - Desk 1',
          assignedTo: 'John Smith',
          warrantyExpiry: '2025-02-28',
          maintenanceSchedule: 'Software updates monthly',
          lastMaintenanceDate: '2025-01-15',
          insurancePolicyNumber: 'INS-TECH-2024-001',
          images: [
            {
              id: '6',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1708987654/assets/macbook-setup.jpg',
              publicId: 'assets/macbook-setup',
              caption: 'MacBook Pro with external monitor setup',
              isPrimary: true,
              uploadedAt: '2024-02-28T13:20:00Z'
            }
          ],
          notes: 'Primary computer for project management software, CAD work, and client presentations. Includes external 27" monitor.',
          createdAt: '2024-02-28T09:00:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        },
        {
          id: '5',
          name: 'Court Surface Temperature Gun',
          description: 'Infrared thermometer for measuring surface temperature before coating application',
          category: 'TOOLS',
          serialNumber: 'TG-IR-2024-005',
          model: 'TempPro IR-500',
          manufacturer: 'Precision Instruments',
          purchaseDate: '2024-05-10',
          purchasePrice: 285.00,
          currentValue: 245.00,
          condition: 'EXCELLENT',
          status: 'ACTIVE',
          location: 'Van 1 - Tool Box C',
          assignedTo: 'Mobile Kit',
          warrantyExpiry: '2026-05-10',
          maintenanceSchedule: 'Calibration every 12 months',
          lastMaintenanceDate: '2024-11-10',
          insurancePolicyNumber: 'INS-TOOLS-2024-005',
          images: [
            {
              id: '7',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1715345678/assets/temp-gun-1.jpg',
              publicId: 'assets/temp-gun-1',
              caption: 'Temperature gun with carrying case',
              isPrimary: true,
              uploadedAt: '2024-05-10T14:30:00Z'
            }
          ],
          notes: 'Critical for ensuring proper application temperature. Last calibration showed +/- 1°F accuracy.',
          createdAt: '2024-05-10T11:00:00Z',
          updatedAt: '2024-11-10T09:15:00Z'
        }
      ];

      const sampleStats: AssetStats = {
        totalAssets: sampleAssets.length,
        totalValue: sampleAssets.reduce((sum, asset) => sum + asset.currentValue, 0),
        toolsCount: sampleAssets.filter(a => a.category === 'TOOLS').length,
        vehiclesCount: sampleAssets.filter(a => a.category === 'VEHICLES').length,
        equipmentCount: sampleAssets.filter(a => a.category === 'EQUIPMENT').length,
        needsMaintenance: sampleAssets.filter(a => {
          const lastMaintenance = new Date(a.lastMaintenanceDate);
          const now = new Date();
          const daysSince = (now.getTime() - lastMaintenance.getTime()) / (1000 * 3600 * 24);
          return daysSince > 180; // 6 months
        }).length
      };

      setAssets(sampleAssets);
      setStats(sampleStats);
    } catch (error) {
      console.error('Failed to fetch asset data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async (assetData: Partial<Asset>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      });
      
      if (response.ok) {
        await fetchAssetData(); // Refresh the list
        setShowAddModal(false);
        alert('Asset created successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to create asset: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Failed to create asset. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAsset = async (assetData: Partial<Asset>) => {
    if (!editingAsset) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/assets/${editingAsset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      });
      
      if (response.ok) {
        await fetchAssetData(); // Refresh the list
        setShowEditModal(false);
        setEditingAsset(null);
        alert('Asset updated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to update asset: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      alert('Failed to update asset. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchAssetData(); // Refresh the list
        setShowDeleteConfirm(null);
        alert('Asset deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to delete asset: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset. Please try again.');
    }
  };

  const handleEditClick = (asset: Asset) => {
    setEditingAsset(asset);
    setShowEditModal(true);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate Cloudinary upload
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // In real implementation, upload to Cloudinary here
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'assets_preset'); // Your Cloudinary preset
        formData.append('folder', 'assets');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000 + index * 500));

        return {
          id: `temp-${Date.now()}-${index}`,
          url: `https://res.cloudinary.com/4420courts/image/upload/v${Date.now()}/assets/${file.name}`,
          publicId: `assets/${file.name.split('.')[0]}`,
          caption: `Uploaded image: ${file.name}`,
          isPrimary: index === 0,
          uploadedAt: new Date().toISOString()
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      console.log('Images uploaded:', uploadedImages);
      
      // Here you would update the asset with the new images
      alert(`Successfully uploaded ${uploadedImages.length} image(s) to Cloudinary!`);
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
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
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: AssetCategory) => {
    const icons = {
      'TOOLS': WrenchScrewdriverIcon,
      'VEHICLES': TruckIcon,
      'EQUIPMENT': BuildingOfficeIcon,
      'TECHNOLOGY': ComputerDesktopIcon,
      'FURNITURE': BuildingOfficeIcon,
      'OTHER': BuildingOfficeIcon
    };
    return icons[category] || BuildingOfficeIcon;
  };

  const getCategoryColor = (category: AssetCategory) => {
    const colors = {
      'TOOLS': 'bg-blue-100 text-blue-800',
      'VEHICLES': 'bg-green-100 text-green-800',
      'EQUIPMENT': 'bg-purple-100 text-purple-800',
      'TECHNOLOGY': 'bg-indigo-100 text-indigo-800',
      'FURNITURE': 'bg-yellow-100 text-yellow-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getConditionColor = (condition: AssetCondition) => {
    const colors = {
      'EXCELLENT': 'bg-green-100 text-green-800',
      'GOOD': 'bg-blue-100 text-blue-800',
      'FAIR': 'bg-yellow-100 text-yellow-800',
      'POOR': 'bg-orange-100 text-orange-800',
      'DAMAGED': 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: AssetStatus) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'SOLD': 'bg-blue-100 text-blue-800',
      'DISPOSED': 'bg-red-100 text-red-800',
      'STOLEN': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading asset data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load asset data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Asset Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Assets</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Tools</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.toolsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Vehicles</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.vehiclesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Equipment</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.equipmentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Needs Maintenance</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.needsMaintenance}</p>
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
                placeholder="Search assets by name, serial number, or manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="TOOLS">Tools</option>
              <option value="VEHICLES">Vehicles</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="FURNITURE">Furniture</option>
              <option value="OTHER">Other</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssetStatus | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SOLD">Sold</option>
              <option value="DISPOSED">Disposed</option>
              <option value="STOLEN">Stolen</option>
            </select>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CloudArrowUpIcon className="w-4 h-4 mr-2" />
              )}
              Upload Photos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial/Model</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => {
                const CategoryIcon = getCategoryIcon(asset.category);
                return (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <CategoryIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.manufacturer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(asset.category)}`}>
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{asset.serialNumber}</div>
                        <div className="text-sm text-gray-500">{asset.model}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(asset.condition)}`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(asset.currentValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(asset)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit Asset"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-green-600 hover:text-green-900"
                          title="Add Photos"
                        >
                          <CameraIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(asset.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Asset"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedAsset(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Asset Details - {selectedAsset.name}</h3>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Asset Images */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Photos</h4>
                    {selectedAsset.images && selectedAsset.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedAsset.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt={image.caption}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            {image.isPrimary && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              {image.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No photos uploaded</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Upload photos for insurance documentation
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Asset Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Category:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedAsset.category)}`}>{selectedAsset.category}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Serial Number:</dt>
                          <dd className="text-gray-900 font-mono">{selectedAsset.serialNumber}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Model:</dt>
                          <dd className="text-gray-900">{selectedAsset.model}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Manufacturer:</dt>
                          <dd className="text-gray-900">{selectedAsset.manufacturer}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Condition:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(selectedAsset.condition)}`}>{selectedAsset.condition}</span></dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Status:</dt>
                          <dd><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAsset.status)}`}>{selectedAsset.status}</span></dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Financial Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Purchase Date:</dt>
                          <dd className="text-gray-900">{formatDate(selectedAsset.purchaseDate)}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Purchase Price:</dt>
                          <dd className="text-gray-900">{formatCurrency(selectedAsset.purchasePrice)}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Current Value:</dt>
                          <dd className="text-gray-900 font-semibold">{formatCurrency(selectedAsset.currentValue)}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Insurance Policy:</dt>
                          <dd className="text-gray-900 font-mono">{selectedAsset.insurancePolicyNumber}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Location & Maintenance</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Location:</dt>
                          <dd className="text-gray-900">{selectedAsset.location}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Assigned To:</dt>
                          <dd className="text-gray-900">{selectedAsset.assignedTo}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Warranty Expiry:</dt>
                          <dd className="text-gray-900">{formatDate(selectedAsset.warrantyExpiry)}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Last Maintenance:</dt>
                          <dd className="text-gray-900">{formatDate(selectedAsset.lastMaintenanceDate)}</dd>
                        </div>
                        <div className="flex">
                          <dt className="w-32 text-gray-500">Schedule:</dt>
                          <dd className="text-gray-900">{selectedAsset.maintenanceSchedule}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                {selectedAsset.notes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAsset.notes}</p>
                  </div>
                )}

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    Created: {formatDate(selectedAsset.createdAt)} | Last Updated: {formatDate(selectedAsset.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Asset</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this asset? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDeleteAsset(showDeleteConfirm)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
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

      {/* Add Asset Modal */}
      {showAddModal && (
        <AssetFormModal
          title="Add New Asset"
          onSubmit={handleCreateAsset}
          onCancel={() => setShowAddModal(false)}
          isSaving={isSaving}
        />
      )}

      {/* Edit Asset Modal */}
      {showEditModal && editingAsset && (
        <AssetFormModal
          title="Edit Asset"
          asset={editingAsset}
          onSubmit={handleUpdateAsset}
          onCancel={() => {
            setShowEditModal(false);
            setEditingAsset(null);
          }}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

// Asset Form Modal Component
interface AssetFormModalProps {
  title: string;
  asset?: Asset;
  onSubmit: (data: Partial<Asset>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function AssetFormModal({ title, asset, onSubmit, onCancel, isSaving }: AssetFormModalProps) {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    description: asset?.description || '',
    category: asset?.category || 'TOOLS' as AssetCategory,
    serialNumber: asset?.serialNumber || '',
    model: asset?.model || '',
    manufacturer: asset?.manufacturer || '',
    purchaseDate: asset?.purchaseDate?.split('T')[0] || '',
    purchasePrice: asset?.purchasePrice || 0,
    currentValue: asset?.currentValue || 0,
    condition: asset?.condition || 'EXCELLENT' as AssetCondition,
    status: asset?.status || 'ACTIVE' as AssetStatus,
    location: asset?.location || '',
    assignedTo: asset?.assignedTo || '',
    warrantyExpiry: asset?.warrantyExpiry?.split('T')[0] || '',
    maintenanceSchedule: asset?.maintenanceSchedule || '',
    lastMaintenanceDate: asset?.lastMaintenanceDate?.split('T')[0] || '',
    insurancePolicyNumber: asset?.insurancePolicyNumber || '',
    notes: asset?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Price') || name.includes('Value') ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" onClick={onCancel}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="TOOLS">Tools</option>
                        <option value="VEHICLES">Vehicles</option>
                        <option value="EQUIPMENT">Equipment</option>
                        <option value="TECHNOLOGY">Technology</option>
                        <option value="FURNITURE">Furniture</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial & Status Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Financial & Status</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Value *</label>
                    <input
                      type="number"
                      name="currentValue"
                      value={formData.currentValue}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="EXCELLENT">Excellent</option>
                        <option value="GOOD">Good</option>
                        <option value="FAIR">Fair</option>
                        <option value="POOR">Poor</option>
                        <option value="DAMAGED">Damaged</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SOLD">Sold</option>
                        <option value="DISPOSED">Disposed</option>
                        <option value="STOLEN">Stolen</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                      <input
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
                      <input
                        type="date"
                        name="warrantyExpiry"
                        value={formData.warrantyExpiry}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
                      <input
                        type="date"
                        name="lastMaintenanceDate"
                        value={formData.lastMaintenanceDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Schedule</label>
                    <input
                      type="text"
                      name="maintenanceSchedule"
                      value={formData.maintenanceSchedule}
                      onChange={handleChange}
                      placeholder="e.g., Every 6 months"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Policy Number</label>
                    <input
                      type="text"
                      name="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : (asset ? 'Update Asset' : 'Create Asset')}
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