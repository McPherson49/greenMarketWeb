'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Eye, Plus, CheckCircle, XCircle, PauseCircle, Calendar, User, Users } from 'lucide-react';

// Mock community data (replace with real API fetch later)
const mockCommunities = [
  {
    id: '1',
    name: 'Livestock & Poultry Network',
    creator: 'Basäm',
    createdDate: '15 Jan 2024',
    members: 1234,
    status: 'Approved',
    icon: '/assets/community1.png',
  },
  {
    id: '2',
    name: 'Bulk Supply Marketplace',
    creator: 'Sinan',
    createdDate: '20 Feb 2024',
    members: 567,
    status: 'Pending',
    icon: '/assets/community2.png',
  },
  {
    id: '3',
    name: 'Export & International Trade',
    creator: 'Michael Brown',
    createdDate: '10 Mar 2024',
    members: 890,
    status: 'Suspended',
    icon: '/assets/community3.png',
  },
  {
    id: '4',
    name: 'Sustainable Farming Collective',
    creator: 'Alice Oyekan',
    createdDate: '5 Apr 2024',
    members: 456,
    status: 'Approved',
    icon: '/assets/community4.png',
  },
];

export default function AdminCommunityPage() {
  const [communities, setCommunities] = useState(mockCommunities);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'suspend' | 'delete' | null>(null);

  const handleActionClick = (community: any, type: 'approve' | 'suspend' | 'delete') => {
    setSelectedCommunity(community);
    setActionType(type);
    setActionModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedCommunity || !actionType) return;

    let updatedStatus: string;
    switch (actionType) {
      case 'approve':
        updatedStatus = 'Approved';
        break;
      case 'suspend':
        updatedStatus = 'Suspended';
        break;
      case 'delete':
        setCommunities(communities.filter((c) => c.id !== selectedCommunity.id));
        setActionModalOpen(false);
        return;
    }

    setCommunities(
      communities.map((c) =>
        c.id === selectedCommunity.id ? { ...c, status: updatedStatus } : c
      )
    );
    setActionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Community Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage communities, approve new ones, monitor posts, and enforce rules
          </p>
        </div>

        <Link
          href="/admin/community/new"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Community
        </Link>
      </div>

      {/* Community Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Community
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Creator
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Created
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Members
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {communities.map((community) => (
                <tr key={community.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={community.icon}
                          alt={community.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {community.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 hidden sm:table-cell text-sm text-gray-700">
                    {community.creator}
                  </td>

                  <td className="py-4 px-6 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{community.createdDate}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{community.members}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        community.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : community.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {community.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/community/${community.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/admin/community/${community.id}`}
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>

                      {community.status === 'Pending' && (
                        <button
                          onClick={() => handleActionClick(community, 'approve')}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {community.status === 'Approved' && (
                        <button
                          onClick={() => handleActionClick(community, 'suspend')}
                          className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Suspend"
                        >
                          <PauseCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleActionClick(community, 'delete')}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {communities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No communities found.</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {communities.length} communit{communities.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {actionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {actionType === 'delete' ? 'Delete' : actionType === 'suspend' ? 'Suspend' : 'Approve'} Community?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to {actionType} "{selectedCommunity?.name}"? 
              {actionType === 'delete' && ' This action cannot be undone.'}
              {actionType === 'suspend' && ' This will temporarily disable the community.'}
              {actionType === 'approve' && ' This will make the community live.'}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActionModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  actionType === 'delete' ? 'bg-red-600 hover:bg-red-700 text-white' :
                  actionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                  'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {actionType === 'delete' ? 'Delete' : actionType === 'suspend' ? 'Suspend' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}