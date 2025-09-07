import axios from 'axios';

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validUntil: string;
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {
  id: string;
}

export interface ValidateCouponRequest {
  code: string;
  orderAmount: number;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  error?: string;
}

export interface CouponStats {
  totalUsage: number;
  totalDiscount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

const createAuthAxios = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const couponApi = {
  // Validate coupon code (public endpoint)
  async validateCoupon(data: ValidateCouponRequest): Promise<ValidateCouponResponse> {
    const authAxios = createAuthAxios();
    const response = await authAxios.post<ApiResponse<ValidateCouponResponse>>('/coupons/validate', data);
    return response.data.data;
  },

  // Create new coupon (admin only)
  async createCoupon(data: CreateCouponRequest): Promise<Coupon> {
    const authAxios = createAuthAxios();
    const response = await authAxios.post<ApiResponse<{ coupon: Coupon }>>('/coupons', data);
    return response.data.data.coupon;
  },

  // Get all coupons (admin only)
  async getAllCoupons(page: number = 1, limit: number = 20): Promise<{ coupons: Coupon[]; pagination: any }> {
    const authAxios = createAuthAxios();
    const response = await authAxios.get<ApiResponse<{ coupons: Coupon[]; pagination: any }>>(
      `/coupons?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Get coupon by ID (admin only)
  async getCouponById(id: string): Promise<Coupon> {
    const authAxios = createAuthAxios();
    const response = await authAxios.get<ApiResponse<{ coupon: Coupon }>>(`/coupons/${id}`);
    return response.data.data.coupon;
  },

  // Update coupon (admin only)
  async updateCoupon(data: UpdateCouponRequest): Promise<Coupon> {
    const authAxios = createAuthAxios();
    const { id, ...updateData } = data;
    const response = await authAxios.put<ApiResponse<{ coupon: Coupon }>>(`/coupons/${id}`, updateData);
    return response.data.data.coupon;
  },

  // Delete coupon (admin only)
  async deleteCoupon(id: string): Promise<void> {
    const authAxios = createAuthAxios();
    await authAxios.delete(`/coupons/${id}`);
  },

  // Get coupon statistics (admin only)
  async getCouponStats(id: string): Promise<CouponStats> {
    const authAxios = createAuthAxios();
    const response = await authAxios.get<ApiResponse<{ stats: CouponStats }>>(`/coupons/${id}/stats`);
    return response.data.data.stats;
  },

  // Toggle coupon active status (admin only)
  async toggleCouponStatus(id: string): Promise<Coupon> {
    const authAxios = createAuthAxios();
    const response = await authAxios.patch<ApiResponse<{ coupon: Coupon }>>(`/coupons/${id}/toggle`);
    return response.data.data.coupon;
  },
};
