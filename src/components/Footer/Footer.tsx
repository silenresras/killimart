import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-16">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-300">
        {/* Company */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/pages/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/pages/terms-conditions" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link href="/pages/refund-policy" className="hover:underline">Refunds and Return Policy</Link></li>
          </ul>
        </div>

        {/* Business */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Business</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/pages/about-us" className="hover:underline">About Us</Link></li>
            <li><Link href="/pages/contact" className="hover:underline">Contact</Link></li>
            <li className="flex gap-4 mt-2 text-xl text-blue-600">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </li>
          </ul>
        </div>

        {/* Optional third column or remove if not needed */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/pages/faqs" className="hover:underline">FAQs</Link></li>
            <li><Link href="/pages/shipping-info" className="hover:underline">Shipping Info</Link></li>
            <li><Link href="/pages/help-center" className="hover:underline">Help Center</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center py-4 text-sm text-gray-500">
        © 2025 Killimart. All rights reserved.
      </div>
    </footer>
  );
}
