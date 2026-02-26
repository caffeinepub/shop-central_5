import React, { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { ShoppingCart, Menu, X, Plus } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CartBadge from './CartBadge';
import LoginButton from './LoginButton';
import { useIsCallerAdmin } from '../hooks/useUserRole';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  const navLinks = [
    { label: 'Shop', path: '/' },
    { label: 'Cart', path: '/cart' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate({ to: '/' })}
          >
            <img
              src="/assets/generated/logo.dim_200x80.png"
              alt="Shop Central"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path as '/' | '/cart' })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Admin: Add Product */}
            {isAuthenticated && isAdmin && (
              <button
                onClick={() => navigate({ to: '/admin/create-product' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/create-product')
                    ? 'bg-green-50 text-green-700'
                    : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {isAuthenticated && (
              <button
                onClick={() => navigate({ to: '/cart' })}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <CartBadge />
              </button>
            )}

            <LoginButton />

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate({ to: link.path as '/' | '/cart' });
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Admin: Add Product (mobile) */}
            {isAuthenticated && isAdmin && (
              <button
                onClick={() => {
                  navigate({ to: '/admin/create-product' });
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
