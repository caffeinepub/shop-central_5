import { useGetCart } from '../hooks/useCart';

export default function CartBadge() {
  const { data: cart } = useGetCart();

  const itemCount = cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  if (itemCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  );
}

