import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { 
  Sparkles, 
  Database, 
  MessageSquare, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { conversations, fetchConversations, resetChat } = useChatStore();
  
  const [docCount, setDocCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchConversations();
    
    // Fetch basic document count stats from public info or helper endpoint
    const fetchStats = async () => {
      try {
        // Just call public documents listing to check size
        const res = await api.get('/documents');
        // Filter those in READY state
        const readyDocs = res.data.data.filter(d => d.status === 'READY');
        setDocCount(readyDocs.length);
      } catch (err) {
        console.error('Error loading documents stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleStartChat = () => {
    resetChat();
    router.push('/chat');
  };

  const handleQuickQuestion = async (prompt) => {
    resetChat();
    // Redirect to chat and trigger prompt via state hook
    router.push({
      pathname: '/chat',
      query: { autoSend: prompt }
    });
  };

  return (
    <>
      <Head>
        <title>Student Dashboard | CollegeRAG</title>
      </Head>

      <div className="space-y-8 max-w-5-xl mx-auto">
        
        {/* Welcome Card Banner */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          <div className="space-y-2.5 text-center md:text-left z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 uppercase">
              Student Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Have questions about hostel rules, placement drives, or grading criteria? Ask CollegeRAG, grounded in official campus files.
            </p>
          </div>
          <button
            onClick={handleStartChat}
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-650 hover:from-indigo-500 hover:to-purple-600 text-white shadow-lg active:scale-[0.98] transition-all flex items-center space-x-2 z-10"
          >
            <span>Start Chatting</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Background graphics */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-650/10 rounded-full blur-3xl -z-0 translate-x-20 -translate-y-20"></div>
        </div>

        {/* Stats & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* KB status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Knowledge Base</p>
              <h3 className="text-base font-extrabold text-slate-200 mt-0.5">
                {loadingStats ? '...' : `${docCount} Verified Documents`}
              </h3>
            </div>
          </div>

          {/* Quick Chat Link */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-900/40 text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Retrieval Mode</p>
              <h3 className="text-base font-extrabold text-slate-200 mt-0.5">Cosine Similarity RAG</h3>
            </div>
          </div>

          {/* Active Conversations Count */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
            <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-900/40 text-teal-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Saved Sessions</p>
              <h3 className="text-base font-extrabold text-slate-200 mt-0.5">
                {conversations.length} Active Chats
              </h3>
            </div>
          </div>

        </div>

        {/* Content Split: Suggested Questions & Recent Chats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Suggested Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-2.5 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Suggested Queries</span>
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickQuestion('What is the grading policy and exam criteria?')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-850 text-xs text-slate-350 hover:text-slate-100 transition-all flex justify-between items-center group"
              >
                <span>"What is the grading policy and exam criteria?"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
              <button 
                onClick={() => handleQuickQuestion('What are the placement drive registration details?')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-850 text-xs text-slate-350 hover:text-slate-100 transition-all flex justify-between items-center group"
              >
                <span>"What are the placement drive registration details?"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
              <button 
                onClick={() => handleQuickQuestion('When does the winter semester enrollment start?')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-850 text-xs text-slate-350 hover:text-slate-100 transition-all flex justify-between items-center group"
              >
                <span>"When does the winter semester enrollment start?"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-2.5 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Recent Conversations</span>
            </h3>
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-xs">
                  <p>No previous conversations found.</p>
                  <button 
                    onClick={handleStartChat}
                    className="mt-2.5 text-indigo-450 hover:underline"
                  >
                    Start a new conversation
                  </button>
                </div>
              ) : (
                conversations.slice(0, 4).map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => router.push(`/chat/${conv._id}`)}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-850 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                      <span className="text-xs truncate font-medium text-slate-350 group-hover:text-slate-200">{conv.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
