export default function Contact() {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-emerald-500 mb-4">Contact Us</h1>
        <form className="space-y-6">
          <input type="text" placeholder="Your Name" className="w-full border px-4 py-2 rounded" required />
          <input type="email" placeholder="Your Email" className="w-full border px-4 py-2 rounded" required />
          <textarea placeholder="Your Message" className="w-full border px-4 py-2 rounded h-32" required />
          <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600">Send Message</button>
        </form>
      </div>
    );
  }