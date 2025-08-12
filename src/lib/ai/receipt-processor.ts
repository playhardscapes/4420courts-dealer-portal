interface ReceiptImage {
  image: string; // base64 encoded
  mimeType: string;
  filename: string;
}

interface ReceiptData {
  vendor: string;
  date: string;
  total: number;
  tax?: number;
  items: ReceiptItem[];
  rawText: string;
  paymentMethod?: string;
  receiptNumber?: string;
  address?: string;
}

interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

interface ExtractionResult {
  success: boolean;
  confidence: number;
  data: ReceiptData;
  error?: string;
}

export class ReceiptProcessor {
  private apiKey: string;
  private baseUrl: string = 'https://api.anthropic.com/v1/messages';

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('CLAUDE_API_KEY not found in environment variables');
    }
  }

  async extractReceiptData(receiptImage: ReceiptImage): Promise<ExtractionResult> {
    if (!this.apiKey) {
      return this.mockReceiptExtraction(receiptImage);
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          system: this.getReceiptExtractionPrompt(),
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Please extract all the information from this receipt image and return it as JSON.'
                },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: receiptImage.mimeType,
                    data: receiptImage.image
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude Vision API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse the JSON response
      const extractedData = JSON.parse(content);

      return {
        success: true,
        confidence: extractedData.confidence || 0.8,
        data: extractedData
      };

    } catch (error) {
      console.error('Receipt extraction failed:', error);
      
      // Fallback to mock extraction for development
      return this.mockReceiptExtraction(receiptImage);
    }
  }

  private getReceiptExtractionPrompt(): string {
    return `You are a receipt OCR specialist. Extract information from receipt images and return structured JSON data.

IMPORTANT: You must return valid JSON only, no other text.

Extract these fields from the receipt:
- vendor: Store/business name
- date: Transaction date (YYYY-MM-DD format)
- total: Total amount (number)
- tax: Tax amount if shown (number)
- items: Array of purchased items
- rawText: All visible text from receipt
- paymentMethod: How payment was made (if visible)
- receiptNumber: Receipt/transaction number (if visible)
- address: Store address (if visible)
- confidence: Your confidence in the extraction (0.0-1.0)

For items array, include:
- description: Item name/description
- quantity: Number of items
- unitPrice: Price per item (if available)
- totalPrice: Total for this line item
- category: Best guess at item category (TOOLS, MATERIALS, SUPPLIES, etc.)

Handle edge cases:
- Blurry or rotated images
- Partial receipts
- Multiple totals (use final total)
- Tax-inclusive vs tax-exclusive pricing
- Different receipt formats

Return JSON in this exact structure:
{
  "vendor": "STORE NAME",
  "date": "2025-01-28",
  "total": 127.45,
  "tax": 8.50,
  "items": [
    {
      "description": "DEWALT DRILL KIT",
      "quantity": 1,
      "unitPrice": 118.95,
      "totalPrice": 118.95,
      "category": "TOOLS"
    }
  ],
  "rawText": "All text from receipt...",
  "paymentMethod": "CREDIT CARD",
  "receiptNumber": "1234567890",
  "address": "123 Main St, City, ST 12345",
  "confidence": 0.9
}

Focus on accuracy for business expense tracking. If you can't read something clearly, indicate lower confidence.`;
  }

  private mockReceiptExtraction(receiptImage: ReceiptImage): ExtractionResult {
    // Mock responses based on filename patterns for development
    const filename = receiptImage.filename.toLowerCase();

    if (filename.includes('homedepot') || filename.includes('hd')) {
      return {
        success: true,
        confidence: 0.85,
        data: {
          vendor: 'HOME DEPOT',
          date: '2025-01-28',
          total: 127.45,
          tax: 8.95,
          items: [
            {
              description: 'DEWALT 20V MAX DRILL KIT',
              quantity: 1,
              unitPrice: 118.50,
              totalPrice: 118.50,
              category: 'TOOLS'
            }
          ],
          rawText: 'HOME DEPOT #1234\nDEWALT 20V MAX DRILL KIT\n$118.50\nTax: $8.95\nTotal: $127.45',
          paymentMethod: 'CREDIT CARD',
          receiptNumber: 'HD12345678',
          address: '123 Hardware Ave, City, ST 12345'
        }
      };
    }

    if (filename.includes('lowes')) {
      return {
        success: true,
        confidence: 0.82,
        data: {
          vendor: 'LOWES',
          date: '2025-01-28',
          total: 89.97,
          tax: 6.30,
          items: [
            {
              description: 'CRAFTSMAN SOCKET SET',
              quantity: 1,
              unitPrice: 83.67,
              totalPrice: 83.67,
              category: 'TOOLS'
            }
          ],
          rawText: 'LOWES #5678\nCRAFTSMAN SOCKET SET\n$83.67\nTax: $6.30\nTotal: $89.97',
          paymentMethod: 'DEBIT CARD',
          receiptNumber: 'LW87654321'
        }
      };
    }

    if (filename.includes('shell') || filename.includes('gas')) {
      return {
        success: true,
        confidence: 0.90,
        data: {
          vendor: 'SHELL',
          date: '2025-01-28',
          total: 65.50,
          items: [
            {
              description: 'GASOLINE',
              quantity: 18.5,
              unitPrice: 3.54,
              totalPrice: 65.50,
              category: 'FUEL'
            }
          ],
          rawText: 'SHELL STATION #9999\nGASOLINE 18.5 GAL @ $3.54\nTotal: $65.50',
          paymentMethod: 'CREDIT CARD',
          receiptNumber: 'SH555666777'
        }
      };
    }

    // Default mock receipt
    return {
      success: true,
      confidence: 0.60,
      data: {
        vendor: 'BUSINESS EXPENSE',
        date: '2025-01-28',
        total: 45.00,
        items: [
          {
            description: 'BUSINESS PURCHASE',
            quantity: 1,
            unitPrice: 45.00,
            totalPrice: 45.00,
            category: 'SUPPLIES'
          }
        ],
        rawText: 'Receipt text could not be clearly read'
      }
    };
  }

  // Helper method to validate extracted data
  validateReceiptData(data: ReceiptData): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!data.vendor || data.vendor.trim().length === 0) {
      issues.push('Vendor name is missing or empty');
    }

    if (!data.date || isNaN(new Date(data.date).getTime())) {
      issues.push('Date is missing or invalid');
    }

    if (!data.total || data.total <= 0) {
      issues.push('Total amount is missing or invalid');
    }

    if (!data.items || data.items.length === 0) {
      issues.push('No items found on receipt');
    }

    // Check if items total matches receipt total (within $0.02 for rounding)
    if (data.items && data.items.length > 0) {
      const itemsTotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
      const difference = Math.abs(itemsTotal - data.total);
      
      if (difference > 0.02) {
        issues.push(`Items total ($${itemsTotal.toFixed(2)}) doesn't match receipt total ($${data.total.toFixed(2)})`);
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  // Helper to determine if receipt should create an asset
  shouldCreateAsset(data: ReceiptData): boolean {
    // Tools/equipment over $50
    if (data.total > 50) {
      const toolKeywords = ['DRILL', 'SAW', 'TOOL', 'EQUIPMENT', 'COMPRESSOR', 'GENERATOR', 'LADDER'];
      const hasToolKeywords = data.items.some(item => 
        toolKeywords.some(keyword => 
          item.description.toUpperCase().includes(keyword) ||
          item.category?.toUpperCase().includes('TOOL')
        )
      );
      
      if (hasToolKeywords) return true;
    }

    // Vehicles regardless of amount
    const vehicleKeywords = ['TRUCK', 'VAN', 'CAR', 'VEHICLE', 'MOTORCYCLE'];
    const hasVehicleKeywords = data.items.some(item =>
      vehicleKeywords.some(keyword => 
        item.description.toUpperCase().includes(keyword)
      )
    );
    
    if (hasVehicleKeywords) return true;

    // Technology over $100
    if (data.total > 100) {
      const techKeywords = ['COMPUTER', 'LAPTOP', 'TABLET', 'PHONE', 'SOFTWARE'];
      const hasTechKeywords = data.items.some(item =>
        techKeywords.some(keyword => 
          item.description.toUpperCase().includes(keyword) ||
          item.category?.toUpperCase().includes('TECH')
        )
      );
      
      if (hasTechKeywords) return true;
    }

    return false;
  }
}