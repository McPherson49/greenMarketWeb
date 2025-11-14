import React, { useState } from "react";
import { User, Package, ShoppingCart, MessageSquare, Home, Menu, X } from "lucide-react";
import { FaChevronRight } from "react-icons/fa6";

// Types
interface VendorProfile {
  firstName: string;
  lastName: string;
  shopName: string;
  shopUrl: string;
  phoneNumber: string;
  email: string;
}

interface Order {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
}

// Dummy Data
const dummyProfile: VendorProfile = {
  firstName: "John",
  lastName: "Doe",
  shopName: "Awesome Shop",
  shopUrl: "https://kbtheme.com/gvaig/store/",
  phoneNumber: "+1 234 567 8900",
  email: "name@gmail.com",
};

const dummyOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Alice Johnson",
    product: "Wireless Headphones",
    amount: 89.99,
    status: "completed",
    date: "2025-11-10",
  },
  {
    id: "ORD-002",
    customerName: "Bob Smith",
    product: "Smart Watch",
    amount: 199.99,
    status: "processing",
    date: "2025-11-11",
  },
  {
    id: "ORD-003",
    customerName: "Carol White",
    product: "Laptop Stand",
    amount: 45.5,
    status: "pending",
    date: "2025-11-12",
  },
  {
    id: "ORD-004",
    customerName: "David Brown",
    product: "USB-C Cable",
    amount: 15.99,
    status: "completed",
    date: "2025-11-09",
  },
  {
    id: "ORD-005",
    customerName: "Emma Davis",
    product: "Keyboard",
    amount: 129.99,
    status: "cancelled",
    date: "2025-11-08",
  },
];

const dummyProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Wireless Headphones",
    price: 89.99,
    stock: 45,
    category: "Audio",
  },
  {
    id: "PRD-002",
    name: "Smart Watch",
    price: 199.99,
    stock: 23,
    category: "Wearables",
  },
  {
    id: "PRD-003",
    name: "Laptop Stand",
    price: 45.5,
    stock: 67,
    category: "Accessories",
  },
  {
    id: "PRD-004",
    name: "USB-C Cable",
    price: 15.99,
    stock: 120,
    category: "Cables",
  },
  {
    id: "PRD-005",
    name: "Keyboard",
    price: 129.99,
    stock: 34,
    category: "Peripherals",
  },
];

const dummyMessages: Message[] = [
  {
    id: "MSG-001",
    from: "Alice Johnson",
    subject: "Question about order",
    preview: "Hi, I wanted to ask about my recent order...",
    date: "2025-11-12",
    unread: true,
  },
  {
    id: "MSG-002",
    from: "Support Team",
    subject: "Payment processed",
    preview: "Your payment has been successfully processed...",
    date: "2025-11-11",
    unread: true,
  },
  {
    id: "MSG-003",
    from: "Bob Smith",
    subject: "Product inquiry",
    preview: "Do you have this item in blue color?...",
    date: "2025-11-10",
    unread: false,
  },
  {
    id: "MSG-004",
    from: "Carol White",
    subject: "Shipping update",
    preview: "When will my order be shipped?...",
    date: "2025-11-09",
    unread: false,
  },
];

type TabType = "dashboard" | "orders" | "products" | "messages" | "profile";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [profile, setProfile] = useState<VendorProfile>(dummyProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleProfileSubmit = () => {
    alert("Profile updated successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
              <span className="mx-2">
                <FaChevronRight />
              </span>
              <span className="text-[#39B54A]">My account</span>
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20  lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
            fixed lg:relative inset-y-0 left-0 z-0 w-72 bg-white rounded-lg shadow-sm p-6
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            lg:block
          `}
          >
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Welcome back!</p>
                <p className="font-medium truncate">{profile.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleTabChange("orders")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === "orders"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => handleTabChange("products")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === "products"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => handleTabChange("messages")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === "messages"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <span>Messages</span>
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  2
                </span>
              </button>
              <button
                onClick={() => handleTabChange("profile")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-50 text-red-600 transition-colors">
                Log out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            {activeTab === "dashboard" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Orders
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold">
                          {dummyOrders.length}
                        </p>
                      </div>
                      <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-[#39B54A]" />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Products
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold">
                          {dummyProducts.length}
                        </p>
                      </div>
                      <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 sm:p-6 rounded-lg sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Unread Messages
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold">
                          {dummyMessages.filter((m) => m.unread).length}
                        </p>
                      </div>
                      <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-[#39B54A]" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {dummyOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="border border-neutral-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{order.product}</p>
                          <p className="text-sm text-gray-600">
                            {order.customerName}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <p className="font-semibold">${order.amount}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">Orders</h2>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <thead className="bg-gray-50 border-b border-neutral-200">
                        <tr>
                          <th className="text-left p-3 sm:p-4 font-medium text-gray-700 text-sm">
                            Order ID
                          </th>
                          <th className="text-left p-3 sm:p-4 font-medium text-gray-700 text-sm">
                            Customer
                          </th>
                          <th className="text-left p-3 sm:p-4 font-medium text-gray-700 text-sm hidden md:table-cell">
                            Product
                          </th>
                          <th className="text-left p-3 sm:p-4 font-medium text-gray-700 text-sm">
                            Amount
                          </th>
                          <th className="text-left p-3 sm:p-4 font-medium text-gray-700 text-sm">
                            Status
                          </th>
                          <th className="text-left p-3 sm:p-4 font-medium text-gray-700 text-sm hidden lg:table-cell">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dummyOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-neutral-200 hover:bg-gray-50"
                          >
                            <td className="p-3 sm:p-4 text-sm">{order.id}</td>
                            <td className="p-3 sm:p-4 text-sm">{order.customerName}</td>
                            <td className="p-3 sm:p-4 text-sm hidden md:table-cell">{order.product}</td>
                            <td className="p-3 sm:p-4 text-sm">${order.amount}</td>
                            <td className="p-3 sm:p-4">
                              <span
                                className={`text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3 sm:p-4 text-gray-600 text-sm hidden lg:table-cell">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Products</h2>
                  <button className="bg-[#39B54A] text-white px-4 py-2 rounded-lg hover:bg-[#188727] text-sm sm:text-base">
                    Add Product
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {dummyProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-neutral-200 rounded-lg p-4 sm:p-5"
                    >
                      <div className="bg-gray-100 h-32 sm:h-40 rounded-lg mb-4 flex items-center justify-center">
                        <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        Category: {product.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-bold text-[#39B54A]">
                          ${product.price}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          Stock: {product.stock}
                        </span>
                      </div>
                      <button className="w-full mt-4 border border-neutral-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">Messages</h2>
                <div className="space-y-3">
                  {dummyMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`border border-neutral-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                        message.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm sm:text-base">{message.from}</h3>
                          {message.unread && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {message.date}
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-1">
                        {message.subject}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">{message.preview}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">
                  Update account to Vendor
                </h2>
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shop Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.shopName}
                      onChange={(e) =>
                        setProfile({ ...profile, shopName: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shop URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={profile.shopUrl}
                      onChange={(e) =>
                        setProfile({ ...profile, shopUrl: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-1 text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 break-all">{profile.shopUrl}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={profile.phoneNumber}
                      onChange={(e) =>
                        setProfile({ ...profile, phoneNumber: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <button
                    onClick={handleProfileSubmit}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm sm:text-base"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;