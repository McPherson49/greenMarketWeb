"use client";

import React, { useEffect, useState } from "react";
import Home from "../components/home/Home";
import BlogSection from "@/components/blog/BlogSection";
import Newsletter from "@/components/newsletter/Newsletter";
import { getCategories } from "@/services/category";
import { getProducts } from "@/services/products"; 
import { Product } from "@/components/products/ProductCard";

type Category = {
  id: number;
  label: string;
  slug: string;
  icon: string; 
  color?: string;
};

export default function IndexPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

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

    async function fetchProducts() {
      try {
        const body = { page: 1, per_page: 10 };
        const res = await getProducts();

        if (!res) return;

        // Map API response to your Product type
        const productsData = res.data || [];
        const productsArray = Array.isArray(productsData) ? productsData : [];

        const formattedProducts: Product[] = productsArray.map((p: any) => ({
          id: p.id,
          name: p.title,
          price: p.price_range?.min ?? "0",
          unit: "",
          vendor: p.user?.name ?? p.business?.name,
          tag: p.sub,
          image: p.thumbnail ?? p.images?.[0] ?? "/placeholder.png",
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchCategories();
    fetchProducts();
  }, []);

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
          loading={loadingCategories || loadingProducts} 
        />
      </div>

      <BlogSection posts={blogPosts} />
      <Newsletter />
    </main>
  );
}
