import React from 'react';
import { X } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: 'rejected' | 'publish' | 'pending') => void;
  onDelete: () => void;
  currentStatus: string;
  productName: string;
  loading?: boolean;
}

export default function StatusModal({ 
  isOpen, 
  onClose, 
  onStatusChange, 
  onDelete,
  currentStatus,
  productName,
  loading = false 
}: StatusModalProps) {
  if (!isOpen) return null;

  const statusOptions = [
    { 
      value: 'publish', 
      label: 'Publish', 
      description: 'Product will be visible to all users',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    { 
      value: 'pending', 
      label: 'Pending', 
      description: 'Product is under review',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    { 
      value: 'rejected', 
      label: 'Rejected', 
      description: 'Product will be hidden from users',
      color: 'bg-red-100 text-red-700 border-red-200'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Change Product Status</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Product:</p>
          <p className="font-medium text-gray-900">{productName}</p>
          <p className="text-sm text-gray-500 mt-1">
            Current status: <span className="capitalize font-medium">{currentStatus}</span>
          </p>
        </div>

        {/* Status Options */}
        <div className="space-y-3 mb-6">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value as 'rejected' | 'publish' | 'pending')}
              disabled={loading}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                option.value === currentStatus 
                  ? option.color + ' border-opacity-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
                {option.value === currentStatus && (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Move to Trash
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
