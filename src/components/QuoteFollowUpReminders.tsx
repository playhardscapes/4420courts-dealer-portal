'use client';

import { useState, useEffect } from 'react';
import { Customer, getAllCustomers, getCustomerDisplayName, getCustomerEmail } from '../data/customers';
import { 
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BellIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  BuildingOfficeIcon,
  PlusIcon,
  FunnelIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceLevel: string;
  value: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  dateCreated: string;
  dateSent?: string;
  expirationDate?: string;
  followUpDate?: string;
  lastFollowUp?: string;
  followUpCount: number;
  notes?: string;
}

interface FollowUpReminder {
  id: string;
  quoteId: string;
  customerId: string;
  customerName: string;
  quoteValue: number;
  reminderType: 'initial' | 'follow_up_1' | 'follow_up_2' | 'final' | 'expiration_warning' | 'expired' | 'custom';
  reminderDate: string;
  status: 'pending' | 'completed' | 'snoozed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  communicationMethod: 'email' | 'phone' | 'both';
  completedDate?: string;
  snoozeUntil?: string;
  notes?: string;
}

const reminderTypeConfig = {
  initial: { 
    label: 'Initial Follow-up', 
    defaultDays: 3, 
    color: 'bg-blue-100 text-blue-800',
    priority: 'medium' as const
  },
  follow_up_1: { 
    label: 'First Follow-up', 
    defaultDays: 7, 
    color: 'bg-yellow-100 text-yellow-800',
    priority: 'medium' as const
  },
  follow_up_2: { 
    label: 'Second Follow-up', 
    defaultDays: 14, 
    color: 'bg-orange-100 text-orange-800',
    priority: 'high' as const
  },
  final: { 
    label: 'Final Follow-up', 
    defaultDays: 21, 
    color: 'bg-red-100 text-red-800',
    priority: 'high' as const
  },
  expiration_warning: { 
    label: 'Expiration Warning', 
    defaultDays: 28, 
    color: 'bg-purple-100 text-purple-800',
    priority: 'urgent' as const
  },
  expired: { 
    label: 'Quote Expired', 
    defaultDays: 30, 
    color: 'bg-gray-100 text-gray-800',
    priority: 'low' as const
  },
  custom: { 
    label: 'Custom Reminder', 
    defaultDays: 7, 
    color: 'bg-green-100 text-green-800',
    priority: 'medium' as const
  }
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  snoozed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export default function QuoteFollowUpReminders() {
  const [reminders, setReminders] = useState<FollowUpReminder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showNewReminderForm, setShowNewReminderForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [selectedReminder, setSelectedReminder] = useState<FollowUpReminder | null>(null);

  // Load customers and sample data
  useEffect(() => {
    const allCustomers = getAllCustomers();
    setCustomers(allCustomers);
    
    // Sample quotes data
    const sampleQuotes: Quote[] = [
      {
        id: 'quote_001',
        customerId: 'cust_municipality_001',
        customerName: 'Botetourt County Parks & Recreation',
        customerEmail: 'jsmith@botetourtva.gov',
        serviceLevel: 'Level 4 - Project Management + Finish',
        value: 15000,
        status: 'sent',
        dateCreated: '2025-01-15',
        dateSent: '2025-01-16',
        expirationDate: '2025-02-15',
        followUpDate: '2025-01-19',
        followUpCount: 0
      },
      {
        id: 'quote_002',
        customerId: 'cust_hoa_001',
        customerName: 'Riverside Estates HOA',
        customerEmail: 'president@riversideestates.com',
        serviceLevel: 'Level 3 - Coating & Lining Specialist',
        value: 12000,
        status: 'accepted',
        dateCreated: '2025-01-18',
        dateSent: '2025-01-19',
        expirationDate: '2025-02-18',
        followUpCount: 1,
        lastFollowUp: '2025-01-25'
      },
      {
        id: 'quote_003',
        customerId: 'cust_individual_001',
        customerName: 'Aric Holsinger',
        customerEmail: 'aricholsinger@verizon.net',
        serviceLevel: 'Level 3 - Coating & Lining Specialist',
        value: 8500,
        status: 'sent',
        dateCreated: '2025-01-20',
        dateSent: '2025-01-22',
        expirationDate: '2025-02-22',
        followUpDate: '2025-01-25',
        followUpCount: 0
      },
      {
        id: 'quote_004',
        customerId: 'cust_business_001',
        customerName: 'Elite Sports Academy',
        customerEmail: 'facilities@elitesportsacademy.com',
        serviceLevel: 'Level 5 - Full Project Management',
        value: 35000,
        status: 'sent',
        dateCreated: '2025-01-10',
        dateSent: '2025-01-12',
        expirationDate: '2025-02-12',
        followUpDate: '2025-01-15',
        followUpCount: 2,
        lastFollowUp: '2025-01-26'
      }
    ];
    
    setQuotes(sampleQuotes);
    
    // Generate automatic reminders based on quotes
    const autoReminders: FollowUpReminder[] = [];
    const today = new Date();
    
    sampleQuotes.forEach(quote => {
      if (quote.status === 'sent') {
        const sentDate = new Date(quote.dateSent || quote.dateCreated);
        const expirationDate = new Date(quote.expirationDate || '');
        
        // Initial follow-up (3 days after sent)
        const initialFollowUp = new Date(sentDate);
        initialFollowUp.setDate(initialFollowUp.getDate() + 3);
        
        if (quote.followUpCount === 0 && initialFollowUp <= today) {
          autoReminders.push({
            id: `reminder_initial_${quote.id}`,
            quoteId: quote.id,
            customerId: quote.customerId,
            customerName: quote.customerName,
            quoteValue: quote.value,
            reminderType: 'initial',
            reminderDate: initialFollowUp.toISOString().split('T')[0],
            status: 'pending',
            priority: 'medium',
            message: `Initial follow-up on ${quote.serviceLevel} quote for $${quote.value.toLocaleString()}. Check if they have any questions or need clarification.`,
            communicationMethod: 'email'
          });
        }
        
        // First follow-up (7 days after sent)
        const firstFollowUp = new Date(sentDate);
        firstFollowUp.setDate(firstFollowUp.getDate() + 7);
        
        if (quote.followUpCount <= 1 && firstFollowUp <= today) {
          autoReminders.push({
            id: `reminder_follow1_${quote.id}`,
            quoteId: quote.id,
            customerId: quote.customerId,
            customerName: quote.customerName,
            quoteValue: quote.value,
            reminderType: 'follow_up_1',
            reminderDate: firstFollowUp.toISOString().split('T')[0],
            status: quote.followUpCount >= 1 ? 'completed' : 'pending',
            priority: 'medium',
            message: `First follow-up call recommended. Quote has been outstanding for a week. Offer to answer questions or schedule site visit if needed.`,
            communicationMethod: 'phone',
            completedDate: quote.followUpCount >= 1 ? quote.lastFollowUp : undefined
          });
        }
        
        // Second follow-up (14 days after sent)
        const secondFollowUp = new Date(sentDate);
        secondFollowUp.setDate(secondFollowUp.getDate() + 14);
        
        if (quote.followUpCount <= 2 && secondFollowUp <= today) {
          autoReminders.push({
            id: `reminder_follow2_${quote.id}`,
            quoteId: quote.id,
            customerId: quote.customerId,
            customerName: quote.customerName,
            quoteValue: quote.value,
            reminderType: 'follow_up_2',
            reminderDate: secondFollowUp.toISOString().split('T')[0],
            status: quote.followUpCount >= 2 ? 'completed' : 'pending',
            priority: 'high',
            message: `Second follow-up needed. Quote approaching halfway point to expiration. Consider offering limited-time incentive or flexible terms.`,
            communicationMethod: 'both',
            completedDate: quote.followUpCount >= 2 ? quote.lastFollowUp : undefined
          });
        }
        
        // Expiration warning (5 days before expiration)
        const expirationWarning = new Date(expirationDate);
        expirationWarning.setDate(expirationWarning.getDate() - 5);
        
        if (expirationWarning <= today && expirationDate > today) {
          autoReminders.push({
            id: `reminder_expiry_${quote.id}`,
            quoteId: quote.id,
            customerId: quote.customerId,
            customerName: quote.customerName,
            quoteValue: quote.value,
            reminderType: 'expiration_warning',
            reminderDate: expirationWarning.toISOString().split('T')[0],
            status: 'pending',
            priority: 'urgent',
            message: `URGENT: Quote expires in 5 days (${expirationDate.toLocaleDateString()}). Final opportunity to secure this pricing and schedule.`,
            communicationMethod: 'both'
          });
        }
        
        // Expired quote
        if (expirationDate <= today) {
          autoReminders.push({
            id: `reminder_expired_${quote.id}`,
            quoteId: quote.id,
            customerId: quote.customerId,
            customerName: quote.customerName,
            quoteValue: quote.value,
            reminderType: 'expired',
            reminderDate: expirationDate.toISOString().split('T')[0],
            status: 'pending',
            priority: 'low',
            message: `Quote has expired. Follow up to see if they're still interested and need updated pricing for current season.`,
            communicationMethod: 'email'
          });
        }
      }
    });
    
    setReminders(autoReminders);
  }, []);

  const [formData, setFormData] = useState({
    quoteId: '',
    reminderType: 'custom' as const,
    reminderDate: '',
    priority: 'medium' as const,
    message: '',
    communicationMethod: 'email' as const,
    notes: ''
  });

  const handleCreateReminder = () => {
    const selectedQuote = quotes.find(q => q.id === formData.quoteId);
    if (!selectedQuote) return;

    const newReminder: FollowUpReminder = {
      id: `reminder_${Date.now()}`,
      quoteId: formData.quoteId,
      customerId: selectedQuote.customerId,
      customerName: selectedQuote.customerName,
      quoteValue: selectedQuote.value,
      reminderType: formData.reminderType,
      reminderDate: formData.reminderDate,
      status: 'pending',
      priority: formData.priority,
      message: formData.message,
      communicationMethod: formData.communicationMethod,
      notes: formData.notes
    };

    setReminders([newReminder, ...reminders]);
    setShowNewReminderForm(false);
    setFormData({
      quoteId: '',
      reminderType: 'custom',
      reminderDate: '',
      priority: 'medium',
      message: '',
      communicationMethod: 'email',
      notes: ''
    });
  };

  const handleCompleteReminder = (reminderId: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, status: 'completed' as const, completedDate: new Date().toISOString().split('T')[0] }
        : reminder
    ));
  };

  const handleSnoozeReminder = (reminderId: string, days: number) => {
    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + days);
    
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId 
        ? { 
            ...reminder, 
            status: 'snoozed' as const, 
            snoozeUntil: snoozeDate.toISOString().split('T')[0],
            reminderDate: snoozeDate.toISOString().split('T')[0]
          }
        : reminder
    ));
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesStatus = filterStatus === '' || reminder.status === filterStatus;
    const matchesPriority = filterPriority === '' || reminder.priority === filterPriority;
    const matchesCustomer = filterCustomer === '' || reminder.customerId === filterCustomer;
    
    return matchesStatus && matchesPriority && matchesCustomer;
  });

  const overdueReminders = reminders.filter(reminder => 
    reminder.status === 'pending' && 
    new Date(reminder.reminderDate) < new Date()
  );

  const todayReminders = reminders.filter(reminder => 
    reminder.status === 'pending' && 
    reminder.reminderDate === new Date().toISOString().split('T')[0]
  );

  const upcomingReminders = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.reminderDate);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return reminder.status === 'pending' && 
           reminderDate > today && 
           reminderDate <= threeDaysFromNow;
  });

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overdue */}
        {overdueReminders.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-medium text-red-800">{overdueReminders.length} Overdue</h3>
            </div>
            <p className="text-sm text-red-700">
              Follow-ups that should have been completed
            </p>
          </div>
        )}

        {/* Today */}
        {todayReminders.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-medium text-yellow-800">{todayReminders.length} Due Today</h3>
            </div>
            <p className="text-sm text-yellow-700">
              Follow-ups scheduled for today
            </p>
          </div>
        )}

        {/* Upcoming */}
        {upcomingReminders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CalendarDaysIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-800">{upcomingReminders.length} Upcoming</h3>
            </div>
            <p className="text-sm text-blue-700">
              Next 3 days
            </p>
          </div>
        )}
      </div>

      {/* Header and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-blue-500" />
              Quote Follow-up Reminders
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Track and manage quote follow-up activities
            </p>
          </div>
          <button
            onClick={() => setShowNewReminderForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Reminder
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="snoozed">Snoozed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

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

          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-1" />
            {filteredReminders.length} of {reminders.length}
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.map((reminder) => {
          const config = reminderTypeConfig[reminder.reminderType];
          const isOverdue = reminder.status === 'pending' && new Date(reminder.reminderDate) < new Date();
          const isDueToday = reminder.reminderDate === new Date().toISOString().split('T')[0];
          
          return (
            <div key={reminder.id} className={`bg-white rounded-lg border p-6 ${
              isOverdue ? 'border-red-300 bg-red-50' : 
              isDueToday ? 'border-yellow-300 bg-yellow-50' : 
              'border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[reminder.status]}`}>
                      {reminder.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[reminder.priority]}`}>
                      {reminder.priority.toUpperCase()}
                    </span>
                    {isOverdue && (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        OVERDUE
                      </span>
                    )}
                    {isDueToday && reminder.status === 'pending' && (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        DUE TODAY
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      {reminder.customerName}
                    </div>
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      Quote #{reminder.quoteId} - ${reminder.quoteValue.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      {new Date(reminder.reminderDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      {reminder.communicationMethod === 'email' ? (
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                      ) : reminder.communicationMethod === 'phone' ? (
                        <PhoneIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <div className="flex">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          <PhoneIcon className="h-4 w-4" />
                        </div>
                      )}
                      {reminder.communicationMethod === 'both' ? 'Email & Phone' : 
                       reminder.communicationMethod.charAt(0).toUpperCase() + reminder.communicationMethod.slice(1)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{reminder.message}</p>
                  
                  {reminder.notes && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {reminder.notes}
                      </p>
                    </div>
                  )}

                  {reminder.status === 'completed' && reminder.completedDate && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Completed on {new Date(reminder.completedDate).toLocaleDateString()}
                    </div>
                  )}

                  {reminder.status === 'snoozed' && reminder.snoozeUntil && (
                    <div className="flex items-center text-blue-600 text-sm">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Snoozed until {new Date(reminder.snoozeUntil).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {reminder.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCompleteReminder(reminder.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Complete
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setSelectedReminder(selectedReminder?.id === reminder.id ? null : reminder)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Snooze
                      </button>
                      {selectedReminder?.id === reminder.id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="p-2 space-y-1 min-w-32">
                            <button
                              onClick={() => {
                                handleSnoozeReminder(reminder.id, 1);
                                setSelectedReminder(null);
                              }}
                              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                            >
                              1 Day
                            </button>
                            <button
                              onClick={() => {
                                handleSnoozeReminder(reminder.id, 3);
                                setSelectedReminder(null);
                              }}
                              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                            >
                              3 Days
                            </button>
                            <button
                              onClick={() => {
                                handleSnoozeReminder(reminder.id, 7);
                                setSelectedReminder(null);
                              }}
                              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                            >
                              1 Week
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredReminders.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders found</h3>
          <p className="text-gray-500">Add a custom reminder or adjust your filters</p>
        </div>
      )}

      {/* New Reminder Form Modal */}
      {showNewReminderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add Custom Reminder</h2>
                <button
                  onClick={() => setShowNewReminderForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                  <select
                    value={formData.quoteId}
                    onChange={(e) => setFormData({...formData, quoteId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select quote...</option>
                    {quotes.filter(q => q.status === 'sent').map(quote => (
                      <option key={quote.id} value={quote.id}>
                        {quote.customerName} - ${quote.value.toLocaleString()} ({quote.serviceLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date</label>
                    <input
                      type="date"
                      value={formData.reminderDate}
                      onChange={(e) => setFormData({...formData, reminderDate: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Communication Method</label>
                  <select
                    value={formData.communicationMethod}
                    onChange={(e) => setFormData({...formData, communicationMethod: e.target.value as any})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="both">Both Email & Phone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Reminder message and action to take..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Additional notes (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewReminderForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReminder}
                  disabled={!formData.quoteId || !formData.reminderDate || !formData.message}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close snooze menu */}
      {selectedReminder && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setSelectedReminder(null)}
        />
      )}
    </div>
  );
}