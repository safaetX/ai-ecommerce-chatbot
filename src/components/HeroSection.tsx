import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-400 font-medium tracking-wide">New Summer Collection</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mb-6">
          Wear the
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-400">
            difference.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
          Premium athletic wear engineered for performance. T-shirts and pants built for movement, refined for everyday life.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-semibold text-sm px-8 py-3.5 rounded-xl hover:bg-zinc-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Shop Collection
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/products?category=t-shirt"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-zinc-300 font-medium text-sm px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            Browse T-Shirts
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-20 flex items-center justify-center gap-12 sm:gap-16">
          {[
            { value: "20+", label: "Products" },
            { value: "S–XXL", label: "Size Range" },
            { value: "3", label: "Top Brands" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
