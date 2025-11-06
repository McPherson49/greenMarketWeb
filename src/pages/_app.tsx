import { useState } from "react";
import type { AppProps } from "next/app";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { ChevronRight, Tags, Leaf } from "lucide-react";
import "@/styles/globals.css";
import Link from "next/link";
import { FaX } from "react-icons/fa6";

type Category = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  image?: string;
  link: string;
};

const categories: Category[] = [
  { label: "Agrochemical", link: "/shop?category=all", image: "/assets/fertilizers.png" },
  { label: "Extension services", link: "/shop?category=vegetables", image: "/assets/extention.png" },
  { label: "Farm machinery", link: "/shop?category=all", image: "/assets/tractor.png" },
  { label: "Feed", link: "/shop?category=grains", image: "/assets/seed-bag.png" },
  { label: "Fish & Aquatic", link: "/shop?category=fish", image: "/assets/fish.png" },
  { label: "Fruit", link: "/shop?category=fruits", image: "/assets/fruits.png" },
  { label: "Fresh Vegetables", link: "/shop?category=wdcdc", image: "/assets/kale.png" },
  { label: "Garden Tools", link: "/shop?category=all", image: "/assets/wheelbarrow.png" },
  { label: "Grain", link: "/shop?category=grain", image: "/assets/wheat.png" },
  { label: "Livestock", link: "/shop?category=poultry", image: "/assets/livestock.png" },
  { label: "Mushrooms & Truffles", link: "/shop?category=vegetables", image: "/assets/mushroom.png" },
  { label: "Nuts & Kernel", link: "/shop?category=grains", image: "/assets/peanuts.png" },
  { label: "Organic", link: "/shop?category=fruits", image: "/assets/organic.png" },
  { label: "Ornamental Plant", link: "/shop?category=vegetables", image: "/assets/potted-plant.png" },
  { label: "Poultry", link: "/shop?category=poultry", image: "/assets/poultry.png" },
  { label: "Processed food", link: "/shop?category=jhcsc", image: "/assets/take-away-food.png" },
  { label: "Plant Seed & Bulbs", link: "/shop?category=vegetables", image: "/assets/seed-packet.png" },
  { label: "Tuber", link: "/shop?category=vegetables", image: "/assets/potato.png" },
  { label: "Plant & Animal Oil", link: "/shop?category=all", image: "/assets/oil-massage.png" },
  { label: "Legumes", link: "/shop?category=ihewcqec", image: "/assets/cashew.png" },
];

function CategoryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99998]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute inset-y-0 left-0 w-[85vw] max-w-md bg-white border-r border-neutral-200 shadow-xl flex flex-col">
        {/* Header - fixed height */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 shrink-0">
          <div className="font-bold text-lg">
            <Image
              src={"/assets/logo.svg"}
              width={100}
              height={100}
              priority
              alt="Greenmarket Logo"
            />
          </div>
          <button
            aria-label="Close"
            className="inline-flex items-center justify-center rounded-md border border-[#39B54A] p-2"
            onClick={onClose}
          >
            <FaX className="text-[#39B54A]" />
          </button>
        </div>
        
        {/* Content area - flexible */}
        <div className="flex flex-col flex-1 min-h-0">
          <h3 className="px-4 py-3 text-sm font-semibold text-neutral-800 shrink-0">
            Browse All Categories
          </h3>
          
          {/* Scrollable nav */}
          <nav className="flex-1 divide-y divide-neutral-200 overflow-y-auto overflow-x-hidden pb-10">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.link}
                className="flex items-center justify-between px-4 py-3 hover:bg-emerald-50"
              >
                <span className="flex items-center gap-2">
                  <span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-100 shrink-0">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.label}
                        width={70}
                        height={70}
                        className="object-contain"
                      />
                    ) : c.icon ? (
                      <c.icon className="" />
                    ) : null}
                  </span>
                  <span className="text-sm">{c.label}</span>
                </span>
                <ChevronRight className="size-4 text-neutral-400 shrink-0" />
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
export default function App({ Component, pageProps }: AppProps) {
  const [catOpen, setCatOpen] = useState(false);

  return (
    <>
      <Header onOpenCategories={() => setCatOpen(true)} />
      <CategoryDrawer open={catOpen} onClose={() => setCatOpen(false)} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
