import type { Product } from '../api/productApi';

// Guest cart item interface
export interface GuestCartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

// Guest cart interface
export interface GuestCart {
  items: GuestCartItem[];
  lastUpdated: string;
}

// User cart interface (for localStorage persistence)
export interface UserCart {
  items: GuestCartItem[];
  lastUpdated: string;
  userId: string;
}

const GUEST_CART_KEY = 'ausadhi_guest_cart';
const USER_CART_KEY = 'ausadhi_user_cart';

export const cartStorage = {
  // Get guest cart from localStorage
  getGuestCart(): GuestCart {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (stored) {
        const cart = JSON.parse(stored) as GuestCart;
        // Validate cart structure
        if (cart.items && Array.isArray(cart.items)) {
          return cart;
        }
      }
    } catch (error) {
      console.error('Error reading guest cart from localStorage:', error);
    }
    
    // Return empty cart if no valid cart found
    return {
      items: [],
      lastUpdated: new Date().toISOString(),
    };
  },

  // Save guest cart to localStorage
  saveGuestCart(cart: GuestCart): void {
    try {
      const cartToSave = {
        ...cart,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartToSave));
    } catch (error) {
      console.error('Error saving guest cart to localStorage:', error);
    }
  },

  // Get user cart from localStorage
  getUserCart(userId: string): UserCart | null {
    try {
      const stored = localStorage.getItem(`${USER_CART_KEY}_${userId}`);
      if (stored) {
        const cart = JSON.parse(stored) as UserCart;
        // Validate cart structure
        if (cart.items && Array.isArray(cart.items) && cart.userId === userId) {
          return cart;
        }
      }
    } catch (error) {
      console.error('Error reading user cart from localStorage:', error);
    }
    
    return null;
  },

  // Save user cart to localStorage
  saveUserCart(userId: string, items: GuestCartItem[]): void {
    try {
      const cartToSave: UserCart = {
        items,
        lastUpdated: new Date().toISOString(),
        userId,
      };
      localStorage.setItem(`${USER_CART_KEY}_${userId}`, JSON.stringify(cartToSave));
    } catch (error) {
      console.error('Error saving user cart to localStorage:', error);
    }
  },

  // Clear user cart from localStorage
  clearUserCart(userId: string): void {
    try {
      localStorage.removeItem(`${USER_CART_KEY}_${userId}`);
    } catch (error) {
      console.error('Error clearing user cart from localStorage:', error);
    }
  },

  // Add item to guest cart
  addToGuestCart(product: Product, quantity: number = 1): GuestCart {
    const cart = this.getGuestCart();
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        id: product.id,
        product,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }
    
    this.saveGuestCart(cart);
    return cart;
  },

  // Update guest cart item quantity
  updateGuestCartItemQuantity(productId: string, quantity: number): GuestCart {
    const cart = this.getGuestCart();
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.id !== productId);
    } else {
      const item = cart.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    
    this.saveGuestCart(cart);
    return cart;
  },

  // Remove item from guest cart
  removeFromGuestCart(productId: string): GuestCart {
    const cart = this.getGuestCart();
    cart.items = cart.items.filter(item => item.id !== productId);
    this.saveGuestCart(cart);
    return cart;
  },

  // Clear guest cart
  clearGuestCart(): void {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error('Error clearing guest cart from localStorage:', error);
    }
  },

  // Get guest cart items count
  getGuestCartItemCount(): number {
    const cart = this.getGuestCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Convert guest cart items to format expected by merge API
  getGuestCartItemsForMerge(): Array<{ productId: string; quantity: number }> {
    const cart = this.getGuestCart();
    return cart.items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    }));
  },

  // Check if guest cart has items
  hasGuestCartItems(): boolean {
    const cart = this.getGuestCart();
    return cart.items.length > 0;
  },

  // Persist user cart to localStorage before logout
  persistUserCartToLocalStorage(userId: string, items: GuestCartItem[]): void {
    console.log('💾 [CART STORAGE] Persisting user cart to localStorage before logout:', {
      userId,
      itemCount: items.length
    });
    this.saveUserCart(userId, items);
  },

  // Load user cart from localStorage after logout
  loadUserCartFromLocalStorage(userId: string): GuestCartItem[] {
    const userCart = this.getUserCart(userId);
    if (userCart) {
      console.log('📂 [CART STORAGE] Loaded user cart from localStorage after logout:', {
        userId,
        itemCount: userCart.items.length
      });
      return userCart.items;
    }
    return [];
  },

  // Clear all cart data (for testing or cleanup)
  clearAllCartData(): void {
    try {
      // Clear guest cart
      localStorage.removeItem(GUEST_CART_KEY);
      
      // Clear all user carts
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(USER_CART_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all cart data from localStorage:', error);
    }
  },
}; 