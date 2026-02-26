import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreateProduct } from '../hooks/useProducts';
import { useIsCallerAdmin } from '../hooks/useUserRole';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Category, DeliveryType } from '../backend';
import ImageGallerySelector from '../components/ImageGallerySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: Category | '';
  imageUrl: string;
  stockQuantity: string;
  deliveryType: DeliveryType | '';
}

export default function CreateProduct() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const createProductMutation = useCreateProduct();

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: '',
    deliveryType: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});
  const [success, setSuccess] = useState(false);

  const isAuthenticated = !!identity;

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Checking permissions...</span>
      </div>
    );
  }

  // Access control
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-8 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => navigate({ to: '/' })}>Go to Shop</Button>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductForm, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = 'Enter a valid price';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.imageUrl) newErrors.imageUrl = 'Please select an image';
    if (!form.stockQuantity.trim()) newErrors.stockQuantity = 'Stock quantity is required';
    else if (isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) < 0)
      newErrors.stockQuantity = 'Enter a valid stock quantity';
    if (!form.deliveryType) newErrors.deliveryType = 'Delivery type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createProductMutation.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        price: BigInt(Math.round(Number(form.price))),
        category: form.category as Category,
        imageUrl: form.imageUrl,
        stockQuantity: BigInt(Math.round(Number(form.stockQuantity))),
        deliveryType: form.deliveryType as DeliveryType,
      },
      {
        onSuccess: (product) => {
          setSuccess(true);
          setTimeout(
            () =>
              navigate({
                to: '/product/$productId',
                params: { productId: String(product.id) },
              }),
            1500
          );
        },
      }
    );
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-8 text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Created!</h2>
          <p className="text-gray-500">Redirecting to product page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 space-y-6">
            {/* Product Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => {
                  setForm((p) => ({ ...p, name: e.target.value }));
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="e.g. Basmati Rice 5kg"
                className={errors.name ? 'border-red-400' : ''}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => {
                  setForm((p) => ({ ...p, description: e.target.value }));
                  if (errors.description) setErrors((p) => ({ ...p, description: undefined }));
                }}
                placeholder="Describe the product..."
                rows={3}
                className={errors.description ? 'border-red-400' : ''}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, price: e.target.value }));
                    if (errors.price) setErrors((p) => ({ ...p, price: undefined }));
                  }}
                  placeholder="e.g. 299"
                  className={errors.price ? 'border-red-400' : ''}
                />
                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, stockQuantity: e.target.value }));
                    if (errors.stockQuantity) setErrors((p) => ({ ...p, stockQuantity: undefined }));
                  }}
                  placeholder="e.g. 50"
                  className={errors.stockQuantity ? 'border-red-400' : ''}
                />
                {errors.stockQuantity && (
                  <p className="text-xs text-red-500">{errors.stockQuantity}</p>
                )}
              </div>
            </div>

            {/* Category & Delivery Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => {
                    setForm((p) => ({ ...p, category: val as Category }));
                    if (errors.category) setErrors((p) => ({ ...p, category: undefined }));
                  }}
                >
                  <SelectTrigger className={errors.category ? 'border-red-400' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Category.food}>Food</SelectItem>
                    <SelectItem value={Category.electronics}>Electronics</SelectItem>
                    <SelectItem value={Category.clothing}>Clothing</SelectItem>
                    <SelectItem value={Category.books}>Books</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Delivery Type</Label>
                <Select
                  value={form.deliveryType}
                  onValueChange={(val) => {
                    setForm((p) => ({ ...p, deliveryType: val as DeliveryType }));
                    if (errors.deliveryType) setErrors((p) => ({ ...p, deliveryType: undefined }));
                  }}
                >
                  <SelectTrigger className={errors.deliveryType ? 'border-red-400' : ''}>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DeliveryType.oneHourDelivery}>1-Hour Delivery</SelectItem>
                    <SelectItem value={DeliveryType.takeaway}>Takeaway</SelectItem>
                  </SelectContent>
                </Select>
                {errors.deliveryType && (
                  <p className="text-xs text-red-500">{errors.deliveryType}</p>
                )}
              </div>
            </div>

            {/* Image Gallery Selector */}
            <div className="space-y-1.5">
              <Label>Product Image</Label>
              <ImageGallerySelector
                selectedImage={form.imageUrl}
                onSelect={(url) => {
                  setForm((p) => ({ ...p, imageUrl: url }));
                  if (errors.imageUrl) setErrors((p) => ({ ...p, imageUrl: undefined }));
                }}
              />
              {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
