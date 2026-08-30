import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function SourceCard({ source }) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert relevance score to percentage
  const percentageScore = Math.round(source.score * 100);

  return (
    <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-md hover:border-slate-800 transition-colors">
      
      {/* Header ( हमेशा visible ) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 select-none transition-colors"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 flex-shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-slate-200 truncate">{source.documentTitle}</h5>
            <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
              Page {source.page || 1} &bull; Score {percentageScore}%
            </p>
          </div>
        </div>

        <div className="text-slate-500 hover:text-slate-350 transition-colors pl-2">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Expandable Excerpt Content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-900/80 bg-slate-950">
          <blockquote className="text-[10px] text-slate-450 leading-relaxed font-sans border-l-2 border-slate-800 pl-3">
            {source.excerpt || "No content summary available."}
          </blockquote>
        </div>
      )}

    </div>
  );
}
