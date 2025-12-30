'use client';
import { useEffect, useState } from 'react';

const UPDATE_KEY = "update-notification-v2"; // change if message changes

export default function UpdateNotification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem(UPDATE_KEY);
    if (!shown) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(UPDATE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-3 rounded-md shadow-lg z-[9999] animate-shake"
      role="alert"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">
          🚧 We’re actively improving and adding new features. Stay tuned!
        </span>
        <button
          onClick={handleClose}
          className="text-white font-bold text-xl leading-none hover:text-gray-300"
        >
          ×
        </button>
      </div>
    </div>
  );
}
