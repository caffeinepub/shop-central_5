import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShoppingCart, Clock, Package } from 'lucide-react';
import { useGetProduct } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import QuantitySelector from '../components/QuantitySelector';
import { useState } from 'react';
import { DeliveryType } from '../backend';

const getDeliveryTypeLabel = (deliveryType: DeliveryType): string => {
  switch (deliveryType) {
    case DeliveryType.oneHourDelivery:
      return '1-hour delivery';
    case DeliveryType.takeaway:
      return 'Takeaway';
    default:
      return '';
  }
};

const getDeliveryTypeIcon = (deliveryType: DeliveryType) => {
  switch (deliveryType) {
    case DeliveryType.oneHourDelivery:
      return <Clock className="h-5 w-5" />;
    case DeliveryType.takeaway:
      return <Package className="h-5 w-5" />;
    default:
      return null;
  }
};

export default function ProductDetail() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-32"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-muted-foreground">Product not found</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-4 text-primary hover:underline"
        >
          Return to catalog
        </button>
      </div>
    );
  }

  const imageUrl = imageError || !product.imageUrl 
    ? '/assets/generated/product-placeholder.dim_400x400.png' 
    : product.imageUrl;

  const isOutOfStock = Number(product.stockQuantity) === 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to catalog</span>
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted border border-border">
          <img
            src={imageUrl}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {getDeliveryTypeIcon(product.deliveryType)}
                <span>{getDeliveryTypeLabel(product.deliveryType)}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary">₹{Number(product.price).toFixed(2)}</p>
          </div>

          <div className="border-t border-b border-border py-6">
            <p className="text-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            {isOutOfStock ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive font-medium">Out of Stock</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This product is currently unavailable
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {Number(product.stockQuantity)} in stock
                  </p>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-foreground">Quantity:</label>
                    <QuantitySelector
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      max={Number(product.stockQuantity)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg disabled:opacity-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{addToCart.isPending ? 'Adding to Cart...' : 'Add to Cart'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
