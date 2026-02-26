import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Clock, Store, Package } from 'lucide-react';
import { Product, DeliveryType } from '../backend';
import { useAddToCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartMutation.mutate({ productId: product.id, quantity: BigInt(1) });
  };

  const isOutOfStock = product.stockQuantity === BigInt(0);

  const deliveryLabel =
    product.deliveryType === DeliveryType.oneHourDelivery ? '1-Hour Delivery' : 'Takeaway';
  const DeliveryIcon = product.deliveryType === DeliveryType.oneHourDelivery ? Clock : Store;

  const imageUrl = product.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png';

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer overflow-hidden group"
      onClick={() =>
        navigate({ to: '/product/$productId', params: { productId: String(product.id) } })
      }
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              '/assets/generated/product-placeholder.dim_400x400.png';
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/70 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="text-xs flex items-center gap-1 bg-white/90 text-gray-700 border border-gray-200"
          >
            <DeliveryIcon className="w-3 h-3" />
            {deliveryLabel}
          </Badge>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Package className="w-3 h-3" />
            <span>{Number(product.stockQuantity)} left</span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || addToCartMutation.isPending}
          className="w-full mt-3 gap-2"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4" />
          {addToCartMutation.isPending ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
