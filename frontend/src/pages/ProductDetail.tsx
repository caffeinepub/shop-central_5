import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShoppingCart, Clock, Store, Package, Loader2 } from 'lucide-react';
import { useGetProduct } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { DeliveryType } from '../backend';
import QuantitySelector from '../components/QuantitySelector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProduct(BigInt(productId));
  const addToCartMutation = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">Product not found.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          Back to Menu
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === BigInt(0);
  const deliveryLabel =
    product.deliveryType === DeliveryType.oneHourDelivery ? '1-Hour Delivery' : 'Takeaway';
  const DeliveryIcon = product.deliveryType === DeliveryType.oneHourDelivery ? Clock : Store;

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      { productId: product.id, quantity: BigInt(quantity) },
      { onSuccess: () => navigate({ to: '/cart' }) }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-6 gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="aspect-square bg-gray-50 overflow-hidden">
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

            {/* Product Info */}
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900 font-heading">{product.name}</h1>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 shrink-0 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <DeliveryIcon className="w-3.5 h-3.5" />
                    {deliveryLabel}
                  </Badge>
                </div>

                <p className="text-3xl font-bold text-gray-900 mb-4">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </p>

                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Package className="w-4 h-4" />
                  <span>
                    {isOutOfStock
                      ? 'Out of stock'
                      : `${Number(product.stockQuantity)} items available`}
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              {!isOutOfStock && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <QuantitySelector
                      quantity={quantity}
                      onIncrease={() =>
                        setQuantity((q) => Math.min(q + 1, Number(product.stockQuantity)))
                      }
                      onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
                      min={1}
                      max={Number(product.stockQuantity)}
                    />
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {addToCartMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart — ₹{(Number(product.price) * quantity).toLocaleString('en-IN')}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {isOutOfStock && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 font-medium">This item is currently out of stock</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
