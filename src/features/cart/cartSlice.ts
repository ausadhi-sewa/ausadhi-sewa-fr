import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../api/productApi';
import { cartApi, type Cart, type CartItem } from '../../api/cartApi';
import { cartStorage, type GuestCartItem } from '../../utils/cartStorage';

// Cart item interface for Redux state
export interface CartItemState {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItemState[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastSynced: string | null;
  currentUserId: string | null; // Track current user for persistence
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  loading: false,
  error: null,
  isAuthenticated: false,
  lastSynced: null,
  currentUserId: null,
};

// Helper function to transform cart API product to full Product type
const transformCartProductToProduct = (cartProduct: any): Product => {
  return {
    id: cartProduct.id,
    name: cartProduct.name,
    slug: cartProduct.slug,
    description: cartProduct.description || undefined,
    shortDescription: cartProduct.shortDescription || undefined,
    price: cartProduct.price,
    discountPrice: cartProduct.discountPrice || undefined,
    sku: cartProduct.sku,
    stock: cartProduct.stock,
    minStock: 5, // Default value since not provided by cart API
    categoryId: undefined, // Not provided by cart API
    manufacturer: undefined, // Not provided by cart API
    expiryDate: undefined, // Not provided by cart API
    batchNumber: undefined, // Not provided by cart API
    prescriptionRequired: 'no' as const, // Default value since not provided by cart API
    profileImgUrl: cartProduct.profileImgUrl || undefined,
    images: undefined, // Not provided by cart API
    isActive: cartProduct.isActive,
    isFeatured: false, // Default value since not provided by cart API
    createdAt: new Date().toISOString(), // Default value since not provided by cart API
    updatedAt: new Date().toISOString(), // Default value since not provided by cart API
  };
};

// Async thunks for authenticated user cart operations
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartApi.getCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart');
    }
  }
);

export const addToUserCart = createAsyncThunk(
  'cart/addToUserCart',
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const cart = await cartApi.addToCart({ productId, quantity });
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add item to cart');
    }
  }
);

export const updateUserCartItemQuantity = createAsyncThunk(
  'cart/updateUserCartItemQuantity',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const cart = await cartApi.updateQuantity(itemId, quantity);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart item');
    }
  }
);

export const removeFromUserCart = createAsyncThunk(
  'cart/removeFromUserCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const cart = await cartApi.removeFromCart(itemId);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove item from cart');
    }
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clearUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartApi.clearCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear cart');
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  'cart/mergeGuestCart',
  async (_, { rejectWithValue }) => {
    try {
      const guestCartItems = cartStorage.getGuestCartItemsForMerge();
      if (guestCartItems.length === 0) {
        return null; // No items to merge
      }
      
      const cart = await cartApi.mergeGuestCart(guestCartItems);
      // Clear guest cart after successful merge
      cartStorage.clearGuestCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to merge guest cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Guest cart operations (local storage)
    addToGuestCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          product,
          quantity,
          addedAt: new Date().toISOString(),
        });
      }
      
      // Save to localStorage
      cartStorage.addToGuestCart(product, quantity);
    },
    
    updateGuestCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      
      // Update localStorage
      cartStorage.updateGuestCartItemQuantity(id, quantity);
    },
    
    removeFromGuestCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Remove from localStorage
      cartStorage.removeFromGuestCart(productId);
    },
    
    clearGuestCart: (state) => {
      state.items = [];
      state.error = null;
      
      // Clear localStorage
      cartStorage.clearGuestCart();
    },
    
    // Load guest cart from localStorage
    loadGuestCart: (state) => {
      const guestCart = cartStorage.getGuestCart();
      state.items = guestCart.items;
      state.isAuthenticated = false;
      state.lastSynced = null;
      state.currentUserId = null;
    },

    // Load user cart from localStorage (after logout)
    loadUserCartFromLocalStorage: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const userCartItems = cartStorage.loadUserCartFromLocalStorage(userId);
      state.items = userCartItems;
      state.isAuthenticated = false;
      state.lastSynced = null;
      state.currentUserId = null;
    },

    // Persist user cart to localStorage (before logout)
    persistUserCartToLocalStorage: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.items.length > 0) {
        cartStorage.persistUserCartToLocalStorage(userId, state.items);
      }
    },

    // Set current user ID
    setCurrentUserId: (state, action: PayloadAction<string | null>) => {
      state.currentUserId = action.payload;
    },
    
    // UI state management
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    // Set authentication status
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items.map((item: CartItem) => ({
          id: item.id,
          product: transformCartProductToProduct(item.product),
          quantity: item.quantity,
          addedAt: item.addedAt,
        }));
        state.isAuthenticated = true;
        state.lastSynced = new Date().toISOString();
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to user cart
      .addCase(addToUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items.map((item: CartItem) => ({
          id: item.id,
          product: transformCartProductToProduct(item.product),
          quantity: item.quantity,
          addedAt: item.addedAt,
        }));
        state.lastSynced = new Date().toISOString();
      })
      .addCase(addToUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update user cart item quantity
      .addCase(updateUserCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items.map((item: CartItem) => ({
          id: item.id,
          product: transformCartProductToProduct(item.product),
          quantity: item.quantity,
          addedAt: item.addedAt,
        }));
        state.lastSynced = new Date().toISOString();
      })
      .addCase(updateUserCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from user cart
      .addCase(removeFromUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items.map((item: CartItem) => ({
          id: item.id,
          product: transformCartProductToProduct(item.product),
          quantity: item.quantity,
          addedAt: item.addedAt,
        }));
        state.lastSynced = new Date().toISOString();
      })
      .addCase(removeFromUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Clear user cart
      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items.map((item: CartItem) => ({
          id: item.id,
          product: transformCartProductToProduct(item.product),
          quantity: item.quantity,
          addedAt: item.addedAt,
        }));
        state.lastSynced = new Date().toISOString();
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Merge guest cart
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items.map((item: CartItem) => ({
            id: item.id,
            product: transformCartProductToProduct(item.product),
            quantity: item.quantity,
            addedAt: item.addedAt,
          }));
          state.isAuthenticated = true;
          state.lastSynced = new Date().toISOString();
        }
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToGuestCart,
  updateGuestCartItemQuantity,
  removeFromGuestCart,
  clearGuestCart,
  loadGuestCart,
  loadUserCartFromLocalStorage,
  persistUserCartToLocalStorage,
  setCurrentUserId,
  openCart,
  closeCart,
  toggleCart,
  setAuthenticated,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
