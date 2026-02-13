import React from 'react';

interface ActivityCardProps {
  Icon: React.ComponentType;
  label: string;
  value: string;
  subtitle: string;
}

export default function ActivityCard({ 
  Icon, 
  label, 
  value, 
  subtitle 
}: ActivityCardProps) {
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
