// Shared customer data - centralized source of truth
// TODO: In production, this would be replaced with API calls or database queries

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

interface Contact {
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
}

export interface Customer {
  id: string;
  userId: string;
  
  // Organization Info
  companyName?: string;
  organizationType?: 'INDIVIDUAL' | 'MUNICIPALITY' | 'HOA' | 'SCHOOL' | 'CHURCH' | 'BUSINESS' | 'OTHER';
  
  // Primary Contact (main point of contact)
  primaryContact: Contact;
  
  // Billing Information
  billingContact?: Contact; // Optional separate billing contact
  billingAddress: Address; // Where invoices/mail should be sent
  
  // Project Information  
  projectContact?: Contact; // Optional on-site project contact
  projectAddress?: Address; // Physical location of the court/project
  
  // Business Classification
  customerGroup: 'RETAIL' | 'CONTRACTOR' | 'DEALER' | 'WHOLESALE' | 'LEVEL_3_RESURFACING';
  customerStatus: 'LEAD' | 'PROSPECT' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_5_5' | 'CLIENT' | 'INACTIVE' | 'LOST' | 'CLOSED';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  notes?: string;
  orders?: any[];
  invoices?: any[];
}

// Helper functions for customer data
export const getCustomerDisplayName = (customer: Customer): string => {
  if (customer.companyName) {
    return customer.companyName;
  }
  if (customer.primaryContact.firstName && customer.primaryContact.lastName) {
    return `${customer.primaryContact.firstName} ${customer.primaryContact.lastName}`;
  }
  return customer.primaryContact.email || 'Unnamed Customer';
};

export const getCustomerEmail = (customer: Customer): string => {
  return customer.primaryContact.email || '';
};

export const getBillingEmail = (customer: Customer): string => {
  return customer.billingContact?.email || customer.primaryContact.email || '';
};

export const getProjectAddress = (customer: Customer): Address => {
  return customer.projectAddress || customer.billingAddress;
};

export const getBillingContactName = (customer: Customer): string => {
  if (customer.billingContact?.firstName && customer.billingContact?.lastName) {
    return `${customer.billingContact.firstName} ${customer.billingContact.lastName}`;
  }
  return getCustomerDisplayName(customer);
};

// This data will be dynamically loaded in production
// For now, it serves as the single source of truth for customer data
export const getAllCustomers = (): Customer[] => {
  return [
    // Individual contractor - simple case
    {
      id: "cust_001",
      userId: "user_001",
      organizationType: "INDIVIDUAL",
      primaryContact: {
        firstName: "Aric",
        lastName: "Holsinger",
        email: "aricholsinger@verizon.net",
        phone: "1 703 8514945"
      },
      billingAddress: {
        street: "2066 Ambrose Commons",
        city: "Charlottesville",
        state: "VA", 
        zipCode: "22903"
      },
      customerGroup: "LEVEL_3_RESURFACING",
      customerStatus: "CLIENT",
      createdAt: "2025-01-30",
      updatedAt: "2025-01-30",
      orders: [],
      invoices: []
    },

    // Municipality example - separate billing and project addresses
    {
      id: "cust_municipality_001",
      userId: "user_municipality_001", 
      companyName: "Botetourt County Parks & Recreation",
      organizationType: "MUNICIPALITY",
      primaryContact: {
        firstName: "John",
        lastName: "Smith",
        title: "Parks & Recreation Director",
        email: "jsmith@botetourtva.gov", 
        phone: "540-473-8246"
      },
      billingContact: {
        firstName: "Mary",
        lastName: "Johnson",
        title: "Accounts Payable Clerk",
        email: "mjohnson@botetourtva.gov",
        phone: "540-473-8200"
      },
      billingAddress: {
        street: "1 Government Center Drive",
        city: "Fincastle",
        state: "VA", 
        zipCode: "24090"
      },
      projectContact: {
        firstName: "Mike", 
        lastName: "Wilson",
        title: "Maintenance Supervisor",
        email: "mwilson@botetourtva.gov",
        phone: "540-473-8250"
      },
      projectAddress: {
        street: "150 Scruggs Road - Tennis Complex",
        city: "Cloverdale",
        state: "VA",
        zipCode: "24077"
      },
      customerGroup: "LEVEL_3_RESURFACING",
      customerStatus: "CLIENT", 
      createdAt: "2025-01-30",
      updatedAt: "2025-01-30",
      notes: "County tennis court complex - 4 courts total. Contact Mike Wilson for site access. Invoice must reference Purchase Order.",
      orders: [],
      invoices: [
        {
          id: "INV-2024-003",
          number: "INV-2024-003", 
          amount: 37650.00,
          dueDate: "2024-12-15",
          status: "PAID",
          description: "Tennis court resurfacing - Courts 1 & 2"
        },
        {
          id: "INV-2024-007", 
          number: "INV-2024-007",
          amount: 47749.30,
          dueDate: "2025-01-15", 
          status: "PENDING",
          description: "Tennis court resurfacing - Courts 3 & 4"
        }
      ]
    },

    // HOA example - separate billing and project addresses  
    {
      id: "cust_hoa_001",
      userId: "user_hoa_001",
      companyName: "Riverside Estates HOA",
      organizationType: "HOA", 
      primaryContact: {
        firstName: "Sarah",
        lastName: "Davis",
        title: "HOA President",
        email: "president@riversideestates.com",
        phone: "919-555-0123"
      },
      billingContact: {
        firstName: "Robert",
        lastName: "Thompson", 
        title: "HOA Treasurer",
        email: "treasurer@riversideestates.com",
        phone: "919-555-0124"
      },
      billingAddress: {
        street: "c/o Triangle Property Management, 1234 Main St",
        city: "Raleigh",
        state: "NC",
        zipCode: "27601"
      },
      projectContact: {
        firstName: "Tom",
        lastName: "Martinez",
        title: "Maintenance Coordinator", 
        email: "maintenance@riversideestates.com",
        phone: "919-555-0125"
      },
      projectAddress: {
        street: "5678 Riverside Drive - Tennis Courts",
        city: "Cary", 
        state: "NC",
        zipCode: "27519"
      },
      customerGroup: "LEVEL_3_RESURFACING",
      customerStatus: "PROSPECT",
      createdAt: "2025-01-30", 
      updatedAt: "2025-01-30",
      notes: "2 tennis courts need resurfacing. Board meeting approval required before work begins.",
      orders: [],
      invoices: []
    },

    // Business example - simple structure
    {
      id: "cust_business_001",
      userId: "user_business_001",
      companyName: "Elite Sports Academy",
      organizationType: "BUSINESS",
      primaryContact: {
        firstName: "Michael",
        lastName: "Rodriguez",
        title: "Facility Manager",
        email: "mrodriguez@elitesports.com",
        phone: "704-555-9876"
      },
      billingAddress: {
        street: "789 Sports Complex Drive",
        city: "Charlotte",
        state: "NC",
        zipCode: "28269"
      },
      projectAddress: {
        street: "789 Sports Complex Drive - Court Area",
        city: "Charlotte",
        state: "NC",
        zipCode: "28269"
      },
      customerGroup: "LEVEL_3_RESURFACING",
      customerStatus: "LEAD",
      createdAt: "2025-01-30",
      updatedAt: "2025-01-30",
      notes: "3 basketball courts need complete resurfacing. Budget approved, waiting for scheduling.",
      orders: [],
      invoices: []
    }
  ];
};
