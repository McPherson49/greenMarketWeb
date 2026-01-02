import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { ChevronRight, Tags, Leaf, Rss, UsersRound } from "lucide-react";
import "@/styles/globals.css";
import Link from "next/link";
import {
  FaChartBar,
  FaBox,
  FaSearch,
  FaUsers,
  FaPlus,
  FaStar,
  FaComments,
  FaEnvelope,
  FaUser,
  FaCog,
  FaWrench,
  FaBell,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { FaBars, FaXmark } from "react-icons/fa6";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaX } from "react-icons/fa6";
import { getCategories, CategoryItem } from "@/services/category";
import MobileBottomNav from "@/components/MobileBottomNav";

type Category = {
  id: number;
  label: string;
  slug: string;
  icon: string;
  color: string;
};

function CategoryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) return;

    const fetchCats = async () => {
      setLoading(true);
      const res = await getCategories();
      if (res) setCategories(res);
      setLoading(false);
    };

    fetchCats();
  }, [open]);

  if (!open) return null;

  const handleCategoryClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-99998">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute inset-y-0 left-0 w-[85vw] max-w-md bg-white border-r border-neutral-200 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 shrink-0">
          <div className="">
            <Image
              src={"/assets/logo.svg"}
              width={100}
              height={100}
              priority
              alt="Greenmarket Logo"
            />
          </div>
          <button
            aria-label="Close"
            className="inline-flex items-center justify-center rounded-md border border-[#39B54A] p-2"
            onClick={onClose}
          >
            <FaXmark className="text-[#39B54A]" />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <h3 className="px-4 py-3 text-sm font-semibold text-neutral-800 shrink-0">
            Browse All Categories
          </h3>

          {/* LOADING STATE */}
          {loading && (
            <div className="px-4 py-3 text-sm text-neutral-600">
              Loading categories...
            </div>
          )}

          {/* Scrollable nav */}
          {/* LIST */}
          {!loading && (
            <nav className="flex-1 divide-y divide-neutral-200 overflow-y-auto pb-10">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-emerald-50"
                  onClick={handleCategoryClick}
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-100 shrink-0">
                      <Image
                        src={c.icon ?? "/assets/default.png"}
                        alt={c.name}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    </span>
                    <span className="text-sm">{c.name}</span>
                  </span>
                  <ChevronRight className="size-4 text-neutral-400 shrink-0" />
                </Link>
              ))}
            </nav>
          )}
        </div>
      </aside>
    </div>
  );
}

// Admin Layout Component with Sidebar
function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      section: "Menu",
      items: [
        { icon: FaChartBar, label: "Dashboard", href: "/admin", badge: null },
        {
          icon: FaUsers,
          label: "All users",
          href: "/admin/users",
          badge: null,
        },
        {
          icon: FaHandHoldingUsd,
          label: "Escrow Request",
          href: "/admin/escrow",
          badge: null,
        },
        {
          icon: MdOutlineProductionQuantityLimits,
          label: "products",
          href: "/admin/products",
          badge: null,
        },
        {
          icon: FaPlus,
          label: "New Product",
          href: "/admin/AdminProducts ",
          badge: null,
        },
        { icon: FaStar, label: "Reviews", href: "/admin/reviews", badge: null },
      ],
    },
    {
      section: "Others",
      items: [
        { icon: FaComments, label: "Chats", href: "/admin/chats", badge: 4 },
        { icon: Rss, label: "Blogs", href: "/admin/blogs", badge: null },
        {
          icon: UsersRound,
          label: "Community",
          href: "/admin/community",
          badge: null,
        },
      ],
    },
    {
      section: "Settings",
      items: [
        { icon: FaUser, label: "Profile", href: "/admin/profile", badge: null },
        {
          icon: FaCog,
          label: "Admin Management",
          href: "/admin/adminMgt",
          badge: null,
        },
        // {
        //   icon: FaWrench,
        //   label: "Settings",
        //   href: "/admin/settings",
        //   badge: null,
        // },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
            <Image
              src={"/assets/logo.svg"}
              width={100}
              height={100}
              priority
              alt="Greenmarket Logo"
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FaXmark className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">SA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Basam Farm
                </p>
                <p className="text-xs text-gray-500 truncate">Super Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </h3>
                <ul className="space-y-1 px-3">
                  {section.items.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-green-50 text-green-600"
                              : "text-green-700 hover:bg-emerald-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon className="text-lg" />
                            <span>{item.label}</span>
                          </span>
                          {item.badge && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-green-500 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              All rights reserved © GreenMarketNG {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area - with left margin on desktop */}
      <div className="min-h-screen ml-0 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-6">
          <div className="flex lg:hidden w-full h-f items-center justify-between">
            <Image
              src={"/assets/logo.svg"}
              width={100}
              height={100}
              priority
              alt="Greenmarket Logo"
            />
            <div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2"
              >
                <FaBars className="text-3xl" />
              </button>
            </div>

            {/* <div className="flex-1 lg:flex-none"></div> */}

            {/* <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <FaBell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
            </div> */}
          </div>
          <div className="flex justify-end">
            <button className="hidden sm:block px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
              Add Product
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const [catOpen, setCatOpen] = useState(false);
  const router = useRouter();
  // const isAdminRoute = router.pathname.startsWith("/admin");
  const isAdminRoute = router.pathname?.startsWith("/admin") ?? false;

  return (
    <>
      {isAdminRoute ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <>
          <Header onOpenCategories={() => setCatOpen(true)} />
          <CategoryDrawer open={catOpen} onClose={() => setCatOpen(false)} />
          <Component {...pageProps} />
          <MobileBottomNav />
          <Footer />
        </>
      )}
    </>
  );
}
