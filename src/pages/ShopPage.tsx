import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, X, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProducts, searchProducts } from '../features/products/productSlice';
import type { Product, ProductFilters } from '../api/productApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../utils/hooks/useCart';
import ProductCard from '@/components/products/ProductCard';
import { Slider } from '@/components/ui/slider';

interface FilterState {
  priceRange: [number, number];
  prescription: string;
  inStock: boolean | null;
  featured: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
}

export default function ShopPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const { products, loading, pagination, error } = useAppSelector((state) => state.products);
  

  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    prescription: '',
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
    prescription: filters.prescription as 'yes' | 'no' | undefined,
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
      prescription: '',
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
    <div className="min-h-screen">
      {/* Header */}
      <div className=" border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSearching ? `Search Results for "${searchQuery}"` : 'Shop Products'}
              </h1>
              <p className="text-gray-600">
                {isSearching 
                  ? `Found ${products.length} products` 
                  : `Showing ${products.length} of ${pagination.total} products`
                }
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center  gap-4">
              <div className="relative flex-1 max-w-md border rounded-lg border-medical-green-500">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4"
                />
              </div>
              
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex bg-transparent hover:bg-transparent text-black hover:text-black"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className='bg-transparent shadow-medical'>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.order}`}
                    onChange={(e) => {
                      const [sortBy, order] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('order', order as 'asc' | 'desc');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                  </select>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="px-1 py-2">
                    <Slider
                      value={[filters.priceRange[0], filters.priceRange[1]]}
                      onValueChange={(val) => handleFilterChange('priceRange', [val[0], val[1]])}
                      min={0}
                      max={10000}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>₹{filters.priceRange[0]}</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Prescription Required */}
                <div>
                  <label className="block text sm font-medium text-gray-700 mb-2">
                    Prescription
                  </label>
                  <select
                    value={filters.prescription}
                    onChange={(e) => handleFilterChange('prescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Products</option>
                    <option value="yes">Prescription Required</option>
                    <option value="no">No Prescription</option>
                  </select>
                </div>

                <Separator />

                {/* Stock Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <select
                    value={filters.inStock === null ? '' : filters.inStock ? 'true' : 'false'}
                    onChange={(e) => handleFilterChange('inStock', e.target.value === '' ? null : e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <Separator />

                {/* Featured Products */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Products Only</span>
                  </label>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full bg-medical-green-400 shadow-medical rounded-full text-gray-700 hover:text-gray-900 hover:bg-medical-green-400"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={`${filters.sortBy}-${filters.order}`}
                        onChange={(e) => {
                          const [sortBy, order] = e.target.value.split('-');
                          handleFilterChange('sortBy', sortBy);
                          handleFilterChange('order', order as 'asc' | 'desc');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="price-asc">Price Low to High</option>
                        <option value="price-desc">Price High to Low</option>
                        <option value="name-asc">Name A-Z</option>
                      </select>
                      
                      <select
                        value={filters.prescription}
                        onChange={(e) => handleFilterChange('prescription', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">All Products</option>
                        <option value="yes">Rx Required</option>
                        <option value="no">No Rx</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Products Grid */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading products. Please try again.</p>
                <Button onClick={() => fetchProductsData(true)}>Retry</Button>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {isSearching 
                    ? `No products match your search for "${searchQuery}"`
                    : 'Try adjusting your filters or search terms'
                  }
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div ref={index === products.length - 1 ? lastProductCallback : undefined}>
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  handleProductClick={(id: string) => navigate(`/product/${id}`)}
                  handleAddToCart={(e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  isLoading={loading}
                />
                </div>
              ))}
            </div>

            {/* End of Results */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">You've reached the end of the results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
