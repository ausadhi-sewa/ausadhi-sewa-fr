import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  addToGuestCart, 
  updateGuestCartItemQuantity, 
  removeFromGuestCart, 
  clearGuestCart,
  loadGuestCart,
  loadUserCartFromLocalStorage,
  persistUserCartToLocalStorage,
  setCurrentUserId,
  fetchUserCart,
  addToUserCart,
  updateUserCartItemQuantity,
  removeFromUserCart,
  clearUserCart,
  mergeGuestCart,
  setAuthenticated,
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
      dispatch(fetchUserCart());
    } else if (!user && isAuthenticated) {
      // User logged out, persist current cart to localStorage and switch to guest cart
      console.log('🔄 [CART HOOK] User logged out, persisting cart to localStorage');
      if (currentUserId && items.length > 0) {
        dispatch(persistUserCartToLocalStorage(currentUserId));
      }
      dispatch(setAuthenticated(false));
      dispatch(setCurrentUserId(null));
      dispatch(loadGuestCart());
    } else if (!user && !isAuthenticated && items.length === 0) {
      // No user and no items, load guest cart from localStorage
      console.log('🔄 [CART HOOK] Loading guest cart from localStorage');
      dispatch(loadGuestCart());
    }
  }, [user, isAuthenticated, dispatch, items.length, currentUserId]);

  // Handle login - merge guest cart with user cart
  useEffect(() => {
    if (user && isAuthenticated && lastSynced === null) {
      // User just logged in, merge guest cart
      // This will replace user cart with guest cart items
      console.log('🔄 [CART HOOK] User just logged in, merging guest cart');
      dispatch(mergeGuestCart());
    }
  }, [user, isAuthenticated, lastSynced, dispatch]);

  // Handle logout - persist user cart to localStorage
  useEffect(() => {
    if (!user && currentUserId && items.length > 0) {
      // User just logged out, persist cart to localStorage
      console.log('🔄 [CART HOOK] User logged out, persisting cart to localStorage');
      dispatch(persistUserCartToLocalStorage(currentUserId));
    }
  }, [user, currentUserId, items.length, dispatch]);

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
    const price = parseFloat(item.product.discountPrice || item.product.price);
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