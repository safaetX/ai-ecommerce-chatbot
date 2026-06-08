"use client";

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const CATEGORIES = [
  { value: "", label: "All Products", count: 20 },
  { value: "t-shirt", label: "T-Shirts", count: 12 },
  { value: "pants", label: "Pants", count: 8 },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function CategorySidebar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceChange,
}: CategorySidebarProps) {
  return (
    <aside className="w-64 shrink-0 flex flex-col gap-6">

      {/* Search */}
      <div>
        <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5">
          Search
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Categories */}
      <div>
        <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5">
          Category
        </label>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${
                selectedCategory === cat.value
                  ? "bg-white text-zinc-950 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-xs font-medium ${
                selectedCategory === cat.value ? "text-zinc-500" : "text-zinc-700"
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Price range */}
      <div>
        <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5">
          Price Range
        </label>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-white font-medium">৳{priceRange[0].toLocaleString()}</span>
          <span className="text-zinc-700">—</span>
          <span className="text-sm text-white font-medium">৳{priceRange[1].toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] text-zinc-600 mb-1 block">Min</label>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
              className="w-full accent-white cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-600 mb-1 block">Max</label>
            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Sizes */}
      <div>
        <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5">
          Available Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              className="w-10 h-10 rounded-xl border border-white/8 text-zinc-400 text-xs font-semibold hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-150"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          onCategoryChange("");
          onSearchChange("");
          onPriceChange([0, 10000]);
        }}
        className="mt-2 w-full py-2.5 rounded-xl border border-white/8 text-xs font-medium text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-150"
      >
        Reset Filters
      </button>
    </aside>
  );
}
