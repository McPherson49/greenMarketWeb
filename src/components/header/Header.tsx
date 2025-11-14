"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  Menu,
  Search,
  Phone,
  CircleUser,
  ChevronRight,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { FaAd, FaHeadset } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";

const navRoutes = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Profile", href: "/profile" },
  { label: "shop", href: "/shop" },
  { label: "How Escrow Works", href: "/howEscrowWorks" },
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

const locations = [
  { value: "Search By Location", label: "Search By Location" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "portharcourt", label: "Port Harcourt" },
  { value: "kano", label: "Kano" },
  { value: "ibadan", label: "Ibadan" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2 text-[#39B54A]">
      <Link href="/">
        <Image
          alt="Greenmarket Logo"
          src="/assets/logo.svg"
          width={100}
          height={100}
        />
      </Link>
    </div>
  );
}

function SearchBar({ className = "" }: { className?: string }) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState("Search By Location");

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };

  return (
    <div
      className={`flex max-w-xl items-center gap-2 rounded-md border border-neutral-200 bg-white p-2 ${className}`}
    >
      <div className="relative">
        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-800 whitespace-nowrap"
        >
          {selectedLocation}
          <ChevronDown className="size-3" />
        </button>
        {/* Location Dropdown */}
        {locationOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg z-[9999]">
            {locations.map((loc) => (
              <button
                key={loc.value}
                onClick={() => handleSelectLocation(loc.label)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition"
              >
                {loc.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative flex-1">
        <input
          aria-label="Search items"
          placeholder="Search for items, vendors..."
          className="w-full border-l border-neutral-200 pl-2 pr-8 py-1.5 text-sm focus:outline-none"
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export default function Header({
  onOpenCategories,
}: {
  onOpenCategories: () => void;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-[9999] bg-white backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200">
        {/* Top bar */}
        <div className="container max-w-7xl mx-auto flex items-center gap-3 py-3">
          {/* Logo on the left */}
          <Brand />
          {/* Desktop Search */}
          <div className="flex-1 hidden md:block mx-4">
            <SearchBar />
          </div>
          {/* Desktop Actions */}
          <div className="ml-auto hidden md:flex items-center gap-2">
            <Link
              href="/post-ad"
              className="inline-flex items-center gap-2 rounded-md border border-[#39B54A] text-[#39B54A] px-3 py-2 text-sm"
            >
              <FaAd className="size-4 " /> Post AD
            </Link>
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-2 rounded-md border-[#39B54A] text-[#39B54A] border px-3 py-2 text-sm"
            >
              <CircleUser className="size-4" /> Login
            </Link>
            <Link
              href="/register"
              className="hidden md:inline-flex items-center gap-2 bg-[#39B54A] text-white rounded-md border border-neutral-200 px-3 py-2 text-sm"
            >
              <TiUserAdd className="size-6 text-white " /> Register
            </Link>
          </div>
          {/* Mobile Hamburger on the right */}
          <button
            className="md:hidden ml-auto inline-flex items-center justify-center rounded-md border border-neutral-200 p-2 text-[#39B54A]"
            onClick={() => setNavOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
        {/* Nav bar with Browse + links */}
        <div className="border-t border-neutral-200 bg-white">
          <div className="container max-w-7xl mx-auto flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-10">
              <button
                type="button"
                onClick={onOpenCategories}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm text-[#39B54A]"
              >
                <Menu className="size-4" /> Browse All Categories
              </button>
              <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-700">
                {navRoutes.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`hover:text-[#39B54A] transition-colors ${
                      pathname === item.href
                        ? " text-[#39B54A] font-medium"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="hidden md:flex items-center text-[#7E7E7E] gap-2">
              <FaHeadset className="size-6 text-[#39B54A] " />
              +234 909 959 3016
              <br />
              24/7 Support Center
            </div>
          </div>
        </div>
        {/* Mobile search */}
        <div className="container max-w-7xl mx-auto md:hidden pb-3">
          <SearchBar />
        </div>
      </header>
      {/* Mobile nav drawer - Portal to body level */}
      <div
        className={`fixed inset-0 z-[99999] transition-opacity duration-300 ${
          navOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setNavOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[85vw] max-w-md bg-white border-r shadow-xl transition-transform duration-300 ease-out ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <Brand />
            <button
              aria-label="Close navigation"
              className="inline-flex items-center justify-center rounded-md border border-neutral-200 p-2"
              onClick={() => setNavOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>
          <nav
            className="divide-y divide-neutral-200 overflow-y-auto"
            style={{ maxHeight: "calc(100dvh - 4rem)" }}
          >
            {navRoutes.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 hover:bg-emerald-50 transition-colors ${
                  pathname === item.href
                    ? "bg-emerald-50 text-[#39B54A] font-medium"
                    : ""
                }`}
                onClick={() => setNavOpen(false)}
              >
                <span className="text-sm">{item.label}</span>
                <ChevronRight className="size-4 text-neutral-400" />
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
