import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { fetchProducts, searchProducts } from '../../features/products/productSlice';
import type { Product, ProductFilters } from '../../api/productApi';

export default function ProductListing() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination } = useAppSelector((state) => state.products);
  
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    order: 'desc'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      dispatch(fetchProducts(filters));
    }
  }, [dispatch, filters, isSearching]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 when filters change
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      dispatch(searchProducts({ query: searchQuery.trim(), filters }));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      order: 'desc'
    });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      order: 'desc'
    });
    setSearchQuery('');
    setIsSearching(false);
  };

  const totalPages = pagination.totalPages;
  const currentPage = pagination.page;

  return (
    <div className="py-16 px-4 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-2">
              {isSearching ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h2>
            <p className="text-neutral-600">
              {isSearching 
                ? `Found ${products.length} products` 
                : `Showing ${products.length} of ${pagination.total} products`
              }
            </p>
          </div>
          
          {/* Search and Filter Toggle */}
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="px-4 py-2 bg-medical-green-500 text-white rounded-lg hover:bg-medical-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Search
              </button>
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || 'createdAt'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500 focus:border-transparent"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price">Price Low to High</option>
                  <option value="price">Price High to Low</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Prescription Required */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Prescription
                </label>
                <select
                  value={filters.prescription || ''}
                  onChange={(e) => handleFilterChange('prescription', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="yes">Required</option>
                  <option value="no">Not Required</option>
                </select>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Stock Status
                </label>
                <select
                  value={filters.inStock ? 'true' : filters.inStock === false ? 'false' : ''}
                  onChange={(e) => handleFilterChange('inStock', e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-neutral-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-neutral-200 h-4 rounded mb-2"></div>
                <div className="bg-neutral-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    {/* Product Image */}
                    <div className="relative h-48 bg-neutral-100 overflow-hidden">
                      {product.profileImgUrl ? (
                        <img
                          src={product.profileImgUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <span>No Image</span>
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2 bg-medical-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discountPrice && parseFloat(product.discountPrice) < parseFloat(product.price) && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {Math.round(((parseFloat(product.price) - parseFloat(product.discountPrice)) / parseFloat(product.price)) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-2 group-hover:text-medical-green-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-medical-green-600">
                          ₹{product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && parseFloat(product.discountPrice) < parseFloat(product.price) && (
                          <span className="text-sm text-neutral-400 line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          product.stock > 10 ? 'text-medical-green-600' : 
                          product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {product.stock > 10 ? 'In Stock' : 
                           product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                        
                        {product.prescriptionRequired === 'yes' && (
                          <span className="text-xs bg-medical-blue-100 text-medical-blue-700 px-2 py-1 rounded">
                            Prescription Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    const isNearCurrent = Math.abs(pageNumber - currentPage) <= 2;
                    
                    if (isCurrentPage || isNearCurrent || pageNumber === 1 || pageNumber === totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                            isCurrentPage
                              ? 'bg-medical-green-500 text-white'
                              : 'border border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                      return <span key={pageNumber} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 