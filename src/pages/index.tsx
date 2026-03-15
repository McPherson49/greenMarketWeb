"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Home from "../components/home/Home";
import Newsletter from "@/components/newsletter/Newsletter";
import { getCategories } from "@/services/category";
import { getProducts } from "@/services/products";
import { UIProduct } from "@/types/product";
import BlogGrid from "@/components/blog/BlogGrid";
import { Blog } from "@/types/blog";
import { getPublishedBlogs } from "@/services/blog";

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

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();

  // Get search parameters from URL
  const searchTerm = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";

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

  useEffect(() => {
    getPublishedBlogs(1).then((res) => {
      setBlogs(res.data.slice(0, 4)); // show only 4 on homepage
      setIsLoading(false);
    });
  }, []);

  // -----------------------------
  // FETCH PRODUCTS (WITH SEARCH)
  // -----------------------------
  const fetchProducts = useCallback(
    async (page: number, search: string = "", loc: string = "") => {
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
        if (loc && loc !== "All Locations") {
          params.location = loc;
        }

        console.log("Fetching products with params:", params); // Debug log

        const res = await getProducts(params);

        // Check if res is null or undefined
        if (!res) {
          console.error("No products data received");
          return;
        }

        // Check if res.data exists and is an array
        const productsArray = Array.isArray(res.data) ? res.data : [];

        // map API → UI product
        const formattedProducts: UIProduct[] = productsArray.map((p: any) => ({
          id: p.id,
          name: p.title,
          price: p.price,
          image: p.thumbnail || p.images?.[0] || "/placeholder.png",
          vendor: p.business?.name || p.user?.name || "Unknown",
          rating: p.business?.rating ?? 0,
          tag: p.sub || undefined,
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
    },
    [],
  );

  // Initial load and reload when search params change
  useEffect(() => {
    fetchProducts(1, searchTerm, location);
  }, [fetchProducts, searchTerm, location]);

  // -----------------------------
  // HANDLE SEARCH FROM HEADER
  // -----------------------------
  const handleSearch = useCallback((searchTerm: string, location: string) => {
    // This will trigger the useEffect above because searchParams will change
    console.log("Search triggered:", { searchTerm, location });
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

  return (
    <main className="w-full">
      <div className="container mt-3 max-w-7xl mx-auto">
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

      <div className="container my-20 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">OUR BLOG</h1>
        <BlogGrid blogs={blogs} isLoading={isLoading} skeletonCount={4} />
      </div>

      <Newsletter />
    </main>
  );
}
