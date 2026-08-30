import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { 
  Database,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  ShieldAlert,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { conversations, fetchConversations, resetChat } = useChatStore();
  
  const [docCount, setDocCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchConversations();
    
    const fetchStats = async () => {
      try {
        const res = await api.get('/documents');
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

      <div className="space-y-8 max-w-5xl mx-auto flex-1 flex flex-col justify-between">
        
        <div className="space-y-8">
          {/* Top Info Bar */}
          <div className="flex justify-between items-center bg-white border border-[#E4E7EC] rounded-xl px-5 py-3.5 shadow-sm">
            <h2 className="text-xs font-bold text-[#12233F]">Student Dashboard</h2>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16806A]"></span>
              <span className="text-[9px] font-bold text-[#16806A] uppercase tracking-wider">Connected</span>
            </div>
          </div>

          {/* Welcome Card Banner */}
          <div className="bg-gradient-to-r from-white to-blue-50/30 border border-[#E4E7EC] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
            <div className="space-y-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-blue-50 text-[#2563EB] text-[9px] font-bold tracking-wider uppercase border border-blue-100">
                Student Portal
              </span>
              <h1 className="text-2xl font-black text-[#12233F]">
                Welcome back, {user?.name || 'Student'}!
              </h1>
              <p className="text-xs text-[#667085] max-w-md leading-relaxed">
                Have questions about hostel rules, placement drives, or grading criteria? Ask CollegeRAG, grounded in official campus files.
              </p>
            </div>
            <button
              onClick={handleStartChat}
              className="px-5 py-3 rounded-lg text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm flex items-center space-x-2 transition-all hover:translate-x-0.5"
            >
              <span>Start Chatting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Statistics Section */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold text-[#667085] uppercase tracking-widest">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Knowledge Base */}
              <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-100 flex-shrink-0">
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Knowledge Base</p>
                  <h4 className="text-sm font-extrabold text-[#12233F] mt-0.5">
                    {loadingStats ? '...' : `${docCount} Verified Documents`}
                  </h4>
                  <p className="text-[10px] text-[#667085] font-medium mt-0.5">Up to date</p>
                </div>
              </div>

              {/* Card 2: Retrieval Mode */}
              <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-purple-50 text-[#8B5CF6] border border-purple-100 flex-shrink-0">
                  <Search className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Retrieval Mode</p>
                  <h4 className="text-sm font-extrabold text-[#12233F] mt-0.5">Cosine Similarity RAG</h4>
                  <p className="text-[10px] text-[#667085] font-medium mt-0.5">Semantic search enabled</p>
                </div>
              </div>

              {/* Card 3: Saved Sessions */}
              <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 shadow-sm flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-[#16806A] border border-emerald-100 flex-shrink-0">
                  <MessageSquare className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Saved Sessions</p>
                  <h4 className="text-sm font-extrabold text-[#12233F] mt-0.5">
                    {conversations.length} Active Chats
                  </h4>
                  <p className="text-[10px] text-[#667085] font-medium mt-0.5">Continue your conversations</p>
                </div>
              </div>

            </div>
          </section>

          {/* Suggested Queries & Recent Conversations (50/50 Split) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Suggested Queries Card */}
            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm flex flex-col justify-between h-[300px]">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#667085] uppercase tracking-widest border-b border-[#E4E7EC] pb-3 flex items-center space-x-2">
                  <Sparkles className="w-4.5 h-4.5 text-[#2563EB]" />
                  <span>Suggested Queries</span>
                </h3>
                
                <div className="space-y-2.5">
                  <button 
                    onClick={() => handleQuickQuestion('What is the grading policy and exam criteria?')}
                    className="w-full text-left p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#2563EB]/45 hover:bg-[#EFF6FF] text-xs font-semibold text-[#172033] hover:text-[#2563EB] transition-all flex justify-between items-center group"
                  >
                    <span>"What is the grading policy and exam criteria?"</span>
                    <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#2563EB] transition-colors" />
                  </button>
                  <button 
                    onClick={() => handleQuickQuestion('What are the placement drive registration details?')}
                    className="w-full text-left p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#2563EB]/45 hover:bg-[#EFF6FF] text-xs font-semibold text-[#172033] hover:text-[#2563EB] transition-all flex justify-between items-center group"
                  >
                    <span>"What are the placement drive registration details?"</span>
                    <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#2563EB] transition-colors" />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleStartChat}
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors flex items-center space-x-1 mt-4"
              >
                <span>View more examples</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recent Conversations Card */}
            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm flex flex-col justify-between h-[300px]">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#667085] uppercase tracking-widest border-b border-[#E4E7EC] pb-3 flex items-center space-x-2">
                  <Clock className="w-4.5 h-4.5 text-[#2563EB]" />
                  <span>Recent Conversations</span>
                </h3>

                <div className="space-y-2.5">
                  {conversations.length === 0 ? (
                    <div className="text-center py-10 text-[#667085] text-xs font-semibold">
                      <p>No previous conversations found.</p>
                      <button 
                        onClick={handleStartChat}
                        className="mt-2 text-[#2563EB] hover:underline"
                      >
                        Start a new conversation
                      </button>
                    </div>
                  ) : (
                    conversations.slice(0, 2).map((conv) => (
                      <div
                        key={conv._id}
                        onClick={() => router.push(`/chat/${conv._id}`)}
                        className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#2563EB]/40 hover:bg-[#EFF6FF] cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <MessageSquare className="w-4 h-4 text-[#667085] group-hover:text-[#2563EB] flex-shrink-0" />
                          <span className="text-xs truncate font-semibold text-[#172033] group-hover:text-[#2563EB]">{conv.title}</span>
                        </div>
                        <span className="text-[10px] text-[#667085] font-semibold">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button 
                onClick={() => router.push('/chat')}
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors flex items-center space-x-1 mt-4"
              >
                <span>View all conversations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* How CollegeRAG Works Informational Section */}
          <section className="bg-white border border-[#E4E7EC] rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-[10px] font-bold text-[#667085] uppercase tracking-widest">How CollegeRAG Works</h3>
              <p className="text-xs text-[#667085] mt-1">Our platform maps student requests to official document sources in four steps.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg relative space-y-3">
                <span className="text-[10px] font-bold text-[#2563EB] font-mono">01</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <h5 className="text-xs font-bold text-[#12233F]">Your Question</h5>
                <p className="text-[10px] text-[#667085] leading-relaxed">Enter queries about admissions, exams, hostels, or guidelines.</p>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg relative space-y-3">
                <span className="text-[10px] font-bold text-[#2563EB] font-mono">02</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8B5CF6] border border-purple-100 flex items-center justify-center">
                  <Search className="w-4.5 h-4.5" />
                </div>
                <h5 className="text-xs font-bold text-[#12233F]">Semantic Retrieval</h5>
                <p className="text-[10px] text-[#667085] leading-relaxed">The system converts the query and checks similarity matches in Pinecone.</p>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg relative space-y-3">
                <span className="text-[10px] font-bold text-[#2563EB] font-mono">03</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16806A] border border-emerald-100 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <h5 className="text-xs font-bold text-[#12233F]">College Documents</h5>
                <p className="text-[10px] text-[#667085] leading-relaxed">Extracts relevant context blocks directly from verified campus files.</p>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg relative space-y-3">
                <span className="text-[10px] font-bold text-[#2563EB] font-mono">04</span>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <h5 className="text-xs font-bold text-[#12233F]">Grounded Answer</h5>
                <p className="text-[10px] text-[#2563EB] leading-relaxed font-semibold">Gemini answers using strictly retrieved facts and prints references.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Division */}
        <footer className="pt-6 border-t border-[#E4E7EC] mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#667085] font-semibold">
          <div className="text-center sm:text-left">
            <span>CollegeRAG © 2026. Built with Google Gemini & Pinecone.</span>
          </div>
          <div className="px-3 py-1.5 rounded border border-dashed border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold text-[9px] uppercase tracking-wider">
            &lt;/&gt; Designed & Developed by Yateesh Kumar
          </div>
          <div className="flex items-center space-x-4">
            <span>All rights reserved.</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16806A]" />
              <span>Secure & Trusted</span>
            </span>
          </div>
        </footer>

      </div>
    </>
  );
}
