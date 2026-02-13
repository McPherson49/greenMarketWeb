import React, { useState, useEffect } from "react";
import { Edit, User, Package, ShoppingCart, Home, Menu, X, UserPlus, ArrowRightLeft } from "lucide-react";
import { FaChevronRight } from "react-icons/fa6";
import EscrowRequests from "@/components/EscrowOrders";
import { getDashboardStats, DashboardStats } from "@/services/dashboard";
import { getProfile, UserProfile } from "@/services/profile";
import { getMyProducts } from "@/services/products";
import { ProductData } from "@/types/product";
import { getOrders } from "@/services/orders";
import Link from "next/link";
import { formatWalletAmount, formatPrice } from "@/utils/func";
import { getOffers } from "@/services/escrow";
import Pagination from "@/components/Pagination";
import { logoutAuth } from "@/utils/auth";
import { GetOrdersResponse } from "@/types/orders";
import Image from "next/image";
import ApiFetcher from "@/utils/apis";
import ReferralTab from "@/components/ReferralTab";
import ProfileImageUpdateModal from "@/components/ProfileImageUpdateModal";
import ChatInterface from "@/components/ChatInterface";
// Types
interface VendorProfile {
  firstName: string;
  lastName: string;
  shopName: string;
  shopUrl: string;
  phoneNumber: string;
  email: string;
}

// Dummy Data (fallback in case API fails)
const dummyProfile: VendorProfile = {
  firstName: "John",
  lastName: "Doe",
  shopName: "Awesome Shop",
  shopUrl: "https://kbtheme.com/gvaig/store/",
  phoneNumber: "+1 234 567 8900",
  email: "name@gmail.com",
};

type TabType =
  | "dashboard"
  | "orders"
  | "products"
  | "chat"
  | "profile"
  | "escrow"
  | "referrals";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [profile, setProfile] = useState<VendorProfile>(dummyProfile);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [myProducts, setMyProducts] = useState<ProductData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [myOrders, setMyOrder] = useState(false);
  const [orders, setOrders] = useState<GetOrdersResponse | null>(null);
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [ordersFilters, setOrdersFilters] = useState({
    page: 1,
    per_page: 10,
    status: "",
    search: "",
  });

  const handlePageChange = (page: number) => {
    setOrdersFilters((prev) => ({ ...prev, page }));
  };

  const handlePerPageChange = (perPage: number) => {
    setOrdersFilters((prev) => ({ ...prev, per_page: perPage, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setOrdersFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrdersFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrdersData();
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "products") {
      fetchMyProducts();
    }

    if (activeTab === "orders") {
      fetchOrdersData();
    }
  }, [activeTab, ordersFilters]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const res = await getOrders(ordersFilters);
      if (res) {
        setOrders(res);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const data = await getProfile();
      setUserProfile(data);

      if (data) {
        const nameParts = data.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setProfile((prev) => ({
          ...prev,
          firstName,
          lastName,
          email: data.email,
          phoneNumber: data.phone,
          shopName: data.business?.name || prev.shopName,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageUpdateSuccess = (newAvatar: string) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        avatar: newAvatar
      });
    }
    
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement;
    if (parent) {
      const fallbackIcon = document.createElement('div');
      fallbackIcon.className = 'w-full h-full flex items-center justify-center';
      fallbackIcon.innerHTML = '<User className="w-6 h-6 text-gray-600" />';
      parent.appendChild(fallbackIcon);
    }
  };

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const data = await getMyProducts();
      setMyProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = () => {
    alert("Profile updated successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const getUserDisplayName = () => {
    if (userProfile) {
      return userProfile.name;
    }
    return profile.email;
  };

  const getUserDisplayEmail = () => {
    if (userProfile) {
      return userProfile.email;
    }
    return profile.email;
  };

  const getActualProductCount = () => {
    if (userProfile) {
      return userProfile.product_count;
    }
    return dashboardData?.products || 0;
  };

  const handleLogout = () => {
    logoutAuth();

    // Redirect to home page
    window.location.href = "/";
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
              className="lg:hidden p-2 rounded-lg  hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0  bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
            fixed lg:relative inset-y-0 left-0 z-9999 lg:z-30 w-72  bg-white rounded-lg shadow-sm p-6
            transform transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            lg:block
          `}
          >
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200 relative">
              {/* Profile Image Container with Edit Icon */}
              <div className="relative group">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                  {userProfile?.avatar ? (
                    <Image
                      src={userProfile.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                      onError={handleImageError}
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                
                {/* Edit Icon Overlay */}
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#39B54A] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#188727] transition-colors group-hover:scale-110 z-10"
                  title="Edit profile picture"
                >
                  <Edit className="w-3 h-3" />
                </button>
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Welcome back!</p>
                <p className="font-medium truncate">
                  {profileLoading ? (
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    getUserDisplayName()
                  )}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === "dashboard"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <span>Dashboard</span>
                {loading && (
                  <div className="w-4 h-4 border-2 border-[#39B54A] border-t-transparent rounded-full animate-spin"></div>
                )}
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
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === "products"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <span>Products</span>
                {loading && (
                  <div className="w-4 h-4 border-2 border-[#39B54A] border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
              <button
                onClick={() => handleTabChange("escrow")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                  activeTab === "escrow"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                Escrow Requests
              </button>
              <button
                onClick={() => handleTabChange("chat")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === "chat"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <span>Messages</span>
              </button>
              <button
                onClick={() => handleTabChange("referrals")}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === "referrals"
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <span>Referrals</span>
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
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-50 text-red-600 transition-colors"
              >
                Log out
              </button>
            </nav>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            {activeTab === "dashboard" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>
                  <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Refresh
                    {loading && (
                      <div className="w-4 h-4 border-2 border-[#39B54A] border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-[#39B54A] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                      {/* Wallet Card */}
                      <div className="bg-linear-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Wallet Balance
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-green-700">
                              {dashboardData
                                ? formatWalletAmount(dashboardData.wallet)
                                : "0"}
                            </p>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">
                              &#x20A6;
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Total Products
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold">
                              {getActualProductCount()}
                            </p>
                          </div>
                          <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-[#39B54A]" />
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Escrow Orders
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold">
                              {dashboardData?.escrow ?? 0}
                            </p>
                          </div>
                          <ArrowRightLeft className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                        </div>
                      </div>

                      <div className="bg-orange-50 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Referral Points
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold">
                              {dashboardData?.tickets ?? 0}
                            </p>
                          </div>
                          <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                        </div>
                      </div>

                      {/* Liked Products Card */}
                      <div className="bg-pink-50 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Liked Products
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold">
                              {dashboardData?.liked ?? 0}
                            </p>
                          </div>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 text-sm">❤</span>
                          </div>
                        </div>
                      </div>

                      {/* Wishlist Card */}
                      <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Wishlist Items
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold">
                              {dashboardData?.wish_list ?? 0}
                            </p>
                          </div>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 text-sm">⭐</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Info Section */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">
                            {profileLoading ? (
                              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                              getUserDisplayName()
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">
                            {profileLoading ? (
                              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                              getUserDisplayEmail()
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">
                            {profileLoading ? (
                              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                              userProfile?.phone || "Not provided"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Account Type</p>
                          <p className="font-medium capitalize">
                            {profileLoading ? (
                              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                              userProfile?.type || "user"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Orders Tab - UPDATED */}
            {activeTab === "orders" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Orders</h2>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={ordersFilters.search}
                        onChange={handleSearch}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                      >
                        Search
                      </button>
                    </form>

                    <select
                      value={ordersFilters.status}
                      onChange={(e) => handleStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-[#39B54A] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
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
                            {orders && orders.data && orders.data.length > 0 ? (
                              orders.data.map((order) => (
                                <tr
                                  key={order.id}
                                  className="border-b border-neutral-200 hover:bg-gray-50"
                                >
                                  <td className="p-3 sm:p-4 text-sm">
                                    {order.id}
                                  </td>
                                  <td className="p-3 sm:p-4 text-sm">
                                    {order.user?.name}
                                  </td>
                                  <td className="p-3 sm:p-4 text-sm hidden md:table-cell">
                                    {order.product?.title}
                                  </td>
                                  <td className="p-3 sm:p-4 text-sm">
                                    {formatPrice(
                                      Number(order.transactable?.amount ?? 0)
                                    )}
                                  </td>
                                  <td className="p-3 sm:p-4">
                                    <span
                                      className={`text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(
                                        order.status ?? "pending"
                                      )}`}
                                    >
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="p-3 sm:p-4 text-gray-600 text-sm hidden lg:table-cell">
                                    {order.created_at &&
                                      formatDate(order.created_at)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="p-8 text-center text-gray-500"
                                >
                                  <div className="flex flex-col items-center justify-center">
                                    <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                                    <p className="text-lg font-medium text-gray-900 mb-2">
                                      No orders found
                                    </p>
                                    <p className="text-gray-600">
                                      {ordersFilters.search ||
                                      ordersFilters.status
                                        ? "No orders match your filters"
                                        : "You haven't received any orders yet."}
                                    </p>
                                    {(ordersFilters.search ||
                                      ordersFilters.status) && (
                                      <button
                                        onClick={() => {
                                          setOrdersFilters({
                                            page: 1,
                                            per_page: 10,
                                            status: "",
                                            search: "",
                                          });
                                        }}
                                        className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                                      >
                                        Clear filters
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {orders && orders.last_page > 1 && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={orders.current_page}
                          totalPages={orders.last_page}
                          totalItems={orders.total}
                          perPage={orders.per_page}
                          onPageChange={handlePageChange}
                          onPerPageChange={handlePerPageChange}
                          showPerPageOptions={true}
                          className="mt-6"
                        />
                      </div>
                    )}

                    {/* Order Summary */}
                    {orders && orders.data && orders.data.length > 0 && (
                      <div className="mt-4 text-sm text-gray-600">
                        Showing {orders.from || 1} to{" "}
                        {orders.to || orders.data.length} of {orders.total}{" "}
                        orders
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold">My Products</h2>
                  <Link href="/post-ad">
                    <button className="bg-[#39B54A] text-white px-4 py-2 rounded-lg hover:bg-[#188727] text-sm sm:text-base">
                      Add Product
                    </button>
                  </Link>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-[#39B54A] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : myProducts && myProducts.data.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {myProducts.data.map((product) => (
                      <div
                        key={product.id}
                        className="border border-neutral-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-100 h-32 sm:h-40 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              width={160}
                              height={160}
                            />
                          ) : product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              width={160}
                              height={160}
                            />
                          ) : (
                            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                          )}
                        </div>

                        <h3 className="font-semibold mb-2 text-sm sm:text-base line-clamp-2">
                          {product.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                          Category: {product.keyword || "Uncategorized"}
                        </p>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base sm:text-lg font-bold text-[#39B54A]">
                            {formatPrice(product.price)}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              product.status === "published"
                                ? "bg-green-100 text-green-800"
                                : product.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-4">
                          <span>Views: {product.views}</span>
                          <span>
                            {new Date(product.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* <Link href={`/edit-product/${product.id}`}>
                          <button className="w-full border border-neutral-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                            Edit Product
                          </button>
                        </Link> */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven't created any products yet.
                    </p>
                    <Link href="/add-product">
                      <button className="bg-[#39B54A] text-white px-6 py-2 rounded-lg hover:bg-[#188727]">
                        Create Your First Product
                      </button>
                    </Link>
                  </div>
                )}

                {/* Pagination */}
                {myProducts && myProducts.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      disabled={myProducts.current_page === 1}
                      className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {myProducts.current_page} of {myProducts.last_page}
                    </span>
                    <button
                      disabled={
                        myProducts.current_page === myProducts.last_page
                      }
                      className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Chat Tab */}
            <ChatInterface activeTab={activeTab} />

            {/* Profile Tab */}
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

            {/* Escrow Requests Tab */}
            {activeTab === "escrow" && <EscrowRequests />}
            {activeTab === "referrals" && <ReferralTab />}
          </div>
        </div>
      </div>
      {/* Profile Image Update Modal */}
      <ProfileImageUpdateModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        currentImage={userProfile?.avatar || null}
        onUpdateSuccess={handleImageUpdateSuccess}
      />
    </div>
  );
};

export default Profile;
