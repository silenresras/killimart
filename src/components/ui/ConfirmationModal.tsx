'use client';

import { ReactNode } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
  children,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl border">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}
        {children}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
