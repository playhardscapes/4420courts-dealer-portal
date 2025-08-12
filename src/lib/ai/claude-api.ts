// Claude API Integration
// Replace this with actual Claude API calls when ready

interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeAPI {
  private apiKey: string;
  private baseUrl: string = 'https://api.anthropic.com/v1/messages';

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('CLAUDE_API_KEY not found in environment variables');
    }
  }

  async callClaude(
    prompt: string, 
    systemPrompt?: string,
    maxTokens: number = 4000
  ): Promise<ClaudeResponse> {
    
    if (!this.apiKey) {
      // Fallback to mock response during development
      return this.mockClaudeResponse(prompt);
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
          max_tokens: maxTokens,
          system: systemPrompt || 'You are a helpful business expense categorization assistant.',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.content[0].text,
        usage: data.usage
      };

    } catch (error) {
      console.error('Claude API call failed:', error);
      
      // Fallback to mock response
      return this.mockClaudeResponse(prompt);
    }
  }

  private mockClaudeResponse(prompt: string): ClaudeResponse {
    // Mock responses based on common patterns for development/testing
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('home depot') && lowerPrompt.includes('drill')) {
      return {
        content: JSON.stringify({
          category: 'ASSET_PURCHASE',
          subcategory: 'TOOLS',
          confidence: 0.92,
          accountType: 'ASSET',
          analysis: 'Home Depot drill purchase identified as a business tool asset based on amount and description patterns',
          needsReview: false,
          actions: ['CREATE_ASSET', 'CREATE_JOURNAL_ENTRY'],
          assetDetails: {
            name: 'Power Drill',
            description: 'Cordless drill from Home Depot',
            category: 'TOOLS',
            manufacturer: 'DEWALT',
            model: 'DCD771C2'
          },
          debitAccount: 'tools_equipment_account_id',
          creditAccount: 'cash_or_credit_account_id',
          vendor: 'HOME_DEPOT'
        })
      };
    }

    if (lowerPrompt.includes('icp') || lowerPrompt.includes('materials')) {
      return {
        content: JSON.stringify({
          category: 'COST_OF_GOODS_SOLD',
          subcategory: 'MATERIALS',
          confidence: 0.95,
          accountType: 'EXPENSE',
          analysis: 'ICP materials purchase for court resurfacing - primary business materials supplier',
          needsReview: false,
          actions: ['MATCH_BILL', 'CREATE_JOURNAL_ENTRY'],
          billMatch: {
            vendor: 'ICP',
            confidence: 0.9
          },
          debitAccount: 'cogs_materials_account_id',
          creditAccount: 'cash_or_credit_account_id',
          vendor: 'ICP'
        })
      };
    }

    if (lowerPrompt.includes('shell') || lowerPrompt.includes('gas') || lowerPrompt.includes('fuel')) {
      return {
        content: JSON.stringify({
          category: 'OPERATING_EXPENSE',
          subcategory: 'VEHICLE_FUEL',
          confidence: 0.88,
          accountType: 'EXPENSE',
          analysis: 'Fuel purchase for business vehicles at gas station',
          needsReview: false,
          actions: ['CREATE_JOURNAL_ENTRY'],
          debitAccount: 'vehicle_expense_account_id',
          creditAccount: 'cash_or_credit_account_id',
          vendor: 'SHELL'
        })
      };
    }

    // Default unknown transaction response
    return {
      content: JSON.stringify({
        category: 'OPERATING_EXPENSE',
        subcategory: 'MISCELLANEOUS',
        confidence: 0.65,
        accountType: 'EXPENSE',
        analysis: 'General business expense - unable to determine specific category with high confidence',
        needsReview: true,
        actions: ['CREATE_JOURNAL_ENTRY'],
        debitAccount: 'misc_expense_account_id',
        creditAccount: 'cash_or_credit_account_id',
        vendor: 'UNKNOWN'
      })
    };
  }

  // Specific method for transaction categorization
  async categorizeTransaction(transaction: {
    date: Date;
    description: string;
    amount: number;
    bankAccount: string;
  }): Promise<any> {
    
    const systemPrompt = `You are a specialized business expense categorization AI for a court resurfacing company (4420 Courts). 

Your job is to analyze bank transactions and:
1. Categorize them accurately (ASSET_PURCHASE, COST_OF_GOODS_SOLD, OPERATING_EXPENSE, etc.)
2. Determine if assets should be created (tools >$50, equipment, vehicles)
3. Match transactions to existing bills (especially ICP supplier payments)
4. Generate proper journal entries with correct account assignments

Always respond with valid JSON only. Be especially accurate for:
- Hardware store purchases (may be assets if >$50)
- ICP payments (always COGS)
- Gas/fuel purchases (vehicle expenses)
- Office supplies, insurance, utilities

Consider the business context: court resurfacing, materials from ICP, tools from hardware stores, job site vehicles.`;

    const prompt = `Analyze this transaction:

Date: ${transaction.date.toISOString().split('T')[0]}
Description: ${transaction.description}
Amount: $${Math.abs(transaction.amount).toFixed(2)}
Bank: ${transaction.bankAccount}

Provide categorization as JSON with this exact structure:
{
  "category": "ASSET_PURCHASE|COST_OF_GOODS_SOLD|OPERATING_EXPENSE|UNKNOWN",
  "subcategory": "specific type",
  "confidence": 0.0-1.0,
  "accountType": "ASSET|EXPENSE|LIABILITY",
  "analysis": "explanation",
  "needsReview": boolean,
  "actions": ["CREATE_ASSET", "MATCH_BILL", "CREATE_JOURNAL_ENTRY"],
  "assetDetails": {
    "name": "asset name",
    "description": "description",
    "category": "TOOLS|VEHICLES|EQUIPMENT|TECHNOLOGY|OTHER",
    "manufacturer": "brand if identifiable"
  },
  "billMatch": {
    "vendor": "vendor name",
    "confidence": 0.0-1.0
  },
  "debitAccount": "account_id",
  "creditAccount": "account_id",
  "vendor": "standardized_vendor_name"
}`;

    const response = await this.callClaude(prompt, systemPrompt);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      
      // Return safe fallback
      return {
        category: 'UNKNOWN',
        subcategory: 'NEEDS_REVIEW',
        confidence: 0.3,
        accountType: 'EXPENSE',
        analysis: `Parse error: ${error instanceof Error ? error.message : String(error)}`,
        needsReview: true,
        actions: []
      };
    }
  }
}

// Export singleton instance
export const claudeAPI = new ClaudeAPI();