import React, { useState } from 'react';
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
  FaChevronUp
} from 'react-icons/fa';

// Sample escrow requests data with image URLs
const escrowRequests = [
  {
    id: 1,
    product: { 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=face', 
      name: 'Wireless Headphones', 
      price: '$150.00' 
    },
    buyer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001'
    },
    seller: {
      name: 'Jane Smith',
      email: 'jane.smith@marketplace.com',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave, Los Angeles, CA 90210'
    },
    status: 'Pending',
    date: '2025-11-20'
  },
  {
    id: 2,
    product: { 
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&crop=face', 
      name: 'Crystal Glass Set', 
      price: '$75.50' 
    },
    buyer: {
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '+1 (555) 234-5678',
      address: '789 Pine Rd, Chicago, IL 60601'
    },
    seller: {
      name: 'Bob Wilson',
      email: 'bob.w@vendor.net',
      phone: '+1 (555) 876-5432',
      address: '101 Elm St, Miami, FL 33101'
    },
    status: 'In Progress',
    date: '2025-11-22'
  },
  {
    id: 3,
    product: { 
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=80&h=80&fit=crop&crop=face', 
      name: 'Premium Perfume', 
      price: '$120.00' 
    },
    buyer: {
      name: 'Carlos Ramirez',
      email: 'carlos.r@buyer.org',
      phone: '+1 (555) 345-6789',
      address: '202 Cedar Ln, Houston, TX 77001'
    },
    seller: {
      name: 'Diana Lee',
      email: 'diana.l@shop.com',
      phone: '+1 (555) 765-4321',
      address: '303 Birch Blvd, Seattle, WA 98101'
    },
    status: 'Successful',
    date: '2025-11-18'
  },
  {
    id: 4,
    product: { 
      image: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=80&h=80&fit=crop&crop=face', 
      name: 'Gourmet Cookie Assortment', 
      price: '$25.99' 
    },
    buyer: {
      name: 'Eve Brown',
      email: 'eve.brown@email.com',
      phone: '+1 (555) 456-7890',
      address: '404 Maple Dr, Boston, MA 02101'
    },
    seller: {
      name: 'Frank Garcia',
      email: 'frank.g@seller.io',
      phone: '+1 (555) 654-3210',
      address: '505 Walnut Way, Denver, CO 80201'
    },
    status: 'Failed',
    date: '2025-11-19'
  },
  {
    id: 5,
    product: { 
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&h=80&fit=crop&crop=face', 
      name: 'Noise-Cancelling Earbuds', 
      price: '$200.00' 
    },
    buyer: {
      name: 'Grace Kim',
      email: 'grace.k@client.net',
      phone: '+1 (555) 567-8901',
      address: '606 Aspen Ave, Phoenix, AZ 85001'
    },
    seller: {
      name: 'Henry Davis',
      email: 'henry.d@trader.com',
      phone: '+1 (555) 543-2109',
      address: '707 Spruce St, Portland, OR 97201'
    },
    status: 'Not Delivered',
    date: '2025-11-21'
  },
  {
    id: 6,
    product: { 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&crop=face', 
      name: 'Designer Watch', 
      price: '$350.00' 
    },
    buyer: {
      name: 'Ian Thompson',
      email: 'ian.t@buyer.net',
      phone: '+1 (555) 678-9012',
      address: '808 Fir St, Atlanta, GA 30301'
    },
    seller: {
      name: 'Julia Martinez',
      email: 'julia.m@seller.com',
      phone: '+1 (555) 432-1098',
      address: '909 Cypress Ct, San Francisco, CA 94101'
    },
    status: 'Pending',
    date: '2025-11-23'
  },
  {
    id: 7,
    product: { 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop&crop=face', 
      name: 'Leather Handbag', 
      price: '$180.00' 
    },
    buyer: {
      name: 'Kara Lee',
      email: 'kara.l@example.org',
      phone: '+1 (555) 789-0123',
      address: '1010 Redwood Rd, Dallas, TX 75201'
    },
    seller: {
      name: 'Liam Chen',
      email: 'liam.c@vendor.io',
      phone: '+1 (555) 321-0987',
      address: '1111 Sycamore St, Austin, TX 78701'
    },
    status: 'In Progress',
    date: '2025-11-24'
  },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  Successful: 'bg-green-100 text-green-700 border-green-200',
  Failed: 'bg-red-100 text-red-700 border-red-200',
  'Not Delivered': 'bg-orange-100 text-orange-700 border-orange-200',
};

const statusIcons = {
  Pending: FaExclamationTriangle,
  'In Progress': FaTruck,
  Successful: FaCheckCircle,
  Failed: FaTimesCircle,
  'Not Delivered': FaTruck,
};

interface UserDetailsProps {
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  isExpanded: boolean;
}

function UserDetails({ user, isExpanded }: UserDetailsProps) {
  return (
    <div className={`space-y-2 ${isExpanded ? 'bg-gray-50 p-3 rounded-lg border border-gray-200' : ''}`}>
      <div className="flex items-center gap-2">
        <FaUser className="text-gray-400 text-sm" />
        <span className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{user.name}</span>
      </div>
      {isExpanded && (
        <>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400 text-sm" />
            <span className="text-xs text-gray-600 truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400 text-sm" />
            <span className="text-xs text-gray-600">{user.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400 text-sm" />
            <span className="text-xs text-gray-600 truncate">{user.address}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function EscrowRequests() {
  const [requests, setRequests] = useState(escrowRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const itemsPerPage = 5;
  const filteredRequests = requests.filter(
    (req) =>
      req.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
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

  const updateStatus = (id: number, newStatus: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
    console.log(`Updated escrow request ${id} status to ${newStatus}`);
  };

  const statusOptions = ['Pending', 'In Progress', 'Successful', 'Failed', 'Not Delivered'];

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
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRequests.map((request) => {
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
                          src={request.product.image}
                          alt={request.product.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Product';
                          }}
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-800 block">{request.product.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-gray-800">{request.product.price}</span>
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
                      <span className="text-sm text-gray-800">{new Date(request.date).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[request.status as keyof typeof statusColors]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {request.status}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <select
                          value={request.status}
                          onChange={(e) => updateStatus(request.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                          <FaEllipsisV className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50">
            <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Escrow Requests</h3>
            <p className="text-sm">No escrow requests found matching the search criteria.</p>
          </div>
        )}

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