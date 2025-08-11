import { PrismaClient, UserRole, DealerServiceLevel, DealerStatus, ProductCategory, ProductType, AccountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with test data...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@4420courts.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      permissions: ['*'], // All permissions
    },
  });

  console.log('✅ Created admin user');

  // Create test dealer
  const dealerPassword = await bcrypt.hash('dealer123', 12);
  const dealerUser = await prisma.user.create({
    data: {
      email: 'dealer@example.com',
      password: dealerPassword,
      firstName: 'John',
      lastName: 'Dealer',
      phone: '+1-555-0123',
      role: UserRole.DEALER,
      dealer: {
        create: {
          companyName: 'Premium Court Solutions',
          dealerCode: 'PCS001',
          territory: 'North Texas',
          commissionRate: 0.15, // 15%
          serviceLevel: DealerServiceLevel.LEVEL_4,
          status: DealerStatus.ACTIVE,
          businessAddress: {
            street: '123 Business Ave',
            city: 'Dallas',
            state: 'TX',
            zip: '75001',
            country: 'USA'
          },
          licenseNumber: 'TX-CONTRACTOR-12345',
        }
      }
    },
    include: {
      dealer: true
    }
  });

  console.log('✅ Created test dealer');

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'Jane',
      lastName: 'Customer',
      phone: '+1-555-0124',
      role: UserRole.CUSTOMER,
      customer: {
        create: {
          companyName: 'Backyard Basketball LLC',
          billingAddress: {
            street: '456 Home St',
            city: 'Plano',
            state: 'TX',
            zip: '75023',
            country: 'USA'
          },
          shippingAddress: {
            street: '456 Home St',
            city: 'Plano',
            state: 'TX',
            zip: '75023',
            country: 'USA'
          },
          customerGroup: 'RETAIL'
        }
      }
    },
    include: {
      customer: true
    }
  });

  console.log('✅ Created test customer');

  // Create products based on your business model
  const courtKit = await prisma.product.create({
    data: {
      sku: 'COURT-KIT-COMPLETE',
      name: 'Complete Court Resurfacing Kit',
      description: '20x 5-gallon buckets (4 gallons material each) - 80 gallons total covers one court',
      category: ProductCategory.COMPLETE_COURT_KIT,
      type: ProductType.PHYSICAL,
      retailPrice: 1350.00,
      dealerPrice: 1150.00,
      wholesalePrice: 950.00,
      cost: 500.00,
      stockQuantity: 25,
      weight: 640, // 20 buckets * ~32lbs each
      dimensions: {
        length: 48,
        width: 40,
        height: 36,
        unit: 'inches'
      }
    }
  });

  const products = await prisma.product.createMany({
    data: [
      {
        sku: 'SERVICE-DELIVERY-DEMO',
        name: 'White Glove Delivery + Demo',
        description: 'Professional delivery and on-site demonstration',
        category: ProductCategory.SERVICES,
        type: ProductType.SERVICE,
        retailPrice: 250.00,
        dealerPrice: 200.00,
        cost: 100.00,
        stockQuantity: 0,
        trackInventory: false
      },
      {
        sku: 'SERVICE-VIDEO-CONSULT',
        name: 'Video Consultation (1 Hour)',
        description: 'Professional video consultation with court specialist',
        category: ProductCategory.SERVICES,
        type: ProductType.SERVICE,
        retailPrice: 150.00,
        dealerPrice: 120.00,
        cost: 50.00,
        stockQuantity: 0,
        trackInventory: false
      },
      {
        sku: 'SERVICE-EMERGENCY',
        name: 'Emergency Support (Same Day)',
        description: 'Same-day emergency support and troubleshooting',
        category: ProductCategory.SERVICES,
        type: ProductType.SERVICE,
        retailPrice: 200.00,
        dealerPrice: 160.00,
        cost: 75.00,
        stockQuantity: 0,
        trackInventory: false
      },
      {
        sku: 'RESOURCE-PREMIUM-ACCESS',
        name: 'Premium Portal Access (1 Year)',
        description: 'Access to premium troubleshooting content and support',
        category: ProductCategory.DIGITAL_RESOURCES,
        type: ProductType.DIGITAL,
        retailPrice: 49.99,
        dealerPrice: 39.99,
        cost: 5.00,
        stockQuantity: 0,
        trackInventory: false
      }
    ]
  });

  console.log('✅ Created test products');

  // Create chart of accounts for accounting system
  const accounts = await prisma.account.createMany({
    data: [
      // Assets
      { code: '1000', name: 'Cash', type: AccountType.ASSET },
      { code: '1100', name: 'Accounts Receivable', type: AccountType.ASSET },
      { code: '1200', name: 'Inventory', type: AccountType.ASSET },
      { code: '1500', name: 'Equipment', type: AccountType.ASSET },
      
      // Liabilities
      { code: '2000', name: 'Accounts Payable', type: AccountType.LIABILITY },
      { code: '2100', name: 'Sales Tax Payable', type: AccountType.LIABILITY },
      { code: '2500', name: 'Long Term Debt', type: AccountType.LIABILITY },
      
      // Equity
      { code: '3000', name: 'Owners Equity', type: AccountType.EQUITY },
      { code: '3100', name: 'Retained Earnings', type: AccountType.EQUITY },
      
      // Revenue
      { code: '4000', name: 'Product Sales', type: AccountType.REVENUE },
      { code: '4100', name: 'Service Revenue', type: AccountType.REVENUE },
      { code: '4200', name: 'Digital Sales', type: AccountType.REVENUE },
      
      // Expenses
      { code: '5000', name: 'Cost of Goods Sold', type: AccountType.EXPENSE },
      { code: '5100', name: 'Materials', type: AccountType.EXPENSE },
      { code: '6000', name: 'Operating Expenses', type: AccountType.EXPENSE },
      { code: '6100', name: 'Marketing', type: AccountType.EXPENSE },
      { code: '6200', name: 'Commission Expense', type: AccountType.EXPENSE },
    ]
  });

  console.log('✅ Created chart of accounts');

  // Create a sample order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2025-0001',
      customerId: customerUser.customer!.id,
      dealerId: dealerUser.dealer!.id,
      status: 'CONFIRMED',
      subtotal: 1350.00,
      taxAmount: 108.00, // 8% tax
      shippingAmount: 75.00,
      totalAmount: 1533.00,
      billingAddress: {
        street: '456 Home St',
        city: 'Plano',
        state: 'TX',
        zip: '75023',
        country: 'USA'
      },
      shippingAddress: {
        street: '456 Home St',
        city: 'Plano',
        state: 'TX',
        zip: '75023',
        country: 'USA'
      },
      paymentStatus: 'PAID',
      paidAt: new Date(),
      items: {
        create: [
          {
            productId: courtKit.id,
            quantity: 1,
            unitPrice: 1350.00,
            totalPrice: 1350.00,
            description: 'Complete Court Resurfacing Kit'
          }
        ]
      }
    },
    include: {
      items: true
    }
  });

  console.log('✅ Created sample order');

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Test credentials:');
  console.log('Admin: admin@4420courts.com / admin123');
  console.log('Dealer: dealer@example.com / dealer123');
  console.log('Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });