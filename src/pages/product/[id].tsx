"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
import { BsChatLeftText } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import Link from "next/link";
import { getProductDetails } from "@/services/products";
import { getCategories } from "@/services/category";

type Category = {
  id: number;
  name: string; 
  slug: string;
  icon: string | null;
  color?: string;
  products_count: number; 
};

const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto max-w-7xl lg:px-0 px-4 py-10 animate-pulse">
      {/* Top Section Skeleton */}
      <div className="grid lg:grid-cols-[1fr_1.5fr_0.8fr] gap-8 mb-12">
        {/* Left - Image Gallery Skeleton */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          </div>
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 rounded-md bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Middle - Product Info Skeleton */}
        <div className="flex flex-col justify-start space-y-4">
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
          
          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Quantity + Buttons Skeleton */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-36 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* Store Info Card Skeleton */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Categories Skeleton */}
        <div className="bg-white shadow-sm border border-neutral-200 rounded-xl p-4 h-fit">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-4 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section Skeleton */}
      <div className="mt-10 border border-neutral-200 rounded-lg bg-white">
        <div className="flex border-b">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-5 py-3">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div className="w-48 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-1 ml-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-12">
        <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-3 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Pulse loader for smaller loading states
const PulseLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`${sizes[size]} border-4 border-green-200 border-t-green-600 rounded-full animate-spin`}></div>
  );
};

const allProducts = [
  {
    id: 1,
    name: "Golden Palm Oil",
    tag: "Hot",
    price: "₦1250",
    unit: "1L",
    vendor: "By Olori",
    image:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Spices Mix",
    tag: "New",
    price: "₦1250",
    unit: "250g",
    vendor: "By MarketPro",
    image:
      "https://escrow.greenmarket.com.ng/storage/products/x0Ia1glzG9A2o2ZtNp9Jhvnj0xwLxU7Z4rjvb00N.jpg",
  },
  {
    id: 3,
    name: "Smoked Fish",
    tag: "Fresh",
    price: "₦1250",
    unit: "1kg",
    vendor: "By SeaFresh",
    image:
      "https://images.unsplash.com/photo-1604908811869-1ab919a6a9bd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Fresh Chicken",
    price: "₦1250",
    unit: "2kg",
    vendor: "By FarmVille",
    image:
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<any | null>(null);

  const product = allProducts.find((p) => p.id === Number(id)) || allProducts[0];

  useEffect(() => {
  if (!router.isReady) return;

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch Categories
      const categories = await getCategories();
      setCategory(categories || []);

      // Fetch Product Details
      if (id) {
        const product = await getProductDetails(id as string);
        setProductDetails(product);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
  }, [router.isReady, id]);


  if (loading || !productDetails) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-7xl lg:px-0 px-4 py-10">
      {/* TOP SECTION */}
      <div className="grid lg:grid-cols-[1fr_1.5fr_0.8fr] gap-8 mb-12">
        {/* LEFT - Product Image */}
        <div>
          {productDetails?.images?.[0] && (
          <div className="relative aspect-square rounded-xl overflow-hidden border">
            <Image
              src={productDetails.images[0]}
              alt={productDetails.name}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </div>
          )}

          {/* Gallery thumbnails */}
          <div className="flex gap-3 mt-4">
            {productDetails?.images?.map((img: string, i: number) => (
  <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border hover:border-green-500 transition">
    <Image
      src={img}
      alt={`thumb-${i}`}
      fill
      className="object-cover hover:scale-105 transition-transform"
    />
  </div>
))}
          </div>
        </div>

        {/* MIDDLE - Product Info */}
        <div className="flex flex-col justify-start space-y-4">
          <span className="text-sm text-pink-500 font-medium bg-pink-100 px-3 py-1 rounded-full w-fit">
            {productDetails.sub}
          </span>

          <h1 className="text-3xl font-semibold">{productDetails.title}</h1>

          <div className="flex items-center gap-2 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{productDetails.business?.rating}</span>
            <span className="text-gray-400 text-sm">({productDetails.reviews.length})</span>
          </div>

          <p className="text-3xl text-green-600 font-bold">₦{productDetails.price || "0"}</p>

          <p 
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: productDetails.description || "" }}
          />

          {/* Quantity + Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="relative w-24">
              <style jsx>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type="number"] {
                  -moz-appearance: textfield;
                }
              `}</style>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-full border border-[#39B54A] rounded-md py-2 pl-3 pr-8 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="absolute right-2 top-1 text-gray-600 hover:text-green-600"
              >
                <ChevronUp size={16} />
              </button>

              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="absolute right-2 bottom-1 text-gray-600 hover:text-green-600"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <Link href={"/message"} className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm">
              <BsChatLeftText size={18} /> Chat Seller
            </Link>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center gap-2 text-sm">
              <FaMoneyBillTransfer size={18} /> Request Escrow
            </button>
          </div>

          {/* Store Info Card */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-base mb-3 text-gray-800">Store Info</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Store Name:</span> {productDetails.business?.name }
              </div>
              <div>
                <span className="font-medium">Location:</span> {productDetails.address }
              </div>
              <div>
                <span className="font-medium">Contact Phone : </span> {productDetails.phone }
              </div>
              <div>
                <span className="font-medium">Contact Email:</span> {productDetails.user.email }
              </div>
              <div>
                <span className="font-medium">Tags:</span> 
                <span className="ml-1">
                   {productDetails?.tags?.map((tag: string, i: number) => (
          <span 
            key={i}
            className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs mr-1"
          >
            {tag}
          </span>
        ))}

                </span>
              </div>
          
            </div>
          </div>
        </div>

        {/* RIGHT - Category Section (Compact) */}
        <div className="bg-white shadow-sm border border-neutral-200 rounded-xl p-4 h-fit">
  <h2 className="text-base font-semibold mb-3 border-b border-[#39B54A] w-1/2 pb-2">
    Categories
  </h2>

  {/* Show only 6 items' height by default */}
  <div className="space-y-2 text-sm max-h-[360px] overflow-y-auto scrollbar-hide">
    {category.map((cat) => (
      <div
        key={cat.id}
        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <span className="text-gray-700">{cat.name}</span>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
          {cat.products_count}
        </span>
      </div>
    ))}
  </div>
</div>

      </div>

      {/* TABS SECTION */}
      <div className="mt-10 border border-neutral-200 rounded-lg bg-white">
        <div className="flex border-b overflow-x-auto">
          {["description", "additional info", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap ${
                activeTab === tab
                  ? "text-[#39B54A] border-b-2 border-[#39B54A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 text-sm text-gray-700">
          {activeTab === "description" && (
            <>
              <div>
                <h3 className="font-semibold mb-2 text-red-600">
                  WARNING AND SAFETY TIPS:
                </h3>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  <li>Avoid purchasing unverified goods</li>
                  <li>Meet safely in public for delivery</li>
                  <li>Double check seller reputation</li>
                  <li>Inspect product before payment</li>
                  <li>We are not directly connecting the payment</li>
                </ul>
              </div>
            </>
          )}
          {activeTab === "additional info" && (
            <p>Additional information about product packaging and care.</p>
          )}
          {activeTab === "reviews" && (
            <p>No reviews yet. Be the first to leave one!</p>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Related Products</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {allProducts.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/product/${item.id}`)}
              className="cursor-pointer border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-sm">
                <p className="font-medium line-clamp-2">{item.name}</p>
                <p className="text-[#39B54A] font-semibold mt-1">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}