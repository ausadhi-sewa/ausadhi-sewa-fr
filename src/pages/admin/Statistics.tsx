import { useState,useEffect } from "react";
import { orderApi } from "../../api/orderApi";
import { OrderStatistics } from "../../components/admin/orders";
import type{OrderStatisticsProps} from "../../components/admin/orders";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { useAppSelector } from "@/utils/hooks";

export default function Statistics() {
    const { user, loading } = useAppSelector((state) => state.auth);
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector(
    (state) => state.categories
  );
    const [statistics, setStatistics] = useState<OrderStatisticsProps['statistics']>({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        outForDeliveryOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0,
      });
    
    const loadStatistics = async () => {
        try {
          const stats = await orderApi.getOrderStatistics();
          setStatistics(stats);
        } catch (error: any) {
          console.error("Error loading statistics:", error);
        }
      };
      useEffect(() => {
        loadStatistics();
      }, []);
  return (


    <div>
        <AnalyticsDashboard totalProducts={products.length} totalCategories={categories.length} userRole={user?.role || ""}/>
        
     <OrderStatistics statistics={statistics}/>
    </div>
  );
}