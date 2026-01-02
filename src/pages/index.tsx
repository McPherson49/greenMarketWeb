"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Home from "../components/home/Home";
import BlogSection from "@/components/blog/BlogSection";
import Newsletter from "@/components/newsletter/Newsletter";
import { getCategories } from "@/services/category";
import { getProducts } from "@/services/products";
import { UIProduct } from "@/types/product";

type Category = {
  id: number;
  label: string;
  slug: string;
  icon: string;
  color?: string;
};

const PER_PAGE = 24;

export default function IndexPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  
  const searchParams = useSearchParams();
  
  // Get search parameters from URL
  const searchTerm = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';

  // -----------------------------
  // FETCH CATEGORIES
  // -----------------------------
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        if (!res) return;

        const formatted = res.map((cat: any) => ({
          id: cat.id,
          label: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          color: cat.color ?? "#cccccc",
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // -----------------------------
  // FETCH PRODUCTS (WITH SEARCH)
  // -----------------------------
  const fetchProducts = useCallback(async (page: number, search: string = '', loc: string = '') => {
    try {
      setLoadingProducts(true);

      // Build params object
      const params: any = {
        page,
        per_page: PER_PAGE,
      };

      // Add search parameter if exists
      if (search) {
        params.search = search;
      }

      // Add location parameter if exists and not "All Locations"
      if (loc && loc !== 'All Locations') {
        params.location = loc;
      }

      console.log('Fetching products with params:', params); // Debug log

      const res = await getProducts(params);

      // Check if res is null or undefined
      if (!res) {
        console.error("No products data received");
        return;
      }

      // Check if res.data exists and is an array
      const productsArray = Array.isArray(res.data) ? res.data : [];

      // ✅ CRITICAL FIX: map API → UI product
      const formattedProducts: UIProduct[] = productsArray.map((p: any) => ({
        id: p.id,
        name: p.title,
        price: p.price,
        image: p.thumbnail || p.images?.[0] || "/placeholder.png",
        vendor: p.business?.name || p.user?.name || "Unknown",
        rating: p.business?.rating ?? 0,
      }));

      console.log("Formatted products count:", formattedProducts.length); // Debug log

      setProducts(formattedProducts);
      setCurrentPage(res.current_page || 1);
      setLastPage(res.last_page || 1);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Initial load and reload when search params change
  useEffect(() => {
    fetchProducts(1, searchTerm, location);
  }, [fetchProducts, searchTerm, location]);

  // -----------------------------
  // HANDLE SEARCH FROM HEADER
  // -----------------------------
  const handleSearch = useCallback((searchTerm: string, location: string) => {
    // This will trigger the useEffect above because searchParams will change
    console.log('Search triggered:', { searchTerm, location });
  }, []);

  // -----------------------------
  // PAGINATION HANDLERS
  // -----------------------------
  const fetchNextPage = () => {
    if (currentPage < lastPage) {
      fetchProducts(currentPage + 1, searchTerm, location);
    }
  };

  const fetchPrevPage = () => {
    if (currentPage > 1) {
      fetchProducts(currentPage - 1, searchTerm, location);
    }
  };

  const blogPosts = [
    { id: "1", category: "LIVESTOCKS", image: "/assets/blog1.png", title: "Livestock Tips & Best Practices", excerpt: "Blimlävikt treskade...", author: "Basäm", date: "3 Nov 2025" },
    { id: "2", category: "UNCATEGORIZED", image: "/assets/blog2.png", title: "Agro-Business & Entrepreneurship", excerpt: "Blimlävikt treskade...", author: "sinan", date: "3 Nov 2025" },
    { id: "3", category: "FISHERY", image: "/assets/blog3.png", title: "Success Stories & Fishermen Spotlight", excerpt: "Blimlävikt treskade...", author: "Basäm", date: "3 Nov 2025" },
    { id: "4", category: "FRUITS", image: "/assets/blog4.png", title: "Market Trends & Prices", excerpt: "Blimlävikt treskade...", author: "sinan", date: "3 Nov 2025" },
  ];

  return (
    <main className="w-full">
      <div className="container mt-10 max-w-7xl mx-auto">
        <Home
          products={products}
          categories={categories}
          loading={loadingProducts}
          currentPage={currentPage}
          lastPage={lastPage}
          onNextPage={fetchNextPage}
          onPrevPage={fetchPrevPage}
          searchTerm={searchTerm}
          location={location}
        />
      </div>

      <BlogSection posts={blogPosts} />
      <Newsletter />
    </main>
  );
}