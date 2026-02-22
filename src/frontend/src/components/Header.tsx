import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Menu, Plus } from 'lucide-react';
import LoginButton from './LoginButton';
import CartBadge from './CartBadge';
import SearchBar from './SearchBar';
import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useUserRole';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  const categories = [
    { value: undefined, label: 'All' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'food', label: 'Food' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/generated/logo.dim_200x80.png"
              alt="Shop Central"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {categories.map((category) => (
              <Link
                key={category.label}
                to="/"
                search={{ category: category.value }}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {category.label}
              </Link>
            ))}
            {identity && isAdmin && (
              <Link
                to="/admin/create-product"
                className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <SearchBar />
            </div>
            <button
              onClick={() => navigate({ to: '/cart' })}
              className="relative p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6 text-foreground" />
              <CartBadge />
            </button>
            <LoginButton />
            <button
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.label}
                to="/"
                search={{ category: category.value }}
                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.label}
              </Link>
            ))}
            {identity && isAdmin && (
              <Link
                to="/admin/create-product"
                className="flex items-center py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
