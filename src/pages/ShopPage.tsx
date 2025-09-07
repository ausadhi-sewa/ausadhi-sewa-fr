import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProducts, searchProducts } from '../features/products/productSlice';
import type { Product, ProductFilters } from '../api/productApi';
import { useCart } from '../utils/hooks/useCart';
import {
  ShopHeader,
  DesktopFiltersSidebar,
  EmptyState,
  ProductsGrid,
} from '@/components/shop';

interface FilterState {
  priceRange: [number, number];
  prescription: string;
  inStock: boolean | null;
  featured: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
}

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const { products, loading, pagination } = useAppSelector((state) => state.products);
  

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    prescription: 'all', // Changed from '' to 'all'
    inStock: null,
    featured: false,
    sortBy: 'createdAt',
    order: 'desc'
  });

  // Infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // API filters
  const apiFilters: ProductFilters = {
    page,
    limit: 12,
    sortBy: filters.sortBy as any,
    order: filters.order,
    prescription: filters.prescription === 'all' ? undefined : (filters.prescription as 'yes' | 'no' | undefined),
    inStock: filters.inStock || undefined,
    featured: filters.featured,
    minPrice: filters.priceRange[0] || undefined,
    maxPrice: filters.priceRange[1] || undefined,
  };

  // Fetch products
  const fetchProductsData = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    const currentFilters = { ...apiFilters, page: currentPage };
    
    try {
      if (debouncedSearchQuery.trim()) {
        await dispatch(searchProducts({ 
          query: debouncedSearchQuery.trim(), 
          filters: currentFilters 
        })).unwrap();
      } else {
        await dispatch(fetchProducts(currentFilters)).unwrap();
      }
      
      if (resetPage) {
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [dispatch, apiFilters, debouncedSearchQuery, page]);

  // Initial load and search
  useEffect(() => {
    fetchProductsData(true);
  }, [debouncedSearchQuery, filters]);

  // Infinite scroll setup
  const lastProductCallback = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
    lastProductRef.current = node;
  }, [loading, hasMore]);

  // Load more products
  useEffect(() => {
    if (page > 1) {
      fetchProductsData();
    }
  }, [page]);

  // Update hasMore based on pagination
  useEffect(() => {
    setHasMore(page < pagination.totalPages);
  }, [page, pagination.totalPages]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
    fetchProductsData(true);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      prescription: 'all', // Changed from '' to 'all'
      inStock: null,
      featured: false,
      sortBy: 'createdAt',
      order: 'desc'
    });
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearching(false);
    setPage(1);
  };

  // Handle product actions
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl">
      {/* Header */}
      <ShopHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isSearching={isSearching}
        products={products}
        pagination={pagination}
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <DesktopFiltersSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {!loading && products.length === 0 && (
              <EmptyState
                isSearching={isSearching}
                searchQuery={searchQuery}
                clearFilters={clearFilters}
              />
            )}

            {products.length > 0 && (
              <ProductsGrid
                products={products}
                loading={loading}
                hasMore={hasMore}
                lastProductCallback={lastProductCallback}
                handleAddToCart={handleAddToCart}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
