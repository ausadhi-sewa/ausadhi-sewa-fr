import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight, Star, Pill, Leaf, Stethoscope, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProducts } from '../features/products/productSlice';
import { useCart } from '../utils/hooks/useCart';
import type { Product, ProductFilters } from '../api/productApi';
import heroImage from '../assets/hero-removebg-preview.png';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, pagination } = useAppSelector((state) => state.products);
  const { addToCart } = useCart();
  
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 9,
    sortBy: 'createdAt',
    order: 'desc'
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => {
    if (!isSearching) {
      dispatch(fetchProducts(filters));
    }
  }, [dispatch, filters, isSearching]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Implement search functionality
    }
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 9,
      sortBy: 'createdAt',
      order: 'desc'
    });
    setSearchQuery('');
    setIsSearching(false);
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 100 });
    setSelectedBrands([]);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent navigation to product details
    addToCart(product);
  };

  const totalPages = pagination.totalPages;
  const currentPage = pagination.page;

  const categories = [
    { id: 'prescription', name: 'Prescription', icon: Pill },
    { id: 'otc', name: 'OTC', icon: Package },
    { id: 'wellness', name: 'Wellness', icon: Leaf },
    { id: 'devices', name: 'Devices', icon: Stethoscope }
  ];

  const brands = ['Austrdfti', 'Serve', 'HotbCaro', 'Medix'];

  return (
    <div className="min-h-screen ">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-medical-green-500 via-medical-green-600 to-medical-green-700 py-8 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-green-600 opacity-30 rounded-full transform translate-x-64 -translate-y-64"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-medical-green-800 opacity-40 rounded-full transform -translate-x-48 translate-y-48"></div>
          {/* <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-medical-green-200 opacity-25 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div> */}
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                EVERYDAY ESSENTIALS
              </h1>
              <button 
                onClick={() => navigate('/shop')}
                className="px-6 py-3 shadow-medical-lg bg-button-color text-black rounded-full font-semibold hover:bg-medical-green-400 transition-colors duration-200 "
              >
                SHOP NOW
              </button>
            </div>
            <div className="hidden  lg:block relative">
              <img 
                src={heroImage}
                alt="Medical Products" 
                className="w-full h-auto max-w-sm mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-6">Filter Products</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-700 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="category" 
                      value="multi"
                      checked={selectedCategory === 'multi'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 text-medical-green-500"
                    />
                    Multi Select
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input 
                        type="radio" 
                        name="category" 
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2 text-medical-green-500"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-700 mb-3">Price Range</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                  />
                  <input
                    type="number"
                    placeholder="100+"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <button className="w-full mt-3 px-4 py-2 bg-button-color text-black rounded-full  transition-colors duration-200 hover:bg-medical-green-300">
                  Filter
                </button>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-700 mb-3">Brand</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands(prev => [...prev, brand]);
                          } else {
                            setSelectedBrands(prev => prev.filter(b => b !== brand));
                          }
                        }}
                        className="mr-2 text-medical-green-500"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* Browse Categories */}
              <div>
                <h4 className="font-semibold text-neutral-700 mb-3">Browse Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={category.id} className="bg-white border border-medical-green-200 rounded-lg p-3 text-center hover:border-medical-green-400 transition-colors duration-200 cursor-pointer">
                        <IconComponent className="w-6 h-6 text-medical-green-600 mx-auto mb-1" />
                        <span className="text-xs text-neutral-700">{category.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            {/* Category Icons */}
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-4 gap-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.id} className="bg-white border border-medical-green-200 rounded-lg p-4 text-center hover:border-medical-green-400 transition-colors duration-200 cursor-pointer">
                      <IconComponent className="w-8 h-8 text-medical-green-600 mx-auto mb-2" />
                      <span className="text-sm text-neutral-700">{category.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Products Section */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Our Products</h2>
              
              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-neutral-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-neutral-200 h-4 rounded mb-2"></div>
                      <div className="bg-neutral-200 h-4 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: Product) => (
                      <div 
                        key={product.id} 
                        className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {/* Product Image */}
                        <div className="relative h-48 bg-neutral-100 overflow-hidden">
                          {product.profileImgUrl ? (
                            <img
                              src={product.profileImgUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-neutral-800 mb-2">
                            {product.name}
                          </h3>
                          <div className="text-lg font-bold text-medical-green-600 mb-3">
                            ₹{product.discountPrice || product.price}
                          </div>
                          <LiquidButton 
                            className='text-black w-full h-10 rounded-full backdrop:bg-medical-green-100'
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            ADD TO CART
                          </LiquidButton>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-8 gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          const isCurrentPage = pageNumber === currentPage;
                          
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
                        })}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 