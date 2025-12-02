import React, { useState } from 'react';
import { ChevronDown, Search, MoreHorizontal } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  products: number;
  date: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  initial: string;
  avatarColor: string;
}

const initialUserData: User[] = [
  { id: '#1', fullName: 'Arlan Pond', email: 'apond0@nytimes.com', businessName: 'N/A', products: 5, date: '1/11/2021', status: 'Active', initial: 'A', avatarColor: 'bg-cyan-500' },
  { id: '#2', fullName: 'Bill Cicero', email: 'bcicero@wiley.com', businessName: 'Tech Solutions Ltd', products: 12, date: '11/20/2020', status: 'Inactive', initial: 'B', avatarColor: 'bg-purple-500' },
  { id: '#3', fullName: 'Thorpe Hawksley', email: 'thawksley2@senate.gov', businessName: 'N/A', products: 3, date: '10/20/2020', status: 'Active', initial: 'T', avatarColor: 'bg-orange-500' },
  { id: '#4', fullName: 'Horacio Versey', email: 'hversey3@illinois.edu', businessName: 'Global Trade Co', products: 8, date: '1/15/2021', status: 'Active', initial: 'H', avatarColor: 'bg-red-500' },
  { id: '#5', fullName: 'Raphael Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 0, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#6', fullName: 'Arlan Pond', email: 'apond0@nytimes.com', businessName: 'N/A', products: 15, date: '1/11/2021', status: 'Active', initial: 'A', avatarColor: 'bg-cyan-500' },
  { id: '#7', fullName: 'Bill Cicero', email: 'bcicero@wiley.com', businessName: 'N/A', products: 2, date: '11/20/2020', status: 'Suspended', initial: 'B', avatarColor: 'bg-purple-500' },
  { id: '#8', fullName: 'Thorpe Hawksley', email: 'thawksley2@senate.gov', businessName: 'Fashion Hub', products: 20, date: '10/20/2020', status: 'Active', initial: 'T', avatarColor: 'bg-orange-500' },
  { id: '#9', fullName: 'Horacio Versey', email: 'hversey3@illinois.edu', businessName: 'N/A', products: 7, date: '1/15/2021', status: 'Active', initial: 'H', avatarColor: 'bg-red-500' },
  { id: '#10', fullName: 'Raphael Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#11', fullName: 'Paul Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#13', fullName: 'Raphael Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#14', fullName: ' Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#15', fullName: 'Raphael Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#16', fullName: 'Emmanuel Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#17', fullName: 'Raphael Dampsey', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#18', fullName: 'Collins Basam', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#19', fullName: 'Viral Mattew', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
  { id: '#20', fullName: 'Igle Enrique', email: 'rdampsey4@reference.com', businessName: 'N/A', products: 4, date: '8/17/2020', status: 'Active', initial: 'R', avatarColor: 'bg-teal-500' },
];

const UserDataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof User>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [userData, setUserData] = useState(initialUserData);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Filter users based on search term
  const filteredUsers = userData.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Paginate users
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (field: keyof User) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleUserAction = (userId: string, action: 'block' | 'suspend') => {
    setUserData(prevData => 
      prevData.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'block' ? 'Inactive' as const : 'Suspended' as const }
          : user
      )
    );
    setShowActionsMenu(null);
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as keyof User)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 appearance-none pr-8 bg-white cursor-pointer"
            >
              <option value="id">ID</option>
              <option value="fullName">Full Name</option>
              <option value="email">Email</option>
              <option value="businessName">Business Name</option>
              <option value="products">Products</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div> */}
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 lg:pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600">
          Actions
          <ChevronDown className="w-4 h-4" />
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300"
                  checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('id')}>
                ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('fullName')}>
                Full Name {sortBy === 'fullName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>
                Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('businessName')}>
                Business Name {sortBy === 'businessName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('products')}>
                Products {sortBy === 'products' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                  />
                </td>
                <td className="px-4 py-4 text-sm text-green-600 font-medium">{user.id}</td>
                <td className="px-4 py-4">
                  <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold`}>
                    {user.initial}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">{user.fullName}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{user.businessName}</td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {user.products === 0 ? 'No products' : `${user.products} product${user.products !== 1 ? 's' : ''}`}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">{user.date}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : user.status === 'Suspended'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4 relative">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {showActionsMenu === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        disabled={user.status === 'Suspended'}
                      >
                        Suspend User
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'block')}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        disabled={user.status === 'Inactive'}
                      >
                        Block User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200">
        <button 
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          // Show first page, last page, current page, and pages around current
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === pageNumber
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <span key={pageNumber} className="px-2 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}
        
        <button 
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default UserDataTable;