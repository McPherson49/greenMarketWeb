import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
import { BsChatLeftText } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";

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

  const product = allProducts.find((p) => p.id === Number(id)) || allProducts[0];

  const categories = [
    { name: "Agrochemical", count: 5 },
    { name: "Feed", count: 6 },
    { name: "Farm machinery", count: 7 },
    { name: "Fish & Aquatic", count: 12 },
    { name: "Fresh Fruit", count: 16 },
  ];

  const gallery = [
    product.image,
    "https://images.unsplash.com/photo-1604908176835-436e0a1ef0c5?q=80&w=600",
    "https://images.unsplash.com/photo-1580913428739-24653e3f9aa3?q=80&w=600",
    "https://images.unsplash.com/photo-1602524818963-5e9b2c6ab8d5?q=80&w=600",
  ];

  if (!router.isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl lg:px-0 px-4 py-10">
      {/* TOP SECTION */}
      <div className="grid lg:grid-cols-[1fr_1.5fr_0.8fr] gap-8 mb-12">
        {/* LEFT - Product Image */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden border">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Gallery thumbnails */}
          <div className="flex gap-3 mt-4">
            {gallery.map((img, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border hover:border-green-500 transition"
              >
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
            {product.tag || "Sale Off"}
          </span>

          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <div className="flex items-center gap-2 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">4.8</span>
            <span className="text-gray-400 text-sm">(32 reviews)</span>
          </div>

          <p className="text-3xl text-green-600 font-bold">{product.price}</p>

          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam rem
            officia, corrupti reiciendis minima nisi modi, quasi, odio minus
            dolore impedit fuga eum eligendi.
          </p>

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

            <button className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm">
              <BsChatLeftText size={18} /> Chat Seller
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center gap-2 text-sm">
              <FaMoneyBillTransfer size={18} /> Request Escrow
            </button>
          </div>

          {/* Store Info Card */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-base mb-3 text-gray-800">Store Info</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Store Name:</span> Linux Genesis
              </div>
              <div>
                <span className="font-medium">Location:</span> After Law School Bwa
              </div>
              <div>
                <span className="font-medium">Contact:</span> 070*****90
              </div>
              <div>
                <span className="font-medium">Tags:</span> 
                <span className="ml-1">
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs mr-1">
                    Rabbit
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    Livestock
                  </span>
                </span>
              </div>
              <div>
                <span className="font-medium">Stock:</span> 
                <span className="text-green-600 font-semibold ml-1">8 Items In Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Category Section (Compact) */}
        <div className="bg-white shadow-sm border border-neutral-200 rounded-xl p-4 h-fit">
          <h2 className="text-base font-semibold mb-3 border-b border-[#39B54A] w-1/2 pb-2">
            Categories
          </h2>
          <div className="space-y-2 text-sm">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                <span className="text-gray-700">{cat.name}</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                  {cat.count}
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
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ultricies malesuada leo, nec suscipit ligula maximus sed. In
                vitae elit ut lorem malesuada placerat.
              </p>
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