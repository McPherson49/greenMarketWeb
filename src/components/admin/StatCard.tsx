import React from 'react';

interface StatCardProps {
  Icon: React.ComponentType;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  viewLink: string;
}

export default function StatCard({ 
  Icon, 
  title, 
  value, 
  trend, 
  trendUp, 
  viewLink 
}: StatCardProps) {
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
