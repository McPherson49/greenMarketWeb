import { Product } from "@/components/products/ProductCard";
import Home from "../components/home/Home";
import { Tags, Leaf } from "lucide-react";
import BlogSection from "@/components/blog/BlogSection";
import Newsletter from "@/components/newsletter/Newsletter";

type Category = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categories: Category[] = [
  { label: "Agricultural", icon: Leaf },
  { label: "Construction", icon: Tags },
  { label: "Farm machinery", icon: Tags },
  { label: "Feed", icon: Tags },
  { label: "Fish & Aquatic", icon: Tags },
  { label: "Fruit", icon: Tags },
  { label: "Fresh Vegetables", icon: Tags },
  { label: "Garden Tools", icon: Tags },
  { label: "Grain", icon: Tags },
  { label: "Livestock", icon: Tags },
  { label: "Mushrooms", icon: Tags },
  { label: "Nuts & Kernel", icon: Tags },
  { label: "Organic", icon: Tags },
  { label: "Poultry", icon: Tags },
  { label: "Processed food", icon: Tags },
  { label: "Spices", icon: Tags },
  { label: "Seeds & Bulbs", icon: Tags },
  { label: "Tuber", icon: Tags },
  { label: "Meat & Animal", icon: Tags },
];

const products: Product[] = [
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
      "https://escrow.greenmarket.com.ng/storage/products/gUDMNW4kNs74NyhENU5w34H9GUbXzJMewSFLp9hr.png",
  },
  {
    id: 3,
    name: "Smoked Fish",
    tag: "Fresh",
    price: "₦1250",
    unit: "1kg",
    vendor: "By SeaFresh",
    image:
      "https://escrow.greenmarket.com.ng/storage/products/zYz6ZbrGybMBevmQITwKKhjoxlsuJJNpsCWBtEdi.jpg",
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
  {
    id: 5,
    name: "Pigeon Local Variant",
    tag: "Sale",
    price: "₦1250",
    unit: "2x",
    vendor: "By Aviary",
    image:
      "https://escrow.greenmarket.com.ng/storage/products/zYz6ZbrGybMBevmQITwKKhjoxlsuJJNpsCWBtEdi.jpg",
  },
  {
    id: 6,
    name: "Fresh Spinach",
    tag: "Leaf",
    price: "₦1250",
    unit: "4 bunches",
    vendor: "By Neofolia",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Fresh Tomato",
    price: "₦1250",
    unit: "1kg",
    vendor: "By RedFarm",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Cucumber",
    price: "₦2500",
    unit: "2kg",
    vendor: "By GreenFarm",
    image:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Iceberg Lettuce",
    price: "₦1250",
    unit: "1 head",
    vendor: "By Leafy",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    name: "Fresh Pineapple",
    price: "₦1250",
    unit: "2 pcs",
    vendor: "By Tropica",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=1200&auto=format&fit=crop",
  },
];

const blogPosts = [
  {
    id: "1",
    category: "LIVESTOCKS",
    image: "/assets/blog1.png",
    title: "Livestock Tips & Best Practices",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "Basäm",
    date: "3 Nov 2025",
  },
  {
    id: "2",
    category: "UNCATEGORIZED",
    image: "/assets/blog2.png",
    title: "Agro-Business & Entrepreneurship",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "sinan",
    date: "3 Nov 2025",
  },
  {
    id: "3",
    category: "FISHERY",
    image: "/assets/blog3.png",
    title: "Success Stories & Fishermen Spotlight",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "Basäm",
    date: "3 Nov 2025",
  },
  {
    id: "4",
    category: "FRUITS",
    image: "/assets/blog4.png",
    title: "Market Trends & Prices",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "sinan",
    date: "3 Nov 2025",
  },
];

export default function IndexPage() {
  return (
    <main className="w-full">
      <div className="container mt-10 max-w-7xl mx-auto">
        <Home products={products} categories={categories} />
      </div>

      <BlogSection posts={blogPosts} />
      <Newsletter />
    </main>
  );
}
