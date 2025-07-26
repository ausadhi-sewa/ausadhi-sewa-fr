export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: string;
  discountPrice?: string | null;
  sku: string;
  stock: number;
  minStock: number;
  categoryId?: string | null;
  manufacturer?: string | null;
  expiryDate?: string | null;
  batchNumber?: string | null;
  prescriptionRequired: 'yes' | 'no';
  profileImgUrl?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  categoryId?: string;
  prescription?: 'yes' | 'no';
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ProductPagination {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface ProductSorting {
  sortBy?: 'price' | 'createdAt' | 'name' | 'stock';
  order?: 'asc' | 'desc';
}

export interface CreateProductData {
  name: string;
  slug: string;
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