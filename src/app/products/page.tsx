"use client";
import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: { S: number; M: number; L: number; XL: number; XXL: number };
}

type SortOption = "default" | "price-asc" | "price-desc" | "name";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sort, setSort] = useState<SortOption>("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery) result = result.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sort]);

  const handleAddToCart = async (product: Product, size: string) => {
    // Wire to your POST /api/cart/add
    await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, size, quantity: 1 }),
    });
  };

  return (
    <main className="bg-zinc-950 min-h-screen">
      <Navbar />

      {/* Page header */}
      <div className="pt-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-1.5">Collection</p>
            <h1 className="text-4xl font-black text-white tracking-tight">
              {selectedCategory === "t-shirt" ? "T-Shirts" : selectedCategory === "pants" ? "Pants" : "All Products"}
            </h1>
            {!loading && (
              <p className="text-zinc-500 text-sm mt-1.5">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-zinc-600 shrink-0">Sort by</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-zinc-900 border border-white/8 text-zinc-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-white/20 cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sm:hidden flex items-center gap-2 bg-zinc-900 border border-white/8 text-zinc-400 text-sm px-3 py-2 rounded-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-8">

          {/* Sidebar — desktop always visible, mobile as overlay */}
          <div className={`
            fixed sm:static inset-0 z-40 sm:z-auto
            ${sidebarOpen ? "flex" : "hidden sm:flex"}
            flex-col sm:block
          `}>
            {/* Mobile backdrop */}
            {sidebarOpen && (
              <div
                className="sm:hidden absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div className="relative sm:static bg-zinc-950 sm:bg-transparent w-72 sm:w-64 h-full sm:h-auto shrink-0 overflow-y-auto sm:overflow-visible ml-auto sm:ml-0 p-6 sm:p-0">
              <div className="flex items-center justify-between mb-6 sm:hidden">
                <span className="text-sm font-semibold text-white">Filters</span>
                <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CategorySidebar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
              />
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden animate-pulse">
                    <div className="aspect-4/3 bg-zinc-800" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-zinc-800 rounded-lg w-3/4" />
                      <div className="h-3 bg-zinc-800 rounded-lg" />
                      <div className="h-3 bg-zinc-800 rounded-lg w-1/2" />
                      <div className="h-9 bg-zinc-800 rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
                <p className="text-zinc-500 text-sm max-w-xs">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => { setSelectedCategory(""); setSearchQuery(""); setPriceRange([0, 10000]); }}
                  className="mt-6 px-5 py-2.5 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
