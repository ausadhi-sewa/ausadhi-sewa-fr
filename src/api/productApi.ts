import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  minStock: number;
  categoryId?: string;
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
  prescriptionRequired: 'yes' | 'no';
  profileImgUrl?: string;
  images?: Array<{ id: string; url: string; storagePath: string; createdAt: string }>;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'name' | 'stock';
  order?: 'asc' | 'desc';
  prescription?: 'yes' | 'no';
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  categoryId?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  minStock?: number;
  categoryId?: string;
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
  prescriptionRequired: 'yes' | 'no';
  isFeatured?: boolean;
  profile?: File;
  gallery?: File[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export const productApi = {
  // Get all products with filters
  async getProducts(filters: ProductFilters = {}) {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  // Get product by ID
  async getProduct(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  async getProductBySlug(slug: string) {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Search products
  async searchProducts(query: string, filters: ProductFilters = {}) {
    const response = await api.get('/products/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts(filters: ProductFilters = {}) {
    const response = await api.get('/products/featured', { params: filters });
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(categoryId: string, filters: ProductFilters = {}) {
    const response = await api.get(`/products/category/${categoryId}`, { params: filters });
    return response.data;
  },

  // Create product (Admin only)
  async createProduct(data: CreateProductData) {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'profile' && key !== 'gallery' && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Add profile image
    if (data.profile) {
      formData.append('profile', data.profile);
    }

    // Add gallery images
    if (data.gallery) {
      data.gallery.forEach((file,) => {
        formData.append('gallery', file);
      });
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
     
    return response.data;
  },

  // Update product (Admin only)
  async updateProduct(data: UpdateProductData) {
    const { id, ...updateData } = data;
    const formData = new FormData();
    
    // Add text fields
    Object.entries(updateData).forEach(([key, value]) => {
      if (key !== 'profile' && key !== 'gallery' && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Add profile image
    if (updateData.profile) {
      formData.append('profile', updateData.profile);
    }

    // Add gallery images
    if (updateData.gallery) {
      updateData.gallery.forEach((file) => {
        formData.append('gallery', file);
      });
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product (Admin only)
  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Update product stock (Admin only)
  async updateProductStock(id: string, quantity: number) {
    const response = await api.put(`/products/${id}/stock`, { quantity });
    return response.data;
  },

  // Get low stock products (Admin only)
  async getLowStockProducts(filters: ProductFilters = {}) {
    const response = await api.get('/products/admin/low-stock', { params: filters });
    return response.data;
  },
}; 