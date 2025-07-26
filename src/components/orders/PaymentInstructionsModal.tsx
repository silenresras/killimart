// components/orders/PaymentInstructionsModal.tsx
"use client";

import React from "react";

interface Props {
  totalAmount: number;
  isOpen: boolean;
  onClose?: () => void;
  onConfirmPayment: () => void; // 👈 new
}


const PaymentInstructionsModal: React.FC<Props> = ({
  totalAmount,
  isOpen,
  onClose,
  onConfirmPayment
}) => {
  const tillNumber = "3121956";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tillNumber);
  };

  const handleConfirm = () => {
    onConfirmPayment(); // 
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 space-y-4 text-sm">
        <h2 className="text-lg font-bold text-center">Order Placed!</h2>

        <p>
          To complete your purchase, follow the steps below:
        </p>

        <ol className="list-decimal list-inside space-y-1">
          <li>Go to <strong>M-Pesa</strong></li>
          <li>Select <strong>Lipa na M-Pesa</strong></li>
          <li>Choose <strong>Buy Goods & Services</strong></li>
          <li>
            Enter Till Number:{" "}
            <strong
              className="cursor-pointer underline text-blue-600"
              onClick={copyToClipboard}
            >
              {tillNumber}
            </strong>{" "}
            (tap to copy)
          </li>
          <li>
            Enter Amount: <strong>KES {totalAmount}</strong>
          </li>
          <li>Enter PIN and confirm</li>
          <li>Confirm <strong>Nicholas Wachira</strong></li>
        </ol>

        <p className="text-xs text-gray-500">
          After payment, your order will appear under “Unpaid” in your account
          until admin verification.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            I’ve Paid – View Orders
          </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsModal;