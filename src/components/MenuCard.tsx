"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { useT } from "@/lib/i18n";

interface MenuCardProps {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  imageUrl?: string | null;
  available: boolean;
}

export function MenuCard({
  id,
  name,
  description,
  price,
  category,
  imageUrl,
  available,
}: MenuCardProps) {
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const cartItem = useCart((s) => s.items.find((i) => i.id === id));
  const quantity = cartItem?.quantity ?? 0;
  const t = useT();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative h-48 bg-rose-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">
            🍰
          </div>
        )}
        <span className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm text-rose-600 text-xs font-medium px-2.5 py-1 rounded-full border border-rose-100">
          {category}
        </span>
        {!available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full">
              {t("menu.unavailable")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {name}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2 flex-1">
            {description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-rose-600 font-bold text-lg">
            ${price.toFixed(2)}
          </span>
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(id, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors font-bold text-lg"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold text-gray-800">{quantity}</span>
              <button
                onClick={() => updateQuantity(id, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>
          ) : (
            <button
              disabled={!available}
              onClick={() => addItem({ id, name, price, imageUrl })}
              className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("menu.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
