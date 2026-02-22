import { useSearch } from '@tanstack/react-router';
import { useGetAllProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function ProductCatalog() {
  const searchParams = useSearch({ strict: false }) as { category?: string; search?: string };
  const { data: products, isLoading } = useGetAllProducts();

  const filteredProducts = products?.filter((product) => {
    const matchesCategory = !searchParams.category || product.category === searchParams.category;
    const matchesSearch = !searchParams.search || 
      product.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      product.description.toLowerCase().includes(searchParams.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="w-full bg-muted">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Shop Central"
          className="w-full h-64 md:h-96 object-cover"
        />
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
            {searchParams.category || 'All Products'}
          </h1>
          {searchParams.search && (
            <p className="text-muted-foreground">
              Search results for "{searchParams.search}"
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

