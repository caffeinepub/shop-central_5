import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateProduct } from '../hooks/useProducts';
import { useIsCallerAdmin } from '../hooks/useUserRole';
import { ArrowLeft } from 'lucide-react';
import { Category, DeliveryType } from '../backend';

export default function CreateProduct() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const { data: isAdmin, isLoading: isLoadingRole } = useIsCallerAdmin();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: '',
    deliveryType: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'food', label: 'Food' }
  ];

  const deliveryTypes = [
    { value: 'oneHourDelivery', label: '1-hour delivery' },
    { value: 'takeaway', label: 'Takeaway' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!formData.stockQuantity.trim()) newErrors.stockQuantity = 'Stock quantity is required';
    else if (isNaN(Number(formData.stockQuantity)) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a non-negative number';
    }
    if (!formData.deliveryType) newErrors.deliveryType = 'Delivery type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      const product = await createProduct.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: BigInt(Math.round(Number(formData.price) * 100)),
        category: formData.category as Category,
        imageUrl: formData.imageUrl,
        stockQuantity: BigInt(formData.stockQuantity),
        deliveryType: formData.deliveryType as DeliveryType
      });

      setSuccessMessage('Product created successfully!');
      
      setTimeout(() => {
        navigate({ to: '/product/$productId', params: { productId: product.id.toString() } });
      }, 1500);
    } catch (error: any) {
      console.error('Create product error:', error);
      setErrors({ submit: error.message || 'Failed to create product' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoadingRole) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Access Denied</h1>
        <p className="text-xl text-muted-foreground mb-8">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Catalog
      </button>

      <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Create New Product</h1>

      {successMessage && (
        <div className="mb-6 p-4 bg-secondary/20 border border-secondary rounded-lg">
          <p className="text-secondary-foreground font-medium">{successMessage}</p>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 bg-destructive/20 border border-destructive rounded-lg">
          <p className="text-destructive font-medium">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-6 max-w-3xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Product Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.name ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.description ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Enter product description"
          />
          {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
              Price (INR) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.price ? 'border-destructive' : 'border-input'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.category ? 'border-destructive' : 'border-input'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="deliveryType" className="block text-sm font-medium text-foreground mb-2">
            Delivery Type *
          </label>
          <select
            id="deliveryType"
            name="deliveryType"
            value={formData.deliveryType}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.deliveryType ? 'border-destructive' : 'border-input'
            }`}
          >
            <option value="">Select delivery type</option>
            {deliveryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.deliveryType && <p className="text-sm text-destructive mt-1">{errors.deliveryType}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground mb-2">
            Image URL *
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.imageUrl ? 'border-destructive' : 'border-input'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl}</p>}
        </div>

        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-foreground mb-2">
            Stock Quantity *
          </label>
          <input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            value={formData.stockQuantity}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.stockQuantity ? 'border-destructive' : 'border-input'
            }`}
            placeholder="0"
          />
          {errors.stockQuantity && <p className="text-sm text-destructive mt-1">{errors.stockQuantity}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={createProduct.isPending}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
          >
            {createProduct.isPending ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
