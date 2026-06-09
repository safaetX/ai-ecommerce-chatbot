"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface CartItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
    category: string;
  };
  size: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.cart?.items || []);
      setLoading(false);
    };
    fetchCart();
  }, []);

  const removeItem = async (productId: string, size: string) => {
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, size }),
    });
    setItems((prev) => prev.filter((i) => !(i.productId._id === productId && i.size === size)));
  };

  const updateQuantity = async (
  productId: string,
  size: string,
  quantity: number
) => {
  if (quantity < 1) return;

  await fetch("/api/cart/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      size,
      quantity,
    }),
  });

  setItems((prev) =>
    prev.map((item) =>
      item.productId._id === productId &&
      item.size === size
        ? { ...item, quantity }
        : item
    )
  );
};

  const handleCheckout = async () => {
    setCheckingOut(true);
    await fetch("/api/checkout", { method: "POST" });
    setCheckingOut(false);
    setOrderPlaced(true);
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 150;
  const total = subtotal + shipping;

  if (orderPlaced) {
    return (
      <main className="bg-zinc-950 min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
            <svg className="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Order Placed!</h2>
          <p className="text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
            Your order has been confirmed. You'll receive a confirmation shortly.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-zinc-950 font-semibold text-sm px-7 py-3 rounded-xl hover:bg-zinc-100 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-950 min-h-screen">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-10">
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-1.5">Your</p>
            <h1 className="text-4xl font-black text-white tracking-tight">Shopping Cart</h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-2xl border border-white/5 h-28 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
              <p className="text-zinc-500 text-sm max-w-xs mb-8">Add some products to get started.</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-zinc-950 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-zinc-100 transition-all"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Items list */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={`${item.productId._id}-${item.size}`}
                    className="flex gap-4 bg-zinc-900 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-white text-sm leading-snug truncate">
                            {item.productId.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.productId._id, item.size)}
                            className="shrink-0 text-zinc-600 hover:text-red-400 transition-colors p-0.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                            {item.productId.category}
                          </span>
                          <span className="text-zinc-800">·</span>
                          <span className="text-xs font-medium text-zinc-500">Size {item.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId._id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-white text-sm"
                          >
                            -
                          </button>

                          <span className="text-xs font-semibold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId._id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="w-6 h-6 rounded bg-zinc-700 hover:bg-zinc-600 text-white text-sm"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-white text-sm">
                          ৳{(item.productId.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  href="/products"
                  className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-300 transition-colors mt-2 pt-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continue shopping
                </Link>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 sticky top-24">
                  <h2 className="font-semibold text-white mb-5 text-sm">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-emerald-400 font-medium" : "text-white font-medium"}>
                        {shipping === 0 ? "Free" : `৳${shipping}`}
                      </span>
                    </div>
                    {subtotal <= 3000 && (
                      <p className="text-[10px] text-zinc-600 leading-relaxed">
                        Add ৳{(3000 - subtotal).toLocaleString()} more for free shipping
                      </p>
                    )}
                  </div>

                  <div className="border-t border-white/5 mt-5 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-black text-white">৳{total.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="mt-6 w-full bg-white text-zinc-950 font-semibold text-sm py-3.5 rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {checkingOut ? "Placing order…" : "Place Order"}
                  </button>

                  <p className="text-[10px] text-zinc-700 text-center mt-3 leading-relaxed">
                    No real payment · Demo checkout only
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
