import React, { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt,
  FaCheckCircle, 
  FaBan, 
  FaTrash
} from 'react-icons/fa';

// Sample admin users data
const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Admin User One',
    email: 'admin1@greenmarket.com',
    role: 'Super Admin',
    joinedDate: '2025-01-15',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Admin User Two',
    email: 'admin2@greenmarket.com',
    role: 'Admin',
    joinedDate: '2025-02-20',
    status: 'Suspended',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Admin User Three',
    email: 'admin3@greenmarket.com',
    role: 'Super Admin',
    joinedDate: '2025-03-10',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Admin User Four',
    email: 'admin4@greenmarket.com',
    role: 'Admin',
    joinedDate: '2025-04-05',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 5,
    name: 'Admin User Five',
    email: 'admin5@greenmarket.com',
    role: 'Admin',
    joinedDate: '2025-05-12',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 6,
    name: 'Admin User Six',
    email: 'admin6@greenmarket.com',
    role: 'Super Admin',
    joinedDate: '2025-06-18',
    status: 'Suspended',
    avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 7,
    name: 'Admin User Seven',
    email: 'admin7@greenmarket.com',
    role: 'Admin',
    joinedDate: '2025-07-22',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=40&h=40&fit=crop&crop=face'
  },
];

const statusColors = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Suspended: 'bg-red-100 text-red-700 border-red-200',
};

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: 'Active' | 'Suspended';
  avatar: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState<{ type: 'delete' | 'suspend' | null; id: number | null }>({ type: null, id: null });

  const itemsPerPage = 5;
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateStatus = (id: number, newStatus: 'Active' | 'Suspended') => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
    console.log(`Updated admin ${id} status to ${newStatus}`);
    setShowModal({ type: null, id: null });
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    console.log(`Deleted admin ${id}`);
    setShowModal({ type: null, id: null });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Admin Users</h1>
          <p className="text-sm text-gray-500">Manage and monitor all admin accounts</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-800">#{user.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=A';
                        }}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{user.email}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-800">{new Date(user.joinedDate).toLocaleDateString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                      <FaCheckCircle className={`w-3 h-3 ${user.status === 'Active' ? 'text-green-500' : 'text-red-500'}`} />
                      {user.status}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowModal({ type: 'suspend', id: user.id })}
                        className={`p-2 rounded hover:bg-gray-100 transition-colors ${user.status === 'Active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                        title={user.status === 'Active' ? 'Suspend' : 'Unsuspend'}
                      >
                        <FaBan className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal({ type: 'delete', id: user.id })}
                        className="p-2 text-red-600 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50">
            <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Admin Users Found</h3>
            <p className="text-sm">Try adjusting your search to find matching users.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-green-500 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal.type && showModal.id !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {showModal.type === 'delete' ? 'Delete Admin' : 'Suspend Admin'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {showModal.type === 'delete'
                ? 'Are you sure you want to permanently delete this admin user? This action cannot be undone.'
                : showModal.type === 'suspend'
                ? `Are you sure you want to ${users.find(u => u.id === showModal.id)?.status === 'Active' ? 'suspend' : 'unsuspend'} this admin user? ${users.find(u => u.id === showModal.id)?.status === 'Active' ? 'They will lose access until unsuspended.' : 'They will regain access.'}`
                : ''}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal({ type: null, id: null })}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showModal.id === null) return;
                  if (showModal.type === 'delete') {
                    deleteUser(showModal.id);
                  } else if (showModal.type === 'suspend') {
                    const currentUser = users.find(u => u.id === showModal.id);
                    if (currentUser) {
                      updateStatus(showModal.id, currentUser.status === 'Active' ? 'Suspended' : 'Active');
                    }
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {showModal.type === 'delete' ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}