"use client";
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Newsletter from "@/components/newsletter/Newsletter";

type Product = {
  id: number;
  name: string;
  tag?: string;
  price: string;
  unit?: string;
  vendor?: string;
  image: string;
  category: string; 
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group rounded-xl border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-sm">
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {product.tag ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#39B54A] px-2 py-0.5 text-xs text-white">
            {product.tag}
          </span>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="mt-3 flex flex-col gap-2">
        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium text-neutral-800">
            {product.name}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-amber-500">
            <Star className="w-3 h-3 fill-current" /> 4.8
          </span>
        </div>

        {/* Vendor + Unit */}
        <div className="text-xs text-neutral-500">
          {product.vendor} {product.unit ? `• ${product.unit}` : null}
        </div>

        {/* Price + View Button */}
        <div className="flex justify-between items-center gap-2">
          <div className="text-sm font-semibold text-neutral-900">
            {product.price}
          </div>

          {/* VIEW BUTTON */}
          <button
            onClick={() => (window.location.href = `/product/${product.id}`)}
            className="inline-flex items-center gap-2 rounded-md bg-[#39B54A] px-3 py-1.5 text-sm text-white hover:bg-emerald-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "all"
  );
  const itemsPerPage = 15;

  
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // Available categories for filtering
  const categories = [
    { label: "All Products", value: "all" },
    { label: "Vegetables", value: "vegetables" },
    { label: "Fruits", value: "fruits" },
    { label: "Poultry", value: "poultry" },
    { label: "Fish & Aquatic", value: "fish" },
    { label: "Grain", value: "grain" },
  ];

  const allProducts: Product[] = [
    {
      id: 1,
      name: "Golden Terry Soya Cooking Oil",
      price: "₦250",
      vendor: "VegiFru",
      unit: "1L",
      image:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
      tag: "New",
      category: "grain",
    },
    {
      id: 2,
      name: "Nutrice Nutrition Powder",
      price: "₦250",
      vendor: "VegiFru",
      unit: "500g",
      image:
        "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&h=300&fit=crop",
      tag: "Sale",
      category: "grain",
    },
    {
      id: 3,
      name: "Premium Chocolate Biscuits",
      price: "₦250",
      vendor: "Biscuits",
      unit: "200g",
      image:
        "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&h=300&fit=crop",
      tag: "Offer",
      category: "grain",
    },
    {
      id: 4,
      name: "Fresh Chicken Whole",
      price: "₦250",
      vendor: "Biscuits",
      unit: "1kg",
      image:
        "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop",
      category: "poultry",
    },
    {
      id: 5,
      name: "Paperback Novel Collection",
      price: "₦250",
      vendor: "Seafood",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
      tag: "Hot",
      category: "fish",
    },
    {
      id: 6,
      name: "Organic Spinach Fresh",
      price: "₦250",
      vendor: "VegiFru",
      unit: "250g",
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
      tag: "Sale",
      category: "vegetables",
    },
    {
      id: 7,
      name: "Frozen Tomato Pack",
      price: "₦250",
      vendor: "VegiFru",
      unit: "500g",
      image:
        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
      category: "vegetables",
    },
    {
      id: 8,
      name: "Fresh Cucumber",
      price: "₦250.88",
      vendor: "Biscuits",
      unit: "3pcs",
      image:
        "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=300&fit=crop",
      tag: "Offer",
      category: "vegetables",
    },
    {
      id: 9,
      name: "Ice Berg Lettuce Seed Pack",
      price: "₦250",
      vendor: "Biscuits",
      unit: "100g",
      image:
        "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
      tag: "New",
      category: "vegetables",
    },
    {
      id: 10,
      name: "Frozen Pineapple Chunks",
      price: "₦250",
      vendor: "Taylor",
      unit: "400g",
      image:
        "https://images.unsplash.com/photo-1550828486-e66bea3be079?w=400&h=300&fit=crop",
      tag: "Hot",
      category: "fruits",
    },
    {
      id: 11,
      name: "Fresh Orange Valencia",
      price: "₦250",
      vendor: "VegiFru",
      unit: "1kg",
      image:
        "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=300&fit=crop",
      tag: "Sale",
      category: "fruits",
    },
    {
      id: 12,
      name: "All Natural Italian-Style Chicken Meatballs",
      price: "₦250",
      vendor: "BayKin",
      unit: "500g",
      image:
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
      tag: "Sale",
      category: "poultry",
    },
    {
      id: 13,
      name: "Angie's Boomchickapop Corn & Chilly",
      price: "₦250",
      vendor: "Seafood",
      unit: "200g",
      image:
        "https://images.unsplash.com/photo-1585641378602-4f0ac363de5c?w=400&h=300&fit=crop",
      tag: "Offer",
      category: "grain",
    },
    {
      id: 14,
      name: "Foster Farms Takeout Crazy Classic",
      price: "₦250",
      vendor: "Seafood",
      unit: "750g",
      image:
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop",
      category: "poultry",
    },
    {
      id: 15,
      name: "Blue Diamond Almonds Lightly Salted",
      price: "₦250",
      vendor: "Seafood",
      unit: "300g",
      image:
        "https://images.unsplash.com/photo-1568471173238-64bdddc18f87?w=400&h=300&fit=crop",
      tag: "Hot",
      category: "grain",
    },
    {
      id: 16,
      name: "Chobani Complete Vanilla Greek Yogurt",
      price: "₦250",
      vendor: "Seafood",
      unit: "400g",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
      tag: "Sale",
      category: "grain",
    },
    {
      id: 17,
      name: "Canada Dry Ginger Ale - 4 Pack",
      price: "₦250",
      vendor: "Seafood",
      unit: "8oz",
      image:
        "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
      category: "grain",
    },
    {
      id: 18,
      name: "Equine Ranchlands Sweet Corn",
      price: "₦250",
      vendor: "Seafood",
      unit: "340g",
      image:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
      tag: "Offer",
      category: "grain",
    },
    {
      id: 19,
      name: "Gorton's Beer Battered Fish Fillets",
      price: "₦250",
      vendor: "SEET Meat",
      unit: "600g",
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
      category: "fish",
    },
    {
      id: 20,
      name: "Haagen-Dazs Caramel Cone Ice Cream",
      price: "₦250",
      vendor: "Farm",
      unit: "473ml",
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
      tag: "Hot",
      category: "grain",
    },
  ];

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "all"
      ? allProducts
      : allProducts.filter(
          (product) => product.category.toLowerCase() === selectedCategory
        );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setCurrentPage(1); // Reset to first page when category changes
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (categoryValue === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", categoryValue);
    }
    window.history.pushState({}, "", url);
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-16 px-4 mb-10"
        style={{
          backgroundImage: "url('/assets/Footer.png')",
          width: "100%",
          minHeight: "250px",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-emerald-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
              Home / Shop
              {selectedCategory !== "all" && (
                <>
                  {" "}
                  /{" "}
                  {categories.find((c) => c.value === selectedCategory)?.label}
                </>
              )}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {selectedCategory === "all"
                ? "Shop"
                : categories.find((c) => c.value === selectedCategory)?.label}
            </h1>
            <p className="text-gray-600 text-sm">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-6 py-2 rounded-full border transition-all ${
                  selectedCategory === category.value
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-emerald-600"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No products found in this category
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentPage === page
                      ? "bg-green-500 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="mt-20">
        <Newsletter />
      </div>
    </div>
  );
};

export default Shop;