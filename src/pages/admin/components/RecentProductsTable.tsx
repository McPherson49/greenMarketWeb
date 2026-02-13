import React, { useState, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { ProductService } from '@/services/adminProducts';
import { Product } from '@/types/adminProducts';
import StatusModal from './StatusModal';
import DeleteModal from './DeleteModal';

export default function RecentProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch recent products
  const fetchRecentProducts = async () => {
    try {
      setLoading(true);
      // Fetch only 5 most recent products, sorted by creation date
      const response = await ProductService.getProducts({
        per_page: 5,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch recent products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (status: 'rejected' | 'publish' | 'pending') => {
    if (!selectedProduct) return;

    try {
      setStatusLoading(true);
      await ProductService.updateProductStatus(selectedProduct.id, status);
      
      // Close modal and refresh products
      setStatusModalOpen(false);
      setSelectedProduct(null);
      
      // Fetch products again to update the list
      await fetchRecentProducts();
    } catch (error) {
      console.error('Failed to update product status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle delete (move to trash)
  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeleteLoading(true);
      await ProductService.deleteProduct(selectedProduct.id);
      
      // Close delete modal and refresh products
      setDeleteModalOpen(false);
      setSelectedProduct(null);
      
      // Fetch products again to update the list
      await fetchRecentProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open status modal
  const openStatusModal = (product: Product) => {
    setSelectedProduct(product);
    setStatusModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  // Close modals
  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedProduct(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  // Format price with Naira symbol
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Get status color classes
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'publish':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'trash':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Listed Products</h2>
        </div>
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-2 text-sm text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Listed Products</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Product Image</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Product Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.thumbnail ? (
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-800">{product.title}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusClasses(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-semibold text-gray-800">{formatPrice(product.price)}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="relative">
                    <button 
                      onClick={() => openStatusModal(product)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <FaEllipsisV className="w-5 h-5" />
                    </button>
                    
                    {/* Dropdown menu could be added here if needed */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {products.length} most recent products
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModalOpen}
        onClose={closeStatusModal}
        onStatusChange={handleStatusChange}
        onDelete={() => openDeleteModal(selectedProduct!)}
        currentStatus={selectedProduct?.status || ''}
        productName={selectedProduct?.title || ''}
        loading={statusLoading}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        productName={selectedProduct?.title || ''}
        loading={deleteLoading}
      />
    </div>
  );
}
