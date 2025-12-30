'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([
    { from: 'bot', text: 'Hi customer, welcome to Kilimart. How can I assist you?' },
  ]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        const botMessage = { from: 'bot' as const, text: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = data?.error || 'Something went wrong.';
        setMessages((prev) => [...prev, { from: 'bot', text: `⚠️ ${errorMessage}` }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: '⚠️ Network error. Please check your internet connection or try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg z-[1000]"
        >
          Open Chat
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-300 z-[1000]">
          {/* Header */}
          <div className="bg-emerald-500 text-white px-4 py-2 flex justify-between items-center rounded-t-xl">
            <h2 className="text-lg font-semibold">Assistant</h2>
            <button onClick={() => setOpen(false)} className="text-white font-bold text-lg">
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <span
                  className={`max-w-[80%] px-3 py-2 text-sm rounded-lg ${msg.from === 'bot'
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-emerald-500 text-white'
                    }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <span className="px-3 py-2 text-sm rounded-lg bg-gray-200 animate-pulse">
                  Typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t border-gray-200 flex bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-md mr-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={sendMessage}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
