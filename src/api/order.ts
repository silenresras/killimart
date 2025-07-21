// /api/order.ts
import { auth_api } from './api';

export const placeOrder = async (orderData: any) => {
  const res = await auth_api.post('/orders', orderData);
  return res.data;
};
