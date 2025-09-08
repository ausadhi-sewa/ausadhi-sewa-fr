import { useAppDispatch } from '../../utils/hooks';
import { openCart } from '../../features/cart/cartSlice';
import { useCart } from '../../utils/hooks/useCart';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartIcon() {
  const dispatch = useAppDispatch();
  const { totalItems } = useCart();

  const handleCartClick = () => {
    dispatch(openCart());
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative border-2 border-medical-green-600 rounded-full  p-4 text-medical-green-600 hover:text-medical-green-700 hover:bg-medical-green-50 transition-colors duration-300"
      onClick={handleCartClick}
    >
      <ShoppingCart className="w-10 h-10  text-black" />
      <span className="text-sm text-black">Cart</span>
      {totalItems > 0 && (  
        <span className="absolute -top-3 -right-3 bg-medical-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  );
} 