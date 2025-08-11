'use client';

import { useState, useEffect } from 'react';
import { Customer, getAllCustomers, getCustomerDisplayName, getCustomerEmail, getBillingEmail } from '../data/customers';
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface CommunicationLog {
  id: string;
  customerId: string;
  customerName: string;
  contactType: 'primary' | 'billing' | 'project' | 'other';
  contactName: string;
  contactInfo: string; // email or phone
  communicationType: 'email' | 'phone' | 'meeting' | 'site_visit' | 'video_call' | 'text' | 'other';
  direction: 'incoming' | 'outgoing';
  subject: string;
  summary: string;
  dateTime: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  status: 'completed' | 'pending_response' | 'follow_up_needed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'quote_request' | 'project_coordination' | 'billing' | 'approval' | 'complaint' | 'maintenance' | 'general';
  attachments?: string[];
  relatedProjectId?: string;
  relatedQuoteId?: string;
  relatedContractId?: string;
}

const communicationTypeIcons = {
  email: EnvelopeIcon,
  phone: PhoneIcon,
  meeting: UserIcon,
  site_visit: MapPinIcon,
  video_call: VideoCameraIcon,
  text: ChatBubbleLeftRightIcon,
  other: ChatBubbleLeftRightIcon
};

const communicationTypeColors = {
  email: 'text-blue-600 bg-blue-50',
  phone: 'text-green-600 bg-green-50',
  meeting: 'text-purple-600 bg-purple-50',
  site_visit: 'text-orange-600 bg-orange-50',
  video_call: 'text-indigo-600 bg-indigo-50',
  text: 'text-gray-600 bg-gray-50',
  other: 'text-gray-600 bg-gray-50'
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending_response: 'bg-yellow-100 text-yellow-800',
  follow_up_needed: 'bg-orange-100 text-orange-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export default function CustomerCommunicationLog() {
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showNewCommunicationForm, setShowNewCommunicationForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');

  // Load customers and sample communication data
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
    
    // Initialize with sample communication logs
    setCommunications([
      {
        id: 'comm_001',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        contactType: 'primary',
        contactName: 'John Smith',
        contactInfo: 'jsmith@botetourtva.gov',
        communicationType: 'email',
        direction: 'incoming',
        subject: 'Tennis Court Resurfacing Quote Request',
        summary: 'Initial inquiry about resurfacing courts 3 & 4 at Scruggs Road facility. Mentioned previous work on courts 1 & 2 was excellent. Requesting quote for similar scope.',
        dateTime: '2025-01-15T09:30:00',
        followUpRequired: false,
        status: 'completed',
        priority: 'high',
        category: 'quote_request',
        relatedQuoteId: 'quote_001'
      },
      {
        id: 'comm_002',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        contactType: 'project',
        contactName: 'Mike Wilson',
        contactInfo: 'mwilson@botetourtva.gov',
        communicationType: 'phone',
        direction: 'outgoing',
        subject: 'Site Access Coordination',
        summary: 'Called to coordinate site access and confirm start date. Mike confirmed Feb 15th works well. Discussed equipment access through main gate. Gate code: 4577. Need to arrive by 7 AM for key pickup.',
        dateTime: '2025-01-28T14:15:00',
        followUpRequired: true,
        followUpDate: '2025-02-13',
        followUpNotes: 'Call 48 hours before start to confirm weather and final preparations',
        status: 'follow_up_needed',
        priority: 'high',
        category: 'project_coordination',
        relatedProjectId: 'proj_001'
      },
      {
        id: 'comm_003',
        customerId: 'cust_hoa_001',
        customerName: 'Riverside Estates HOA',
        contactType: 'primary',
        contactName: 'Sarah Davis',
        contactInfo: 'president@riversideestates.com',
        communicationType: 'meeting',
        direction: 'outgoing',
        subject: 'Board Meeting Presentation',
        summary: 'Presented project proposal to HOA board. Discussed timeline, noise considerations, and resident notification process. Board approved project 5-1. Robert Thompson (treasurer) will handle contract and payment coordination.',
        dateTime: '2025-01-20T19:00:00',
        followUpRequired: false,
        status: 'completed',
        priority: 'medium',
        category: 'approval',
        relatedQuoteId: 'quote_002'
      },
      {
        id: 'comm_004',
        customerId: 'cust_hoa_001',
        customerName: 'Riverside Estates HOA',
        contactType: 'billing',
        contactName: 'Robert Thompson',
        contactInfo: 'treasurer@riversideestates.com',
        communicationType: 'email',
        direction: 'incoming',
        subject: 'Contract Execution and Payment Schedule',
        summary: 'Requesting to set up payment schedule: 50% down, 25% at halfway point, 25% on completion. Also asked about warranty terms and what happens if weather delays project past March 15th community event.',
        dateTime: '2025-01-25T16:45:00',
        followUpRequired: true,
        followUpDate: '2025-01-27',
        followUpNotes: 'Send contract with flexible completion date and 2-year warranty details',
        status: 'pending_response',
        priority: 'high',
        category: 'billing',
        relatedContractId: 'contract_002'
      },
      {
        id: 'comm_005',
        customerId: 'cust_individual_001',
        customerName: 'Aric Holsinger',
        contactType: 'primary',
        contactName: 'Aric Holsinger',
        contactInfo: 'aricholsinger@verizon.net',
        communicationType: 'site_visit',
        direction: 'outgoing',
        subject: 'Court Assessment and Measurement',
        summary: 'Visited property to assess existing court condition. Noted significant cracking in northeast corner requiring additional prep work. Court dimensions confirmed. Discussed color options - prefers classic green with white lines.',
        dateTime: '2025-01-18T10:00:00',
        followUpRequired: true,
        followUpDate: '2025-01-22',
        followUpNotes: 'Send updated quote reflecting additional crack repair work',
        status: 'follow_up_needed',
        priority: 'medium',
        category: 'quote_request'
      }
    ]);
  }, []);

  const [formData, setFormData] = useState({
    customerId: '',
    contactType: 'primary' as const,
    contactName: '',
    contactInfo: '',
    communicationType: 'email' as const,
    direction: 'outgoing' as const,
    subject: '',
    summary: '',
    dateTime: new Date().toISOString().slice(0, 16),
    followUpRequired: false,
    followUpDate: '',
    followUpNotes: '',
    priority: 'medium' as const,
    category: 'general' as const,
    relatedProjectId: '',
    relatedQuoteId: '',
    relatedContractId: ''
  });

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        ...formData,
        customerId,
        contactName: customer.primaryContact.name,
        contactInfo: getCustomerEmail(customer)
      });
    }
  };

  const handleContactTypeChange = (contactType: 'primary' | 'billing' | 'project' | 'other') => {
    if (!selectedCustomer) return;
    
    let contactName = '';
    let contactInfo = '';
    
    switch (contactType) {
      case 'primary':
        contactName = selectedCustomer.primaryContact.name;
        contactInfo = getCustomerEmail(selectedCustomer);
        break;
      case 'billing':
        contactName = selectedCustomer.billingContact?.name || '';
        contactInfo = getBillingEmail(selectedCustomer);
        break;
      case 'project':
        contactName = selectedCustomer.projectContact?.name || '';
        contactInfo = selectedCustomer.projectContact?.email || '';
        break;
    }
    
    setFormData({
      ...formData,
      contactType,
      contactName,
      contactInfo
    });
  };

  const handleCreateCommunication = () => {
    const customerName = customers.find(c => c.id === formData.customerId)?.companyName || 
                        customers.find(c => c.id === formData.customerId)?.primaryContact.name || '';

    const newCommunication: CommunicationLog = {
      id: `comm_${Date.now()}`,
      customerId: formData.customerId,
      customerName,
      contactType: formData.contactType,
      contactName: formData.contactName,
      contactInfo: formData.contactInfo,
      communicationType: formData.communicationType,
      direction: formData.direction,
      subject: formData.subject,
      summary: formData.summary,
      dateTime: formData.dateTime,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate || undefined,
      followUpNotes: formData.followUpNotes || undefined,
      status: formData.followUpRequired ? 'follow_up_needed' : 'completed',
      priority: formData.priority,
      category: formData.category,
      relatedProjectId: formData.relatedProjectId || undefined,
      relatedQuoteId: formData.relatedQuoteId || undefined,
      relatedContractId: formData.relatedContractId || undefined
    };

    setCommunications([newCommunication, ...communications]);
    setShowNewCommunicationForm(false);
    setSelectedCustomer(null);
    setFormData({
      customerId: '',
      contactType: 'primary',
      contactName: '',
      contactInfo: '',
      communicationType: 'email',
      direction: 'outgoing',
      subject: '',
      summary: '',
      dateTime: new Date().toISOString().slice(0, 16),
      followUpRequired: false,
      followUpDate: '',
      followUpNotes: '',
      priority: 'medium',
      category: 'general',
      relatedProjectId: '',
      relatedQuoteId: '',
      relatedContractId: ''
    });
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = searchTerm === '' || 
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.contactName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === '' || comm.category === filterCategory;
    const matchesStatus = filterStatus === '' || comm.status === filterStatus;
    const matchesCustomer = filterCustomer === '' || comm.customerId === filterCustomer;

    return matchesSearch && matchesCategory && matchesStatus && matchesCustomer;
  });

  const priorityCommunications = communications.filter(comm => 
    comm.status === 'follow_up_needed' || comm.status === 'pending_response'
  ).sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="space-y-6">
      {/* Priority Communications Alert */}
      {priorityCommunications.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="font-medium text-orange-800">
              {priorityCommunications.length} Communication{priorityCommunications.length > 1 ? 's' : ''} Need Attention
            </h3>
          </div>
          <div className="space-y-2">
            {priorityCommunications.slice(0, 3).map((comm) => (
              <div key={comm.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[comm.priority]}`}>
                    {comm.priority.toUpperCase()}
                  </span>
                  <span className="text-orange-700">
                    {comm.customerName} - {comm.subject}
                  </span>
                </div>
                <div className="text-orange-600">
                  {comm.followUpDate && new Date(comm.followUpDate) <= new Date() ? 'Overdue' : 
                   comm.status === 'pending_response' ? 'Awaiting Response' : 'Follow-up Needed'}
                </div>
              </div>
            ))}
            {priorityCommunications.length > 3 && (
              <div className="text-sm text-orange-600">
                +{priorityCommunications.length - 3} more requiring attention
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-500" />
              Customer Communications
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Track all customer interactions and follow-ups
            </p>
          </div>
          <button
            onClick={() => setShowNewCommunicationForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Log Communication
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search communications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Customers</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {getCustomerDisplayName(customer)}
              </option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            <option value="quote_request">Quote Request</option>
            <option value="project_coordination">Project Coordination</option>
            <option value="billing">Billing</option>
            <option value="approval">Approval</option>
            <option value="complaint">Complaint</option>
            <option value="maintenance">Maintenance</option>
            <option value="general">General</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending_response">Pending Response</option>
            <option value="follow_up_needed">Follow-up Needed</option>
            <option value="closed">Closed</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-1" />
            {filteredCommunications.length} of {communications.length}
          </div>
        </div>
      </div>

      {/* Communications List */}
      <div className="space-y-4">
        {filteredCommunications.map((comm) => {
          const CommunicationIcon = communicationTypeIcons[comm.communicationType];
          
          return (
            <div key={comm.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${communicationTypeColors[comm.communicationType]}`}>
                    <CommunicationIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{comm.subject}</h3>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[comm.status]}`}>
                        {comm.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[comm.priority]}`}>
                        {comm.priority.toUpperCase()}
                      </span>
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {comm.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          {comm.customerName}
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {comm.contactName} ({comm.contactType})
                        </div>
                        <div className="flex items-center">
                          {comm.communicationType === 'email' ? (
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <PhoneIcon className="h-4 w-4 mr-1" />
                          )}
                          {comm.contactInfo}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{comm.summary}</p>
                    
                    {comm.followUpRequired && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                        <div className="flex items-start">
                          <ClockIcon className="h-4 w-4 mr-2 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-yellow-800">
                              Follow-up {comm.followUpDate ? `due ${new Date(comm.followUpDate).toLocaleDateString()}` : 'required'}
                            </div>
                            {comm.followUpNotes && (
                              <div className="text-sm text-yellow-700 mt-1">{comm.followUpNotes}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(comm.dateTime).toLocaleDateString()}
                  </div>
                  <div className="mt-1">
                    {new Date(comm.dateTime).toLocaleTimeString()}
                  </div>
                  <div className={`mt-1 text-xs ${comm.direction === 'incoming' ? 'text-blue-600' : 'text-green-600'}`}>
                    {comm.direction === 'incoming' ? '← Incoming' : '→ Outgoing'}
                  </div>
                </div>
              </div>
              
              {(comm.relatedProjectId || comm.relatedQuoteId || comm.relatedContractId) && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Related:</span>
                    {comm.relatedProjectId && <span className="ml-2 text-blue-600">Project #{comm.relatedProjectId}</span>}
                    {comm.relatedQuoteId && <span className="ml-2 text-blue-600">Quote #{comm.relatedQuoteId}</span>}
                    {comm.relatedContractId && <span className="ml-2 text-blue-600">Contract #{comm.relatedContractId}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCommunications.length === 0 && (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communications found</h3>
          <p className="text-gray-500">Log your first customer communication or adjust your filters</p>
        </div>
      )}

      {/* New Communication Form Modal */}
      {showNewCommunicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Log New Communication</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Select customer...</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {getCustomerDisplayName(customer)}
                          {customer.organizationType && customer.organizationType !== 'INDIVIDUAL' ? ` (${customer.organizationType})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
                      <select
                        value={formData.contactType}
                        onChange={(e) => handleContactTypeChange(e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="primary">Primary Contact</option>
                        <option value="billing">Billing Contact</option>
                        <option value="project">Project Contact</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Communication Type</label>
                      <select
                        value={formData.communicationType}
                        onChange={(e) => setFormData({...formData, communicationType: e.target.value as any})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone Call</option>
                        <option value="meeting">In-Person Meeting</option>
                        <option value="site_visit">Site Visit</option>
                        <option value="video_call">Video Call</option>
                        <option value="text">Text Message</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Contact person name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                      <input
                        type="text"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Email or phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                      <select
                        value={formData.direction}
                        onChange={(e) => setFormData({...formData, direction: e.target.value as any})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="outgoing">Outgoing (I contacted them)</option>
                        <option value="incoming">Incoming (They contacted me)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Communication subject or topic"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="general">General</option>
                        <option value="quote_request">Quote Request</option>
                        <option value="project_coordination">Project Coordination</option>
                        <option value="billing">Billing</option>
                        <option value="approval">Approval</option>
                        <option value="complaint">Complaint</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                    <textarea
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Detailed summary of the communication..."
                    />
                  </div>

                  <div className="border border-gray-200 rounded p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="followUpRequired"
                        checked={formData.followUpRequired}
                        onChange={(e) => setFormData({...formData, followUpRequired: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                        Follow-up Required
                      </label>
                    </div>

                    {formData.followUpRequired && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                          <input
                            type="date"
                            value={formData.followUpDate}
                            onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes</label>
                          <textarea
                            value={formData.followUpNotes}
                            onChange={(e) => setFormData({...formData, followUpNotes: e.target.value})}
                            rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="What needs to be done on follow-up..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowNewCommunicationForm(false);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCommunication}
                  disabled={!formData.customerId || !formData.subject || !formData.summary}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Log Communication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}