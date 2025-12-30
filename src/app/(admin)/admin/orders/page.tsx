// app/(admin)/orders/page.tsx
'use client';

import AdminOrderList from '@/components/admin/orders/AdminOrderList';

export default function OrdersPage() {
  return (
    <div className="p-4">
      <AdminOrderList />
    </div>
  );
}
