import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product, ProductState } from './types.product';
import axios from 'axios';



const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void>('products/fetchProducts', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`)
  return response.data
});

export const createProduct = createAsyncThunk<Product, any>('products/createProduct', async (payload) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, payload)
  return response.data
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch failed';
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Create failed';
      });
  },
});

export default productSlice.reducer; 