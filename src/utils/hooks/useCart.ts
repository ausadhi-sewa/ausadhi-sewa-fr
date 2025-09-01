import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  addToGuestCart, 
  updateGuestCartItemQuantity, 
  removeFromGuestCart, 
  clearGuestCart,
  loadGuestCart,
  setCurrentUserId,
  fetchUserCart,
  addToUserCart,
  updateUserCartItemQuantity,
  removeFromUserCart,
  clearUserCart,
  setAuthenticated,
  clearError,
} from '../../features/cart/cartSlice';
import type { Product } from '../../api/productApi';
import { cartStorage } from '../cartStorage';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { 
    items, 
    isOpen, 
    loading, 
    error, 
    isAuthenticated, 
    lastSynced,
    currentUserId
  } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  // Initialize cart based on authentication status
  useEffect(() => {
    if (user && !isAuthenticated) {
      // User is authenticated but cart is not synced
      console.log('🔄 [CART HOOK] User authenticated, syncing cart from backend');
      dispatch(setAuthenticated(true));
      dispatch(setCurrentUserId(user.id));
      
      // Get guest cart items
      const guestCartItems = cartStorage.getGuestCartItemsForTransfer();
      
      if (guestCartItems.length > 0) {
        console.log('🔄 [CART HOOK] Transferring', guestCartItems.length, 'guest cart items to user cart');
        
        // Transfer each guest item to user cart (backend will handle duplicates)
        guestCartItems.forEach(item => {
          dispatch(addToUserCart({ 
            productId: item.productId, 
            quantity: item.quantity 
          }));
        });
        
        // Clear guest cart after successful transfer
        cartStorage.clearGuestCart();
      } else {
        console.log('🔄 [CART HOOK] No guest cart items, fetching user cart from database');
        dispatch(fetchUserCart());
      }
    } else if (!user && isAuthenticated) {
      // User logged out, clear cart state and switch to guest cart
      console.log('🔄 [CART HOOK] User logged out, switching to guest cart');
      dispatch(setAuthenticated(false));
      dispatch(setCurrentUserId(null));
      dispatch(clearUserCart()); // Clear Redux state
      dispatch(loadGuestCart()); // Load guest cart from localStorage
    } else if (!user && !isAuthenticated && items.length === 0) {
      // No user and no items, load guest cart from localStorage
      console.log('🔄 [CART HOOK] Loading guest cart from localStorage');
      dispatch(loadGuestCart());
    }
  }, [user, isAuthenticated, dispatch, items.length, currentUserId]);

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