import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

export const categoryApi = {
  // Get all categories
  async getCategories(sortBy?: string, order?: string) {
    const response = await api.get('/categories', { 
      params: { sortBy, order } 
    });
    return response.data;
  },

  // Get category by ID
  async getCategory(id: string) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create category (Admin only)
  async createCategory(data: CreateCategoryData) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Update category (Admin only)
  async updateCategory(data: UpdateCategoryData) {
    const { id, ...updateData } = data;
    const response = await api.put(`/categories/${id}`, updateData);
    return response.data;
  },

  // Delete category (Admin only)
  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
}; 