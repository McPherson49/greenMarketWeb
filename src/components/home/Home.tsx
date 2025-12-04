import ProductCard, { Product } from "@/components/products/ProductCard";
import React from "react";
import Hero from "./Hero";
import Image from "next/image";

type Category = {
  label: string;
  icon: string;    
  color?: string;
  slug: string;
  id: number;
};

type HomeProps = {
  products: Product[];
  categories: Category[];
  loading?: boolean;
};

// Skeleton card component
const ProductCardSkeleton = () => (
  <div className="animate-pulse rounded-lg p-4 bg-white shadow-md">
    <div className="h-32 bg-gray-200 rounded mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export default function Home({ products, categories, loading }: HomeProps) {
  return (
    <div className="space-y-8 ">
      <Hero />

      {/* Mobile categories chips */}
      <div className="lg:hidden -mx-4 px-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
          {categories.slice(0, 16).map((c) => (
            <button
              key={c.label}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs"
            >
              <Image src={c.icon} className="size-3" alt={c.label} width={32} height={32} />{" "}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg my-5 font-semibold">Popular Products</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
