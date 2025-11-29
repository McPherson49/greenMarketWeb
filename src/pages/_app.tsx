import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { ChevronRight, Tags, Leaf } from "lucide-react";
import "@/styles/globals.css";
import Link from "next/link";
import { FaX } from "react-icons/fa6";
import { getCategories, CategoryItem } from "@/services/category";

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

  // Handle category click - close on mobile only
  const handleCategoryClick = () => {
    // Check if we're on mobile (screen width < 768px)
    if (window.innerWidth < 768) {
      onClose();
    }
    // On desktop, drawer stays open so users can browse multiple categories
  };

  return (
    <div className="fixed inset-0 z-[99998]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute inset-y-0 left-0 w-[85vw] max-w-md bg-white border-r border-neutral-200 shadow-xl flex flex-col">
        {/* Header - fixed height */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 shrink-0">
          <div className="font-bold text-lg">
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
            <FaX className="text-[#39B54A]" />
          </button>
        </div>
        
        {/* Content area - flexible */}
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
export default function App({ Component, pageProps }: AppProps) {
  const [catOpen, setCatOpen] = useState(false);

  return (
    <>
      <Header onOpenCategories={() => setCatOpen(true)} />
      <CategoryDrawer open={catOpen} onClose={() => setCatOpen(false)} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}