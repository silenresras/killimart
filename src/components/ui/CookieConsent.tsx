'use client';
import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-md shadow-lg flex justify-between items-center z-50 flex-wrap gap-2">
      <p className="text-sm flex-1">We use cookies to improve your experience. By using our site, you agree to our cookie policy.</p>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
