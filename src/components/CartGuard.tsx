"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart";

export function CartGuard() {
  const { data: session, status } = useSession();

  // On login: load cart from DB
  useEffect(() => {
    if (status === "loading") return;
    const currentId = session?.user?.id ?? null;
    if (!currentId || session?.user?.role !== "CLIENT") return;
    if (useCart.getState().userId === currentId) return;

    fetch("/api/cart")
      .then((r) => r.json())
      .then(({ items }: { items: { menuItemId: string; quantity: number; name: string; price: number; imageUrl?: string | null }[] }) => {
        useCart.getState().setCart(
          currentId,
          items.map((i) => ({ id: i.menuItemId, name: i.name, price: i.price, quantity: i.quantity, imageUrl: i.imageUrl }))
        );
      });
  }, [session?.user?.id, status]);

  // On cart change: sync to DB (debounced 400ms)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = useCart.subscribe((state, prev) => {
      if (!state.userId || state.items === prev.items) return;
      if (session?.user?.role !== "CLIENT") return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: state.items.map(({ id, quantity }) => ({
              menuItemId: id,
              quantity,
            })),
          }),
        });
      }, 400);
    });
    return () => { unsubscribe(); clearTimeout(timer); };
  }, []);

  return null;
}
