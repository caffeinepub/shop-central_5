import { Link } from '@tanstack/react-router';
import { ShoppingCart, Clock, Package } from 'lucide-react';
import { Product, DeliveryType } from '../backend';
import { useAddToCart } from '../hooks/useCart';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

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
      return <Clock className="h-3 w-3" />;
    case DeliveryType.takeaway:
      return <Package className="h-3 w-3" />;
    default:
      return null;
  }
};

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(1) });
  };

  const imageUrl = imageError || !product.imageUrl 
    ? '/assets/generated/product-placeholder.dim_400x400.png' 
    : product.imageUrl;

  const isOutOfStock = Number(product.stockQuantity) === 0;

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id.toString() }}
      className="group block bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-border"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-serif font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getDeliveryTypeIcon(product.deliveryType)}
              <span>{getDeliveryTypeLabel(product.deliveryType)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₹{Number(product.price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || isOutOfStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
              isOutOfStock
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            } disabled:opacity-50`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isOutOfStock ? 'Out of Stock' : addToCart.isPending ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
        {!isOutOfStock && (
          <p className="text-xs text-muted-foreground">
            {Number(product.stockQuantity)} in stock
          </p>
        )}
      </div>
    </Link>
  );
}
