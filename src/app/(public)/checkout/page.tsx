  'use client';

  import Link from 'next/link';
  import { useRouter } from 'next/navigation';
  import { useEffect, useState, useCallback } from 'react';

  import { useCartContext } from '@/components/Context/CartContext';
  import { useShippingStore } from '@/store/useShippingStore';
  import { useOrderStore } from '@/store/useOrderStore';
  import type { PlaceOrderPayload } from '@/types/order';

  import PaymentInstructionsModal from '@/components/orders/PaymentInstructionsModal';

  export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCartContext();

    const { addresses, loading: addressLoading, fetchAddresses } = useShippingStore();
    const {
      placeOrder,
      isSuccess,
      isLoading,
      error,
      setIsSuccess,
      setError
    } = useOrderStore();

    const [showPayModal, setShowPayModal] = useState(false);
    const [orderTotal, setOrderTotal] = useState(0);

    const defaultAddress = addresses.find((a) => a.isDefault);
    const shippingFee = defaultAddress?.shippingFee ?? 129;

    const productTotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalPrice = productTotal + shippingFee;

    // Fetch addresses on mount
    useEffect(() => {
      fetchAddresses();
    }, [fetchAddresses]);

    // When order placement succeeds, open modal and clear cart
    useEffect(() => {
      if (!isSuccess) return;
      clearCart();
      setShowPayModal(true);
      setIsSuccess(false); // Prevents this effect from re-triggering
    }, [isSuccess, clearCart, setIsSuccess]);

    const handlePlaceOrder = useCallback(async () => {
      if (!defaultAddress) {
        alert('Please add a shipping address before placing your order.');
        return;
      }

      if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      const payload: PlaceOrderPayload = {
        orderItems: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          county: defaultAddress.county,
          subCounty: defaultAddress.subCounty,
          town: defaultAddress.town,
          phoneNumber: defaultAddress.phoneNumber,
          shippingFee
        },
        totalPrice
      };

      setOrderTotal(totalPrice);

      try {
        await placeOrder(payload);
      } catch {
        setError('Failed to place order. Please try again.');
      }
    }, [cart, defaultAddress, placeOrder, setError, shippingFee, totalPrice]);

    return (
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <h1 className="text-2xl font-bold">Checkout</h1>

        {/* Products */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Products</h2>
          {cart.length > 0 ? (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.product._id} className="flex justify-between text-sm">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item.product.name} × {item.quantity}
                  </Link>
                  <span>KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
          <p className="text-sm text-gray-700">M-PESA (Only supported method currently)</p>
        </div>

        {/* Shipping Information */}
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Shipping Information</h2>
            <Link href="/myaccount/overview" className="text-blue-500 text-sm hover:underline">
              View
            </Link>
          </div>

          {addressLoading ? (
            <p className="text-sm text-gray-600 mt-3">Loading address...</p>
          ) : defaultAddress ? (
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p><strong>County:</strong> {defaultAddress.county}</p>
              <p><strong>Sub-County:</strong> {defaultAddress.subCounty}</p>
              <p><strong>Town:</strong> {defaultAddress.town}</p>
              <p><strong>Phone:</strong> {defaultAddress.phoneNumber}</p>
              <p><strong>Shipping Fee:</strong> KSh {shippingFee.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-red-500 text-sm mt-3">
              No shipping address found. Please{" "}
              <Link href="/myaccount/overview" className="underline text-blue-600">
                add one
              </Link>
              .
            </p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="border p-4 rounded-lg shadow-sm space-y-2">
          <h2 className="text-lg font-semibold">Payment Summary</h2>
          <div className="flex justify-between text-sm">
            <span>Product Amount</span>
            <span>KSh {productTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping Fee</span>
            <span className="text-gray-600">+ KSh {shippingFee.toLocaleString()}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-base">
            <span>Total Amount</span>
            <span>KSh {totalPrice.toLocaleString()}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!defaultAddress || isLoading || cart.length === 0}
            className={`w-full mt-4 py-2 rounded ${
              defaultAddress && !isLoading && cart.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white`}
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Payment Instruction Modal */}
        <PaymentInstructionsModal
          totalAmount={orderTotal}
          isOpen={showPayModal}
          onClose={() => {
            setShowPayModal(false);
            router.push('/myaccount/orders');
          }}
        />
      </div>
    );
  }
