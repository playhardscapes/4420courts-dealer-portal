interface Transaction {
  date: Date;
  description: string;
  amount: number;
  bankAccount: string;
  externalId: string;
}

interface CategorizationResult {
  category: string;
  subcategory: string;
  confidence: number;
  accountType: string;
  analysis: string;
  needsReview: boolean;
  actions?: string[];
  assetDetails?: AssetDetails;
  billMatch?: BillMatch;
  debitAccount?: string;
  creditAccount?: string;
  vendor?: string;
}

interface AssetDetails {
  name: string;
  description: string;
  category: 'TOOLS' | 'VEHICLES' | 'EQUIPMENT' | 'TECHNOLOGY' | 'FURNITURE' | 'OTHER';
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
}

interface BillMatch {
  vendor: string;
  poNumber?: string;
  invoiceNumber?: string;
  confidence: number;
}

export class TransactionCategorizer {
  private businessRules!: Map<string, any>;
  private vendorPatterns!: Map<string, any>;
  private accountMappings: Map<string, string>;

  constructor() {
    this.initializeBusinessRules();
    this.initializeVendorPatterns();
    this.accountMappings = new Map(); // Initialize empty, will be loaded async
  }

  async categorizeTransaction(transaction: Transaction): Promise<CategorizationResult> {
    // Load account mappings if not already loaded
    if (this.accountMappings.size === 0) {
      await this.initializeAccountMappings();
    }
    
    // Clean and normalize the description
    const description = this.normalizeDescription(transaction.description);
    const amount = Math.abs(transaction.amount);
    
    // Step 1: Vendor Recognition
    const vendor = this.identifyVendor(description);
    
    // Step 2: Apply business rules first
    const ruleBasedResult = this.applyBusinessRules(transaction, vendor);
    if (ruleBasedResult) {
      return ruleBasedResult;
    }

    // Step 3: Use Claude AI for complex categorization
    const aiResult = await this.callClaudeAPI(transaction, vendor);
    
    // Step 4: Validate and enhance AI result
    return this.validateAndEnhanceResult(aiResult, transaction, vendor);
  }

  private normalizeDescription(description: string): string {
    return description
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private identifyVendor(description: string): string | null {
    for (const [pattern, vendor] of this.vendorPatterns.entries()) {
      if (description.includes(pattern)) {
        return vendor.name;
      }
    }
    return null;
  }

  private applyBusinessRules(transaction: Transaction, vendor: string | null): CategorizationResult | null {
    const description = this.normalizeDescription(transaction.description);
    const amount = Math.abs(transaction.amount);

    // Rule 1: Home Depot / Lowes tool purchases
    if (vendor === 'HOME_DEPOT' || vendor === 'LOWES') {
      if (amount > 50 && this.isToolPurchase(description)) {
        return {
          category: 'ASSET_PURCHASE',
          subcategory: 'TOOLS',
          confidence: 0.9,
          accountType: 'ASSET',
          analysis: `Tool purchase from ${vendor} - Auto-creating asset`,
          needsReview: false,
          actions: ['CREATE_ASSET', 'CREATE_JOURNAL_ENTRY'],
          assetDetails: this.extractAssetDetails(description, vendor),
          debitAccount: this.accountMappings.get('TOOLS_EQUIPMENT'),
          creditAccount: transaction.bankAccount === 'BLUEVINE_CHECKING' 
            ? this.accountMappings.get('CASH') 
            : this.accountMappings.get('CREDIT_CARD_PAYABLE'),
          vendor
        };
      }
    }

    // Rule 2: ICP Materials (Cost of Goods Sold)
    if (vendor === 'ICP' || description.includes('ICP')) {
      return {
        category: 'COST_OF_GOODS_SOLD',
        subcategory: 'MATERIALS',
        confidence: 0.95,
        accountType: 'EXPENSE',
        analysis: 'ICP materials purchase - matching to existing PO/Bill',
        needsReview: false,
        actions: ['MATCH_BILL', 'CREATE_JOURNAL_ENTRY'],
        billMatch: {
          vendor: 'ICP',
          confidence: 0.9
        },
        debitAccount: this.accountMappings.get('COST_OF_GOODS_SOLD'),
        creditAccount: transaction.bankAccount === 'BLUEVINE_CHECKING' 
          ? this.accountMappings.get('CASH') 
          : this.accountMappings.get('CREDIT_CARD_PAYABLE'),
        vendor: 'ICP'
      };
    }

    // Rule 3: Gas stations (Vehicle expenses)
    if (this.isGasStation(vendor, description)) {
      return {
        category: 'OPERATING_EXPENSE',
        subcategory: 'VEHICLE_FUEL',
        confidence: 0.85,
        accountType: 'EXPENSE',
        analysis: 'Fuel purchase for business vehicles',
        needsReview: false,
        actions: ['CREATE_JOURNAL_ENTRY'],
        debitAccount: this.accountMappings.get('VEHICLE_EXPENSES'),
        creditAccount: transaction.bankAccount === 'BLUEVINE_CHECKING' 
          ? this.accountMappings.get('CASH') 
          : this.accountMappings.get('CREDIT_CARD_PAYABLE'),
        vendor: vendor || undefined
      };
    }

    // Rule 4: Office supplies
    if (this.isOfficeSupplies(vendor, description)) {
      return {
        category: 'OPERATING_EXPENSE',
        subcategory: 'OFFICE_SUPPLIES',
        confidence: 0.8,
        accountType: 'EXPENSE',
        analysis: 'Office supplies purchase',
        needsReview: false,
        actions: ['CREATE_JOURNAL_ENTRY'],
        debitAccount: this.accountMappings.get('OFFICE_SUPPLIES'),
        creditAccount: transaction.bankAccount === 'BLUEVINE_CHECKING' 
          ? this.accountMappings.get('CASH') 
          : this.accountMappings.get('CREDIT_CARD_PAYABLE'),
        vendor: vendor || undefined
      };
    }

    return null; // No rule matched, will use AI
  }

  private async callClaudeAPI(transaction: Transaction, vendor: string | null): Promise<CategorizationResult> {
    try {
      // Import Claude API (dynamic import to avoid SSR issues)
      const { claudeAPI } = await import('./claude-api');
      
      // Use the specialized transaction categorization method
      const result = await claudeAPI.categorizeTransaction(transaction);
      
      return result;
    } catch (error) {
      console.error('Claude API error:', error);
      
      // Fallback categorization
      return {
        category: 'UNKNOWN',
        subcategory: 'NEEDS_REVIEW',
        confidence: 0.3,
        accountType: 'EXPENSE',
        analysis: `Unable to categorize: ${error instanceof Error ? error.message : String(error)}`,
        needsReview: true,
        actions: []
      };
    }
  }

  private buildAnalysisPrompt(transaction: Transaction, vendor: string | null): string {
    return `
You are a business expense categorization expert for a court resurfacing company (4420 Courts). 
Analyze this transaction and provide categorization with specific actions.

Transaction Details:
- Date: ${transaction.date.toISOString().split('T')[0]}
- Description: ${transaction.description}
- Amount: $${Math.abs(transaction.amount).toFixed(2)}
- Bank Account: ${transaction.bankAccount}
- Identified Vendor: ${vendor || 'Unknown'}

Business Context:
- We resurface tennis/basketball courts
- We buy materials from ICP (our main supplier)
- We buy tools from Home Depot, Lowes, Harbor Freight
- We have vehicles for job sites
- We have office/administrative expenses

Categorization Rules:
1. Tool purchases >$50 from hardware stores = CREATE_ASSET
2. ICP purchases = COST_OF_GOODS_SOLD + MATCH_BILL
3. Small tool purchases <$50 = OPERATING_EXPENSE (Tools & Equipment)
4. Gas/fuel = VEHICLE_EXPENSES
5. Office supplies = OFFICE_SUPPLIES
6. Insurance = INSURANCE_EXPENSE
7. Utilities = UTILITIES
8. Equipment rentals = EQUIPMENT_RENTAL

Asset Creation Criteria:
- Tools/equipment >$50 with useful life >1 year
- All vehicles regardless of amount
- Technology items >$100
- Equipment with serial numbers

Response Format (JSON only):
{
  "category": "ASSET_PURCHASE|COST_OF_GOODS_SOLD|OPERATING_EXPENSE|UNKNOWN",
  "subcategory": "specific subcategory",
  "confidence": 0.0-1.0,
  "accountType": "ASSET|EXPENSE|LIABILITY",
  "analysis": "Brief explanation of categorization logic",
  "needsReview": boolean,
  "actions": ["CREATE_ASSET", "MATCH_BILL", "CREATE_JOURNAL_ENTRY"],
  "assetDetails": {
    "name": "Asset name",
    "description": "Asset description", 
    "category": "TOOLS|VEHICLES|EQUIPMENT|TECHNOLOGY|OTHER",
    "manufacturer": "Brand name if identifiable",
    "model": "Model if identifiable"
  },
  "billMatch": {
    "vendor": "Vendor name",
    "confidence": 0.0-1.0
  },
  "debitAccount": "account_id_for_debit",
  "creditAccount": "account_id_for_credit",
  "vendor": "standardized vendor name"
}

Analyze and respond with JSON only:
`;
  }

  private async simulateClaudeAPI(prompt: string): Promise<string> {
    // This simulates Claude's response based on common patterns
    // In production, this would be replaced with actual Claude API call
    
    const description = prompt.match(/Description: (.+)/)?.[1]?.toUpperCase() || '';
    const amount = parseFloat(prompt.match(/Amount: \$(.+)/)?.[1] || '0');
    const vendor = prompt.match(/Identified Vendor: (.+)/)?.[1];

    // Simulate different response patterns
    if (description.includes('HOME DEPOT') && amount > 50) {
      return JSON.stringify({
        category: 'ASSET_PURCHASE',
        subcategory: 'TOOLS',
        confidence: 0.9,
        accountType: 'ASSET',
        analysis: 'Tool purchase from Home Depot identified as asset',
        needsReview: false,
        actions: ['CREATE_ASSET', 'CREATE_JOURNAL_ENTRY'],
        assetDetails: {
          name: 'Hardware Store Tool Purchase',
          description: description,
          category: 'TOOLS',
          manufacturer: 'Various',
          model: 'Unknown'
        },
        debitAccount: 'tools_equipment_account_id',
        creditAccount: 'cash_or_credit_account_id',
        vendor: 'HOME_DEPOT'
      });
    }

    if (description.includes('ICP')) {
      return JSON.stringify({
        category: 'COST_OF_GOODS_SOLD',
        subcategory: 'MATERIALS',
        confidence: 0.95,
        accountType: 'EXPENSE',
        analysis: 'ICP materials purchase for court resurfacing',
        needsReview: false,
        actions: ['MATCH_BILL', 'CREATE_JOURNAL_ENTRY'],
        billMatch: {
          vendor: 'ICP',
          confidence: 0.9
        },
        debitAccount: 'cogs_account_id',
        creditAccount: 'cash_or_credit_account_id',
        vendor: 'ICP'
      });
    }

    // Default response for unknown transactions
    return JSON.stringify({
      category: 'OPERATING_EXPENSE',
      subcategory: 'MISCELLANEOUS',
      confidence: 0.6,
      accountType: 'EXPENSE',
      analysis: 'General business expense',
      needsReview: true,
      actions: ['CREATE_JOURNAL_ENTRY'],
      debitAccount: 'misc_expense_account_id',
      creditAccount: 'cash_or_credit_account_id',
      vendor: vendor || 'UNKNOWN'
    });
  }

  private validateAndEnhanceResult(result: CategorizationResult, transaction: Transaction, vendor: string | null): CategorizationResult {
    // Validate confidence levels
    if (result.confidence < 0.7) {
      result.needsReview = true;
    }

    // Ensure required fields
    if (!result.category) {
      result.category = 'UNKNOWN';
      result.needsReview = true;
    }

    // Set vendor if not already set
    if (!result.vendor && vendor) {
      result.vendor = vendor;
    }

    return result;
  }

  private extractAssetDetails(description: string, vendor: string): AssetDetails {
    // Extract asset details from transaction description
    const name = this.extractAssetName(description);
    
    return {
      name: name || 'Tool Purchase',
      description: `${vendor} purchase: ${description}`,
      category: this.determineAssetCategory(description),
      manufacturer: this.extractManufacturer(description) || vendor,
      model: this.extractModel(description)
    };
  }

  private extractAssetName(description: string): string {
    // Common tool patterns
    const toolPatterns = [
      /DRILL/i, /SAW/i, /HAMMER/i, /WRENCH/i, /SCREWDRIVER/i,
      /LADDER/i, /GENERATOR/i, /COMPRESSOR/i, /GRINDER/i,
      /BLOWER/i, /EDGER/i, /TRIMMER/i, /MOWER/i
    ];

    for (const pattern of toolPatterns) {
      if (pattern.test(description)) {
        return description.match(pattern)?.[0] || 'Tool';
      }
    }

    return 'Hardware Purchase';
  }

  private determineAssetCategory(description: string): AssetDetails['category'] {
    if (/COMPUTER|LAPTOP|TABLET|PHONE|SOFTWARE/i.test(description)) return 'TECHNOLOGY';
    if (/TRUCK|VAN|TRAILER|VEHICLE/i.test(description)) return 'VEHICLES';
    if (/COMPRESSOR|GENERATOR|LARGE|HEAVY/i.test(description)) return 'EQUIPMENT';
    if (/DESK|CHAIR|CABINET|FURNITURE/i.test(description)) return 'FURNITURE';
    return 'TOOLS';
  }

  private extractManufacturer(description: string): string | undefined {
    const brands = ['DEWALT', 'MILWAUKEE', 'MAKITA', 'RYOBI', 'CRAFTSMAN', 'HUSKY', 'RIDGID'];
    return brands.find(brand => description.includes(brand));
  }

  private extractModel(description: string): string | undefined {
    // Look for model patterns like "DW745" or "M18-2863"
    const modelPattern = /[A-Z]+[0-9-]+/;
    return description.match(modelPattern)?.[0];
  }

  private initializeBusinessRules() {
    this.businessRules = new Map([
      ['tool_threshold', 50], // Tools over $50 become assets
      ['asset_life_threshold', 365], // Items with >1 year life are assets
      ['auto_categorize_confidence', 0.8] // Auto-process if confidence > 80%
    ]);
  }

  private initializeVendorPatterns() {
    this.vendorPatterns = new Map([
      ['HOME DEPOT', { name: 'HOME_DEPOT', type: 'HARDWARE_STORE' }],
      ['LOWES', { name: 'LOWES', type: 'HARDWARE_STORE' }],
      ['HARBOR FREIGHT', { name: 'HARBOR_FREIGHT', type: 'TOOL_STORE' }],
      ['ICP', { name: 'ICP', type: 'SUPPLIER' }],
      ['SHELL', { name: 'SHELL', type: 'GAS_STATION' }],
      ['EXXON', { name: 'EXXON', type: 'GAS_STATION' }],
      ['BP', { name: 'BP', type: 'GAS_STATION' }],
      ['STAPLES', { name: 'STAPLES', type: 'OFFICE_SUPPLIES' }],
      ['AMAZON', { name: 'AMAZON', type: 'ONLINE_RETAILER' }]
    ]);
  }

  private async initializeAccountMappings() {
    // Load actual account IDs from database
    try {
      const { prisma } = await import('@/lib/prisma');
      
      const accounts = await prisma.account.findMany({
        select: { id: true, code: true, name: true }
      });
      
      // Map accounts by common usage patterns
      this.accountMappings = new Map();
      
      accounts.forEach(account => {
        // Bank accounts
        if (account.code === '1000' || account.name.includes('Bluevine')) {
          this.accountMappings.set('CASH', account.id);
        }
        if (account.code === '2300' || account.code === 'AMEX') {
          this.accountMappings.set('CREDIT_CARD_PAYABLE', account.id);
        }
        
        // Expense accounts
        if (account.code === '1360' || account.name.includes('Tools')) {
          this.accountMappings.set('TOOLS_EQUIPMENT', account.id);
        }
        if (account.code === '5000') {
          this.accountMappings.set('COST_OF_GOODS_SOLD', account.id);
        }
        if (account.code === '6110') {
          this.accountMappings.set('VEHICLE_EXPENSES', account.id);
        }
        if (account.code === '6060') {
          this.accountMappings.set('OFFICE_SUPPLIES', account.id);
        }
        if (account.code === '6320') {
          this.accountMappings.set('INSURANCE_EXPENSE', account.id);
        }
        if (account.code === '7050') {
          this.accountMappings.set('MISC_EXPENSE', account.id);
        }
      });
      
    } catch (error) {
      console.error('Error loading account mappings:', error);
      // Fallback to placeholder values
      this.accountMappings = new Map([
        ['CASH', 'CASH_PLACEHOLDER'],
        ['CREDIT_CARD_PAYABLE', 'CC_PLACEHOLDER'],
        ['TOOLS_EQUIPMENT', 'TOOLS_PLACEHOLDER'],
        ['COST_OF_GOODS_SOLD', 'COGS_PLACEHOLDER'],
        ['VEHICLE_EXPENSES', 'VEHICLE_PLACEHOLDER'],
        ['OFFICE_SUPPLIES', 'OFFICE_PLACEHOLDER'],
        ['INSURANCE_EXPENSE', 'INSURANCE_PLACEHOLDER'],
        ['MISC_EXPENSE', 'MISC_PLACEHOLDER']
      ]);
    }
  }

  private isToolPurchase(description: string): boolean {
    const toolKeywords = [
      'DRILL', 'SAW', 'HAMMER', 'WRENCH', 'SCREWDRIVER', 'TOOL',
      'EQUIPMENT', 'HARDWARE', 'COMPRESSOR', 'GENERATOR', 'LADDER'
    ];
    return toolKeywords.some(keyword => description.includes(keyword));
  }

  private isGasStation(vendor: string | null, description: string): boolean {
    const gasStations = ['SHELL', 'EXXON', 'BP', 'CHEVRON', 'MOBIL', 'TEXACO'];
    return gasStations.some(station => 
      vendor === station || description.includes(station)
    ) || description.includes('GAS') || description.includes('FUEL');
  }

  private isOfficeSupplies(vendor: string | null, description: string): boolean {
    const officeVendors = ['STAPLES', 'OFFICE DEPOT', 'AMAZON'];
    const officeKeywords = ['PAPER', 'PEN', 'OFFICE', 'SUPPLIES', 'PRINTER'];
    
    return officeVendors.some(v => vendor === v || description.includes(v)) ||
           officeKeywords.some(keyword => description.includes(keyword));
  }
}