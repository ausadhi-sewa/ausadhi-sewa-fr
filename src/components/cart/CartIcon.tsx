import React from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { openCart } from '../../features/cart/cartSlice';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartIcon() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    dispatch(openCart());
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative h-10 w-10 p-0 text-medical-green-600 hover:text-medical-green-700 hover:bg-medical-green-50 transition-colors duration-300"
      onClick={handleCartClick}
    >
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-medical-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  );
} 