import { Trash2 } from 'lucide-react';
import { OrderItem } from '../backend';
import { useRemoveFromCart, useUpdateCartQuantity } from '../hooks/useCart';
import { useGetProduct } from '../hooks/useProducts';
import QuantitySelector from './QuantitySelector';
import { useState } from 'react';

interface CartItemProps {
  item: OrderItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { data: product } = useGetProduct(item.productId);
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-border">
        <div className="animate-pulse flex space-x-4 flex-1">
          <div className="rounded-lg bg-muted h-24 w-24"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (newQuantity: number) => {
    await updateQuantity.mutateAsync({
      productId: item.productId,
      newQuantity: BigInt(newQuantity)
    });
  };

  const handleRemove = async () => {
    await removeFromCart.mutateAsync(item.productId);
  };

  const imageUrl = imageError || !product.imageUrl 
    ? '/assets/generated/product-placeholder.dim_400x400.png' 
    : product.imageUrl;

  const itemTotal = Number(product.price) * Number(item.quantity);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-card rounded-lg border border-border">
      <img
        src={imageUrl}
        alt={product.name}
        onError={() => setImageError(true)}
        className="w-24 h-24 object-cover rounded-lg bg-muted"
      />
      <div className="flex-1 space-y-2">
        <h3 className="font-serif font-semibold text-lg text-foreground">{product.name}</h3>
        <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
        <p className="text-lg font-bold text-primary">₹{Number(product.price).toFixed(2)}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <QuantitySelector
          quantity={Number(item.quantity)}
          onQuantityChange={handleQuantityChange}
          max={Number(product.stockQuantity)}
        />
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold text-foreground">₹{itemTotal.toFixed(2)}</p>
        </div>
        <button
          onClick={handleRemove}
          disabled={removeFromCart.isPending}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
