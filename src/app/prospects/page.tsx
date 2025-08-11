'use client';

import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  UserIcon, 
  EyeIcon, 
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Lead {
  id: string;
  userId: string;
  companyName?: string;
  customerGroup: 'RETAIL' | 'CONTRACTOR' | 'DEALER' | 'WHOLESALE';
  metadata?: {
    leadData?: {
      organizationType?: string;
      organizationName?: string;
      projectAddress?: string;
      projectType?: string;
      courtSize?: string;
      surfaceCondition?: string;
      timeline?: string;
      budget?: string;
      preferredDate?: string;
      preferredTime?: string;
      message?: string;
      submissionDate?: string;
      leadSource?: string;
    };
    isLead?: boolean;
    leadStatus?: string;
  };
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    status: 'LEAD' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  };
}

const customerGroupColors = {
  RETAIL: 'bg-blue-100 text-blue-800',
  CONTRACTOR: 'bg-green-100 text-green-800',
  DEALER: 'bg-purple-100 text-purple-800',
  WHOLESALE: 'bg-orange-100 text-orange-800'
};

export default function ProspectsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Load leads (customers with LEAD status) from database on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/customers?status=LEAD');
        if (response.ok) {
          const data = await response.json();
          setLeads(data.customers);
        } else {
          console.error('Failed to fetch leads');
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Helper functions
  const getLeadDisplayName = (lead: Lead) => {
    if (lead.user.firstName && lead.user.lastName) {
      return `${lead.user.firstName} ${lead.user.lastName}`;
    }
    return lead.companyName || lead.user.email || 'Unknown';
  };

  const getLeadSubject = (lead: Lead) => {
    const projectType = lead.metadata?.leadData?.projectType || 'consultation';
    return `${projectType.toUpperCase()} Request - ${getLeadDisplayName(lead)}`;
  };

  // Filter leads based on search term and filters
  const filteredLeads = leads.filter(lead => {
    const displayName = getLeadDisplayName(lead);
    const matchesSearch = 
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.metadata?.leadData?.projectType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = filterGroup === 'all' || lead.customerGroup === filterGroup;
    
    return matchesSearch && matchesGroup;
  });

  const convertToCustomer = async (lead: Lead) => {
    if (!window.confirm(`Convert ${getLeadDisplayName(lead)} from lead to active customer? This will move them to the Customers section and they'll be ready for quotes.`)) {
      return;
    }

    try {
      const response = await fetch('/api/leads/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: lead.user.id,
          customerId: lead.id 
        })
      });
      
      if (response.ok) {
        // Remove from leads list since they're now an active customer
        setLeads(leads.filter(l => l.id !== lead.id));
        alert(`${getLeadDisplayName(lead)} has been converted to an active customer! You can find them in the Customers section.`);
      } else {
        const error = await response.json();
        alert(`Error converting to customer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error converting to customer:', error);
      alert('Error converting to customer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prospects</h1>
              <p className="text-gray-600 mt-1">Manage prospect inquiries and convert to customers</p>
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
              placeholder="Search tickets..."
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

      {/* Leads List */}
      <div className="px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading leads...</div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500">No leads match your current filters.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getLeadDisplayName(lead)}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {getLeadSubject(lead)}
                        </div>
                        {lead.companyName && (
                          <div className="text-xs text-gray-400">{lead.companyName}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lead.user.email}
                          </div>
                          {lead.user.phone && (
                            <div className="text-sm text-gray-500">
                              {lead.user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lead.metadata?.leadData?.projectType || 'Consultation'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        lead.customerGroup === 'RETAIL' ? 'bg-blue-100 text-blue-800' :
                        lead.customerGroup === 'CONTRACTOR' ? 'bg-green-100 text-green-800' :
                        lead.customerGroup === 'DEALER' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {lead.customerGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.metadata?.leadData?.budget || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => convertToCustomer(lead)}
                          className="text-green-600 hover:text-green-700 font-medium text-xs bg-green-50 px-2 py-1 rounded"
                          title="Convert to Customer"
                        >
                          <ArrowRightIcon className="w-4 h-4 inline mr-1" />
                          Convert
                        </button>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-700"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <a
                          href={`mailto:${lead.user.email}`}
                          className="text-gray-600 hover:text-gray-700"
                          title="Send Email"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </a>
                        {lead.user.phone && (
                          <a
                            href={`tel:${lead.user.phone}`}
                            className="text-purple-600 hover:text-purple-700"
                            title="Call Phone"
                          >
                            <PhoneIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Lead Details: {getLeadDisplayName(selectedLead)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Contact Information</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700"><strong>Name:</strong> {getLeadDisplayName(selectedLead)}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {selectedLead.user.email}</p>
                    {selectedLead.user.phone && (
                      <p className="text-gray-700"><strong>Phone:</strong> {selectedLead.user.phone}</p>
                    )}
                    {selectedLead.companyName && (
                      <p className="text-gray-700"><strong>Company:</strong> {selectedLead.companyName}</p>
                    )}
                  </div>
                </div>
                
                {selectedLead.metadata?.leadData && (
                  <div>
                    <h4 className="font-medium text-gray-900">Project Details</h4>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      {selectedLead.metadata.leadData.projectType && (
                        <p className="text-gray-700"><strong>Service Level:</strong> {selectedLead.metadata.leadData.projectType}</p>
                      )}
                      {selectedLead.metadata.leadData.projectAddress && (
                        <p className="text-gray-700"><strong>Project Address:</strong> {selectedLead.metadata.leadData.projectAddress}</p>
                      )}
                      {selectedLead.metadata.leadData.courtSize && (
                        <p className="text-gray-700"><strong>Court Size:</strong> {selectedLead.metadata.leadData.courtSize}</p>
                      )}
                      {selectedLead.metadata.leadData.surfaceCondition && (
                        <p className="text-gray-700"><strong>Surface Condition:</strong> {selectedLead.metadata.leadData.surfaceCondition}</p>
                      )}
                      {selectedLead.metadata.leadData.timeline && (
                        <p className="text-gray-700"><strong>Timeline:</strong> {selectedLead.metadata.leadData.timeline}</p>
                      )}
                      {selectedLead.metadata.leadData.budget && (
                        <p className="text-gray-700"><strong>Budget:</strong> {selectedLead.metadata.leadData.budget}</p>
                      )}
                      {selectedLead.metadata.leadData.preferredDate && (
                        <p className="text-gray-700"><strong>Preferred Date:</strong> {selectedLead.metadata.leadData.preferredDate}</p>
                      )}
                      {selectedLead.metadata.leadData.preferredTime && (
                        <p className="text-gray-700"><strong>Preferred Time:</strong> {selectedLead.metadata.leadData.preferredTime}</p>
                      )}
                      {selectedLead.metadata.leadData.message && (
                        <div>
                          <p className="text-gray-700"><strong>Additional Details:</strong></p>
                          <p className="text-gray-600 italic mt-1">{selectedLead.metadata.leadData.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Customer Group</h4>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      selectedLead.customerGroup === 'RETAIL' ? 'bg-blue-100 text-blue-800' :
                      selectedLead.customerGroup === 'CONTRACTOR' ? 'bg-green-100 text-green-800' :
                      selectedLead.customerGroup === 'DEALER' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedLead.customerGroup}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      LEAD
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => convertToCustomer(selectedLead)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                    <span>Convert to Active Customer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}