import { toast } from "sonner";
import type { Product } from "../api/productApi";

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

const GUEST_CART_KEY = "ausadhi_guest_cart";

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
      console.error("Error reading guest cart from localStorage:", error);
    }

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
      console.error("Error saving guest cart to localStorage:", error);
    }
  },

  // Add item to guest cart
  addToGuestCart(product: Product, quantity: number = 1): GuestCart {
    const cart = this.getGuestCart();
    const existingItem = cart.items.find((item) => item.id === product.id);

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
      cart.items = cart.items.filter((item) => item.id !== productId);
    } else {
      const item = cart.items.find((item) => item.id === productId);
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
    cart.items = cart.items.filter((item) => item.id !== productId);
    this.saveGuestCart(cart);
    return cart;
  },

  // Clear guest cart
  clearGuestCart(): void {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      toast.error("Failed to clear guest cart");
    }
  },

  // Get guest cart items for transfer to database
  getGuestCartItemsForTransfer(): Array<{
    productId: string;
    quantity: number;
  }> {
    const cart = this.getGuestCart();

    // Validate items before returning
    const validItems = cart.items.filter(
      (item) => item.id && item.quantity > 0 && item.product
    );

    if (validItems.length !== cart.items.length) {
      console.warn(
        "⚠️ [CART STORAGE] Some guest cart items were invalid and filtered out"
      );
    }

    return validItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));
  },

  // Check if guest cart has items
  hasGuestCartItems(): boolean {
    const cart = this.getGuestCart();
    return cart.items.length > 0;
  },

  // Clear all cart data (for testing or cleanup)
  clearAllCartData(): void {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
      toast.success("All cart data cleared successfully");
    } catch (error) {
      toast.error("Failed to clear all cart data");
    }
  },
};
