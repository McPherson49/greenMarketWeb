"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, X, ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { BsChatLeftText } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import Link from "next/link";
import { getProductDetails, getSimilarProducts } from "@/services/products";
import { getCategories } from "@/services/category";
import ApiFetcher from "@/utils/apis";
import ProductDetailsSkeleton from "@/components/skeletons/ProductDetailsSkeleton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Types ---
type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  color?: string;
  products_count: number;
};

type SimilarProduct = {
  id: number;
  title: string;
  price: number;
  price_range: { max: string; min: string };
  thumbnail: string;
  images: string[];
  business: { name: string; rating: number };
  user: { name: string };
  sub: string;
  tags: string[];
};

type SimilarProductsResponse = {
  current_page: number;
  data: SimilarProduct[];
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  path?: string;
};
export const dynamic = "force-dynamic";

// --- Loader Component ---
const PulseLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return <div className={`${sizes[size]} border-4 border-green-200 border-t-green-600 rounded-full animate-spin`}></div>;
};

// --- Image Viewer Component ---
const ImageViewer = ({ 
  images, 
  initialIndex, 
  isOpen, 
  onClose 
}: { 
  images: string[]; 
  initialIndex: number; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch(e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        goToPrev();
        break;
      case 'ArrowRight':
        goToNext();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen || !images.length) return null;

  return (
    <div className="fixed inset-0 z-99999 bg-black/95 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        aria-label="Close image viewer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeftCircle className="w-8 h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRightCircle className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main Image */}
      <div className="relative w-full max-w-5xl h-full max-h-[90vh]">
        <Image
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] py-2 px-4 bg-black/30 rounded-full">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                currentIndex === index 
                  ? "border-white scale-110" 
                  : "border-transparent hover:border-gray-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Pagination ---
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages: number[] = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50">
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md border text-sm font-medium ${currentPage === page ? "bg-green-600 text-white border-green-600" : "border-gray-300 hover:bg-gray-50"
            }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50">
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

// --- Helper Functions ---
const transformToSimilarProductsResponse = (data: any): SimilarProductsResponse => {
  if (!data) return { current_page: 1, data: [], last_page: 1, per_page: 10, total: 0 };
  return {
    current_page: data.current_page || 1,
    data: Array.isArray(data.data) ? data.data : [],
    last_page: data.last_page || 1,
    per_page: data.per_page || 10,
    total: data.total || 0,
    from: data.from,
    to: data.to,
    path: data.path
  };
};

const stripHtml = (html: string) => (html ? html.replace(/<[^>]*>?/gm, "") : "");
const getWordLimitedText = (text: string, limit = 50) => {
  const words = text.split(" ");
  return words.length <= limit ? text : words.slice(0, limit).join(" ");
};

// --- Main Component ---
export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  // --- States ---
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<any | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProductsResponse>({
    current_page: 1,
    data: [],
    last_page: 1,
    per_page: 10,
    total: 0
  });
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [currentSimilarPage, setCurrentSimilarPage] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [escrowDescription, setEscrowDescription] = useState("");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // --- Fetch Product & Categories ---
  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const categories = await getCategories();
        setCategory(categories || []);

        if (id) {
          const product = await getProductDetails(id as string);
          setProductDetails(product);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router.isReady, id]);

  // --- Fetch Similar Products ---
  useEffect(() => {
    if (!id) return;

    const fetchSimilarProducts = async () => {
      setLoadingSimilar(true);
      try {
        const similarData = await getSimilarProducts(Number(id), currentSimilarPage);
        const transformedData = transformToSimilarProductsResponse(similarData);
        setSimilarProducts(transformedData);
      } catch (error) {
        console.error("Error loading similar products:", error);
        setSimilarProducts({ current_page: 1, data: [], last_page: 1, per_page: 10, total: 0 });
      } finally {
        setLoadingSimilar(false);
      }
    };
    fetchSimilarProducts();
  }, [id, currentSimilarPage]);

  const handleSimilarPageChange = (page: number) => setCurrentSimilarPage(page);

  // --- Image Viewer Handlers ---
  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    document.body.style.overflow = 'unset'; // Re-enable scrolling
  };

  if (loading || !productDetails) return <ProductDetailsSkeleton />;

  // Get valid images
  const validImages = productDetails?.images?.filter((img: any) => typeof img === "string") || [];

  // --- Escrow Handlers ---
  const handleRequestEscrow = () => setShowEscrowModal(true);

  const submitEscrowRequest = async () => {
    if (!productDetails?.id) return;
    try {
      setEscrowLoading(true);
      await ApiFetcher.post(`/offers/${productDetails.id}`, {
        amount: productDetails.price,
        description: escrowDescription,
        quantity
      });

      setShowEscrowModal(false);
      setEscrowDescription("");

      toast.success("Escrow request sent successfully!", { autoClose: 2000, position: "top-right" });

      setTimeout(() => router.push("/profile?tab=escrow"), 2000);
    } catch (error) {
      console.error("Escrow request failed:", error);
      toast.error("Failed to submit escrow request", { autoClose: 3000, position: "top-right" });
    } finally {
      setEscrowLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl lg:px-0 px-4 py-10">
      <ToastContainer />

      {/* Image Viewer Modal */}
      <ImageViewer
        images={validImages}
        initialIndex={selectedImageIndex}
        isOpen={imageViewerOpen}
        onClose={closeImageViewer}
      />

      {/* TOP SECTION */}
      <div className="grid lg:grid-cols-[1fr_1.5fr_0.8fr] gap-8 mb-12">
        {/* LEFT - Product Images */}
        <div>
          {validImages[0] && (
            <div 
              className="relative aspect-square rounded-xl overflow-hidden border cursor-zoom-in group"
              onClick={() => openImageViewer(0)}
            >
              <Image
                src={validImages[0]}
                alt={productDetails.title || "Product Image"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  Click to enlarge
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            {validImages.map((img: string, i: number) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border hover:border-green-500 transition group"
                onClick={() => openImageViewer(i)}
              >
                <Image
                  src={img}
                  alt={`${productDetails.title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE - Product Info */}
        <div className="flex flex-col justify-start space-y-4">
          <span className="text-sm text-pink-500 font-medium bg-pink-100 px-3 py-1 rounded-full w-fit">{productDetails.sub || "Product"}</span>
          <h1 className="text-3xl font-semibold">{productDetails.title}</h1>
          <div className="flex items-center gap-2 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{productDetails.business?.rating || "0.0"}</span>
            <span className="text-gray-400 text-sm">({productDetails.reviews?.length || 0})</span>
          </div>
          <p className="text-3xl text-green-600 font-bold">₦{productDetails.price || "0"}</p>

          {/* --- Description Show More / Less --- */}
          {(() => {
            const plainText = stripHtml(productDetails.description || "");
            const words = plainText.split(" ");
            const shouldTruncate = words.length > 50;
            const displayedText = showFullDescription ? plainText : getWordLimitedText(plainText, 50);
            return (
              <div className="text-gray-600 leading-relaxed">
                <p>{displayedText}</p>
                {shouldTruncate && (
                  <button onClick={() => setShowFullDescription(!showFullDescription)} className="mt-2 text-green-600 text-sm font-medium hover:underline">
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            );
          })()}

          {/* Quantity + Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link href={"/message"} className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm">
              <BsChatLeftText size={18} /> Chat Seller
            </Link>

            <button onClick={handleRequestEscrow} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center gap-2 text-sm">
              <FaMoneyBillTransfer size={18} /> Request Escrow
            </button>
          </div>

          {/* Store Info */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-base mb-3 text-gray-800">Store Info</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div><span className="font-medium">Store Name:</span> {productDetails.business?.name || "N/A"}</div>
              <div><span className="font-medium">Location:</span> {productDetails.address || "N/A"}</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Contact Phone:</span>
                <div className="flex items-center gap-1">
                  {showPhoneNumber ? (
                    <span>{productDetails.phone || "N/A"}</span>
                  ) : (
                    <div className="relative">
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                        ••••••••••
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                    className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                    aria-label={showPhoneNumber ? "Hide phone number" : "Show phone number"}
                  >
                    {showPhoneNumber ? (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div><span className="font-medium">Contact Email:</span> {productDetails.user?.email || "N/A"}</div>
              <div>
                <span className="font-medium">Tags:</span>
                <span className="ml-1">{productDetails?.tags?.map((tag: string, i: number) => (
                  <span key={i} className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs mr-1">{tag}</span>
                )) || "No tags available"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Categories */}
        <div className="bg-white shadow-sm border border-neutral-200 rounded-xl p-4 h-fit">
          <h2 className="text-base font-semibold mb-3 border-b border-[#39B54A] w-1/2 pb-2">Categories</h2>
          <div className="space-y-2 text-sm max-h-90 overflow-y-auto scrollbar-hide">
            {category.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer">
                <span className="text-gray-700">{cat.name}</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{cat.products_count}</span>
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
              className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap ${activeTab === tab ? "text-[#39B54A] border-b-2 border-[#39B54A]" : "text-gray-500 hover:text-gray-700"
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
                <h3 className="font-semibold mb-2 text-red-600">WARNING AND SAFETY TIPS:</h3>
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
          {activeTab === "additional info" && <p>Additional information about product packaging and care.</p>}
          {activeTab === "reviews" && <p>No reviews yet. Be the first to leave one!</p>}
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Similar Products</h2>
        {loadingSimilar ? (
          <div className="flex justify-center items-center py-8">
            <PulseLoader size="lg" />
          </div>
        ) : similarProducts.data.length ? (
          <>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
              {similarProducts.data.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="relative w-full h-48">
                    {typeof item.images?.[0] === "string" && (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                    <p className="text-green-600 font-semibold">₦{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={similarProducts.current_page}
              totalPages={similarProducts.last_page}
              onPageChange={handleSimilarPageChange}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 py-8">No similar products found</p>
        )}
      </div>
      {/* --- Escrow Modal --- */}
      {showEscrowModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50 px-4"
          onClick={() => setShowEscrowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Request Escrow</h2>
            <div className="space-y-4 text-sm">

              {/* Amount Input */}
              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₦</span>
                  <input
                    type="text"
                    value={productDetails.price?.toLocaleString() || ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, "");
                      const newValue = numericValue.replace(/^0+/, "") || "";
                      setProductDetails({ ...productDetails, price: newValue ? Number(newValue) : undefined });
                    }}
                    className="w-full border rounded-md px-7 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block mb-1 font-medium">Quantity</label>
                <input
                  type="text"
                  value={quantity === 0 ? "" : quantity.toString()}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    const newQty = numericValue.replace(/^0+/, "") || "";
                    setQuantity(newQty ? Number(newQty) : 0);
                  }}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={escrowDescription}
                  onChange={(e) => setEscrowDescription(e.target.value)}
                  rows={4}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Add details for this escrow request..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEscrowModal(false)}
                className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitEscrowRequest}
                disabled={escrowLoading || !productDetails.price || !quantity}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {escrowLoading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}