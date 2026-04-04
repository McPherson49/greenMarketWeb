import React, { useState, useEffect, useCallback } from 'react';
import { Search, MoreHorizontal, RefreshCw, Download } from 'lucide-react';
import { UserService } from '@/services/user';
import { User, UsersParams } from '@/types/user';
import { toast } from "react-toastify";
import Image from 'next/image';
import { getAuthToken } from '@/utils/auth';

// Update the User interface to match API response
interface UIUser extends User {
  status: 'Active' | 'Inactive' | 'Suspended';
  initial: string;
  avatarColor: string;
  businessName: string;
}

// Define the API field mapping
type UISortableField = 'id' | 'name' | 'email' | 'businessName' | 'product_count' | 'created_at' | 'status';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const UserDataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<UISortableField>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [users, setUsers] = useState<UIUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 1,
    to: 1,
  });

  const generateAvatarColor = (id: number): string => {
    const colors = [
      'bg-cyan-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500',
      'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-pink-500',
      'bg-yellow-500', 'bg-green-500',
    ];
    return colors[id % colors.length];
  };

  const getInitial = (name: string): string => name.charAt(0).toUpperCase();

  const getStatus = (user: User): 'Active' | 'Inactive' | 'Suspended' => {
    if (user.deleted_at) return 'Suspended';
    if (user.email_verified_at) return 'Active';
    return 'Inactive';
  };

  const getBusinessName = (user: User): string => {
    return typeof user.business === 'string' ? user.business : user.business || 'N/A';
  };

  const fetchUsers = useCallback(async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const getApiSortField = (field: UISortableField): string => {
        const fieldMap: Record<UISortableField, string> = {
          'id': 'id', 'name': 'name', 'email': 'email',
          'businessName': 'business.name', 'product_count': 'product_count',
          'created_at': 'created_at', 'status': 'email_verified_at',
        };
        return fieldMap[field];
      };

      const params: UsersParams = {
        page, per_page: 10,
        search: search || undefined,
        sort_by: getApiSortField(sortBy),
        sort_order: sortOrder,
      };

      const response = await UserService.getUsers(params);
      const uiUsers: UIUser[] = response.data.map((user) => ({
        ...user,
        status: getStatus(user),
        initial: getInitial(user.name),
        avatarColor: generateAvatarColor(user.id),
        businessName: getBusinessName(user),
      }));

      setUsers(uiUsers);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, sortBy, sortOrder, fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) setCurrentPage(1);
      else fetchUsers(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchUsers]);

  // ── Export to CSV ────────────────────────────────────────────────────────
  const handleExport = async () => {
    const token = getAuthToken();
    if (!token) { toast.error('Please sign in to export data'); return; }

    setExporting(true);
    try {
      const res = await fetch(`${API_BASE}/users/export`, {
        method: 'GET',
        headers: {
          Accept: 'text/csv',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Export failed: ${res.status}`);

      // Read as blob and trigger browser download
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success('Users exported successfully');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export users. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleSort = (field: UISortableField) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const handleUserAction = async (userId: number, action: 'block' | 'suspend' | 'delete') => {
    try {
      if (action === 'delete') {
        await UserService.deleteUser(userId);
        toast.success('User deleted successfully');
      } else if (action === 'block') {
        toast.success('User blocked successfully');
      } else if (action === 'suspend') {
        toast.success('User suspended successfully');
      }
      fetchUsers(currentPage, searchTerm);
      setShowActionsMenu(null);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) setSelectedUsers([]);
    else setSelectedUsers(users.map(user => user.id));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) setCurrentPage(page);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleRefresh = () => fetchUsers(currentPage, searchTerm);

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) return;
    try {
      for (const userId of selectedUsers) await UserService.deleteUser(userId);
      toast.success(`${selectedUsers.length} user(s) deleted successfully`);
      setSelectedUsers([]);
      fetchUsers(currentPage, searchTerm);
    } catch (error) {
      console.error('Failed to delete users:', error);
      toast.error('Failed to delete users');
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 lg:pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
              disabled={loading}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{selectedUsers.length} selected</span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200"
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={exporting || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Export all users to CSV"
          >
            {exporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-2 text-sm text-gray-500">Loading users...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('id')}>
                    ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                    Full Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>
                    Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('businessName')}>
                    Business {sortBy === 'businessName' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('product_count')}>
                    Products {sortBy === 'product_count' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>
                    Date Joined {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                    Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-green-600 font-medium">{user.id}</td>
                    <td className="px-4 py-4">
                      {user.avatar ? (
                        <div className="relative w-10 h-10">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            className="rounded-full object-cover"
                            fill
                            sizes="40px"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = `w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold`;
                                fallback.textContent = user.initial;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold`}>
                          {user.initial}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-50" title={user.email}>{user.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{user.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{user.businessName}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {user.product_count === 0 ? 'No products' : `${user.product_count} product${user.product_count !== 1 ? 's' : ''}`}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-700'
                        : user.status === 'Suspended' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                ‹ Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                let pageNum;
                if (pagination.last_page <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= pagination.last_page - 2) pageNum = pagination.last_page - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    disabled={loading}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNum
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.last_page > 5 && currentPage < pagination.last_page - 2 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button onClick={() => goToPage(pagination.last_page)} disabled={loading} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300">
                    {pagination.last_page}
                  </button>
                </>
              )}
              <button
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pagination.last_page || loading}
              >
                Next ›
              </button>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && users.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="mt-2 text-sm text-green-600 hover:text-green-700">
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDataTable;