import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, CheckCircle, MapPin } from 'lucide-react';
import { useGetCart } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { useCheckout } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { data: cart } = useGetCart();
  const { data: products = [] } = useGetAllProducts();
  const checkoutMutation = useCheckout();

  const [form, setForm] = useState<ShippingForm>({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  const cartItems = (cart?.items ?? []).map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? { product, quantity: Number(item.quantity) } : null;
  }).filter(Boolean) as { product: any; quantity: number }[];

  const total = Number(cart?.total ?? 0);

  const validate = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode.trim())) newErrors.pincode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    checkoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: '/order-confirmation' }),
    });
  };

  const handleChange = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/cart' })}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Checkout</h1>
        </div>

        {/* Store Location Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3.5 mb-6 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Store / Pickup Location</p>
            <p className="text-sm text-blue-700">
              Belur, near Lalbaba College
            </p>
            <p className="text-xs text-blue-500 mt-0.5">
              Packaged food, electronics &amp; daily needs — visit us at the above address.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Information</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={handleChange('name')}
                        placeholder="Your full name"
                        className={errors.name ? 'border-red-400' : ''}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        placeholder="10-digit mobile number"
                        className={errors.phone ? 'border-red-400' : ''}
                      />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={handleChange('address')}
                      placeholder="Street address, apartment, etc."
                      className={errors.address ? 'border-red-400' : ''}
                    />
                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={handleChange('city')}
                        placeholder="City"
                        className={errors.city ? 'border-red-400' : ''}
                      />
                      {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={form.pincode}
                        onChange={handleChange('pincode')}
                        placeholder="6-digit pincode"
                        className={errors.pincode ? 'border-red-400' : ''}
                      />
                      {errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={String(product.id)} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">
                        {product.name} × {quantity}
                      </span>
                      <span className="text-gray-900 font-medium shrink-0">
                        ₹{(Number(product.price) * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={checkoutMutation.isPending || cartItems.length === 0}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
