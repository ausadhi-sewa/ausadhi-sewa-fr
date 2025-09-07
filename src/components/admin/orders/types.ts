import { type Order, type OrderFilters } from '../../../api/orderApi';

export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  outForDeliveryOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface OrderStatisticsProps {
  statistics: OrderStatistics;
}

export interface OrderFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onExportOrders: () => void;
}

export interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  selectedOrder: Order | null;
  showStaffAssignment: string | null;
  staffId: string;
  onOrderSelect: (order: Order | null) => void;
  onStatusUpdate: (orderId: string, status: string) => void;
  onPaymentStatusUpdate: (orderId: string, paymentStatus: string) => void;
  onAssignStaff: (orderId: string) => void;
  onPrintOrder: (order: Order) => void;
  onShowStaffAssignment: (orderId: string | null) => void;
  onStaffIdChange: (staffId: string) => void;
}

export interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export interface OrderPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface OrderStatus {
  value: string;
  label: string;
  color: string;
}

export interface PaymentStatus {
  value: string;
  label: string;
  color: string;
}
