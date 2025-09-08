import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { OrderPaginationProps } from './types';

export default function OrderPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: OrderPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Card className="mt-6 bg-transparent">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalItems} orders
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 py-2 text-sm">
              Page {currentPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
