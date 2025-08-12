'use client';

import { useState, useEffect } from 'react';
import { Customer, getAllCustomers, getCustomerDisplayName, getCustomerEmail } from '../data/customers';
import { 
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface AppointmentRequest {
  id: string;
  customerId?: string; // Link to existing customer if already exists
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationType: 'INDIVIDUAL' | 'HOA' | 'MUNICIPALITY' | 'SCHOOL' | 'CHURCH' | 'BUSINESS' | 'OTHER';
  organizationName?: string;
  projectAddress: string;
  projectType: 'consultation' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level5_5';
  preferredDate?: string;
  preferredTime?: string;
  message: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  responseDeadline: string;
  assignedTo?: string;
  dealerNotes?: string;
  customerCreated?: boolean; // Flag to track if customer was created from this request
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const organizationTypeLabels = {
  INDIVIDUAL: 'Individual/Homeowner',
  HOA: 'Homeowners Association',
  MUNICIPALITY: 'Municipality/Government',
  SCHOOL: 'School/Educational',
  CHURCH: 'Church/Religious',
  BUSINESS: 'Business/Commercial',
  OTHER: 'Other'
};

const projectTypeLabels = {
  consultation: 'Initial Consultation (Free)',
  level1: 'Level 1 - DIY Resources',
  level2: 'Level 2 - Monthly Membership',
  level3: 'Level 3 - Coating & Lining Specialist',
  level4: 'Level 4 - Project Management + Finish',
  level5: 'Level 5 - Full Project Management',
  level5_5: 'Level 5.5 - Premium Personalized'
};

export default function AppointmentRequests() {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'confirm' | 'reject', requestId: string} | null>(null);
  const [showCreateCustomerDialog, setShowCreateCustomerDialog] = useState(false);
  const [requestToCreateCustomer, setRequestToCreateCustomer] = useState<AppointmentRequest | null>(null);

  // Load customers and appointment requests
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
    
    const sampleRequests: AppointmentRequest[] = [
      {
        id: 'req_001',
        customerId: 'cust_hoa_001', // Link to existing Riverside Estates HOA customer
        firstName: 'Sarah',
        lastName: 'Davis',
        email: 'president@riversideestates.com',
        phone: '919-555-0123',
        organizationType: 'HOA',
        organizationName: 'Riverside Estates HOA',
        projectAddress: '5678 Riverside Drive, Cary, NC 27519',
        projectType: 'level4',
        preferredDate: '2025-02-10',
        preferredTime: 'morning',
        message: 'Following up on our board meeting approval. We are looking to resurface our community tennis courts. The board has approved a budget of $20,000-25,000. We would like to discuss the timeline and coordination with residents.',
        status: 'pending',
        priority: 'high',
        submittedAt: '2025-01-30T10:30:00',
        responseDeadline: '2025-02-01T17:00:00',
        assignedTo: 'John Doe',
        customerCreated: false
      },
      {
        id: 'req_002',
        customerId: 'cust_municipality_001', // Link to existing Botetourt County customer
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@botetourtva.gov',
        phone: '540-473-8250',
        organizationType: 'MUNICIPALITY',
        organizationName: 'Botetourt County Parks & Recreation',
        projectAddress: '150 Scruggs Road, Cloverdale, VA 24077',
        projectType: 'level5',
        preferredDate: '2025-02-05',
        preferredTime: 'afternoon',
        message: 'Following up on the successful completion of courts 1 & 2, we need to get courts 3 & 4 resurfaced. Same specifications as previous project. PO system requires 48-hour advance notice.',
        status: 'pending',
        priority: 'urgent',
        submittedAt: '2025-01-29T14:15:00',
        responseDeadline: '2025-01-31T16:00:00',
        customerCreated: false
      },
      {
        id: 'req_003',
        firstName: 'David',
        lastName: 'Martinez',
        email: 'david.martinez@gmail.com',
        phone: '703-555-0199',
        organizationType: 'INDIVIDUAL',
        projectAddress: '456 Oak Lane, Vienna, VA 22182',
        projectType: 'consultation',
        preferredDate: '2025-02-12',
        preferredTime: 'evening',
        message: 'Interested in building a pickleball court in my backyard. Want to understand the different service levels and get a ballpark estimate for my property.',
        status: 'confirmed',
        priority: 'medium',
        submittedAt: '2025-01-28T16:45:00',
        responseDeadline: '2025-01-30T17:00:00',
        dealerNotes: 'Confirmed for Feb 12 at 6 PM. Site visit scheduled. Customer created in system.',
        customerCreated: true
      },
      {
        id: 'req_004',
        firstName: 'Jennifer',
        lastName: 'Collins',
        email: 'jcollins@stmarysschool.edu',
        phone: '804-555-0167',
        organizationType: 'SCHOOL',
        organizationName: 'St. Mary\'s Catholic School',
        projectAddress: '789 School Drive, Richmond, VA 23229',
        projectType: 'level3',
        preferredDate: '2025-02-15',
        preferredTime: 'flexible',
        message: 'Our school needs to resurface 2 tennis courts for the spring season. Budget is limited but we want quality work. Looking for cost-effective solutions.',
        status: 'pending',
        priority: 'medium',
        submittedAt: '2025-01-30T09:20:00',
        responseDeadline: '2025-02-02T17:00:00'
      }
    ];
    setRequests(sampleRequests);
  }, []);

  const createCustomerFromRequest = (request: AppointmentRequest): Customer => {
    const newCustomerId = `cust_${Date.now()}`;
    
    // Parse project address into components
    const addressParts = request.projectAddress.split(',').map(part => part.trim());
    const street = addressParts[0] || '';
    const city = addressParts[1] || '';
    const stateZip = addressParts[2] || '';
    const stateParts = stateZip.split(' ');
    const state = stateParts[0] || '';
    const zipCode = stateParts[1] || '';

    const customer: Customer = {
      id: newCustomerId,
      userId: `user_${Date.now()}`,
      companyName: request.organizationType !== 'INDIVIDUAL' ? request.organizationName : undefined,
      organizationType: request.organizationType,
      primaryContact: {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        title: request.organizationType === 'INDIVIDUAL' ? 'Homeowner' : 'Primary Contact'
      },
      billingAddress: {
        street,
        city,
        state,
        zipCode,
        country: 'US'
      },
      projectAddress: {
        street,
        city,
        state,
        zipCode,
        country: 'US'
      },
      customerGroup: 'RETAIL',
      customerStatus: 'PROSPECT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: `Customer created from appointment request: ${request.message}`,
      orders: [],
      invoices: []
    };

    return customer;
  };

  const handleConfirmRequest = (requestId: string) => {
    const request = requests.find(req => req.id === requestId);
    if (!request) return;

    // If no customer exists, create one
    if (!request.customerId) {
      const newCustomer = createCustomerFromRequest(request);
      setCustomers([...customers, newCustomer]);
      
      // Update the request to link to the new customer
      setRequests(requests.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'confirmed' as const,
              customerId: newCustomer.id,
              customerCreated: true,
              dealerNotes: `Customer created in system. ${req.dealerNotes || ''}`
            }
          : req
      ));
    } else {
      // Just confirm the existing request
      setRequests(requests.map(req => 
        req.id === requestId 
          ? { ...req, status: 'confirmed' as const }
          : req
      ));
    }
    
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const }
        : req
    ));
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleActionClick = (type: 'confirm' | 'reject', requestId: string) => {
    setConfirmAction({ type, requestId });
    setShowConfirmDialog(true);
  };

  const filteredRequests = requests.filter(request => {
    return !filterStatus || request.status === filterStatus;
  });

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const urgentRequests = requests.filter(req => req.priority === 'urgent' && req.status === 'pending');
  const overdueRequests = requests.filter(req => 
    req.status === 'pending' && new Date(req.responseDeadline) < new Date()
  );

  const getFullName = (request: AppointmentRequest) => {
    return `${request.firstName} ${request.lastName}`;
  };

  const getDisplayName = (request: AppointmentRequest) => {
    if (request.organizationType === 'INDIVIDUAL') {
      return getFullName(request);
    }
    return request.organizationName || getFullName(request);
  };

  const getLinkedCustomer = (request: AppointmentRequest): Customer | null => {
    if (!request.customerId) return null;
    return customers.find(c => c.id === request.customerId) || null;
  };

  const isOverdue = (request: AppointmentRequest) => {
    return request.status === 'pending' && new Date(request.responseDeadline) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {urgentRequests.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-medium text-red-800">{urgentRequests.length} Urgent</h3>
            </div>
            <p className="text-sm text-red-700">High-priority requests requiring immediate attention</p>
          </div>
        )}

        {overdueRequests.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ClockIcon className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="font-medium text-orange-800">{overdueRequests.length} Overdue</h3>
            </div>
            <p className="text-sm text-orange-700">Requests past response deadline</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CalendarDaysIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-blue-800">{pendingRequests.length} Pending</h3>
          </div>
          <p className="text-sm text-blue-700">Total requests awaiting response</p>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-500" />
              Appointment Requests
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage incoming consultation and project requests from customers
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-6">
            {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div 
            key={request.id} 
            className={`bg-white rounded-lg border p-6 ${
              isOverdue(request) ? 'border-red-300 bg-red-50' : 
              request.priority === 'urgent' ? 'border-orange-300 bg-orange-50' : 
              'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{getDisplayName(request)}</h3>
                  {request.customerId && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      CUSTOMER
                    </span>
                  )}
                  {request.customerCreated && (
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      NEW CUSTOMER
                    </span>
                  )}
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                    {request.status.toUpperCase()}
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[request.priority]}`}>
                    {request.priority.toUpperCase()}
                  </span>
                  {isOverdue(request) && (
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      OVERDUE
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {getFullName(request)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {request.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {request.phone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                      {organizationTypeLabels[request.organizationType]}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {request.projectAddress}
                    </div>
                    <div className="text-gray-600">
                      <strong>Service:</strong> {projectTypeLabels[request.projectType]}
                    </div>
                    {request.preferredDate && (
                      <div className="text-gray-600">
                        <strong>Preferred:</strong> {new Date(request.preferredDate).toLocaleDateString()}
                        {request.preferredTime && ` (${request.preferredTime})`}
                      </div>
                    )}
                    <div className="text-gray-600">
                      <strong>Submitted:</strong> {new Date(request.submittedAt).toLocaleDateString()} at {new Date(request.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                  <p className="text-sm text-gray-700">
                    <strong>Customer Message:</strong> {request.message}
                  </p>
                </div>

                {request.customerId && (() => {
                  const linkedCustomer = getLinkedCustomer(request);
                  return linkedCustomer ? (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                      <p className="text-sm text-green-700">
                        <strong>Linked Customer:</strong> {getCustomerDisplayName(linkedCustomer)} 
                        <span className="text-green-600"> - Status: {linkedCustomer.customerStatus}</span>
                      </p>
                    </div>
                  ) : null;
                })()}

                {request.dealerNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                    <p className="text-sm text-blue-700">
                      <strong>Dealer Notes:</strong> {request.dealerNotes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    Response due: {new Date(request.responseDeadline).toLocaleDateString()} at {new Date(request.responseDeadline).toLocaleTimeString()}
                  </div>
                  {request.assignedTo && (
                    <div>Assigned to: {request.assignedTo}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                  title="View Details"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleActionClick('confirm', request.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleActionClick('reject', request.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment requests found</h3>
          <p className="text-gray-500">Check your filter settings or wait for new requests to come in</p>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Appointment Request Details
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {getFullName(selectedRequest)}</div>
                    <div><strong>Email:</strong> {selectedRequest.email}</div>
                    <div><strong>Phone:</strong> {selectedRequest.phone}</div>
                    <div><strong>Organization:</strong> {organizationTypeLabels[selectedRequest.organizationType]}</div>
                    {selectedRequest.organizationName && (
                      <div><strong>Organization Name:</strong> {selectedRequest.organizationName}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Project Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Project Address:</strong> {selectedRequest.projectAddress}</div>
                    <div><strong>Service Level:</strong> {projectTypeLabels[selectedRequest.projectType]}</div>
                    {selectedRequest.preferredDate && (
                      <div><strong>Preferred Date:</strong> {new Date(selectedRequest.preferredDate).toLocaleDateString()}</div>
                    )}
                    {selectedRequest.preferredTime && (
                      <div><strong>Preferred Time:</strong> {selectedRequest.preferredTime}</div>
                    )}
                    <div><strong>Priority:</strong> {selectedRequest.priority}</div>
                    <div><strong>Status:</strong> {selectedRequest.status}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Customer Message</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {selectedRequest.message}
                </p>
              </div>

              {selectedRequest.dealerNotes && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Dealer Notes</h3>
                  <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded">
                    {selectedRequest.dealerNotes}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleActionClick('reject', selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleActionClick('confirm', selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm Appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {confirmAction.type === 'confirm' ? 'Confirm Appointment' : 'Reject Request'}
              </h3>
              <p className="text-gray-700 mb-6">
                {confirmAction.type === 'confirm' 
                  ? (() => {
                      const request = requests.find(r => r.id === confirmAction.requestId);
                      return request?.customerId 
                        ? 'Are you sure you want to confirm this appointment? This will notify the existing customer and add the appointment to your calendar.'
                        : 'Are you sure you want to confirm this appointment? This will create a new customer record, notify them, and add the appointment to your calendar.';
                    })()
                  : 'Are you sure you want to reject this request? This will notify the customer that their request cannot be accommodated.'
                }
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfirmAction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.type === 'confirm') {
                      handleConfirmRequest(confirmAction.requestId);
                    } else {
                      handleRejectRequest(confirmAction.requestId);
                    }
                  }}
                  className={`px-4 py-2 rounded text-white ${
                    confirmAction.type === 'confirm' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {confirmAction.type === 'confirm' ? 'Confirm' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}