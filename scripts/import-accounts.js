const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importChartOfAccounts() {
  try {
    console.log('Starting Chart of Accounts import...');
    
    // Read the CSV file
    const csvPath = path.join(__dirname, '../filestotransfercsvdata/ChartOfAccounts.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = parseCSVLine(line);
      if (columns.length < 3) continue;
      
      const [code, name, type] = columns;
      
      // Skip empty code entries
      if (!code || !name) continue;
      
      // Map CSV types to our AccountType enum
      const accountType = mapAccountType(type);
      if (!accountType) {
        console.log(`Skipping account ${name} - unknown type: ${type}`);
        continue;
      }
      
      try {
        // Create or update account
        await prisma.account.upsert({
          where: { code: code },
          update: {
            name: name,
            type: accountType
          },
          create: {
            code: code,
            name: name,
            type: accountType,
            balance: 0
          }
        });
        
        console.log(`✓ Imported account: ${code} - ${name} (${accountType})`);
      } catch (error) {
        console.error(`Error importing account ${code} - ${name}:`, error.message);
      }
    }
    
    // Create specific bank accounts that we need
    await createBankAccounts();
    
    console.log('Chart of Accounts import completed!');
    
  } catch (error) {
    console.error('Error importing Chart of Accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function createBankAccounts() {
  console.log('Creating specific bank accounts...');
  
  // Bluevine Checking Account
  await prisma.account.upsert({
    where: { code: '1000' },
    update: {
      name: 'Bluevine Checking',
      type: 'ASSET'
    },
    create: {
      code: '1000',
      name: 'Bluevine Checking',
      type: 'ASSET',
      balance: 0
    }
  });
  
  // AmEx Credit Card
  await prisma.account.upsert({
    where: { code: '2300' },
    update: {
      name: 'American Express Credit Card',
      type: 'LIABILITY'
    },
    create: {
      code: '2300',
      name: 'American Express Credit Card',
      type: 'LIABILITY',
      balance: 0
    }
  });
  
  // Common expense accounts
  const expenseAccounts = [
    { code: '6030', name: 'Hand Tools', type: 'EXPENSE' },
    { code: '6110', name: 'Vehicle Expenses', type: 'EXPENSE' },
    { code: '6060', name: 'Office Supplies', type: 'EXPENSE' },
    { code: '6320', name: 'Insurance Expense', type: 'EXPENSE' },
    { code: '7050', name: 'Miscellaneous Expense', type: 'EXPENSE' },
    { code: '1360', name: 'Tools Equipment', type: 'ASSET' },
    { code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE' }
  ];
  
  for (const account of expenseAccounts) {
    await prisma.account.upsert({
      where: { code: account.code },
      update: {
        name: account.name,
        type: account.type
      },
      create: {
        code: account.code,
        name: account.name,
        type: account.type,
        balance: 0
      }
    });
    console.log(`✓ Created account: ${account.code} - ${account.name}`);
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function mapAccountType(csvType) {
  const typeMap = {
    'Bank': 'ASSET',
    'Accounts Receivable': 'ASSET',
    'Current Asset': 'ASSET',
    'Inventory': 'ASSET',
    'Fixed Asset': 'ASSET',
    'Accounts Payable': 'LIABILITY',
    'Current Liability': 'LIABILITY',
    'Liability': 'LIABILITY',
    'Sales Tax': 'LIABILITY',
    'Unpaid Expense Claims': 'LIABILITY',
    'Historical Adjustment': 'LIABILITY',
    'Rounding': 'LIABILITY',
    'Tracking': 'LIABILITY',
    'Equity': 'EQUITY',
    'Retained Earnings': 'EQUITY',
    'Sales': 'REVENUE',
    'Revenue': 'REVENUE',
    'Other Income': 'REVENUE',
    'Direct Costs': 'EXPENSE',
    'Expense': 'EXPENSE'
  };
  
  return typeMap[csvType] || null;
}

// Run the import
importChartOfAccounts();