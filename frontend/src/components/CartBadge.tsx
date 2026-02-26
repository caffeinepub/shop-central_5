import React from 'react';
import { useGetCart } from '../hooks/useCart';

export default function CartBadge() {
  const { data: cart } = useGetCart();

  const totalItems = cart?.items?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
}
