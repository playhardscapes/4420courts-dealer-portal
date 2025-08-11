'use client';

import { useState, useEffect } from 'react';
import { AccountType } from '@prisma/client';

interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  parentId: string | null;
  isActive: boolean;
  children?: Account[];
}

export function ChartOfAccountsView() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AccountType | 'ALL'>('ALL');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // For now, use sample data based on the schema
      const sampleAccounts: Account[] = [
        { id: '1', code: '1000', name: 'Cash', type: 'ASSET', balance: 25000.00, parentId: null, isActive: true },
        { id: '2', code: '1100', name: 'Accounts Receivable', type: 'ASSET', balance: 15000.00, parentId: null, isActive: true },
        { id: '3', code: '1200', name: 'Inventory', type: 'ASSET', balance: 45000.00, parentId: null, isActive: true },
        { id: '4', code: '1500', name: 'Equipment', type: 'ASSET', balance: 12000.00, parentId: null, isActive: true },
        { id: '5', code: '2000', name: 'Accounts Payable', type: 'LIABILITY', balance: -8000.00, parentId: null, isActive: true },
        { id: '6', code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY', balance: -2500.00, parentId: null, isActive: true },
        { id: '7', code: '3000', name: 'Owner\'s Equity', type: 'EQUITY', balance: -50000.00, parentId: null, isActive: true },
        { id: '8', code: '4000', name: 'Product Sales', type: 'REVENUE', balance: -125000.00, parentId: null, isActive: true },
        { id: '9', code: '4100', name: 'Service Revenue', type: 'REVENUE', balance: -45000.00, parentId: null, isActive: true },
        { id: '10', code: '5000', name: 'Cost of Goods Sold', type: 'EXPENSE', balance: 75000.00, parentId: null, isActive: true },
        { id: '11', code: '6200', name: 'Commission Expense', type: 'EXPENSE', balance: 12500.00, parentId: null, isActive: true },
      ];
      
      setAccounts(sampleAccounts);
    } catch (err) {
      setError('Failed to load chart of accounts');
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = filter === 'ALL' 
    ? accounts 
    : accounts.filter(account => account.type === filter);

  const getAccountTypeColor = (type: AccountType) => {
    switch (type) {
      case 'ASSET':
        return 'bg-green-100 text-green-800';
      case 'LIABILITY':
        return 'bg-red-100 text-red-800';
      case 'EQUITY':
        return 'bg-blue-100 text-blue-800';
      case 'REVENUE':
        return 'bg-purple-100 text-purple-800';
      case 'EXPENSE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading chart of accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchAccounts}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['ALL', 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === type
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {type === 'ALL' ? 'All Accounts' : type.charAt(0) + type.slice(1).toLowerCase()}
              <span className="ml-2 bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                {type === 'ALL' ? accounts.length : accounts.filter(a => a.type === type).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Accounts Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {account.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(account.type)}`}>
                    {account.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(account.balance))}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    account.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    {account.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] as const).map((type) => {
          const typeAccounts = accounts.filter(a => a.type === type);
          const totalBalance = typeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
          
          return (
            <div key={type} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${getAccountTypeColor(type)}`}>
                      <span className="text-sm font-bold">
                        {type.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(Math.abs(totalBalance))}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}