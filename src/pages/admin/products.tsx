import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FiSearch, FiX, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IoEyeOutline } from 'react-icons/io5';
import { ProductService } from '@/services/adminProducts';
import { Product, ProductsParams } from '@/types/adminProducts';
import { toast } from 'react-toastify';

// Define UI product interface that doesn't extend Product
interface UIProduct {
  // Original Product properties
  id: number;
  category_id: number;
  old_id: number | null;
  user_id: number;
  title: string;
  slug: string;
  tags: string[];
  description: string;
  state: string;
  local: string;
  nearest: string;
  plan_id: number | null;
  price: number;
  use_escrow: number;
  status: 'rejected' | 'publish' | 'pending' | 'draft' | 'trash';
  images: string[];
  price_range: any | null;
  meta: any | null;
  properties: any | null;
  created_at: string;
  updated_at: string;
  views: number;
  user: any; // Simplified user object
  social: any | null;
  business: any; // Simplified business object
  purchased_ad: boolean;
  thumbnail: string;
  keyword: string;
  address: string;
  phone: string;
  chat_id: number;
  reviews: any[]; // Keep as array
  subscription: any | null;
  icon: string;
  sub: string;
  
  // UI-specific properties
  uiRating: number; // For star display
  uiReviewCount: number; // For review count display
  originalPrice?: number; // For sale display
  category: string; // For category display
}

export default function ProductManagement() {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<UIProduct | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 8,
    total: 0,
    from: 1,
    to: 1,
  });
  
  const itemsPerPage = 16;

  // Transform API product to UI product
  const transformToUIProduct = (product: Product): UIProduct => {
    // Calculate rating from business rating (2.5 from API) or use default
    const businessRating = product.business?.rating || 2.5;
    const uiRating = Math.min(5, Math.max(1, Math.round(businessRating)));
    
    // Generate review count based on product views or use actual reviews length
    const uiReviewCount = product.reviews?.length || Math.floor(product.views / 10) || 5;
    
    // Check if product has sale (based on price or other criteria)
    const hasSale = Math.random() > 0.7; // 30% chance of having sale
    const originalPrice = hasSale ? product.price * 1.2 : undefined;
    
    // Create UI product object with all properties
    const uiProduct: UIProduct = {
      // Copy all Product properties
      id: product.id,
      category_id: product.category_id,
      old_id: product.old_id,
      user_id: product.user_id,
      title: product.title,
      slug: product.slug,
      tags: product.tags,
      description: product.description,
      state: product.state,
      local: product.local,
      nearest: product.nearest,
      plan_id: product.plan_id,
      price: product.price,
      use_escrow: product.use_escrow,
      status: product.status,
      images: product.images,
      price_range: product.price_range,
      meta: product.meta,
      properties: product.properties,
      created_at: product.created_at,
      updated_at: product.updated_at,
      views: product.views,
      user: product.user,
      social: product.social,
      business: product.business,
      purchased_ad: product.purchased_ad,
      thumbnail: product.thumbnail,
      keyword: product.keyword,
      address: product.address,
      phone: product.phone,
      chat_id: product.chat_id,
      reviews: product.reviews,
      subscription: product.subscription,
      icon: product.icon,
      sub: product.sub,
      
      // Add UI-specific properties
      uiRating,
      uiReviewCount,
      originalPrice,
      category: product.keyword || 'Uncategorized',
    };
    
    return uiProduct;
  };

  // Fetch products from API
  const fetchProducts = useCallback(async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const params: ProductsParams = {
        page,
        per_page: itemsPerPage,
        search: search || undefined,
      };

      const response = await ProductService.getProducts(params);
      
      // Transform API data to UI format
      const uiProducts = response.data.map(transformToUIProduct);
      
      setProducts(uiProducts);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and page changes
  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchProducts(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) &&
      product.status !== 'trash'
    );
  }, [products, searchTerm]);

  const totalPages = pagination.last_page;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = async (productId: number, newStatus: 'rejected' | 'publish' | 'pending' | 'draft' | 'trash') => {
    try {
      await ProductService.updateProductStatus(productId, newStatus); 
      
      // Update local state
      setProducts(products.map(p => 
        p.id === productId ? { ...p, status: newStatus } : p
      ));
      
      if (selectedProduct?.id === productId) {
        setSelectedProduct({ ...selectedProduct, status: newStatus });
      }
      
      toast.success(`Product status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const handleBoostAd = async (productId: number) => {
    try {
      await ProductService.boostProductAd(productId);
      toast.success('Product ad boosted successfully');
    } catch (error) {
      console.error('Failed to boost product ad:', error);
      toast.error('Failed to boost product ad');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await ProductService.deleteProduct(productId);
      
      // Update local state
      setProducts(products.filter(p => p.id !== productId));
      setSelectedProduct(null);
      
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < rating ? <AiFillStar key={i} className="text-yellow-400" /> : <AiOutlineStar key={i} className="text-gray-300" />
    ));
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-green-50 ">
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
                {pagination.total}
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
              <option value="date-new">Date: Newest First</option>
              <option value="date-old">Date: Oldest First</option>
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
              disabled={loading}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl  hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                  <div className="relative overflow-hidden h-56 bg-linear-to-br from-gray-100 to-gray-50">
                    <img 
                      src={product.thumbnail || product.images[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-600 ">
                      {product.category}
                    </div>
                    {product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        SALE
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'publish' 
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : product.status === 'draft'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-semibold mb-3 h-10 line-clamp-2 text-gray-800 group-hover:text-green-600 transition">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(product.uiRating)}
                      <span className="text-xs text-gray-500 ml-1 font-medium">({product.uiReviewCount})</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          ₦{formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-gray-900">
                        ₦{formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        📍 {product.state}, {product.local}
                      </span>
                      <span className="flex items-center gap-1 mt-1">
                        👤 {product.user?.name || 'Unknown Seller'}
                      </span>
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
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className={`px-5 py-2 rounded-lg transition-all duration-300 font-medium ${
                  currentPage === 1 || loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                }`}
              >
                ←
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={loading}
                    className={`px-5 py-2 rounded-lg transition-all duration-300 font-medium ${
                      currentPage === pageNum
                        ? 'bg-[#39B54A] text-white shadow-lg scale-110'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200 transition-all duration-300 font-medium"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className={`px-5 py-2 rounded-lg transition-all duration-300 font-medium ${
                  currentPage === totalPages || loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                }`}
              >
                →
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No products match your search.' : 'No products available at the moment.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

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
                <div className="relative overflow-hidden rounded-2xl h-72 bg-linear-to-br from-gray-100 to-gray-50 shadow-inner">
                  <img 
                    src={selectedProduct.thumbnail || selectedProduct.images[0]} 
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-green-600 shadow-lg">
                    {selectedProduct.category}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.status === 'publish' 
                        ? 'bg-green-100 text-green-700'
                        : selectedProduct.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : selectedProduct.status === 'draft'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProduct.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedProduct.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(selectedProduct.uiRating)}
                    <span className="text-sm text-gray-600 font-medium">({selectedProduct.uiReviewCount} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    {selectedProduct.originalPrice && (
                      <span className="text-gray-400 line-through text-xl">
                        ₦{formatPrice(selectedProduct.originalPrice)}
                      </span>
                    )}
                    <span className="text-4xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      ₦{formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Seller</h4>
                      <p className="font-semibold text-gray-800">{selectedProduct.user?.name || 'Unknown Seller'}</p>
                      <p className="text-sm text-gray-600">{selectedProduct.user?.phone || 'No phone'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                      <p className="font-semibold text-gray-800">{selectedProduct.state}, {selectedProduct.local}</p>
                      <p className="text-sm text-gray-600">{selectedProduct.nearest}</p>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-blue-50 to-green-50 rounded-2xl p-5 border border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-1 h-5 bg-linear-to-b from-green-500 to-blue-500 rounded-full"></span>
                      Description
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                    
                    {selectedProduct.tags.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Tags:</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tags.map((tag, index) => (
                            <span key={index} className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mt-4">
                    <p>Created: {formatDate(selectedProduct.created_at)}</p>
                    <p>Views: {selectedProduct.views}</p>
                    <p>Escrow: {selectedProduct.use_escrow ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleBoostAd(selectedProduct.id)}
                    className="flex items-center justify-center gap-3 bg-linear-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  >
                    <FiTrendingUp size={20} />
                    Boost Ad
                  </button>
                  <button
                    onClick={() => handleDelete(selectedProduct.id)}
                    className="flex items-center justify-center gap-3 bg-linear-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  >
                    <FiTrash2 size={20} />
                    Delete
                  </button>
                </div>

                {/* Status Selection */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-linear-to-b from-green-500 to-blue-500 rounded-full"></span>
                    Change Status
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'pending')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'pending'
                          ? 'border-yellow-500 bg-linear-to-br from-yellow-50 to-yellow-100 text-yellow-700 shadow-md scale-105'
                          : 'border-gray-200 hover:border-yellow-400 bg-white hover:bg-yellow-50'
                      }`}
                    >
                      ⏳ Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'publish')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'publish'
                          ? 'border-green-500 bg-linear-to-br from-green-50 to-green-100 text-green-700 shadow-md scale-105'
                          : 'border-gray-200 hover:border-green-400 bg-white hover:bg-green-50'
                      }`}
                    >
                      ✓ Publish
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'draft')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'draft'
                          ? 'border-blue-500 bg-linear-to-br from-blue-50 to-blue-100 text-blue-700 shadow-md scale-105'
                          : 'border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50'
                      }`}
                    >
                      📝 Draft
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProduct.id, 'trash')}
                      className={`px-5 py-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedProduct.status === 'trash'
                          ? 'border-gray-700 bg-linear-to-br from-gray-100 to-gray-200 text-gray-700 shadow-md scale-105'
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