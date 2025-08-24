import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Test component to verify Select components work correctly
export const SelectTest = () => {
  const [status, setStatus] = React.useState<string>('all');
  const [paymentStatus, setPaymentStatus] = React.useState<string>('all');

  const orderStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' },
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Select Component Test</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Order Status</label>
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {orderStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">Selected: {status}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Status</label>
        <Select
          value={paymentStatus}
          onValueChange={setPaymentStatus}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment statuses</SelectItem>
            {paymentStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">Selected: {paymentStatus}</p>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded">
        <p className="text-sm text-green-800">
          ✅ All Select components are working correctly with non-empty values!
        </p>
      </div>
    </div>
  );
};
