import React, { useState, useMemo } from 'react';
import { FiSearch, FiX, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaUserGear } from 'react-icons/fa6';
import { IoEyeOutline } from 'react-icons/io5';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  status: 'pending' | 'publish' | 'rejected' | 'trash';
  description: string;
  category: string;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Simply Orange Pulp Free Juice',
    price: 499.90,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 25,
    status: 'publish',
    description: 'Fresh orange juice without pulp, 100% natural with no added sugar. Perfect for breakfast or anytime refreshment.',
    category: 'Beverages'
  },
  {
    id: 2,
    name: "Lay's Classic Potato Snack Party Size, 13 oz Bag",
    price: 1190.00,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop',
    rating: 5,
    reviews: 12,
    status: 'publish',
    description: 'Crispy and delicious potato chips, perfect for parties and gatherings. Made with quality ingredients.',
    category: 'Snacks'
  },
  {
    id: 3,
    name: 'Oscar Mayer Ham & Swiss Melt Scrambler - 3oz',
    price: 1599.00,
    image: 'https://images.unsplash.com/photo-1613564834361-9436948817d1?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 8,
    status: 'publish',
    description: 'Delicious breakfast scrambler with premium ham and Swiss cheese. Ready in minutes for a quick meal.',
    category: 'Breakfast'
  },
  {
    id: 4,
    name: 'Oscar Mayer Ham & Swiss Melt Scrambler - 3oz',
    price: 1599.00,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop',
    rating: 5,
    reviews: 15,
    status: 'publish',
    description: 'Savory breakfast option featuring quality ham and melted Swiss cheese with scrambled eggs.',
    category: 'Breakfast'
  },
  {
    id: 5,
    name: 'Large Garden Spinach & Herb Wrap Tortillas - 10ct',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 22,
    status: 'publish',
    description: 'Healthy spinach and herb tortilla wraps, perfect for making nutritious wraps and sandwiches.',
    category: 'Bakery'
  },
  {
    id: 6,
    name: 'Omar Value Rising Crust Frozen Pizza, Supreme',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 34,
    status: 'publish',
    description: 'Frozen pizza with rising crust technology, topped with premium ingredients including pepperoni, sausage, and vegetables.',
    category: 'Frozen Foods'
  },
  {
    id: 7,
    name: 'Real Plant-Powered Protein Shake - Double Chocolate',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop',
    rating: 5,
    reviews: 46,
    status: 'publish',
    description: 'Plant-based protein shake with rich double chocolate flavor. Perfect post-workout nutrition with 20g of protein.',
    category: 'Health & Wellness'
  },
  {
    id: 8,
    name: 'Real Plant-Powered Protein Shake - Vanilla',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 29,
    status: 'publish',
    description: 'Delicious plant-powered protein beverage, dairy-free and packed with essential nutrients and minerals.',
    category: 'Health & Wellness'
  },
  {
    id: 9,
    name: 'Real Plant-Powered Protein Shake - Vanilla',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 29,
    status: 'publish',
    description: 'Delicious plant-powered protein beverage, dairy-free and packed with essential nutrients and minerals.',
    category: 'Health & Wellness'
  },
  {
    id: 10,
    name: 'Real Plant-Powered Protein Shake - Vanilla',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 29,
    status: 'publish',
    description: 'Delicious plant-powered protein beverage, dairy-free and packed with essential nutrients and minerals.',
    category: 'Health & Wellness'
  },
  {
    id: 11,
    name: 'Real Plant-Powered Protein Shake - Vanilla',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 29,
    status: 'publish',
    description: 'Delicious plant-powered protein beverage, dairy-free and packed with essential nutrients and minerals.',
    category: 'Health & Wellness'
  },
  {
    id: 12,
    name: 'Real Plant-Powered Protein Shake - Vanilla',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 29,
    status: 'publish',
    description: 'Delicious plant-powered protein beverage, dairy-free and packed with essential nutrients and minerals.',
    category: 'Health & Wellness'
  },
  {
    id: 13,
    name: 'Real Plant-Powered Protein Shake - Vanilla',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 29,
    status: 'publish',
    description: 'Delicious plant-powered protein beverage, dairy-free and packed with essential nutrients and minerals.',
    category: 'Health & Wellness'
  },
  {
    id: 14,
    name: 'Real Plant-Powered Protein Shake - Vanilla',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    rating: 4,
    reviews: 29,
    status: 'publish',
    description: 'Delicious plant-powered protein beverage, dairy-free and packed with essential nutrients and minerals.',
    category: 'Health & Wellness'
  }
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState('default');
  
  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.status !== 'trash'
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (productId: number, newStatus: Product['status']) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: newStatus } : p
    ));
    if (selectedProduct?.id === productId) {
      setSelectedProduct({ ...selectedProduct, status: newStatus });
    }
  };

  const handleBoostAd = (productId: number) => {
    alert(`Boosting ad for product #${productId}`);
  };

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      setSelectedProduct(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < rating ? <AiFillStar key={i} className="text-yellow-400" /> : <AiOutlineStar key={i} className="text-gray-300" />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#39B54A] from-green-600 to-blue-600  ">
            Product Management
          </h1>
          <p className="text-gray-600">Manage your inventory and product listings</p>
        </div>

        {/* Controls Bar */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-2xl  p-6 border border-gray-100">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">All Products</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                {filteredProducts.length}
              </span>
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="default">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition "
            />
          </div>
          
         
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl  hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
              <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-100 to-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-600 ">
                  {product.category}
                </div>
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    SALE
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold mb-3 h-10 line-clamp-2 text-gray-800 group-hover:text-green-600 transition">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-500 ml-1 font-medium">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                  )}
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-[#39B54A] text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                >
                  <IoEyeOutline size={16} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-5 py-2 rounded-lg transition-all duration-300 font-medium ${
                currentPage === page
                  ? 'bg-[#39B54A] text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-gray-50  hover:shadow-md border border-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-center z-10 rounded-t-3xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage product information and status</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-2xl h-72 bg-gradient-to-br from-gray-100 to-gray-50 shadow-inner">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-green-600 shadow-lg">
                    {selectedProduct.category}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedProduct.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(selectedProduct.rating)}
                    <span className="text-sm text-gray-600 font-medium">({selectedProduct.reviews} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    {selectedProduct.originalPrice && (
                      <span className="text-gray-400 line-through text-xl">${selectedProduct.originalPrice}</span>
                    )}
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-5 border border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
                      Description
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleBoostAd(selectedProduct.id)}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  >
                    <FiTrendingUp size={20} />
                    Boost Ad
                  </button>
                  <button
                    onClick={() => handleDelete(selectedProduct.id)}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  >
                    <FiTrash2 size={20} />
                    Delete
                  </button>
                </div>

                {/* Status Selection */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
                    Change Status
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'pending')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'pending'
                          ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700 shadow-md scale-105'
                          : 'border-gray-200 hover:border-yellow-400 bg-white hover:bg-yellow-50'
                      }`}
                    >
                      ⏳ Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'publish')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'publish'
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 text-green-700 shadow-md scale-105'
                          : 'border-gray-200 hover:border-green-400 bg-white hover:bg-green-50'
                      }`}
                    >
                      ✓ Publish
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'rejected')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'rejected'
                          ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 text-red-700 shadow-md scale-105'
                          : 'border-gray-200 hover:border-red-400 bg-white hover:bg-red-50'
                      }`}
                    >
                      ✕ Rejected
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'trash')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'trash'
                          ? 'border-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-600 bg-white hover:bg-gray-100'
                      }`}
                    >
                      🗑️ Trash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}