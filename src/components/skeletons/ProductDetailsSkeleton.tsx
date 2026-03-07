"use client";
import React from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto max-w-7xl lg:px-0 px-4 py-10 animate-pulse">
      {/* Top Section */}
      <div className="grid lg:grid-cols-[1fr_1.5fr_0.8fr] gap-8 mb-12">
        {/* Image */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200" />
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 rounded-md bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="w-24 h-6 bg-gray-200 rounded-full" />
          <div className="w-3/4 h-8 bg-gray-200 rounded" />
          <div className="w-32 h-6 bg-gray-200 rounded" />
          <div className="w-24 h-8 bg-gray-200 rounded" />

          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-4/5 h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-4 bg-gray-200 rounded" />
          </div>

          <div className="flex gap-3 pt-4">
            <div className="w-24 h-10 bg-gray-200 rounded-md" />
            <div className="w-32 h-10 bg-gray-200 rounded-md" />
            <div className="w-36 h-10 bg-gray-200 rounded-md" />
          </div>

          <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="w-32 h-5 bg-gray-200 rounded mb-3" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <div className="w-32 h-6 bg-gray-200 rounded mb-3" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex justify-between bg-gray-50 px-3 py-2 rounded-md mb-2"
            >
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-4 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border border-gray-300 rounded-lg bg-white">
        <div className="flex border-b">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-5 py-3">
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="p-6">
          <div className="w-48 h-5 bg-gray-200 rounded mb-3" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3/4 h-4 bg-gray-200 rounded mb-2 ml-6" />
          ))}
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <div className="w-48 h-6 bg-gray-200 rounded mb-4" />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-300 rounded-xl overflow-hidden">
              <div className="h-48 bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
