import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionCategorizer } from '@/lib/ai/transaction-categorizer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bankAccount = formData.get('bankAccount') as string; // 'bluevine' or 'amex'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Parse CSV file
    const text = await file.text();
    const transactions = await parseTransactionFile(text, bankAccount);
    
    // Initialize AI categorizer
    const categorizer = new TransactionCategorizer();
    
    const processedTransactions = [];
    
    for (const transaction of transactions) {
      try {
        // Use AI to categorize and process each transaction
        const result = await categorizer.categorizeTransaction(transaction);
        
        // Create the transaction record
        const createdTransaction = await prisma.bankTransaction.create({
          data: {
            ...transaction,
            transactionType: transaction.amount < 0 ? 'DEBIT' : 'CREDIT', // Determine from amount
            bankAccount: 'OTHER_CHECKING', // Default for imported transactions
            category: result.category,
            subcategory: result.subcategory,
            confidence: result.confidence,
            accountType: result.accountType,
            aiAnalysis: result.analysis,
            needsReview: result.confidence < 0.8 || result.needsReview,
            processed: false
          }
        });

        // Handle special actions based on categorization
        if (result.actions) {
          for (const action of result.actions) {
            await executeAIAction(action, createdTransaction, result);
          }
        }

        processedTransactions.push({
          transaction: createdTransaction,
          result
        });

      } catch (error) {
        console.error(`Error processing transaction ${transaction.description}:`, error);
        // Create transaction with manual review flag
        const createdTransaction = await prisma.bankTransaction.create({
          data: {
            ...transaction,
            transactionType: transaction.amount < 0 ? 'DEBIT' : 'CREDIT', // Determine from amount
            bankAccount: 'OTHER_CHECKING', // Default for imported transactions
            category: 'UNKNOWN',
            needsReview: true,
            processed: false,
            aiAnalysis: `Error during AI processing: ${error instanceof Error ? error.message : String(error)}`
          }
        });
        
        processedTransactions.push({
          transaction: createdTransaction,
          result: { error: error instanceof Error ? error.message : String(error) }
        });
      }
    }

    // Generate summary
    const summary = {
      totalTransactions: processedTransactions.length,
      categorized: processedTransactions.filter(t => !('error' in t.result)).length,
      needsReview: processedTransactions.filter(t => t.transaction.needsReview).length,
      assetsCreated: processedTransactions.filter(t => !('error' in t.result) && t.result?.actions?.includes('CREATE_ASSET')).length,
      billsMatched: processedTransactions.filter(t => !('error' in t.result) && t.result?.actions?.includes('MATCH_BILL')).length,
      journalEntries: processedTransactions.filter(t => !('error' in t.result) && t.result?.actions?.includes('CREATE_JOURNAL_ENTRY')).length
    };

    return NextResponse.json({
      success: true,
      summary,
      transactions: processedTransactions
    });

  } catch (error) {
    console.error('Error importing transactions:', error);
    return NextResponse.json(
      { error: 'Failed to import transactions' },
      { status: 500 }
    );
  }
}

// Helper function to parse CSV line with proper quote handling
function parseCSVLine(line: string): string[] {
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

// Parse different bank file formats
async function parseTransactionFile(text: string, bankAccount: string) {
  const lines = text.split('\n').filter(line => line.trim());
  const transactions = [];

  if (bankAccount === 'bluevine') {
    // Bluevine CSV format: Date, Description, Debit/Credit, Balance
    const headers = lines[0].split(',');
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 4) {
        const amount = parseFloat(values[2]);
        const balance = values[3] ? parseFloat(values[3]) : 0;
        transactions.push({
          date: new Date(values[0]),
          description: values[1].replace(/"/g, ''),
          amount: amount,
          balance: balance,
          transactionType: amount < 0 ? 'DEBIT' : 'CREDIT',
          bankAccount: 'BLUEVINE_CHECKING',
          externalId: `BV-${values[0]}-${Math.abs(amount)}-${i}`,
          rawData: lines[i]
        });
      }
    }
  } else if (bankAccount === 'amex') {
    // AmEx CSV format: Date,Receipt,Description,Card Member,Account #,Amount
    const headers = lines[0].split(',');
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 6) {
        const amount = parseFloat(values[5]); // AmEx amount (positive for charges, negative for payments)
        transactions.push({
          date: new Date(values[0]),
          description: values[2].replace(/"/g, ''), // Description is in column 2
          amount: amount,
          balance: 0, // AmEx doesn't provide balance
          transactionType: amount > 0 ? 'DEBIT' : 'CREDIT',
          bankAccount: 'AMEX_CREDIT',
          externalId: `AMEX-${values[0]}-${Math.abs(amount)}-${i}`,
          rawData: lines[i]
        });
      }
    }
  }

  return transactions;
}

// Execute AI-determined actions
async function executeAIAction(action: string, transaction: any, aiResult: any) {
  switch (action) {
    case 'CREATE_ASSET':
      await createAssetFromTransaction(transaction, aiResult);
      break;
    case 'MATCH_BILL':
      await matchTransactionToBill(transaction, aiResult);
      break;
    case 'CREATE_JOURNAL_ENTRY':
      await createJournalEntry(transaction, aiResult);
      break;
    case 'UPDATE_INVENTORY':
      await updateInventory(transaction, aiResult);
      break;
  }
}

// Create asset from tool/equipment purchase
async function createAssetFromTransaction(transaction: any, aiResult: any) {
  const assetData = aiResult.assetDetails;
  
  await prisma.asset.create({
    data: {
      name: assetData.name,
      description: assetData.description,
      category: assetData.category,
      serialNumber: assetData.serialNumber || `AUTO-${Date.now()}`,
      model: assetData.model || '',
      manufacturer: assetData.manufacturer || '',
      purchaseDate: transaction.date,
      purchasePrice: Math.abs(transaction.amount),
      currentValue: Math.abs(transaction.amount),
      condition: 'EXCELLENT',
      status: 'ACTIVE',
      location: 'New Purchase - Location TBD',
      assignedTo: 'Unassigned',
      notes: `Auto-created from transaction: ${transaction.description}`,
      metadata: {
        source: 'AI_TRANSACTION_IMPORT',
        transactionId: transaction.id,
        vendor: aiResult.vendor,
        confidence: aiResult.confidence
      }
    }
  });

  // Mark transaction as processed
  await prisma.bankTransaction.update({
    where: { id: transaction.id },
    data: { processed: true }
  });
}

// Match transaction to existing bill and mark as paid
async function matchTransactionToBill(transaction: any, aiResult: any) {
  const billDetails = aiResult.billMatch;
  
  // Find matching bill (by amount, vendor, date range)
  const matchingBill = await prisma.bill.findFirst({
    where: {
      amount: Math.abs(transaction.amount),
      vendor: billDetails.vendor,
      dueDate: {
        gte: new Date(transaction.date.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days before
        lte: new Date(transaction.date.getTime() + 7 * 24 * 60 * 60 * 1000)  // 7 days after
      },
      status: 'PENDING'
    }
  });

  if (matchingBill) {
    // Mark bill as paid
    await prisma.bill.update({
      where: { id: matchingBill.id },
      data: {
        status: 'PAID',
        paidDate: transaction.date,
        paymentReference: transaction.externalId
      }
    });

    // Create payment record
    await prisma.billPayment.create({
      data: {
        billId: matchingBill.id,
        amount: Math.abs(transaction.amount),
        paymentDate: transaction.date,
        method: transaction.bankAccount === 'BLUEVINE_CHECKING' ? 'BANK_TRANSFER' : 'CREDIT_CARD',
        reference: transaction.externalId
      }
    });

    // Mark transaction as processed
    await prisma.bankTransaction.update({
      where: { id: transaction.id },
      data: { processed: true }
    });
  }
}

// Create journal entry for the transaction
async function createJournalEntry(transaction: any, aiResult: any) {
  const entryNumber = `JE-${Date.now()}`;
  
  await prisma.journalEntry.create({
    data: {
      entryNumber,
      debitAccountId: aiResult.debitAccount,
      creditAccountId: aiResult.creditAccount,
      amount: Math.abs(transaction.amount),
      description: `${aiResult.category}: ${transaction.description}`,
      reference: transaction.externalId,
      entryDate: transaction.date,
      metadata: {
        source: 'AI_TRANSACTION_IMPORT',
        transactionId: transaction.id,
        confidence: aiResult.confidence
      }
    }
  });

  // Update account balances
  await updateAccountBalance(aiResult.debitAccount, Math.abs(transaction.amount), 'DEBIT');
  await updateAccountBalance(aiResult.creditAccount, Math.abs(transaction.amount), 'CREDIT');

  // Mark transaction as processed
  await prisma.bankTransaction.update({
    where: { id: transaction.id },
    data: { processed: true }
  });
}

async function updateAccountBalance(accountId: string, amount: number, type: 'DEBIT' | 'CREDIT') {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) return;

  let balanceChange = amount;
  
  // Apply accounting rules based on account type
  if (account.type === 'ASSET' || account.type === 'EXPENSE') {
    balanceChange = type === 'DEBIT' ? amount : -amount;
  } else {
    balanceChange = type === 'CREDIT' ? amount : -amount;
  }

  await prisma.account.update({
    where: { id: accountId },
    data: {
      balance: {
        increment: balanceChange
      }
    }
  });
}

async function updateInventory(transaction: any, aiResult: any) {
  // Update inventory based on AI analysis
  // This would be implemented based on your specific inventory needs
  console.log('Inventory update not yet implemented');
}