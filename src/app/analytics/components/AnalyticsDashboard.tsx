'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  TrendingUpIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  salesMetrics: {
    totalRevenue: number;
    monthlyGrowth: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    customerRetention: number;
    customerLifetimeValue: number;
  };
  territoryMetrics: {
    activeStates: number;
    topState: string;
    territoryGrowth: number;
  };
  monthlyData: {
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }[];
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      // Sample analytics data
      const sampleData: AnalyticsData = {
        salesMetrics: {
          totalRevenue: 247500,
          monthlyGrowth: 12.5,
          averageOrderValue: 1425,
          conversionRate: 18.3
        },
        customerMetrics: {
          totalCustomers: 164,
          newCustomers: 23,
          customerRetention: 87.2,
          customerLifetimeValue: 3250
        },
        territoryMetrics: {
          activeStates: 8,
          topState: 'Florida',
          territoryGrowth: 15.7
        },
        monthlyData: [
          { month: 'Aug 2024', revenue: 185000, orders: 128, customers: 95 },
          { month: 'Sep 2024', revenue: 198000, orders: 142, customers: 108 },
          { month: 'Oct 2024', revenue: 215000, orders: 156, customers: 121 },
          { month: 'Nov 2024', revenue: 232000, orders: 168, customers: 135 },
          { month: 'Dec 2024', revenue: 225000, orders: 162, customers: 142 },
          { month: 'Jan 2025', revenue: 247500, orders: 174, customers: 164 }
        ]
      };
      
      setAnalytics(sampleData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === '7d' ? '7 Days' : 
                 period === '30d' ? '30 Days' : 
                 period === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.salesMetrics.totalRevenue)}</p>
              <p className="text-sm text-green-600">{formatPercent(analytics.salesMetrics.monthlyGrowth)} from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500">Avg Order Value</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.salesMetrics.averageOrderValue)}</p>
              <p className="text-sm text-blue-600">{analytics.salesMetrics.conversionRate}% conversion rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
              <p className="text-2xl font-bold text-gray-900">{analytics.customerMetrics.totalCustomers}</p>
              <p className="text-sm text-purple-600">{analytics.customerMetrics.newCustomers} new this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-500">Customer LTV</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.customerMetrics.customerLifetimeValue)}</p>
              <p className="text-sm text-orange-600">{analytics.customerMetrics.customerRetention}% retention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.monthlyData.map((data, index) => {
              const maxRevenue = Math.max(...analytics.monthlyData.map(d => d.revenue));
              const height = (data.revenue / maxRevenue) * 100;
              
              return (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                    <div 
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t absolute bottom-0 w-full transition-all duration-1000"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    <div className="font-medium">{data.month.split(' ')[0]}</div>
                    <div className="text-gray-500">{formatCurrency(data.revenue)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Territory Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Territory Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex items-center">
                <MapPinIcon className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">Active States</h4>
                  <p className="text-sm text-gray-600">Coverage area expansion</p>
                </div>
              </div>  
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{analytics.territoryMetrics.activeStates}</p>
                <p className="text-sm text-green-600">{formatPercent(analytics.territoryMetrics.territoryGrowth)} growth</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Top Performing Regions</h4>
              {[
                { state: 'Florida', revenue: 87500, growth: 18.2 },
                { state: 'Texas', revenue: 72300, growth: 15.7 },
                { state: 'California', revenue: 54200, growth: 12.1 },
                { state: 'Georgia', revenue: 33500, growth: 24.3 }
              ].map((region) => (
                <div key={region.state} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{region.state}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(region.revenue)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${region.growth > 15 ? 'text-green-600' : 'text-blue-600'}`}>
                      {formatPercent(region.growth)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New customer registration', detail: 'ABC Home Courts - Florida', time: '2 hours ago', type: 'customer' },
            { action: 'Large order completed', detail: '$2,790 - Elite Sports Surfaces', time: '4 hours ago', type: 'sale' },
            { action: 'Commission payment processed', detail: '$285 to dealer PCS001', time: '6 hours ago', type: 'commission' },
            { action: 'Territory expansion approved', detail: 'North Carolina region', time: '1 day ago', type: 'territory' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'customer' ? 'bg-blue-500' :
                  activity.type === 'sale' ? 'bg-green-500' :
                  activity.type === 'commission' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}