import SourceCard from '../SourceCard';
import { User, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>
      <div className={`flex items-start space-x-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`p-2 rounded-xl flex-shrink-0 border ${
          isUser 
            ? 'bg-slate-900 border-slate-800 text-slate-350' 
            : 'bg-indigo-950/40 border-indigo-900/40 text-indigo-400'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>

        {/* Message Content Bubble */}
        <div className="space-y-3">
          <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-none'
              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
          }`}>
            {/* Split content by newline to maintain paragraph formatting */}
            <div className="whitespace-pre-wrap font-sans">
              {message.content}
            </div>
            
            {/* Grounding badge indicator (Assistant messages only) */}
            {!isUser && (
              <div className="mt-3 flex items-center justify-between border-t border-slate-850 pt-2.5 text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
                <span>CollegeRAG Assistant</span>
                <span className="flex items-center space-x-1">
                  {message.grounded ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-400">Grounded Context</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-rose-400">Ungrounded response</span>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Citation cards block (Assistant messages only) */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block pl-1">
                Retrieved Sources ({message.sources.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.sources.map((src, index) => (
                  <SourceCard key={src.chunkId || index} source={src} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
