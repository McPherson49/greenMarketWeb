// EscrowRequests.tsx
import React, { useState } from "react";
import { Package, User, Clock, CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";
import { FaChevronDown, FaFilter } from "react-icons/fa6";

// Types
interface EscrowOrder {
  id: string;
  type: "sent" | "received";
  customerName: string;
  productTitle: string;
  productImage?: string;
  amount: number;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "success" | "failed" | "disputed" | "abandoned" | "inescrow";
  date: string;
}

// Dummy Data (fallback in case API fails)
const dummyEscrowOrders: EscrowOrder[] = [
  {
    id: "ESC-001",
    type: "received",
    customerName: "Alice Johnson",
    productTitle: "Wireless Headphones Pro",
    productImage: "/placeholder-image.jpg", // Replace with actual image path if available
    amount: 89.99,
    status: "pending",
    date: "2025-11-10",
  },
  {
    id: "ESC-002",
    type: "sent",
    customerName: "Bob Smith",
    productTitle: "Smart Watch Ultra",
    productImage: "/placeholder-image.jpg",
    amount: 199.99,
    status: "accepted",
    date: "2025-11-11",
  },
  {
    id: "ESC-003",
    type: "received",
    customerName: "Carol White",
    productTitle: "Laptop Stand Ergonomic",
    amount: 45.50,
    status: "rejected",
    date: "2025-11-12",
  },
  {
    id: "ESC-004",
    type: "sent",
    customerName: "David Brown",
    productTitle: "Bluetooth Speaker",
    productImage: "/placeholder-image.jpg",
    amount: 75.00,
    status: "inescrow",
    date: "2025-11-13",
  },
  {
    id: "ESC-005",
    type: "received",
    customerName: "Eva Davis",
    productTitle: "Gaming Mouse",
    amount: 59.99,
    status: "disputed",
    date: "2025-11-14",
  },
];

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
    case "success":
      return "bg-green-100 text-green-800";
    case "pending":
    case "inescrow":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    case "disputed":
      return "bg-orange-100 text-orange-800";
    case "abandoned":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const EscrowRequests: React.FC = () => {
  const [sortType, setSortType] = useState<"all" | "sent" | "received">("all");
  const [statusFilter, setStatusFilter] = useState<
    | "all"
    | "pending"
    | "accepted"
    | "rejected"
    | "cancelled"
    | "success"
    | "failed"
    | "disputed"
    | "abandoned"
    | "inescrow"
  >("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<EscrowOrder | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter orders based on sort and status
  const filteredOrders = dummyEscrowOrders.filter((order) => {
    const matchesSort = sortType === "all" || order.type === sortType;
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSort && matchesStatus;
  });

  const handleAction = async (action: "accept" | "reject" | "pending", orderId: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setModalOpen(false);
    // In a real app, update the order status here via API
    console.log(`Action ${action} performed on order ${orderId}`);
  };

  const openModal = (order: EscrowOrder) => {
    setCurrentOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentOrder(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Escrow Request Orders</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border border-neutral-200">
        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <FaFilter className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Sort by Type:</label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as "all" | "sent" | "received")}
            className="px-3 py-1 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <FaChevronDown className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "all"
                  | "pending"
                  | "accepted"
                  | "rejected"
                  | "cancelled"
                  | "success"
                  | "failed"
                  | "disputed"
                  | "abandoned"
                  | "inescrow"
              )
            }
            className="px-3 py-1 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="disputed">Disputed</option>
            <option value="abandoned">Abandoned</option>
            <option value="inescrow">In Escrow</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-neutral-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow bg-white"
            >
              {/* Product Image */}
              <div className="bg-gray-100 h-32 sm:h-40 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {order.productImage ? (
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                )}
              </div>

              {/* Product Title */}
              <h3 className="font-semibold mb-2 text-sm sm:text-base line-clamp-2">
                {order.productTitle}
              </h3>

              {/* Customer and Type */}
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                <User className="w-3 h-3" />
                <span>{order.customerName}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  order.type === "sent" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                }`}>
                  {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                </span>
              </div>

              {/* Amount and Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-base sm:text-lg font-bold text-[#39B54A]">
                  {formatPrice(order.amount)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Clock className="w-3 h-3" />
                <span>{order.date}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openModal(order)}
                disabled={["success", "failed", "abandoned"].includes(order.status)}
                className="w-full bg-[#39B54A] text-white px-4 py-2 rounded-lg hover:bg-[#188727] text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {["success", "failed", "abandoned"].includes(order.status) ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <>
                    Manage Escrow
                    <FaChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No escrow requests found</h3>
          <p className="text-gray-600 mb-6">
            {sortType !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters to view requests."
              : "You haven't received or sent any escrow requests yet."}
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && currentOrder && (
        <div className="fixed inset-0 mt-30 bg-white/10 backdrop-blur-3xl flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Manage Escrow Request</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Order ID: {currentOrder.id}</p>
              <p className="text-sm text-gray-600 mb-2">Product: {currentOrder.productTitle}</p>
              <p className="text-sm text-gray-600 mb-2">Amount: {formatPrice(currentOrder.amount)}</p>
              <p className="text-sm text-gray-600">From: {currentOrder.customerName}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAction("accept", currentOrder.id)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                {loading ? "Processing..." : "Accept Offer"}
              </button>
              <button
                onClick={() => handleAction("reject", currentOrder.id)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-5 h-5" />
                {loading ? "Processing..." : "Reject Offer"}
              </button>
              <button
                onClick={() => handleAction("pending", currentOrder.id)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                <Clock className="w-5 h-5" />
                {loading ? "Processing..." : "Set to Pending"}
              </button>
            </div>

            <button
              onClick={closeModal}
              className="w-full mt-4 text-gray-500 text-sm hover:text-gray-700 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowRequests;