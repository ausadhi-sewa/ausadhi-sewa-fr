
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconUser,
  IconShield,
  IconUser as IconProducts,
} from '@tabler/icons-react';


interface AnalyticsDashboardProps {
  totalProducts: number;
  totalCategories: number;
  userRole: string;

}

export default function AnalyticsDashboard({ 
  totalProducts, 
  totalCategories, 
  userRole, 
  
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconProducts className="w-5 h-5 text-medical-green-600" />
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-medical-green-600">
                  {totalProducts}
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
                  {totalCategories}
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
                  {userRole}
                </p>
                <p className="text-sm text-neutral-600">Current user role</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">More analytics features coming soon...</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">• Sales performance metrics</p>
            <p className="text-sm text-gray-500">• Customer behavior analysis</p>
            <p className="text-sm text-gray-500">• Inventory turnover rates</p>
            <p className="text-sm text-gray-500">• Revenue trends</p>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
