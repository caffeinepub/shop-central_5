import React from 'react';
import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import { Heart, MapPin } from 'lucide-react';

export default function Layout() {
  const appId = encodeURIComponent(window.location.hostname || 'belur-store-app');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span>© {new Date().getFullYear()} All rights reserved.</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>
                  Store location: Belur, near Lalbaba College
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
