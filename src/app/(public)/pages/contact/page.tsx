import { FiMail, FiPhone } from 'react-icons/fi';

export default function Contact() {

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-emerald-500 mb-2">Contact Us</h1>

      {/* NEW: quick-action bar */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm">
        <a
          href="mailto:support@killimart.com"
          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800"
        >
          <FiMail /> Email us
        </a>

        <a
          href="tel:+25475737887"
          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800"
        >
          <FiPhone /> +25475737887
        </a>
        <a
          href="tel:+254791191864"
          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800"
        >
          <FiPhone /> +254791191864
        </a>
      </div>

      {/* existing form */}
      <form className="space-y-6">
        <input type="text" placeholder="Your Name" className="w-full border px-4 py-2 rounded" required />
        <input type="email" placeholder="Your Email" className="w-full border px-4 py-2 rounded" required />
        <textarea placeholder="Your Message" className="w-full border px-4 py-2 rounded h-32" required />
        <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600">
          Send Message
        </button>
      </form>
      
    </div>
  );
}