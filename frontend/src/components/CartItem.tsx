import React from 'react';
import { Trash2 } from 'lucide-react';
import { Product } from '../backend';
import { useRemoveFromCart, useUpdateCartQuantity } from '../hooks/useCart';
import QuantitySelector from './QuantitySelector';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  product: Product;
  quantity: number;
}

export default function CartItem({ product, quantity }: CartItemProps) {
  const removeFromCartMutation = useRemoveFromCart();
  const updateQuantityMutation = useUpdateCartQuantity();

  const handleIncrease = () => {
    updateQuantityMutation.mutate({
      productId: product.id,
      newQuantity: BigInt(quantity + 1),
    });
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      removeFromCartMutation.mutate(product.id);
    } else {
      updateQuantityMutation.mutate({
        productId: product.id,
        newQuantity: BigInt(quantity - 1),
      });
    }
  };

  const handleRemove = () => {
    removeFromCartMutation.mutate(product.id);
  };

  const itemTotal = Number(product.price) * quantity;
  const isLoading = removeFromCartMutation.isPending || updateQuantityMutation.isPending;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              '/assets/generated/product-placeholder.dim_400x400.png';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          ₹{Number(product.price).toLocaleString('en-IN')} each
        </p>

        <div className="flex items-center justify-between">
          <QuantitySelector
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            min={1}
            max={Number(product.stockQuantity)}
            disabled={isLoading}
          />
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-sm">
              ₹{itemTotal.toLocaleString('en-IN')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={isLoading}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
