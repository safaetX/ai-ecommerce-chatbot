"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!session) {
        setCartCount(0);
        return;
      }

      try {
        const res = await fetch("/api/cart");
        const data = await res.json();

        const count =
          data.cart?.items?.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          ) || 0;

        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [session]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-black tracking-tighter">
              T
            </span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            ThreadShop
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Shop", href: "/products" },
            { label: "T-Shirts", href: "/products?category=t-shirt" },
            { label: "Pants", href: "/products?category=pants" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">

          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg bg-white/5 border border-white/8 text-zinc-500 text-sm hover:border-white/15 hover:text-zinc-300 transition-all duration-150 w-44"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs">Search products…</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/8">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-medium text-zinc-300">
                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>

              <button
                onClick={() => signOut()}
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/8">
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-100 px-3.5 py-1.5 rounded-lg transition-all duration-150"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {menuOpen ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-1">
            {[
              { label: "Shop All", href: "/products" },
              { label: "T-Shirts", href: "/products?category=t-shirt" },
              { label: "Pants", href: "/products?category=pants" },
              { label: "Cart", href: "/cart" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 pt-3 border-t border-white/5 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg text-sm text-zinc-400 border border-white/10 hover:border-white/20 transition-all"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-100 transition-all"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}