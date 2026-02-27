import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaTruck,
  FaEllipsisV,
  FaChevronDown,
  FaChevronUp,
  FaSpinner
} from 'react-icons/fa';
import { getOffers, acceptOffer, rejectOffer } from '@/services/escrow';
import { EscrowOffer, EscrowStatus, GetOffersRequest } from '@/types/escrow';
import { toast } from 'react-toastify';


const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-blue-100 text-blue-700 border-blue-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  disputed: 'bg-orange-100 text-orange-700 border-orange-200',
  abandoned: 'bg-gray-100 text-gray-700 border-gray-200',
  in_escrow: 'bg-purple-100 text-purple-700 border-purple-200',
};

const statusIcons = {
  pending: FaExclamationTriangle,
  accepted: FaTruck,
  success: FaCheckCircle,
  failed: FaTimesCircle,
  rejected: FaTimesCircle,
  cancelled: FaTimesCircle,
  disputed: FaExclamationTriangle,
  abandoned: FaTimesCircle,
  in_escrow: FaTruck,
};

interface UserDetailsProps {
  user: {
    first_name: string;
    last_name: string | null;
    email: string;
    phone: string | null;
  };
  isExpanded: boolean;
}

function UserDetails({ user, isExpanded }: UserDetailsProps) {
  const fullName = user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name;
  
  return (
    <div className={`space-y-2 ${isExpanded ? 'bg-gray-50 p-3 rounded-lg border border-gray-200' : ''}`}>
      <div className="flex items-center gap-2">
        <FaUser className="text-gray-400 text-sm" />
        <span className="text-sm font-medium text-gray-800 truncate max-w-37.5">{fullName}</span>
      </div>
      {isExpanded && (
        <>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400 text-sm" />
            <span className="text-xs text-gray-600 truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-400 text-sm" />
              <span className="text-xs text-gray-600">{user.phone}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function EscrowRequests() {
  const [requests, setRequests] = useState<EscrowOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<EscrowStatus | ''>('');

  const itemsPerPage = 5;

  const fetchOffers = async (page: number = 1, status?: EscrowStatus) => {
    setLoading(true);
    try {
      const params: GetOffersRequest = { page };
      if (status) params.status = status;
      
      const response = await getOffers(params);
      if (response) {
        setRequests(response.data);
        setTotalPages(response.last_page);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(currentPage, statusFilter || undefined);
  }, [currentPage, statusFilter]);

  const filteredRequests = requests.filter(
    (req) =>
      req.buyer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.seller.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleAcceptOffer = async (offerId: number) => {
    const success = await acceptOffer(offerId);
    if (success) {
      fetchOffers(currentPage, statusFilter || undefined);
    }
  };

  const handleRejectOffer = async (offerId: number) => {
    const success = await rejectOffer(offerId);
    if (success) {
      fetchOffers(currentPage, statusFilter || undefined);
    }
  };

  const statusOptions: EscrowStatus[] = ['pending', 'accepted', 'rejected', 'cancelled', 'success', 'failed', 'disputed', 'abandoned', 'in_escrow'];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Escrow Requests</h1>
          <p className="text-sm text-gray-500">Manage and update escrow request details</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as EscrowStatus | '');
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by name or product..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Buyer</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                {/* <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <FaSpinner className="mx-auto h-8 w-8 text-green-500 animate-spin mb-4" />
                    <p className="text-sm text-gray-500">Loading escrow requests...</p>
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Escrow Requests</h3>
                    <p className="text-sm">No escrow requests found matching the search criteria.</p>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request) => {
                  const isExpanded = expandedRows.has(request.id);
                  const StatusIcon = statusIcons[request.status as keyof typeof statusIcons];
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-800">#{request.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={request.product.images[0] || 'https://via.placeholder.com/48?text=Product'}
                            alt={request.product.title}
                            className="w-12 h-12 rounded-lg object-cover shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Product';
                            }}
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-800 block">{request.product.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-800">${request.amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleRowExpansion(request.id)}
                        >
                          <UserDetails user={request.buyer} isExpanded={isExpanded} />
                          {isExpanded && (
                            <button className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 mt-2">
                              <FaChevronUp className="w-3 h-3" />
                              <span>Collapse</span>
                            </button>
                          )}
                          {!isExpanded && (
                            <button className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 mt-2">
                              <FaChevronDown className="w-3 h-3" />
                              <span>Expand</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleRowExpansion(request.id)}
                        >
                          <UserDetails user={request.seller} isExpanded={isExpanded} />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{new Date(request.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[request.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAcceptOffer(request.id)}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectOffer(request.id)}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {/* <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                            <FaEllipsisV className="w-4 h-4" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredRequests.length)}</span> of{' '}
              <span className="font-medium">{filteredRequests.length}</span> results
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
    </div>
  );
}