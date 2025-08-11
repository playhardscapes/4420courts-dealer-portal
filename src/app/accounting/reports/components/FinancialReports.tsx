'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  ArrowArrowTrendingUpIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface FinancialData {
  balanceSheet: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    currentAssets: number;
    currentLiabilities: number;
    workingCapital: number;
  };
  incomeStatement: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    grossProfit: number;
    operatingIncome: number;
  };
  cashFlow: {
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    netCashFlow: number;
  };
  keyRatios: {
    currentRatio: number;
    debtToEquity: number;
    grossMargin: number;
    netMargin: number;
    returnOnAssets: number;
  };
}

type ReportType = 'balanceSheet' | 'incomeStatement' | 'cashFlow' | 'trialBalance';
type DateRange = '1m' | '3m' | '6m' | '1y' | 'custom';

export function FinancialReports() {
  const [activeReport, setActiveReport] = useState<ReportType>('balanceSheet');
  const [dateRange, setDateRange] = useState<DateRange>('1m');
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  const fetchFinancialData = async () => {
    try {
      // Sample financial data
      const sampleData: FinancialData = {
        balanceSheet: {
          totalAssets: 485750,
          totalLiabilities: 125300,
          totalEquity: 360450,
          currentAssets: 245800,
          currentLiabilities: 85600,
          workingCapital: 160200
        },
        incomeStatement: {
          totalRevenue: 247500,
          totalExpenses: 185200,
          netIncome: 62300,
          grossProfit: 148500,
          operatingIncome: 72100
        },
        cashFlow: {
          operatingCashFlow: 68500,
          investingCashFlow: -15200,
          financingCashFlow: -12000,
          netCashFlow: 41300
        },
        keyRatios: {
          currentRatio: 2.87,
          debtToEquity: 0.35,
          grossMargin: 60.0,
          netMargin: 25.2,
          returnOnAssets: 12.8
        }
      };
      
      setFinancialData(sampleData);
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatRatio = (value: number) => {
    return value.toFixed(2);
  };

  const reports = [
    { id: 'balanceSheet', name: 'Balance Sheet', icon: DocumentTextIcon },
    { id: 'incomeStatement', name: 'Income Statement', icon: ChartBarIcon },
    { id: 'cashFlow', name: 'Cash Flow', icon: ArrowTrendingUpIcon },
    { id: 'trialBalance', name: 'Trial Balance', icon: CurrencyDollarIcon }
  ] as const;

  const renderBalanceSheet = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Assets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="font-medium text-gray-900">Current Assets</span>
            <span className="font-semibold text-gray-900">{formatCurrency(financialData!.balanceSheet.currentAssets)}</span>
          </div>
          <div className="pl-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Cash & Cash Equivalents</span>
              <span className="text-gray-900">{formatCurrency(125800)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accounts Receivable</span>
              <span className="text-gray-900">{formatCurrency(85400)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inventory</span>
              <span className="text-gray-900">{formatCurrency(34600)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 pt-4">
            <span className="font-medium text-gray-900">Fixed Assets</span>
            <span className="font-semibold text-gray-900">{formatCurrency(239950)}</span>
          </div>
          <div className="pl-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Equipment</span>
              <span className="text-gray-900">{formatCurrency(185000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accumulated Depreciation</span>
              <span className="text-gray-900">({formatCurrency(45050)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicles</span>
              <span className="text-gray-900">{formatCurrency(100000)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-300 font-bold text-lg">
            <span className="text-gray-900">Total Assets</span>
            <span className="text-green-600">{formatCurrency(financialData!.balanceSheet.totalAssets)}</span>
          </div>
        </div>
      </div>

      {/* Liabilities & Equity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liabilities & Equity</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="font-medium text-gray-900">Current Liabilities</span>
            <span className="font-semibold text-gray-900">{formatCurrency(financialData!.balanceSheet.currentLiabilities)}</span>
          </div>
          <div className="pl-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Accounts Payable</span>
              <span className="text-gray-900">{formatCurrency(42300)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accrued Expenses</span>
              <span className="text-gray-900">{formatCurrency(28500)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Short-term Debt</span>
              <span className="text-gray-900">{formatCurrency(14800)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 pt-4">
            <span className="font-medium text-gray-900">Long-term Liabilities</span>
            <span className="font-semibold text-gray-900">{formatCurrency(39700)}</span>
          </div>
          <div className="pl-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Equipment Loan</span>
              <span className="text-gray-900">{formatCurrency(39700)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 pt-4">
            <span className="font-medium text-gray-900">Owner's Equity</span>
            <span className="font-semibold text-gray-900">{formatCurrency(financialData!.balanceSheet.totalEquity)}</span>
          </div>
          <div className="pl-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Capital Contribution</span>
              <span className="text-gray-900">{formatCurrency(300000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retained Earnings</span>
              <span className="text-gray-900">{formatCurrency(60450)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-300 font-bold text-lg">
            <span className="text-gray-900">Total Liab. & Equity</span>
            <span className="text-blue-600">{formatCurrency(financialData!.balanceSheet.totalAssets)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomeStatement = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Income Statement</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="font-medium text-gray-900">Revenue</span>
          <span className="font-semibold text-green-600">{formatCurrency(financialData!.incomeStatement.totalRevenue)}</span>
        </div>
        <div className="pl-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Product Sales</span>
            <span className="text-gray-900">{formatCurrency(195000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Revenue</span>
            <span className="text-gray-900">{formatCurrency(52500)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-gray-200 pt-4">
          <span className="font-medium text-gray-900">Cost of Goods Sold</span>
          <span className="font-semibold text-red-600">({formatCurrency(99000)})</span>
        </div>
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-300 font-medium">
          <span className="text-gray-900">Gross Profit</span>
          <span className="text-green-600">{formatCurrency(financialData!.incomeStatement.grossProfit)}</span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-gray-200 pt-4">
          <span className="font-medium text-gray-900">Operating Expenses</span>
          <span className="font-semibold text-red-600">({formatCurrency(76400)})</span>
        </div>
        <div className="pl-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Salaries & Benefits</span>
            <span className="text-gray-900">{formatCurrency(42000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Marketing</span>
            <span className="text-gray-900">{formatCurrency(18500)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Administrative</span>
            <span className="text-gray-900">{formatCurrency(15900)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-gray-300 font-medium">
          <span className="text-gray-900">Operating Income</span>
          <span className="text-blue-600">{formatCurrency(financialData!.incomeStatement.operatingIncome)}</span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-gray-200 pt-2">
          <span className="font-medium text-gray-900">Other Income/Expenses</span>
          <span className="font-semibold text-red-600">({formatCurrency(9800)})</span>
        </div>
        <div className="pl-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Interest Expense</span>
            <span className="text-gray-900">{formatCurrency(9800)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-400 font-bold text-lg">
          <span className="text-gray-900">Net Income</span>
          <span className="text-green-600">{formatCurrency(financialData!.incomeStatement.netIncome)}</span>
        </div>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Cash Flow Statement</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="font-medium text-gray-900">Operating Activities</span>
            <span className="font-semibold text-green-600">{formatCurrency(financialData!.cashFlow.operatingCashFlow)}</span>
          </div>
          <div className="pl-4 mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Net Income</span>
              <span className="text-gray-900">{formatCurrency(62300)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Depreciation</span>
              <span className="text-gray-900">{formatCurrency(8500)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Change in A/R</span>
              <span className="text-gray-900">({formatCurrency(12400)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Change in Inventory</span>
              <span className="text-gray-900">{formatCurrency(5200)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Change in A/P</span>
              <span className="text-gray-900">{formatCurrency(4900)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="font-medium text-gray-900">Investing Activities</span>
            <span className="font-semibold text-red-600">({formatCurrency(Math.abs(financialData!.cashFlow.investingCashFlow))})</span>
          </div>
          <div className="pl-4 mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Equipment Purchase</span>
              <span className="text-gray-900">({formatCurrency(15200)})</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="font-medium text-gray-900">Financing Activities</span>
            <span className="font-semibold text-red-600">({formatCurrency(Math.abs(financialData!.cashFlow.financingCashFlow))})</span>
          </div>
          <div className="pl-4 mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Owner Distributions</span>
              <span className="text-gray-900">({formatCurrency(12000)})</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-400 font-bold text-lg">
          <span className="text-gray-900">Net Change in Cash</span>
          <span className="text-green-600">{formatCurrency(financialData!.cashFlow.netCashFlow)}</span>
        </div>
      </div>
    </div>
  );

  const renderTrialBalance = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Trial Balance</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { account: '1000 - Cash', debit: 125800, credit: 0 },
              { account: '1100 - Accounts Receivable', debit: 85400, credit: 0 },
              { account: '1200 - Inventory', debit: 34600, credit: 0 },
              { account: '1500 - Equipment', debit: 185000, credit: 0 },
              { account: '1550 - Accumulated Depreciation', debit: 0, credit: 45050 },
              { account: '1600 - Vehicles', debit: 100000, credit: 0 },
              { account: '2000 - Accounts Payable', debit: 0, credit: 42300 },
              { account: '2100 - Accrued Expenses', debit: 0, credit: 28500 },
              { account: '2200 - Short-term Debt', debit: 0, credit: 14800 },
              { account: '2500 - Equipment Loan', debit: 0, credit: 39700 },
              { account: '3000 - Owner\'s Capital', debit: 0, credit: 300000 },
              { account: '3100 - Retained Earnings', debit: 0, credit: 60450 },
              { account: '4000 - Product Sales', debit: 0, credit: 195000 },
              { account: '4100 - Service Revenue', debit: 0, credit: 52500 },
              { account: '5000 - Cost of Goods Sold', debit: 99000, credit: 0 },
              { account: '6000 - Salaries & Benefits', debit: 42000, credit: 0 },
              { account: '6100 - Marketing Expense', debit: 18500, credit: 0 },
              { account: '6200 - Administrative Expense', debit: 15900, credit: 0 },
              { account: '7000 - Interest Expense', debit: 9800, credit: 0 }
            ].map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.account}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {item.debit > 0 ? formatCurrency(item.debit) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {item.credit > 0 ? formatCurrency(item.credit) : '—'}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">TOTALS</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{formatCurrency(715900)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">{formatCurrency(715900)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading financial reports...</p>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load financial data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {reports.map((report) => {
              const IconComponent = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeReport === report.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {report.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Ratios Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Current Ratio</h3>
              <p className="text-2xl font-bold text-gray-900">{formatRatio(financialData.keyRatios.currentRatio)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Debt/Equity</h3>
              <p className="text-2xl font-bold text-gray-900">{formatRatio(financialData.keyRatios.debtToEquity)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Gross Margin</h3>
              <p className="text-2xl font-bold text-gray-900">{formatPercent(financialData.keyRatios.grossMargin)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Net Margin</h3>
              <p className="text-2xl font-bold text-gray-900">{formatPercent(financialData.keyRatios.netMargin)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowDownTrayIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">ROA</h3>
              <p className="text-2xl font-bold text-gray-900">{formatPercent(financialData.keyRatios.returnOnAssets)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Report Content */}
      <div>
        {activeReport === 'balanceSheet' && renderBalanceSheet()}
        {activeReport === 'incomeStatement' && renderIncomeStatement()}
        {activeReport === 'cashFlow' && renderCashFlow()}
        {activeReport === 'trialBalance' && renderTrialBalance()}
      </div>
    </div>
  );
}