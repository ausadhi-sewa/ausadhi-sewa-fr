import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  isSearching: boolean;
  searchQuery: string;
  clearFilters: () => void;
}

export default function EmptyState({
  isSearching,
  searchQuery,
  clearFilters,
}: EmptyStateProps) {
  return (
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
  );
}
