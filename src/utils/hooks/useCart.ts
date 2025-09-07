

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  addToGuestCart, 
  updateGuestCartItemQuantity, 
  removeFromGuestCart, 
  clearGuestCart,
  addToUserCart,
  updateUserCartItemQuantity,
  removeFromUserCart,
  clearUserCart,
  clearError,
} from '../../features/cart/cartSlice';
import type { Product } from '../../api/productApi';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { 
    items, 
    isOpen, 
    loading, 
    error, 
    isAuthenticated, 
  } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  // Add item to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (isAuthenticated && user) {
      dispatch(addToUserCart({ productId: product.id, quantity }));
    } else {
      dispatch(addToGuestCart({ product, quantity }));
    }
  }, [dispatch, isAuthenticated, user]);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (isAuthenticated && user) {
      dispatch(updateUserCartItemQuantity({ itemId, quantity }));
    } else {
      dispatch(updateGuestCartItemQuantity({ id: itemId, quantity }));
    }
  }, [dispatch, isAuthenticated, user]);

  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    if (isAuthenticated && user) {
      dispatch(removeFromUserCart(itemId));
    } else {
      dispatch(removeFromGuestCart(itemId));
    }
  }, [dispatch, isAuthenticated, user]);

  // Clear cart
  const clearCart = useCallback(() => {
    if (isAuthenticated && user) {
      dispatch(clearUserCart());
    } else {
      dispatch(clearGuestCart());
    }
  }, [dispatch, isAuthenticated, user]);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // Check if cart is empty
  const isEmpty = items.length === 0;

  // Get item by product ID
  const getItem = useCallback((productId: string) => {
    return items.find(item => item.id === productId);
  }, [items]);

  // Check if product is in cart
  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  // Clear error
  const clearCartError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    items,
    isOpen,
    loading,
    error,
    isAuthenticated,
    isEmpty,
    totalItems,
    subtotal,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItem,
    isInCart,
    clearCartError,
  };
};