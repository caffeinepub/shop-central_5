import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        className="h-8 w-8 rounded-none border-r border-gray-200 hover:bg-gray-100"
      >
        <Minus className="w-3.5 h-3.5" />
      </Button>
      <span className="w-10 text-center text-sm font-medium text-gray-900 select-none">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
        className="h-8 w-8 rounded-none border-l border-gray-200 hover:bg-gray-100"
      >
        <Plus className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
