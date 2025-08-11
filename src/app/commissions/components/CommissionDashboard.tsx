'use client';

import { useState, useEffect } from 'react';
import { CommissionStatus, DealerServiceLevel } from '@prisma/client';
import { 
  CurrencyDollarIcon, 
  TrendingUpIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Commission {
  id: string;
  dealerId: string;
  orderId: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  period: string;
  paidAt: Date | null;
  createdAt: Date;
  dealer: {
    companyName: string;
    dealerCode: string;
    serviceLevel: DealerServiceLevel;
  };
}

export function CommissionDashboard() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [selectedStatus, setSelectedStatus] = useState<CommissionStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchCommissions();
  }, [selectedPeriod]);

  const fetchCommissions = async () => {
    try {
      // Sample commission data based on schema
      const sampleCommissions: Commission[] = [
        {
          id: '1',
          dealerId: 'dealer-1',
          orderId: 'order-1001',
          orderAmount: 1395.00,
          commissionRate: 0.10,
          commissionAmount: 139.50,
          status: 'PAID',
          period: '2025-01',
          paidAt: new Date('2025-01-25'),
          createdAt: new Date('2025-01-20'),
          dealer: {
            companyName: 'Pro Court Solutions',
            dealerCode: 'PCS001',
            serviceLevel: 'LEVEL_4'
          }
        },
        {
          id: '2',
          dealerId: 'dealer-1',
          orderId: 'order-1002',
          orderAmount: 800.00,
          commissionRate: 0.10,
          commissionAmount: 80.00,
          status: 'APPROVED',
          period: '2025-01',
          paidAt: null,
          createdAt: new Date('2025-01-22'),
          dealer: {
            companyName: 'Pro Court Solutions',
            dealerCode: 'PCS001',
            serviceLevel: 'LEVEL_4'
          }
        },
        {
          id: '3',
          dealerId: 'dealer-2',
          orderId: 'order-1003',
          orderAmount: 1200.00,
          commissionRate: 0.15,
          commissionAmount: 180.00,
          status: 'CALCULATED',
          period: '2025-01',
          paidAt: null,
          createdAt: new Date('2025-01-24'),
          dealer: {
            companyName: 'Elite Courts LLC',
            dealerCode: 'ECL002',
            serviceLevel: 'LEVEL_5'
          }
        },
        {
          id: '4',
          dealerId: 'dealer-1',
          orderId: 'order-1004',
          orderAmount: 1395.00,
          commissionRate: 0.10,
          commissionAmount: 139.50,
          status: 'PENDING',
          period: '2025-01',
          paidAt: null,
          createdAt: new Date('2025-01-26'),
          dealer: {
            companyName: 'Pro Court Solutions',
            dealerCode: 'PCS001',
            serviceLevel: 'LEVEL_4'
          }
        }
      ];
      
      setCommissions(sampleCommissions);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommissions = selectedStatus === 'ALL' 
    ? commissions 
    : commissions.filter(commission => commission.status === selectedStatus);

  const getStatusIcon = (status: CommissionStatus) => {
    switch (status) {
      case 'PAID':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'APPROVED':
        return <TrendingUpIcon className="w-5 h-5 text-blue-500" />;
      case 'CALCULATED':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'PENDING':
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
      case 'DISPUTED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800';
      case 'CALCULATED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'DISPUTED':
        return 'bg-red-100 text-red-800';
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

  const formatPercent = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  // Calculate summary stats
  const totalCommissions = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const paidCommissions = commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingCommissions = commissions.filter(c => c.status !== 'PAID').reduce((sum, c) => sum + c.commissionAmount, 0);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading commission data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Commissions</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCommissions)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Paid Out</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(paidCommissions)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingCommissions)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Dealers</h3>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="2025-01">January 2025</option>
              <option value="2024-12">December 2024</option>
              <option value="2024-11">November 2024</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as CommissionStatus | 'ALL')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CALCULATED">Calculated</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
              <option value="DISPUTED">Disputed</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredCommissions.length} of {commissions.length} commissions
          </div>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dealer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commission
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCommissions.map((commission) => (
              <tr key={commission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {commission.dealer.companyName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {commission.dealer.dealerCode} • {commission.dealer.serviceLevel}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{commission.orderId.slice(-4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(commission.orderAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {formatPercent(commission.commissionRate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(commission.commissionAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    {getStatusIcon(commission.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                      {commission.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {commission.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}