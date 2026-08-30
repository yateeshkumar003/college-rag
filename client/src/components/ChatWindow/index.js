import { useState, useEffect, useRef } from 'react';
import ChatMessage from '../ChatMessage';
import { Send, Sparkles, AlertCircle, Loader } from 'lucide-react';

export default function ChatWindow({ 
  messages, 
  loading, 
  error, 
  onSendMessage 
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat history when new messages load or print
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !loading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-slate-950 relative">
      
      {/* Scrollable messages history container */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
        {messages.length === 0 ? (
          // Empty State Prompt Layout
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-5">
            <div className="p-4 rounded-full bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Welcome to CollegeRAG</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Ask any questions about the college guidelines, admissions criteria, academic notices, hostel rules, or placement statistics. 
                Answers will be generated strictly based on verified college documents.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
              <div 
                onClick={() => setInputText('What documents are required for admission?')}
                className="p-3 text-left bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl cursor-pointer text-[11px] text-slate-350 transition-colors"
              >
                "What documents are required for admission?"
              </div>
              <div 
                onClick={() => setInputText('What are the hostel timings?')}
                className="p-3 text-left bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl cursor-pointer text-[11px] text-slate-350 transition-colors"
              >
                "What are the hostel timings?"
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg._id} message={msg} />
          ))
        )}

        {/* Typing Loading indicator */}
        {loading && (
          <div className="flex items-start space-x-3 mb-5">
            <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-450 text-xs flex items-center space-x-2">
              <Loader className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Generating grounded answer...</span>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-355 text-xs flex items-start space-x-2.5 mb-5 max-w-2-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Form Bar */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <form onSubmit={handleFormSubmit} className="max-w-4-xl mx-auto flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-colors">
          <input
            type="text"
            disabled={loading}
            placeholder="Type your question here (e.g. When is the exam fee deadline?)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-xs text-slate-100 placeholder-slate-650 px-3 py-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-[0.96]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
