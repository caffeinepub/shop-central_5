import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, ShoppingBag, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { useGetOrderHistory } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { data: orderHistory, isLoading } = useGetOrderHistory();

  const latestOrder = orderHistory?.orders?.[orderHistory.orders.length - 1];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Loading order details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 font-heading mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-6">
            Thank you for your order. We'll prepare it right away!
          </p>

          {latestOrder && (
            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Order #{String(latestOrder.id)}
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium capitalize">
                  {String(latestOrder.status)}
                </span>
              </div>
              <Separator className="mb-3" />
              <div className="flex justify-between text-sm font-bold text-gray-900">
                <span>Total Paid</span>
                <span>₹{Number(latestOrder.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Pickup / Products Available At */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-left flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-800 mb-0.5">Products available at</p>
              <p className="text-sm text-blue-700">
                Belur, near Lalbaba College
              </p>
              <p className="text-xs text-blue-400 mt-0.5">
                Packaged food, electronics &amp; daily needs store.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate({ to: '/' })}
            className="w-full gap-2"
            size="lg"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
