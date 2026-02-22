import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useGetOrderHistory } from '../hooks/useCart';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { data: orderHistory } = useGetOrderHistory();

  const latestOrder = orderHistory?.orders[orderHistory.orders.length - 1];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <CheckCircle className="h-24 w-24 text-secondary mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {latestOrder && (
          <div className="bg-card rounded-lg border border-border p-6 space-y-4 text-left">
            <h2 className="text-2xl font-serif font-bold text-foreground">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-medium">#{latestOrder.id.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{latestOrder.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-primary">₹{Number(latestOrder.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{latestOrder.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-muted-foreground">
            You will receive an email confirmation shortly with your order details.
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
