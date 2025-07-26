import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { logoutUser, checkSession } from "../features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLogout, IconUser, IconShield } from "@tabler/icons-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  // Check session on component mount
  useEffect(() => {
    console.log('🔵 [DASHBOARD] Checking session on mount');
    dispatch(checkSession());
  }, [dispatch]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log('🔴 [DASHBOARD] No user found, redirecting to login');
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    console.log('🔵 [DASHBOARD] Logout button clicked');
    try {
      await dispatch(logoutUser()).unwrap();
      console.log('🟢 [DASHBOARD] Logout successful');
      navigate("/login");
    } catch (error) {
      console.error('🔴 [DASHBOARD] Logout failed:', error);
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
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-green-50 to-medical-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
            <p className="text-neutral-600">Welcome back, {user.name}!</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <IconLogout className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="w-5 h-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Role</p>
                <div className="flex items-center gap-2">
                  <IconShield className="w-4 h-4" />
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-neutral-600">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">Manage your products</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">View and manage orders</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">View sales and analytics</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 