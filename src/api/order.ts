// /api/order.ts
import { auth_api } from './api';
import { OrderData } from '@/types/order';

export const placeOrder = async (orderData: OrderData) => {
  const res = await auth_api.post('/orders', orderData);
  return res.data;
};
