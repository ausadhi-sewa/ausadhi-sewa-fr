import React from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { closeCart, removeFromCart, updateQuantity, clearCart } from '../../features/cart/cartSlice';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  Package,
  CreditCard
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.product.discountPrice || item.product.price);
    return sum + (price * item.quantity);
  }, 0);

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log('Proceeding to checkout...');
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-medical-green-600" />
                <DrawerTitle className="text-xl font-bold text-neutral-800">
                  Shopping Cart
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="text-neutral-600">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">Your cart is empty</h3>
                <p className="text-neutral-500">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-neutral-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.profileImgUrl ? (
                          <img
                            src={item.product.profileImgUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-neutral-800 text-sm mb-1 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-neutral-600 mb-2">
                          SKU: {item.product.sku}
                        </p>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-medical-green-600">
                            ₹{item.product.discountPrice || item.product.price}
                          </span>
                          {item.product.discountPrice && (
                            <span className="text-sm text-neutral-400 line-through">
                              ₹{item.product.price}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <Badge variant="secondary" className="min-w-[2rem] justify-center">
                            {item.quantity}
                          </Badge>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <>
              <Separator />
              <DrawerFooter>
                <div className="space-y-4">
                  {/* Cart Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Subtotal ({totalItems} items):</span>
                      <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Shipping:</span>
                      <span className="font-semibold text-medical-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-medical-green-600">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <LiquidButton 
                      className="w-full h-12 text-black rounded-lg backdrop:bg-medical-green-100"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </LiquidButton>
                    
                    <Button
                      variant="outline"
                      className="w-full h-10"
                      onClick={handleClearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
} 