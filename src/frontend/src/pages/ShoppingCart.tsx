import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useGetCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useGetCart();

  const isEmpty = !cart || cart.items.length === 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">Start shopping to add items to your cart</p>
          </div>
          <button
            onClick={() => navigate({ to: '/' })}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.productId.toString()} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 space-y-4 sticky top-24">
            <h2 className="text-2xl font-serif font-bold text-foreground">Order Summary</h2>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Items ({cart.items.length})</span>
                <span>₹{Number(cart.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">₹{Number(cart.total).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate({ to: '/checkout' })}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="w-full px-6 py-3 border border-input rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
