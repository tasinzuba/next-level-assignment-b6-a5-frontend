'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function getAIResponse(input: string): string {
  const text = input.toLowerCase().trim();

  if (/^(hi|hello|hey|greetings)/.test(text)) {
    return "Hello! I'm Recape AI Assistant. How can I help you find your next movie?";
  }
  if (/recommend|suggest|what.*(watch|see|movie)/.test(text)) {
    return "Based on popular choices, I'd suggest checking out our Featured section! You can also browse by genre like Action, Drama, or Sci-Fi. Visit /movies to explore!";
  }
  if (/action/.test(text)) return "Great choice! Check out our Action collection. Head to Browse Movies and filter by Action genre!";
  if (/comedy/.test(text)) return "Love a good laugh! Browse our Comedy movies for the best picks!";
  if (/horror|scary/.test(text)) return "Feeling brave? Our Horror collection has some spine-chilling titles!";
  if (/drama/.test(text)) return "Drama lovers rejoice! We have an amazing Drama collection waiting for you.";
  if (/sci-fi|science fiction/.test(text)) return "Sci-Fi fan? Explore our futuristic Sci-Fi collection!";
  if (/romance|love/.test(text)) return "Looking for romance? Our Romance collection has heartwarming stories!";
  if (/thriller|suspense/.test(text)) return "Thrillers keep you on the edge! Check out our Thriller collection.";
  if (/free/.test(text)) return "We have hundreds of free movies! Visit /movies and filter by 'Free' to browse them all.";
  if (/premium/.test(text)) return "Premium content includes 1080p/4K streaming and exclusive titles. Subscribe at /subscription!";
  if (/review|rate|rating/.test(text)) return "You can write reviews on any movie's detail page! Click a movie, scroll down, and share your thoughts. Reviews are moderated before publishing.";
  if (/subscribe|subscription|plan|price|cost/.test(text)) return "We offer Monthly ($9.99/mo) and Yearly ($79.99/yr) plans. The yearly plan saves you 33%! Visit /subscription for details.";
  if (/search|find|look/.test(text)) return "Use the search bar in the navbar to find any movie or series. You can also filter by genre, price type, and media type on the Browse page!";
  if (/watchlist|save|bookmark/.test(text)) return "You can save movies to your watchlist from any movie's detail page. Click the 'Add to Watchlist' button!";
  if (/help|what can you/.test(text)) return "I can help you with:\n- Movie recommendations\n- Genre suggestions\n- Review & rating info\n- Subscription plans\n- Search tips\n- Watchlist management\n\nJust ask me anything!";
  if (/thank|thanks/.test(text)) return "You're welcome! Enjoy your movie experience on Recape! 🎬";
  if (/bye|goodbye/.test(text)) return "Goodbye! Come back anytime for movie recommendations. Happy watching!";

  return "I'm not sure about that. Try asking about movie recommendations, genres, reviews, or subscription plans! Type 'help' to see what I can assist with.";
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hi! I'm Recape AI Assistant. Ask me about movies, genres, reviews, or anything else!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, text: getAIResponse(input), sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-900/30 flex items-center justify-center transition-transform hover:scale-110"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-red-600 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Recape AI Assistant</p>
              <p className="text-red-200 text-xs">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-red-600 text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-zinc-800 p-3">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about movies..."
                className="flex-1 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
              />
              <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
