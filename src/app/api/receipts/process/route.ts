import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionCategorizer } from '@/lib/ai/transaction-categorizer';
import { ReceiptProcessor } from '@/lib/ai/receipt-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt') as File;
    const location = formData.get('location') as string || 'Unknown';
    const notes = formData.get('notes') as string || '';
    
    if (!file) {
      return NextResponse.json({ error: 'No receipt image provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Convert image to base64 for Claude Vision API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = file.type;

    // Initialize receipt processor
    const receiptProcessor = new ReceiptProcessor();
    
    // Step 1: Extract text and data from receipt image using Claude Vision
    console.log('📸 Processing receipt image with Claude Vision...');
    const extractionResult = await receiptProcessor.extractReceiptData({
      image: base64Image,
      mimeType,
      filename: file.name
    });

    if (!extractionResult.success) {
      return NextResponse.json({ 
        error: 'Failed to process receipt image',
        details: extractionResult.error 
      }, { status: 500 });
    }

    // Step 2: Save receipt record with extracted data
    const receipt = await prisma.receipt.create({
      data: {
        filename: file.name,
        originalImage: base64Image,
        mimeType,
        fileSize: file.size,
        location,
        notes,
        
        // Extracted data from Claude Vision
        vendor: extractionResult.data.vendor,
        date: extractionResult.data.date,
        totalAmount: extractionResult.data.total,
        taxAmount: extractionResult.data.tax || 0,
        items: extractionResult.data.items || [],
        
        // OCR results
        extractedText: extractionResult.data.rawText,
        confidence: extractionResult.confidence,
        
        // Processing status
        processed: false,
        needsReview: extractionResult.confidence < 0.8
      }
    });

    // Step 3: Create transaction from receipt data and categorize with AI
    if (extractionResult.data.total && extractionResult.data.vendor && extractionResult.data.date) {
      try {
        const categorizer = new TransactionCategorizer();
        
        // Create transaction object from receipt
        const transaction = {
          date: new Date(extractionResult.data.date),
          description: `${extractionResult.data.vendor} - Receipt #${receipt.id.slice(-6)}`,
          amount: -Math.abs(extractionResult.data.total), // Negative for expense
          bankAccount: 'RECEIPT_CAPTURE', // Special type for manual receipts
          externalId: `RECEIPT-${receipt.id}`
        };

        // Categorize with AI
        console.log('🤖 Categorizing receipt with AI...');
        const categorizationResult = await categorizer.categorizeTransaction(transaction);

        // Create bank transaction record
        const bankTransaction = await prisma.bankTransaction.create({
          data: {
            ...transaction,
            category: categorizationResult.category,
            subcategory: categorizationResult.subcategory,
            confidence: categorizationResult.confidence,
            accountType: categorizationResult.accountType,
            aiAnalysis: categorizationResult.analysis,
            needsReview: categorizationResult.confidence < 0.8 || categorizationResult.needsReview,
            processed: false,
            metadata: {
              source: 'RECEIPT_CAPTURE',
              receiptId: receipt.id,
              extractionConfidence: extractionResult.confidence
            }
          }
        });

        // Execute AI actions (create assets, journal entries, etc.)
        if (categorizationResult.actions) {
          for (const action of categorizationResult.actions) {
            await executeReceiptAction(action, bankTransaction, categorizationResult, receipt);
          }
        }

        // Update receipt as processed
        await prisma.receipt.update({
          where: { id: receipt.id },
          data: { 
            processed: true,
            bankTransactionId: bankTransaction.id
          }
        });

        return NextResponse.json({
          success: true,
          receipt: {
            id: receipt.id,
            vendor: extractionResult.data.vendor,
            date: extractionResult.data.date,
            total: extractionResult.data.total,
            items: extractionResult.data.items,
            confidence: extractionResult.confidence
          },
          categorization: {
            category: categorizationResult.category,
            subcategory: categorizationResult.subcategory,
            confidence: categorizationResult.confidence,
            analysis: categorizationResult.analysis,
            actions: categorizationResult.actions
          },
          transaction: {
            id: bankTransaction.id,
            needsReview: bankTransaction.needsReview
          }
        });

      } catch (error) {
        console.error('Error categorizing receipt:', error);
        
        // Return receipt data even if categorization failed
        return NextResponse.json({
          success: true,
          receipt: {
            id: receipt.id,
            vendor: extractionResult.data.vendor,
            date: extractionResult.data.date,
            total: extractionResult.data.total,
            items: extractionResult.data.items,
            confidence: extractionResult.confidence
          },
          categorization: {
            error: 'Failed to categorize transaction',
            needsReview: true
          }
        });
      }
    } else {
      // Incomplete data - return for manual review
      return NextResponse.json({
        success: true,
        receipt: {
          id: receipt.id,
          vendor: extractionResult.data.vendor,
          date: extractionResult.data.date,
          total: extractionResult.data.total,
          items: extractionResult.data.items,
          confidence: extractionResult.confidence
        },
        categorization: {
          needsReview: true,
          message: 'Incomplete receipt data - manual review required'
        }
      });
    }

  } catch (error) {
    console.error('Error processing receipt:', error);
    return NextResponse.json(
      { error: 'Failed to process receipt' },
      { status: 500 }
    );
  }
}

// Execute AI-determined actions for receipts
async function executeReceiptAction(action: string, transaction: any, aiResult: any, receipt: any) {
  switch (action) {
    case 'CREATE_ASSET':
      await createAssetFromReceipt(transaction, aiResult, receipt);
      break;
    case 'CREATE_JOURNAL_ENTRY':
      await createJournalEntry(transaction, aiResult);
      break;
    case 'UPDATE_INVENTORY':
      await updateInventory(transaction, aiResult);
      break;
  }
}

async function createAssetFromReceipt(transaction: any, aiResult: any, receipt: any) {
  const assetData = aiResult.assetDetails;
  
  // Create asset with receipt photo
  await prisma.asset.create({
    data: {
      name: assetData.name,
      description: assetData.description,
      category: assetData.category,
      serialNumber: assetData.serialNumber || `REC-${Date.now()}`,
      model: assetData.model || '',
      manufacturer: assetData.manufacturer || receipt.vendor,
      purchaseDate: transaction.date,
      purchasePrice: Math.abs(transaction.amount),
      currentValue: Math.abs(transaction.amount),
      condition: 'EXCELLENT',
      status: 'ACTIVE',
      location: receipt.location || 'New Purchase - Location TBD',
      assignedTo: 'Unassigned',
      notes: `Auto-created from receipt: ${receipt.vendor}`,
      images: [{
        url: `data:${receipt.mimeType};base64,${receipt.originalImage}`,
        caption: `Receipt from ${receipt.vendor}`,
        isPrimary: true,
        uploadedAt: new Date().toISOString()
      }],
      metadata: {
        source: 'RECEIPT_CAPTURE',
        receiptId: receipt.id,
        transactionId: transaction.id,
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

async function createJournalEntry(transaction: any, aiResult: any) {
  const entryNumber = `JE-REC-${Date.now()}`;
  
  await prisma.journalEntry.create({
    data: {
      entryNumber,
      debitAccountId: aiResult.debitAccount,
      creditAccountId: aiResult.creditAccount,
      amount: Math.abs(transaction.amount),
      description: `Receipt: ${aiResult.category} - ${transaction.description}`,
      reference: transaction.externalId,
      entryDate: transaction.date,
      metadata: {
        source: 'RECEIPT_CAPTURE',
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
  console.log('Inventory update not yet implemented');
}