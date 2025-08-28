import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { logoutUser, checkSession } from "../../features/auth/authSlice";
import {
  fetchProducts,
  deleteProduct,
} from "../../features/products/productSlice";
import { fetchCategories } from "../../features/categories/categorySlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconLogout,
  IconUser,
  IconShield,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import { ProductTable } from "../../components/products/ProductTable";
import { AddProductDialog } from "../../components/products/AddProductDialog";
import { AddCategoryDialog } from "../../components/categories/AddCategoryDialog";
import { EditProductDialog } from "../../components/products/EditProductDialog";
import { ViewProductDialog } from "../../components/products/ViewProductDialog";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );
  const { categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  // Dialog states
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [viewProductOpen, setViewProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchProducts({}));
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    console.log("🔵 [DASHBOARD] Logout button clicked");
    try {
      await dispatch(logoutUser()).unwrap();
      console.log("🟢 [DASHBOARD] Logout successful");
      navigate("/");
    } catch (error) {
      console.error("🔴 [DASHBOARD] Logout failed:", error);
    }
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setViewProductOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setEditProductOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        console.log("🟢 [DASHBOARD] Product deleted successfully");
      } catch (error) {
        console.error("🔴 [DASHBOARD] Delete product failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-medical-green-500 border-t-transparent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log(
      "🔵 [DASHBOARD] No user found, AuthGate should handle redirect"
    );
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-green-50 to-medical-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">
              Admin Dashboard
            </h1>
            <p className="text-neutral-600">Welcome back, {user.name}!</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <IconLogout className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <IconUser className="w-5 h-5 text-medical-green-600" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-medical-green-600">
                {products.length}
              </p>
              <p className="text-sm text-neutral-600">
                Active products in store
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <IconShield className="w-5 h-5 text-medical-blue-600" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-medical-blue-600">
                {categories.length}
              </p>
              <p className="text-sm text-neutral-600">Product categories</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <IconUser className="w-5 h-5 text-medical-orange-600" />
                User Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-medical-orange-600 capitalize">
                {user.role}
              </p>
              <p className="text-sm text-neutral-600">Current user role</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setAddProductOpen(true)}
            className="flex items-center gap-2 bg-medical-green-600 hover:bg-medical-green-700"
          >
            <IconPlus className="w-4 h-4" />
            Add Product
          </Button>
          <Button
            onClick={() => setAddCategoryOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {/* Products Table */}
        <Card className="mb-6 bg-transparent">
          <CardHeader>
            <CardTitle className="text-xl">Product Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductTable
              products={products}
              loading={productsLoading}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        categories={categories}
      />

      <AddCategoryDialog
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
      />

      {selectedProduct && (
        <>
          <EditProductDialog
            open={editProductOpen}
            onOpenChange={setEditProductOpen}
            product={selectedProduct}
            categories={categories}
          />

          <ViewProductDialog
            open={viewProductOpen}
            onOpenChange={setViewProductOpen}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
}
