import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  FaBox, 
  FaDollarSign, 
  FaUsers, 
  FaChartBar, 
  FaFileAlt, 
  FaTruck, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaCookieBite, 
  FaWineGlassAlt, 
  FaHeadphonesAlt, 
  FaFlask,
  FaEllipsisV 
} from 'react-icons/fa';
import React from 'react';

// Sample data for sales chart
const salesData = [
  { date: '01 Jan', sales: 4200, order: 3800 },
  { date: '05 Jan', sales: 3800, order: 3200 },
  { date: '10 Jan', sales: 5100, order: 4500 },
  { date: '15 Jan', sales: 4600, order: 4200 },
  { date: '20 Jan', sales: 5800, order: 5200 },
  { date: '25 Jan', sales: 5200, order: 4800 },
  { date: '30 Jan', sales: 6100, order: 5600 },
  { date: '05 Feb', sales: 5500, order: 5000 },
  { date: '10 Feb', sales: 6800, order: 6200 },
  { date: '15 Feb', sales: 6200, order: 5800 },
  { date: '20 Feb', sales: 7100, order: 6500 },
  { date: '25 Feb', sales: 6600, order: 6000 },
];

// Channel data for pie chart
const channelData = [
  { name: 'Total Users', value: 48, color: '#10b981' },
  { name: 'All Products', value: 30, color: '#3b82f6' },
  { name: 'Escrow Request', value: 22, color: '#f59e0b' },
];

// Recent products data
const recentProducts = [
  { id: 1, Icon: FaCookieBite, name: 'Cookie', status: 'Rejected', price: '$10.00' },
  { id: 2, Icon: FaWineGlassAlt, name: 'Glass', status: 'Accepted', price: '$70.10' },
  { id: 3, Icon: FaHeadphonesAlt, name: 'Headphone', status: 'Pending', price: '$870.50' },
  { id: 4, Icon: FaFlask, name: 'Perfume', status: 'Pending', price: '$70.50' },
];

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('May');

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Overview</h1>
        <p className="text-sm text-gray-500">Monitor your business performance</p>
      </div>

      

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Sales Chart</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                  <span className="text-gray-600">Order</span>
                </div>
              </div>
            </div>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
            </select>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-800">$10,552.40</span>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                +8.3%
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="order" 
                stroke="#6ee7b7" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channels Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Channels</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {channelData.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: channel.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{channel.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{channel.value}%</div>
                  <div className="text-xs text-gray-500">+{channel.value * 10}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          Icon={FaBox}
          title="All Products"
          value="310"
          trend="+8.5%"
          trendUp={true}
          viewLink="#"
        />
        <StatCard
          Icon={FaDollarSign}
          title="Sales"
          value="$3,759.00"
          trend="-4.2%"
          trendUp={false}
          viewLink="#"
        />
        <StatCard
          Icon={FaUsers}
          title="Total Users"
          value="1,247"
          trend="+12.3%"
          trendUp={true}
          viewLink="#"
        />
        <StatCard
          Icon={FaChartBar}
          title="Revenue"
          value="$12,450"
          trend="+6.7%"
          trendUp={true}
          viewLink="#"
        />
      </div>

      {/* Activity & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escrow Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Escrow Activity Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <ActivityCard
              Icon={FaFileAlt}
              label="Escrow Requested"
              value="110"
              subtitle="Product"
            />
            <ActivityCard
              Icon={FaTruck}
              label="Successful Delivered"
              value="72"
              subtitle="New"
            />
            <ActivityCard
              Icon={FaExclamationTriangle}
              label="Reported"
              value="16"
              subtitle="Supplier Item Cases"
            />
            <ActivityCard
              Icon={FaTimesCircle}
              label="Rejected"
              value="84"
              subtitle="Rejected Cases"
            />
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Reviews</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <ReviewCard
              name="Johneth Sidesley"
              rating={4}
              comment="Very nice glasses, I ordered for my friend."
            />
            <ReviewCard
              name="Sarah Mitchell"
              rating={5}
              comment="Excellent quality products and fast delivery!"
            />
            <ReviewCard
              name="Michael Chen"
              rating={4}
              comment="Good service overall, would recommend."
            />
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Listed Products</h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Photo</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Product Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-10 text-[#39B54A] h-10 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                      <product.Icon />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-800">{product.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Accepted' 
                        ? 'bg-green-100 text-green-700'
                        : product.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-gray-800">{product.price}</span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEllipsisV className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Products added recently
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  Icon, 
  title, 
  value, 
  trend, 
  trendUp, 
  viewLink 
}: { 
  Icon: React.ComponentType;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  viewLink: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 text-[#39B54A] h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl">
          <Icon />
        </div>
        <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <button className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors">
          View
        </button>
      </div>
    </div>
  );
}

function ActivityCard({ 
  Icon, 
  label, 
  value, 
  subtitle 
}: { 
  Icon: React.ComponentType;
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className="text-3xl mb-2 text-[#39B54A]">
        <Icon />
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}

function ReviewCard({ name, rating, comment }: {
  name: string;
  rating: number;
  comment: string;
}) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <span className="text-green-600 font-semibold text-sm">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-800">{name}</h4>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600">{comment}</p>
        </div>
      </div>
    </div>
  );
}