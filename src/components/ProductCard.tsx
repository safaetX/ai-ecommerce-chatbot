"use client";

import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: { S: number; M: number; L: number; XL: number; XXL: number };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size: string) => void;
}

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState("");

  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock === 0;

  return (
    <div className="group relative flex flex-col bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/12 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40">

      {/* Image */}
      <div className="relative overflow-hidden aspect-4/3 bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        <div className="absolute top-3 left-3">
          <span className="inline-block bg-zinc-950/80 backdrop-blur-sm text-zinc-300 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/8">
            {product.category}
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
            <span className="bg-zinc-900 border border-white/10 text-zinc-400 text-xs font-medium px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-sm leading-snug truncate">
          {product.name}
        </h3>

        <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Sizes */}
        {!isOutOfStock && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {SIZES.map((size) => {
              const inStock = product.stock[size] > 0;

              return (
                <button
                  key={size}
                  disabled={!inStock}
                  onClick={() => inStock && setSelectedSize(size)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                    !inStock
                      ? "border-white/4 text-zinc-700 line-through cursor-not-allowed"
                      : selectedSize === size
                      ? "border-white text-white bg-white/10"
                      : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-white">
              ৳{product.price.toLocaleString()}
            </p>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => {
              if (!selectedSize) {
                alert("Please select a size");
                return;
              }

              onAddToCart?.(product, selectedSize);
            }}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-150 ${
              isOutOfStock
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-white text-zinc-950 hover:bg-zinc-100 active:scale-[0.97]"
            }`}
          >
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}