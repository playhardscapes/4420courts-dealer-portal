'use client';

import { useState, useEffect } from 'react';
import { Customer, getAllCustomers, getCustomerDisplayName } from '../data/customers';
import { 
  CameraIcon,
  PhotoIcon,
  FolderIcon,
  CalendarIcon,
  MapPinIcon,
  DocumentTextIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ProjectPhoto {
  id: string;
  projectId: string;
  projectName: string;
  customerId: string;
  customerName: string;
  filename: string;
  url: string;
  category: 'before' | 'during' | 'after' | 'issue' | 'progress' | 'equipment' | 'materials' | 'documentation';
  phase: 'prep' | 'primer' | 'base' | 'texture' | 'lines' | 'final' | 'warranty' | 'other';
  dateTaken: string;
  timeTaken: string;
  location?: string;
  description?: string;
  tags: string[];
  weatherConditions?: string;
  capturedBy: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  metadata?: {
    temperature?: string;
    humidity?: string;
    windConditions?: string;
    lightingConditions?: string;
  };
}

interface ProjectPhotoAlbum {
  projectId: string;
  projectName: string;
  customerName: string;
  startDate: string;
  status: 'active' | 'completed' | 'archived';
  totalPhotos: number;
  categories: {
    before: number;
    during: number;
    after: number;
    issue: number;
    progress: number;
    equipment: number;
    materials: number;
    documentation: number;
  };
  lastPhotoDate?: string;
}

const categoryConfig = {
  before: { label: 'Before', color: 'bg-red-100 text-red-800', icon: CameraIcon },
  during: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  after: { label: 'After', color: 'bg-green-100 text-green-800', icon: PhotoIcon },
  issue: { label: 'Issues', color: 'bg-orange-100 text-orange-800', icon: DocumentTextIcon },
  progress: { label: 'Progress', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  equipment: { label: 'Equipment', color: 'bg-purple-100 text-purple-800', icon: CameraIcon },
  materials: { label: 'Materials', color: 'bg-indigo-100 text-indigo-800', icon: PhotoIcon },
  documentation: { label: 'Documentation', color: 'bg-gray-100 text-gray-800', icon: DocumentTextIcon }
};

const phaseConfig = {
  prep: { label: 'Surface Prep', color: 'bg-gray-100 text-gray-800' },
  primer: { label: 'Primer', color: 'bg-blue-100 text-blue-800' },
  base: { label: 'Base Coat', color: 'bg-green-100 text-green-800' },
  texture: { label: 'Texture', color: 'bg-yellow-100 text-yellow-800' },
  lines: { label: 'Line Painting', color: 'bg-purple-100 text-purple-800' },
  final: { label: 'Final', color: 'bg-green-100 text-green-800' },
  warranty: { label: 'Warranty', color: 'bg-orange-100 text-orange-800' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-800' }
};

export default function ProjectPhotoDocumentation() {
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [albums, setAlbums] = useState<ProjectPhotoAlbum[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [viewMode, setViewMode] = useState<'albums' | 'photos'>('albums');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPhase, setFilterPhase] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load customers and sample data
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
    
    // Sample project albums
    const sampleAlbums: ProjectPhotoAlbum[] = [
      {
        projectId: 'proj_001',
        projectName: 'Botetourt County - Tennis Courts 3 & 4',
        customerName: 'Botetourt County Parks & Recreation',
        startDate: '2025-02-15',
        status: 'active',
        totalPhotos: 47,
        categories: {
          before: 8,
          during: 25,
          after: 4,
          issue: 3,
          progress: 15,
          equipment: 4,
          materials: 6,
          documentation: 7
        },
        lastPhotoDate: '2025-01-30'
      },
      {
        projectId: 'proj_002',
        projectName: 'Riverside Estates HOA - Tennis Courts',
        customerName: 'Riverside Estates HOA',
        startDate: '2025-03-01',
        status: 'active',
        totalPhotos: 23,
        categories: {
          before: 12,
          during: 8,
          after: 0,
          issue: 1,
          progress: 8,
          equipment: 2,
          materials: 3,
          documentation: 4
        },
        lastPhotoDate: '2025-01-28'
      },
      {
        projectId: 'proj_003',
        projectName: 'Elite Sports Academy - Court Complex',
        customerName: 'Elite Sports Academy',
        startDate: '2024-12-10',
        status: 'completed',
        totalPhotos: 89,
        categories: {
          before: 15,
          during: 45,
          after: 18,
          issue: 4,
          progress: 35,
          equipment: 8,
          materials: 12,
          documentation: 15
        },
        lastPhotoDate: '2025-01-05'
      }
    ];
    
    setAlbums(sampleAlbums);
    
    // Sample photos for Botetourt County project
    const samplePhotos: ProjectPhoto[] = [
      {
        id: 'photo_001',
        projectId: 'proj_001',
        projectName: 'Botetourt County - Tennis Courts 3 & 4',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        filename: 'court3_before_01.jpg',
        url: '/api/photos/court3_before_01.jpg',
        category: 'before',
        phase: 'prep',
        dateTaken: '2025-01-28',
        timeTaken: '09:15',
        location: 'Court 3 - North End',
        description: 'Existing court surface showing significant cracking along baseline. Note water damage near net post.',
        tags: ['cracking', 'water damage', 'baseline', 'assessment'],
        weatherConditions: 'Clear, 45°F',
        capturedBy: 'Site Supervisor',
        fileSize: 2.3,
        dimensions: { width: 1920, height: 1080 },
        metadata: {
          temperature: '45°F',
          humidity: '65%',
          lightingConditions: 'Natural morning light'
        }
      },
      {
        id: 'photo_002',
        projectId: 'proj_001',
        projectName: 'Botetourt County - Tennis Courts 3 & 4',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        filename: 'court4_surface_prep.jpg',
        url: '/api/photos/court4_surface_prep.jpg',
        category: 'during',
        phase: 'prep',
        dateTaken: '2025-01-29',
        timeTaken: '14:30',
        location: 'Court 4 - Center Court',
        description: 'Surface preparation in progress. Crack filling completed, surface cleaning underway with pressure washing.',
        tags: ['prep work', 'pressure washing', 'crack repair', 'progress'],
        weatherConditions: 'Partly cloudy, 52°F',
        capturedBy: 'Field Team Lead',
        fileSize: 3.1,
        dimensions: { width: 1920, height: 1080 },
        metadata: {
          temperature: '52°F',
          humidity: '55%',
          windConditions: 'Light breeze 5-8 mph',
          lightingConditions: 'Overcast, good for work'
        }
      },
      {
        id: 'photo_003',
        projectId: 'proj_001',
        projectName: 'Botetourt County - Tennis Courts 3 & 4',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        filename: 'materials_delivery.jpg',
        url: '/api/photos/materials_delivery.jpg',
        category: 'materials',
        phase: 'other',
        dateTaken: '2025-01-30',
        timeTaken: '07:45',
        location: 'Equipment Staging Area',
        description: 'Material delivery completed. 20 buckets acrylic resurfacer, primer, and line paint. All materials checked and staged.',
        tags: ['delivery', 'acrylic resurfacer', 'staging', 'inventory'],
        weatherConditions: 'Clear, 42°F',
        capturedBy: 'Project Manager',
        fileSize: 2.8,
        dimensions: { width: 1920, height: 1080 },
        metadata: {
          temperature: '42°F',
          humidity: '70%',
          lightingConditions: 'Early morning natural light'
        }
      },
      {
        id: 'photo_004',
        projectId: 'proj_001',
        projectName: 'Botetourt County - Tennis Courts 3 & 4',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        filename: 'issue_drainage.jpg',
        url: '/api/photos/issue_drainage.jpg',
        category: 'issue',
        phase: 'prep',
        dateTaken: '2025-01-30',
        timeTaken: '11:20',
        location: 'Court 3 - Southwest Corner',
        description: 'ISSUE: Discovered drainage problem in southwest corner. Standing water after rain. Need to address before primer application.',
        tags: ['drainage', 'standing water', 'issue', 'delay'],
        weatherConditions: 'After rain, 48°F',
        capturedBy: 'Site Supervisor',
        fileSize: 2.1,
        dimensions: { width: 1920, height: 1080 },
        metadata: {
          temperature: '48°F',
          humidity: '85%',
          lightingConditions: 'Overcast post-rain'
        }
      }
    ];
    
    setPhotos(samplePhotos);
  }, []);

  const [uploadFormData, setUploadFormData] = useState({
    projectId: '',
    category: 'progress' as const,
    phase: 'other' as const,
    location: '',
    description: '',
    tags: '',
    weatherConditions: '',
    capturedBy: 'Project Manager',
    metadata: {
      temperature: '',
      humidity: '',
      windConditions: '',
      lightingConditions: ''
    }
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const selectedAlbumData = albums.find(a => a.projectId === uploadFormData.projectId);
    if (!selectedAlbumData) return;

    Array.from(files).forEach((file, index) => {
      const newPhoto: ProjectPhoto = {
        id: `photo_${Date.now()}_${index}`,
        projectId: uploadFormData.projectId,
        projectName: selectedAlbumData.projectName,
        customerId: 'cust_temp', // Would be set from selected album
        customerName: selectedAlbumData.customerName,
        filename: file.name,
        url: URL.createObjectURL(file),
        category: uploadFormData.category,
        phase: uploadFormData.phase,
        dateTaken: new Date().toISOString().split('T')[0],
        timeTaken: new Date().toTimeString().slice(0, 5),
        location: uploadFormData.location,
        description: uploadFormData.description,
        tags: uploadFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        weatherConditions: uploadFormData.weatherConditions,
        capturedBy: uploadFormData.capturedBy,
        fileSize: Number((file.size / (1024 * 1024)).toFixed(1)),
        dimensions: { width: 1920, height: 1080 }, // Would be determined from actual file
        metadata: {
          temperature: uploadFormData.metadata.temperature,
          humidity: uploadFormData.metadata.humidity,
          windConditions: uploadFormData.metadata.windConditions,
          lightingConditions: uploadFormData.metadata.lightingConditions
        }
      };

      setPhotos([newPhoto, ...photos]);
    });

    // Update album photo count
    setAlbums(albums.map(album => 
      album.projectId === uploadFormData.projectId 
        ? {
            ...album,
            totalPhotos: album.totalPhotos + files.length,
            categories: {
              ...album.categories,
              [uploadFormData.category]: album.categories[uploadFormData.category] + files.length
            },
            lastPhotoDate: new Date().toISOString().split('T')[0]
          }
        : album
    ));

    setShowUploadForm(false);
    setUploadFormData({
      projectId: '',
      category: 'progress',
      phase: 'other',
      location: '',
      description: '',
      tags: '',
      weatherConditions: '',
      capturedBy: 'Project Manager',
      metadata: {
        temperature: '',
        humidity: '',
        windConditions: '',
        lightingConditions: ''
      }
    });
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesAlbum = selectedAlbum === '' || photo.projectId === selectedAlbum;
    const matchesCategory = filterCategory === '' || photo.category === filterCategory;
    const matchesPhase = filterPhase === '' || photo.phase === filterPhase;
    const matchesSearch = searchTerm === '' || 
      photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      photo.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAlbum && matchesCategory && matchesPhase && matchesSearch;
  });

  const formatFileSize = (sizeInMB: number): string => {
    return sizeInMB < 1 ? `${(sizeInMB * 1024).toFixed(0)} KB` : `${sizeInMB.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <PhotoIcon className="h-5 w-5 mr-2 text-blue-500" />
              Project Photo Documentation
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Organize and manage project photos by phase and category
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('albums')}
                className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'albums' ? 'bg-white shadow-sm' : ''}`}
              >
                Albums
              </button>
              <button
                onClick={() => setViewMode('photos')}
                className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'photos' ? 'bg-white shadow-sm' : ''}`}
              >
                Photos
              </button>
            </div>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Upload Photos
            </button>
          </div>
        </div>

        {/* Filters for Photo View */}
        {viewMode === 'photos' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Projects</option>
              {albums.map(album => (
                <option key={album.projectId} value={album.projectId}>
                  {album.projectName}
                </option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Phases</option>
              {Object.entries(phaseConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <FunnelIcon className="h-4 w-4 mr-1" />
              {filteredPhotos.length} photos
            </div>
          </div>
        )}
      </div>

      {/* Albums View */}
      {viewMode === 'albums' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div key={album.projectId} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{album.projectName}</h3>
                  <p className="text-gray-600 text-sm">{album.customerName}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Started {new Date(album.startDate).toLocaleDateString()}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  album.status === 'active' ? 'bg-green-100 text-green-800' :
                  album.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {album.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Photos</span>
                  <span className="font-medium">{album.totalPhotos}</span>
                </div>
                {album.lastPhotoDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Photo</span>
                    <span className="text-gray-500">{new Date(album.lastPhotoDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(album.categories)
                    .filter(([_, count]) => count > 0)
                    .slice(0, 6)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${categoryConfig[category as keyof typeof categoryConfig].color}`}>
                          {categoryConfig[category as keyof typeof categoryConfig].label}
                        </span>
                        <span className="text-gray-600">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedAlbum(album.projectId);
                    setViewMode('photos');
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View Photos
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                  <ShareIcon className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photos View */}
      {viewMode === 'photos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div 
                className="relative h-48 bg-gray-200 cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute top-2 left-2 flex space-x-1">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${categoryConfig[photo.category].color}`}>
                    {categoryConfig[photo.category].label}
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${phaseConfig[photo.phase].color}`}>
                    {phaseConfig[photo.phase].label}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button className="p-1 bg-white/80 rounded hover:bg-white">
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(photo.dateTaken).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {photo.timeTaken}
                  </div>
                </div>
                
                {photo.location && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {photo.location}
                  </div>
                )}
                
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {photo.description}
                </p>
                
                {photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {photo.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{photo.tags.length - 3} more</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatFileSize(photo.fileSize)}</span>
                  <span>{photo.dimensions.width}×{photo.dimensions.height}</span>
                  <span>{photo.capturedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPhotos.length === 0 && viewMode === 'photos' && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-500">Upload photos or adjust your filters</p>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{selectedPhoto.filename}</h2>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photo */}
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                  <PhotoIcon className="h-24 w-24 text-gray-400" />
                </div>
                
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Project Information</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Project:</strong> {selectedPhoto.projectName}</div>
                      <div><strong>Customer:</strong> {selectedPhoto.customerName}</div>
                      <div><strong>Date:</strong> {new Date(selectedPhoto.dateTaken).toLocaleDateString()} at {selectedPhoto.timeTaken}</div>
                      {selectedPhoto.location && <div><strong>Location:</strong> {selectedPhoto.location}</div>}
                      <div><strong>Captured by:</strong> {selectedPhoto.capturedBy}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Categorization</h3>
                    <div className="flex space-x-2 mb-2">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${categoryConfig[selectedPhoto.category].color}`}>
                        {categoryConfig[selectedPhoto.category].label}
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${phaseConfig[selectedPhoto.phase].color}`}>
                        {phaseConfig[selectedPhoto.phase].label}
                      </span>
                    </div>
                    {selectedPhoto.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedPhoto.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedPhoto.description && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700 text-sm">{selectedPhoto.description}</p>
                    </div>
                  )}
                  
                  {selectedPhoto.weatherConditions && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Weather Conditions</h3>
                      <p className="text-gray-700 text-sm">{selectedPhoto.weatherConditions}</p>
                    </div>
                  )}
                  
                  {selectedPhoto.metadata && Object.values(selectedPhoto.metadata).some(v => v) && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Metadata</h3>
                      <div className="space-y-1 text-sm">
                        {selectedPhoto.metadata.temperature && <div><strong>Temperature:</strong> {selectedPhoto.metadata.temperature}</div>}
                        {selectedPhoto.metadata.humidity && <div><strong>Humidity:</strong> {selectedPhoto.metadata.humidity}</div>}
                        {selectedPhoto.metadata.windConditions && <div><strong>Wind:</strong> {selectedPhoto.metadata.windConditions}</div>}
                        {selectedPhoto.metadata.lightingConditions && <div><strong>Lighting:</strong> {selectedPhoto.metadata.lightingConditions}</div>}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">File Information</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Size:</strong> {formatFileSize(selectedPhoto.fileSize)}</div>
                      <div><strong>Dimensions:</strong> {selectedPhoto.dimensions.width} × {selectedPhoto.dimensions.height}</div>
                      <div><strong>Filename:</strong> {selectedPhoto.filename}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Project Photos</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={uploadFormData.projectId}
                    onChange={(e) => setUploadFormData({...uploadFormData, projectId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select project...</option>
                    {albums.filter(a => a.status !== 'archived').map(album => (
                      <option key={album.projectId} value={album.projectId}>
                        {album.projectName} - {album.customerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={uploadFormData.category}
                      onChange={(e) => setUploadFormData({...uploadFormData, category: e.target.value as any})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
                    <select
                      value={uploadFormData.phase}
                      onChange={(e) => setUploadFormData({...uploadFormData, phase: e.target.value as any})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      {Object.entries(phaseConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={uploadFormData.location}
                    onChange={(e) => setUploadFormData({...uploadFormData, location: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Court 3 - North End, Equipment Staging Area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={uploadFormData.description}
                    onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Describe what the photos show..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={uploadFormData.tags}
                      onChange={(e) => setUploadFormData({...uploadFormData, tags: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="cracking, prep work, progress"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
                    <input
                      type="text"
                      value={uploadFormData.weatherConditions}
                      onChange={(e) => setUploadFormData({...uploadFormData, weatherConditions: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Clear, 65°F"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Additional Metadata (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                      <input
                        type="text"
                        value={uploadFormData.metadata.temperature}
                        onChange={(e) => setUploadFormData({
                          ...uploadFormData, 
                          metadata: {...uploadFormData.metadata, temperature: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="65°F"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Humidity</label>
                      <input
                        type="text"
                        value={uploadFormData.metadata.humidity}
                        onChange={(e) => setUploadFormData({
                          ...uploadFormData, 
                          metadata: {...uploadFormData.metadata, humidity: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="60%"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wind Conditions</label>
                      <input
                        type="text"
                        value={uploadFormData.metadata.windConditions}
                        onChange={(e) => setUploadFormData({
                          ...uploadFormData, 
                          metadata: {...uploadFormData.metadata, windConditions: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Light breeze 5-8 mph"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lighting Conditions</label>
                      <input
                        type="text"
                        value={uploadFormData.metadata.lightingConditions}
                        onChange={(e) => setUploadFormData({
                          ...uploadFormData, 
                          metadata: {...uploadFormData.metadata, lightingConditions: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Natural morning light"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Photos</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select multiple photos. Accepted formats: JPG, PNG, HEIC
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // This would be handled by the file input onChange
                    // Just close the form since files are processed there
                  }}
                  disabled={!uploadFormData.projectId}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Upload Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}