import { useNavigate } from 'react-router-dom';
import type { Product } from '../../api/productApi';
import ProductCard from '../products/ProductCard';

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  lastProductCallback: (node: HTMLDivElement) => void;
  handleAddToCart: (product: Product) => void;
}

export default function ProductsGrid({
  products,
  loading,
  hasMore,
  lastProductCallback,
  handleAddToCart,
}: ProductsGridProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div key={product.id} ref={index === products.length - 1 ? lastProductCallback : undefined}>
            <ProductCard 
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
    </>
  );
}
