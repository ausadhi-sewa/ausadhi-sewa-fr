import axios from 'axios';

export interface Address {
  id: string;
  userId: string;
  type: 'delivery' | 'billing';
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  type?: 'delivery' | 'billing';
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

interface AddressResponse {
  success: boolean;
  data: Address;
}

interface AddressesResponse {
  success: boolean;
  data: Address[];
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

export const addressApi = {
  // Get user's addresses
  async getUserAddresses(): Promise<Address[]> {
    const authAxios = createAuthAxios();
    const response = await authAxios.get<AddressesResponse>('/addresses');
    return response.data.data;
  },

  // Get default address
  async getDefaultAddress(): Promise<Address | null> {
    const authAxios = createAuthAxios();
    const response = await authAxios.get<AddressResponse>('/addresses/default');
    return response.data.data;
  },

  // Create new address
  async createAddress(data: CreateAddressRequest): Promise<Address> {
    const authAxios = createAuthAxios();
    const response = await authAxios.post<AddressResponse>('/addresses', data);
    return response.data.data;
  },

  // Update address
  async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<Address> {
    const authAxios = createAuthAxios();
    const response = await authAxios.put<AddressResponse>(`/addresses/${addressId}`, data);
    return response.data.data;
  },

  // Delete address
  async deleteAddress(addressId: string): Promise<void> {
    const authAxios = createAuthAxios();
    await authAxios.delete(`/addresses/${addressId}`);
  },

  // Set address as default
  async setDefaultAddress(addressId: string): Promise<void> {
    const authAxios = createAuthAxios();
    await authAxios.patch(`/addresses/${addressId}/default`);
  },
};
