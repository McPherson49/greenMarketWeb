import { useState, useEffect } from 'react';
import { 
  FaBox, 
  FaMoneyBillWave, 
  FaUsers, 
  FaChartBar
} from 'react-icons/fa';
import React from 'react';
import { DashboardService } from '@/services/adminDashboard';
import { DashboardData } from '@/types/adminDashboard';
import { toast } from 'react-toastify';

// Import extracted components
import StatCard from '@/components/admin/StatCard';

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('May');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);


  // Format wallet amount
  const formatWallet = (wallet: string) => {
    return `₦${parseFloat(wallet).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-2 text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          Icon={FaBox}
          title="All Products"
          value={dashboardData?.admin.products.toString() || "0"}
          trend="+8.5%"
          trendUp={true}
          viewLink="#"
        />
        <StatCard
          Icon={FaMoneyBillWave}
          title="Wallet Balance"
          value={dashboardData ? formatWallet(dashboardData.wallet) : "₦0.00"}
          trend="-4.2%"
          trendUp={false}
          viewLink="#"
        />
        <StatCard
          Icon={FaUsers}
          title="Total Users"
          value={dashboardData?.admin.users.toString() || "0"}
          trend="+12.3%"
          trendUp={true}
          viewLink="#"
        />
        <StatCard
          Icon={FaChartBar}
          title="Escrows"
          value={dashboardData?.admin.escrows.toString() || "0"}
          trend="+6.7%"
          trendUp={true}
          viewLink="#"
        />
      </div>
    </div>
  );
}
