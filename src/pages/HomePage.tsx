import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight, Star, Pill, Leaf, Stethoscope, Package, Heart, Eye, ShoppingCart } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProducts } from '../features/products/productSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import { useCart } from '../utils/hooks/useCart';
import type { Product, ProductFilters } from '../api/productApi';
import heroImage from '../assets/hero-removebg-preview.png';
import ProductCard from '@/components/products/ProductCard';
import { toast } from 'sonner';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, pagination } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { addToCart } = useCart();
  
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 9,
    sortBy: 'createdAt',
    order: 'desc'
  });

  useEffect(() => {
    dispatch(fetchProducts(filters));
    dispatch(fetchCategories());
  }, [dispatch, filters]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent navigation to product details
    addToCart(product);
  };

  const handleCategoryClick = async (categoryId: string) => {
   navigate(`/category/${categoryId}`)
  };

  const totalPages = pagination.totalPages;
  const currentPage = pagination.page;

  // Category icons mapping
  const categoryIcons: { [key: string]: any } = {
    'pain-relief': Pill,
    'cold-cough': Stethoscope,
    'antibiotics': Package,
    'vitamins-supplements': Leaf,
    'digestive-health': Heart,
    'diabetes-care': Stethoscope,
    'heart-blood-pressure': Heart,
    'skin-care': Leaf,
    'womens-health': Heart,
    'first-aid': Package,
    'eye-care': Eye,
    'allergy-relief': Pill,
    'mental-wellness': Heart,
    'medical-devices': Stethoscope,
    'baby-care': Heart,
    'elderly-care': Stethoscope,
    'respiratory-care': Stethoscope,
    'oral-care': Package,
    'sexual-wellness': Heart,
    'ayurvedic-medicine': Leaf,
    'immunity-boosters': Leaf,
    'weight-management': Heart,
    'bone-joint-care': Stethoscope,
    'liver-care': Heart,
    'kidney-care': Heart,
    'sleep-aids': Pill,
    'surgical-supplies': Package,
    'personal-hygiene': Package,
    'fitness-sports': Heart,
    'homeopathic-medicine': Leaf
  };

  return (
    <div className="min-h-screen">
 {/* Hero Banner */}
 <section className="relative bg-gradient-to-r from-medical-green-500 via-medical-green-600 to-medical-green-700 py-8 px-4 overflow-hidden border-b border-gray-100 rounded-2xl ">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-green-600 opacity-30 rounded-full transform translate-x-64 -translate-y-64"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-medical-green-800 opacity-40 rounded-full transform -translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                EVERYDAY ESSENTIALS
              </h1>
              <button 
                onClick={() => navigate('/shop')}
                className="px-6 py-3 shadow-medical-lg bg-button-color text-black rounded-full font-semibold hover:bg-medical-green-400 transition-colors duration-200"
              >
                SHOP NOW
              </button>
            </div>
            <div className="hidden lg:block relative">
              <img 
                src={heroImage}
                alt="Medical Products" 
                className="w-full h-auto max-w-sm mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
<section className="  py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
         
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {categories.slice(0, 16).map((category) => {
              const IconComponent = categoryIcons[category.slug] || Package;
              return (
                <div 
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md group"
                >
                  <div className="w-12 h-12 bg-medical-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-medical-green-200 transition-colors duration-200">
                    <IconComponent className="w-6 h-6 text-medical-green-600" />
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Mobile Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Our Products</h2>
          
          {/* Mobile Filter Dropdown */}
          {/* <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem onClick={() => navigate('/shop')}>
                  View All Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/')}>
                  Pain Relief
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop?category=cold-cough')}>
                  Cold & Cough
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop?category=vitamins-supplements')}>
                  Vitamins & Supplements
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/shop?category=first-aid')}>
                  First Aid
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}
        </div>
        
        {/* Products Grid */}
       
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} handleProductClick={handleProductClick} handleAddToCart={handleAddToCart} isLoading={loading} />
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
        
      
      </div>
    </div>
  );
} 