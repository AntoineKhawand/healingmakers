"use client";

import CartDrawer from "@/components/cart/CartDrawer";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
