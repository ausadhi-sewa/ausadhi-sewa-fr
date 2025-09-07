import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MobileFiltersDropdown from './MobileFiltersDropdown';

interface FilterState {
  priceRange: [number, number];
  prescription: string;
  inStock: boolean | null;
  featured: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
}

interface ShopHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  products: any[];
  pagination: { total: number };
  filters: FilterState;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
}

export default function ShopHeader({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  products,
  pagination,
  filters,
  handleFilterChange,
  clearFilters,
}: ShopHeaderProps) {
  return (
    <div className="border-b">
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
          <div className="flex items-center gap-4">
            <div className="relative flex-1 w-full border rounded-lg border-medical-green-500">
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
            
            {/* Mobile Filter Dropdown */}
            <MobileFiltersDropdown
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
