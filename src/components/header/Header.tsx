"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, Search, CircleUser, ChevronRight, X, ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { FaAd, FaHeadset } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { logoutAuth } from "@/utils/auth"
import locationService from "@/services/country"; 
import { toast } from "react-toastify";
import { UIProduct } from "@/types/product";

const navRoutes = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "shop", href: "/shop" },
  { label: "How Escrow Works", href: "/howEscrowWorks" },
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

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

interface SearchBarProps {
  className?: string;
  onSearch?: (searchTerm: string, location: string) => void;
  initialSearch?: string;
  initialLocation?: string;
}

function SearchBar({ 
  className = "", 
  onSearch,
  initialSearch = "",
  initialLocation = "Search By Location" 
}: SearchBarProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<Array<{ name: string; state_code: string }>>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const country = "Nigeria";

  useEffect(() => {
    setSelectedLocation(initialLocation);
    setSearchTerm(initialSearch);
  }, [initialLocation, initialSearch]);

  const handleSelectLocation = (state: string) => {
    setSelectedLocation(state);
    setLocationOpen(false);
    if (onSearch) {
      onSearch(searchTerm, state);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchTerm, selectedLocation);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    async function fetchNigerianStates() {
      setLoading(true);
      try {
        const countryData = await locationService.getStates(country);
        setStates(countryData);
      } catch (error) {
        toast.error("Failed to load states. Please refresh the page.");
        console.error("Error loading Nigerian states:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNigerianStates();
  }, [country]);

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
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg z-9999 max-h-60 overflow-y-auto">
            <button
              onClick={() => handleSelectLocation("All Locations")}
              className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition border-b"
            >
              All Locations
            </button>
            {states.map((loc) => (
              <button
                key={loc.name}
                onClick={() => handleSelectLocation(loc.name)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition"
              >
                {loc.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative flex-1">
        <input
          aria-label="Search items"
          placeholder="Search for Product"
          className="w-full border-l border-neutral-200 pl-2 pr-8 py-1.5 text-sm focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        <button 
          onClick={handleSearchSubmit}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <Search className="size-4 text-muted-foreground hover:text-[#39B54A]" />
        </button>
      </div>
    </div>
  );
}

interface HeaderProps {
  onOpenCategories: () => void;
  onSearch?: (searchTerm: string, location: string) => void;
}

export default function Header({
  onOpenCategories,
  onSearch
}: HeaderProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search params from URL
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || 'All Locations';
    setSearchTerm(search);
    setSelectedLocation(location);
  }, [searchParams]);

  // Check authentication status on component mount and route changes
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const checkAuthStatus = () => {
    const token = sessionStorage.getItem('jwt');
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    logoutAuth()
    window.location.href = '/';
  };

  // Handle search functionality
  const handleSearch = (term: string, location: string) => {
    setSearchTerm(term);
    setSelectedLocation(location);

    // Update URL with search params
    const params = new URLSearchParams();
    
    if (term) {
      params.set('search', term);
    }
    
    if (location !== 'All Locations') {
      params.set('location', location);
    }

    const queryString = params.toString();
    
    // If we're on a shop/search page, update the URL
    if (pathname === '/shop' || pathname === '/') {
      if (queryString) {
        router.push(`${pathname}?${queryString}`);
      } else {
        router.push(pathname);
      }
    }

    // Call the parent onSearch callback if provided
    if (onSearch) {
      onSearch(term, location);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-9999 bg-white backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-neutral-200">
        {/* Top bar */}
        <div className="container max-w-7xl mx-auto flex items-center gap-3 py-3">
          {/* Logo on the left */}
          <Brand />
          {/* Desktop Search */}
          <div className="flex-1 hidden md:block mx-4">
            <SearchBar 
              onSearch={handleSearch}
              initialSearch={searchTerm}
              initialLocation={selectedLocation}
            />
          </div>
          {/* Desktop Actions */}
          <div className="ml-auto hidden md:flex items-center gap-2">
            <Link
              href="/post-ad"
              className="inline-flex items-center gap-2 rounded-md border border-[#39B54A] text-[#39B54A] px-3 py-2 text-sm"
            >
              <FaAd className="size-4 " /> Post AD
            </Link>
            
            {/* Conditionally render Login/Register or User Profile */}
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-md border-[#39B54A] text-[#39B54A] border px-3 py-2 text-sm"
                >
                  <CircleUser className="size-4" /> Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-[#39B54A] text-white rounded-md border border-neutral-200 px-3 py-2 text-sm"
                >
                  <TiUserAdd className="size-6 text-white " /> Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-md border-[#39B54A] text-[#39B54A] border px-3 py-2 text-sm"
                >
                  <CircleUser className="size-4" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-md border border-red-500 text-red-500 px-3 py-2 text-sm hover:bg-red-50 transition-colors"
                >
                  <LogOut className="size-4" /> Logout
                </button>
              </div>
            )}
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
          <SearchBar 
            onSearch={handleSearch}
            initialSearch={searchTerm}
            initialLocation={selectedLocation}
          />
        </div>
      </header>
      {/* Mobile nav drawer - Portal to body level */}
      <div
        className={`fixed inset-0 z-99999 transition-opacity duration-300 ${
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
            
            {/* Mobile Auth Links */}
            <div className="p-4 border-t border-neutral-200">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 justify-center rounded-md border-[#39B54A] text-[#39B54A] border px-3 py-2 text-sm"
                    onClick={() => setNavOpen(false)}
                  >
                    <CircleUser className="size-4" /> Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 justify-center bg-[#39B54A] text-white rounded-md border border-neutral-200 px-3 py-2 text-sm"
                    onClick={() => setNavOpen(false)}
                  >
                    <TiUserAdd className="size-6 text-white" /> Register
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 justify-center rounded-md border-[#39B54A] text-[#39B54A] border px-3 py-2 text-sm"
                    onClick={() => setNavOpen(false)}
                  >
                    <CircleUser className="size-4" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setNavOpen(false);
                    }}
                    className="flex items-center gap-2 justify-center rounded-md border border-red-500 text-red-500 px-3 py-2 text-sm hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}