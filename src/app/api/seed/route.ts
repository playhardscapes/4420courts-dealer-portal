import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Chart of Accounts data from CLAUDE.md documentation
const chartOfAccounts = [
  // ASSETS
  { code: '1000', name: 'Cash', type: 'ASSET', balance: 125800 },
  { code: '1100', name: 'Accounts Receivable', type: 'ASSET', balance: 85400 },
  { code: '1200', name: 'Inventory', type: 'ASSET', balance: 34600 },
  { code: '1300', name: 'Prepaid Expenses', type: 'ASSET', balance: 12500 },
  { code: '1400', name: 'Office Equipment', type: 'ASSET', balance: 45000 },
  { code: '1500', name: 'Equipment', type: 'ASSET', balance: 185000 },
  { code: '1550', name: 'Accumulated Depreciation - Equipment', type: 'ASSET', balance: -45050 },
  { code: '1600', name: 'Vehicles', type: 'ASSET', balance: 100000 },
  { code: '1650', name: 'Accumulated Depreciation - Vehicles', type: 'ASSET', balance: -25000 },
  
  // LIABILITIES
  { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', balance: 42300 },
  { code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY', balance: 8500 },
  { code: '2200', name: 'Accrued Expenses', type: 'LIABILITY', balance: 28500 },
  { code: '2300', name: 'Short-term Debt', type: 'LIABILITY', balance: 14800 },
  { code: '2500', name: 'Equipment Loan', type: 'LIABILITY', balance: 39700 },
  { code: '2600', name: 'Vehicle Loan', type: 'LIABILITY', balance: 28000 },
  
  // EQUITY
  { code: '3000', name: 'Owners Equity', type: 'EQUITY', balance: 300000 },
  { code: '3100', name: 'Retained Earnings', type: 'EQUITY', balance: 60450 },
  { code: '3200', name: 'Current Year Earnings', type: 'EQUITY', balance: 62300 },
  
  // REVENUE
  { code: '4000', name: 'Product Sales', type: 'REVENUE', balance: 195000 },
  { code: '4100', name: 'Service Revenue', type: 'REVENUE', balance: 52500 },
  { code: '4200', name: 'Consultation Revenue', type: 'REVENUE', balance: 18500 },
  { code: '4300', name: 'Training Revenue', type: 'REVENUE', balance: 12000 },
  
  // EXPENSES
  { code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE', balance: 99000 },
  { code: '5100', name: 'Direct Labor', type: 'EXPENSE', balance: 24000 },
  { code: '5200', name: 'Materials Cost', type: 'EXPENSE', balance: 42000 },
  { code: '6000', name: 'Salaries & Benefits', type: 'EXPENSE', balance: 42000 },
  { code: '6100', name: 'Marketing Expense', type: 'EXPENSE', balance: 18500 },
  { code: '6200', name: 'Commission Expense', type: 'EXPENSE', balance: 24750 },
  { code: '6300', name: 'Administrative Expense', type: 'EXPENSE', balance: 15900 },
  { code: '6400', name: 'Office Supplies', type: 'EXPENSE', balance: 3200 },
  { code: '6500', name: 'Insurance', type: 'EXPENSE', balance: 8500 },
  { code: '6600', name: 'Vehicle Expenses', type: 'EXPENSE', balance: 12000 },
  { code: '6700', name: 'Equipment Maintenance', type: 'EXPENSE', balance: 5500 },
  { code: '6800', name: 'Professional Services', type: 'EXPENSE', balance: 7200 },
  { code: '7000', name: 'Interest Expense', type: 'EXPENSE', balance: 9800 },
  { code: '7100', name: 'Depreciation Expense', type: 'EXPENSE', balance: 8500 },
  { code: '8000', name: 'Other Income', type: 'REVENUE', balance: 2500 },
  { code: '9000', name: 'Other Expenses', type: 'EXPENSE', balance: 1800 }
];

// POST /api/seed - Initialize database with sample data
export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding not allowed in production' },
        { status: 403 }
      );
    }

    // Clear existing data in proper order to respect foreign keys
    await prisma.inventoryMove.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.journalEntry.deleteMany();
    await prisma.account.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    console.log('Creating Chart of Accounts...');
    // Create Chart of Accounts
    await prisma.account.createMany({
      data: chartOfAccounts.map(account => ({
        code: account.code,
        name: account.name,
        type: account.type as any,
        balance: account.balance
      }))
    });

    console.log('Creating sample customers...');
    // Create comprehensive customer data
    const customers = await prisma.customer.createMany({
      data: [
        {
          firstName: 'Mike',
          lastName: 'Johnson',
          companyName: 'ABC Home Courts',
          email: 'mike@abchomecourts.com',
          phone: '(555) 123-4567',
          group: 'CONTRACTOR',
          status: 'ACTIVE',
          billingAddress: {
            street: '123 Sports Complex Dr',
            city: 'Tampa',
            state: 'FL',
            zipCode: '33601'
          },
          shippingAddress: {
            street: '123 Sports Complex Dr',
            city: 'Tampa',
            state: 'FL',
            zipCode: '33601'
          },
          creditLimit: 25000,
          notes: 'Long-term customer, specializes in residential courts'
        },
        {
          firstName: 'Sarah',
          lastName: 'Davis',
          companyName: 'Elite Sports Surfaces',
          email: 'sarah@elitesports.com',
          phone: '(555) 234-5678',
          group: 'DEALER',
          status: 'ACTIVE',
          creditLimit: 50000,
          notes: 'Premium dealer with excellent payment history'
        },
        {
          firstName: 'Tom',
          lastName: 'Wilson',
          companyName: 'Court Masters LLC',
          email: 'info@courtmasters.com',
          phone: '(555) 345-6789',
          group: 'CONTRACTOR',
          status: 'ACTIVE',
          billingAddress: {
            street: '321 Recreation Blvd',
            city: 'Atlanta',
            state: 'GA',
            zipCode: '30309'
          },
          creditLimit: 15000
        },
        {
          firstName: 'Lisa',
          lastName: 'Rodriguez',
          companyName: 'Residential Courts Inc',
          email: 'orders@residentialcourts.com',
          phone: '(555) 456-7890',
          group: 'RETAIL',
          status: 'ACTIVE',
          creditLimit: 5000
        }
      ]
    });

    console.log('Creating product catalog...');
    // Create comprehensive product catalog
    const products = await prisma.product.createMany({
      data: [
        // Complete Court Kits (Retail Products)
        {
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
          weight: 95.5,
          dimensions: { length: 48.0, width: 32.0, height: 24.0 }
        },
        
        // Install Materials (Internal Use)
        {
          sku: 'RM-205',
          name: 'Premium Acrylic Coating - 5 Gallon',
          description: 'High-performance acrylic court coating for professional installations',
          category: 'RESURFACING_MATERIALS',
          type: 'PHYSICAL',
          retailPrice: 125.00,
          dealerPrice: 100.00,
          wholesalePrice: 85.00,
          cost: 45.00,
          stockQuantity: 8,
          lowStockAlert: 15,
          trackInventory: true,
          weight: 52.3,
          dimensions: { length: 12.5, width: 12.5, height: 15.0 }
        },
        {
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
          weight: 50.0
        },
        {
          sku: 'TE-310',
          name: 'Professional Squeegee Set',
          description: 'Complete squeegee set with multiple blade sizes for optimal surface preparation',
          category: 'TOOLS_EQUIPMENT',
          type: 'PHYSICAL',
          retailPrice: 285.00,
          dealerPrice: 228.00,
          wholesalePrice: 195.00,
          cost: 125.00,
          stockQuantity: 0,
          lowStockAlert: 5,
          trackInventory: true,
          weight: 12.8
        },
        
        // Services (Retail Available)
        {
          sku: 'SV-150',
          name: 'Video Consultation - 1 Hour',
          description: 'One-on-one video consultation with court resurfacing expert',
          category: 'SERVICES',
          type: 'SERVICE',
          retailPrice: 150.00,
          dealerPrice: 120.00,
          wholesalePrice: 150.00,
          cost: 25.00,
          stockQuantity: 999,
          lowStockAlert: 0,
          trackInventory: false,
          weight: 0
        },
        
        // Digital Resources (Retail Available)
        {
          sku: 'DR-001',
          name: 'Court Prep Video Library',
          description: 'Complete digital library of court preparation and application videos',
          category: 'DIGITAL_RESOURCES',
          type: 'DIGITAL',
          retailPrice: 49.99,
          dealerPrice: 39.99,
          wholesalePrice: 49.99,
          cost: 5.00,
          stockQuantity: 999,
          lowStockAlert: 0,
          trackInventory: false,
          weight: 0
        },
        
        // Drop Ship Items
        {
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
          weight: 5.2
        }
      ]
    });

    console.log('Creating asset inventory...');
    // Create comprehensive asset inventory for insurance purposes
    const assets = await prisma.asset.createMany({
      data: [
        // Tools
        {
          name: 'Professional Court Squeegee System',
          description: '36" aluminum frame squeegee with multiple blade attachments for court preparation',
          category: 'TOOLS',
          serialNumber: 'SQ-2024-001',
          model: 'Pro-Squeegee 36',
          manufacturer: 'Court Tools Inc',
          purchaseDate: new Date('2024-03-15'),
          purchasePrice: 485.00,
          currentValue: 425.00,
          condition: 'EXCELLENT',
          status: 'ACTIVE',
          location: 'Main Warehouse - Tool Storage A3',
          assignedTo: 'Mike Johnson',
          warrantyExpiry: new Date('2026-03-15'),
          maintenanceSchedule: 'Every 6 months',
          lastMaintenanceDate: new Date('2024-12-01'),
          insurancePolicyNumber: 'INS-TOOLS-2024-001',
          images: [
            {
              id: '1',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1706123456/assets/squeegee-system-1.jpg',
              publicId: 'assets/squeegee-system-1',
              caption: 'Complete squeegee system with all attachments',
              isPrimary: true,
              uploadedAt: '2024-03-15T10:30:00Z'
            }
          ],
          notes: 'Primary squeegee for all court prep work. Includes 4 different blade types for various surface conditions.'
        },
        {
          name: 'Court Surface Temperature Gun',
          description: 'Infrared thermometer for measuring surface temperature before coating application',
          category: 'TOOLS',
          serialNumber: 'TG-IR-2024-005',
          model: 'TempPro IR-500',
          manufacturer: 'Precision Instruments',
          purchaseDate: new Date('2024-05-10'),
          purchasePrice: 285.00,
          currentValue: 245.00,
          condition: 'EXCELLENT',
          status: 'ACTIVE',
          location: 'Van 1 - Tool Box C',
          assignedTo: 'Mobile Kit',
          warrantyExpiry: new Date('2026-05-10'),
          maintenanceSchedule: 'Calibration every 12 months',
          lastMaintenanceDate: new Date('2024-11-10'),
          insurancePolicyNumber: 'INS-TOOLS-2024-005',
          notes: 'Critical for ensuring proper application temperature. Last calibration showed +/- 1°F accuracy.'
        },
        
        // Vehicles
        {
          name: 'Ford Transit Cargo Van',
          description: '2023 Ford Transit 250 cargo van for equipment transport and mobile operations',
          category: 'VEHICLES',
          serialNumber: 'VIN-1FTBR2C84NKA12345',
          model: 'Transit 250',
          manufacturer: 'Ford Motor Company',
          purchaseDate: new Date('2023-08-20'),
          purchasePrice: 42500.00,
          currentValue: 38200.00,
          condition: 'GOOD',
          status: 'ACTIVE',
          location: 'Company Parking - Bay 1',
          assignedTo: 'Sarah Davis',
          warrantyExpiry: new Date('2026-08-20'),
          maintenanceSchedule: 'Every 5,000 miles',
          lastMaintenanceDate: new Date('2025-01-10'),
          insurancePolicyNumber: 'INS-VEHICLE-2023-002',
          images: [
            {
              id: '3',
              url: 'https://res.cloudinary.com/4420courts/image/upload/v1692456789/assets/transit-van-exterior.jpg',
              publicId: 'assets/transit-van-exterior',
              caption: 'Exterior view with company branding',
              isPrimary: true,
              uploadedAt: '2023-08-20T15:45:00Z'
            }
          ],
          notes: 'Primary vehicle for court installations. Custom shelving installed for tool organization. 28,500 current miles.'
        },
        
        // Equipment
        {
          name: 'Commercial Pressure Washer',
          description: 'Heavy-duty 4000 PSI pressure washer for court surface preparation',
          category: 'EQUIPMENT',
          serialNumber: 'PW-4000-2024-003',
          model: 'PowerClean 4000X',
          manufacturer: 'Industrial Cleaning Solutions',
          purchaseDate: new Date('2024-01-12'),
          purchasePrice: 2850.00,
          currentValue: 2400.00,
          condition: 'GOOD',
          status: 'ACTIVE',
          location: 'Equipment Shed - North Wall',
          assignedTo: 'Equipment Pool',
          warrantyExpiry: new Date('2027-01-12'),
          maintenanceSchedule: 'Monthly inspection, annual service',
          lastMaintenanceDate: new Date('2024-12-15'),
          insurancePolicyNumber: 'INS-EQUIP-2024-003',
          notes: 'Used for all major court cleaning projects. Requires special handling due to high pressure. 245 hours on engine.'
        },
        
        // Technology
        {
          name: 'MacBook Pro M3 - Project Management',
          description: 'MacBook Pro 16" M3 for project management, design work, and client presentations',
          category: 'TECHNOLOGY',
          serialNumber: 'MBP-M3-2024-001',
          model: 'MacBook Pro 16" M3',
          manufacturer: 'Apple Inc.',
          purchaseDate: new Date('2024-02-28'),
          purchasePrice: 3200.00,
          currentValue: 2650.00,
          condition: 'EXCELLENT',
          status: 'ACTIVE',
          location: 'Office - Desk 1',
          assignedTo: 'John Smith',
          warrantyExpiry: new Date('2025-02-28'),
          maintenanceSchedule: 'Software updates monthly',
          lastMaintenanceDate: new Date('2025-01-15'),
          insurancePolicyNumber: 'INS-TECH-2024-001',
          notes: 'Primary computer for project management software, CAD work, and client presentations. Includes external 27" monitor.'
        }
      ]
    });

    console.log('Database seeding completed successfully!');
    return NextResponse.json({
      message: 'Database seeded successfully with comprehensive business data',
      counts: {
        accounts: chartOfAccounts.length,
        customers: 4,
        products: 7,
        assets: 5
      },
      summary: {
        chartOfAccounts: `${chartOfAccounts.length} accounts created covering Assets, Liabilities, Equity, Revenue, and Expenses`,
        customers: 'Created diverse customer base including contractors, dealers, and retail customers',
        products: 'Created product catalog with install materials, retail products, services, and drop-ship items',
        assets: 'Created comprehensive asset inventory for insurance documentation with photos and maintenance records'
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}