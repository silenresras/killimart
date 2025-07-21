// pages/faqs/page.tsx
"use client";

import { useState } from 'react';

const faqData = [
  {
    question: "How do I track my order?",
    answer: "You can track your order through the My Orders section after logging in."
  },
  {
    question: "What is your return policy?",
    answer: "You can return products within 7 days as long as they are unused and in original packaging."
  },
  {
    question: "How do I contact support?",
    answer: "Reach out through our contact form or email us at support@killimart.com."
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-emerald-500 mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border rounded">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-4 py-3 bg-gray-100 font-medium hover:bg-gray-200"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 text-gray-700 bg-white border-t">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
