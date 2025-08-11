// Enhanced customer data structure with separate billing and project addresses
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

export interface CustomerEnhanced {
  id: string;
  userId: string;
  
  // Organization Info
  companyName?: string;
  organizationType?: 'INDIVIDUAL' | 'MUNICIPALITY' | 'HOA' | 'SCHOOL' | 'CHURCH' | 'BUSINESS' | 'OTHER';
  
  // Primary Contact (main point of contact)
  primaryContact: Contact;
  
  // Billing Information (where invoices/mail should be sent)
  billingContact?: Contact; // Optional separate billing contact
  billingAddress: Address;
  
  // Project Information (physical location of the court/project)
  projectContact?: Contact; // Optional on-site project contact  
  projectAddress?: Address; // Optional separate project location
  
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

// Backward compatibility - convert old format to new format
export interface Customer {
  id: string;
  userId: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  billingAddress?: any;
  shippingAddress?: any;
  customerGroup: 'RETAIL' | 'CONTRACTOR' | 'DEALER' | 'WHOLESALE' | 'LEVEL_3_RESURFACING';
  customerStatus: 'LEAD' | 'PROSPECT' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_5_5' | 'CLIENT' | 'INACTIVE' | 'LOST' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  orders?: any[];
  invoices?: any[];
}

// Helper function to convert old format to new enhanced format
export const convertToEnhanced = (oldCustomer: Customer): CustomerEnhanced => {
  return {
    id: oldCustomer.id,
    userId: oldCustomer.userId,
    companyName: oldCustomer.companyName,
    organizationType: oldCustomer.companyName ? 'BUSINESS' : 'INDIVIDUAL',
    primaryContact: {
      firstName: oldCustomer.firstName,
      lastName: oldCustomer.lastName,
      email: oldCustomer.email,
      phone: oldCustomer.phone
    },
    billingAddress: oldCustomer.billingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    // For backward compatibility, project address same as billing unless specified
    projectAddress: oldCustomer.shippingAddress || oldCustomer.billingAddress,
    customerGroup: oldCustomer.customerGroup,
    customerStatus: oldCustomer.customerStatus,
    createdAt: oldCustomer.createdAt,
    updatedAt: oldCustomer.updatedAt,
    orders: oldCustomer.orders,
    invoices: oldCustomer.invoices
  };
};

// Example of enhanced customers with proper structure
export const getEnhancedCustomers = (): CustomerEnhanced[] => {
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
    }
  ];
};