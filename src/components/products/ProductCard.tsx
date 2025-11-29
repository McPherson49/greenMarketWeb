"use client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { GrView } from "react-icons/gr";

export type Product = {
  id: number;
  name: string;
  tag?: string;
  price: string;
  unit?: string;
  vendor?: string;
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-xl border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-sm">
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
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
            <Star className="size-3 fill-current" /> 4.8
          </span>
        </div>

        {/* Vendor + Unit */}
        <div className="text-xs text-neutral-500">
          {product.vendor} {product.unit ? `• ${product.unit}` : null}
        </div>

        {/* Price + View Button */}
        <div className="flex justify-between items-center gap-2">
          <div className="text-sm font-semibold text-[#E4130C]">
            &#8358;{product.price}
          </div>

          {/* VIEW BUTTON AS LINK */}
          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-[#39B54A] px-3 py-1.5 text-sm text-white hover:bg-emerald-700 transition-colors"
          >
            <GrView className="size-4" /> View
          </Link>
        </div>
      </div>
    </div>
  );
}
