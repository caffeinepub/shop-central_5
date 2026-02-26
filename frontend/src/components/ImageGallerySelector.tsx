import React from 'react';
import { Check } from 'lucide-react';

const PRODUCT_IMAGES = [
  { url: '/assets/generated/biryani.dim_400x400.png', label: 'Biryani' },
  { url: '/assets/generated/dosa.dim_400x400.png', label: 'Dosa' },
  { url: '/assets/generated/gulab-jamun.dim_400x400.png', label: 'Gulab Jamun' },
  { url: '/assets/generated/paneer-tikka.dim_400x400.png', label: 'Paneer Tikka' },
  { url: '/assets/generated/samosas.dim_400x400.png', label: 'Samosas' },
  { url: '/assets/generated/product-placeholder.dim_400x400.png', label: 'Default' },
];

interface ImageGallerySelectorProps {
  selectedImage: string;
  onSelect: (url: string) => void;
}

export default function ImageGallerySelector({ selectedImage, onSelect }: ImageGallerySelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {PRODUCT_IMAGES.map((img) => {
        const isSelected = selectedImage === img.url;
        return (
          <button
            key={img.url}
            type="button"
            onClick={() => onSelect(img.url)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            aria-label={`Select ${img.label}`}
            aria-pressed={isSelected}
          >
            <img
              src={img.url}
              alt={img.label}
              className="w-full h-full object-cover"
            />
            {isSelected && (
              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                <div className="bg-blue-500 rounded-full p-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-0.5 truncate px-1">
              {img.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
