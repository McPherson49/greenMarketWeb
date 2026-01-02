  "use client";

  import ProductCard from "@/components/products/ProductCard";
  import React from "react";
  import Hero from "./Hero";
  import Image from "next/image";
  import { UIProduct } from "@/types/product";
  import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";

  type Category = {
    label: string;
    icon: string;
    color?: string;
    slug: string;
    id: number;
  };

  type HomeProps = {
    products: UIProduct[];
    categories: Category[];
    loading?: boolean;
    currentPage: number;
    lastPage: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    location: string;
  };

  export default function Home({
    products,
    categories,
    loading,
    currentPage,
    lastPage,
    onNextPage,
    onPrevPage,
    searchTerm,
    location,
  }: HomeProps) {
    // Check if we have active search
    const hasActiveSearch = searchTerm || (location && location !== 'All Locations');
    
    return (
      <div className="space-y-8">
        <Hero />

        {/* Mobile categories */}
        <div className="lg:hidden -mx-4 px-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
            {categories.slice(0, 16).map((c) => (
              <button
                key={c.id}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs"
              >
                <Image src={c.icon} alt={c.label} width={16} height={16} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          {/* Search Results Header - Only shown when there's an active search */}
          {hasActiveSearch && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {searchTerm ? `Search Results for "${searchTerm}"` : "Filtered Products"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
                        Search: {searchTerm}
                      </span>
                    )}
                    {location && location !== 'All Locations' && (
                      <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
                        📍 {location}
                      </span>
                    )}
                    {!loading && (
                      <span className="text-gray-700 font-medium">
                        {products.length} product{products.length !== 1 ? 's' : ''} found
                      </span>
                    )}
                  </div>
                </div>
                {(searchTerm || (location && location !== 'All Locations')) && (
                  <a 
                    href="/" 
                    className="text-sm text-[#39B54A] hover:underline hover:text-emerald-600 whitespace-nowrap"
                  >
                    Clear all filters →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Products Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">
              {hasActiveSearch ? 'Products' : 'Popular Products'}
            </h2>
            {hasActiveSearch && !loading && products.length > 0 && (
              <span className="text-sm text-gray-600">
                Page {currentPage} of {lastPage}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              {hasActiveSearch ? (
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm 
                      ? `No products match "${searchTerm}"${location && location !== 'All Locations' ? ` in ${location}` : ''}`
                      : `No products available${location && location !== 'All Locations' ? ` in ${location}` : ''}`
                    }
                  </p>
                  {(searchTerm || (location && location !== 'All Locations')) && (
                    <a 
                      href="/" 
                      className="inline-flex items-center gap-2 bg-[#39B54A] text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
                    >
                      Clear search
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No products available</p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination UI */}
              {lastPage > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium">
                    Page {currentPage} of {lastPage}
                  </span>

                  <button
                    onClick={onNextPage}
                    disabled={currentPage === lastPage}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }