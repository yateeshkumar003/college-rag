import Link from 'next/link';
import Head from 'next/head';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Cpu, 
  CheckCircle2, 
  Database,
  Search,
  MessageSquare,
  FileText,
  Lock,
  History,
  Layers,
  FileCheck
} from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>CollegeRAG | Grounded College AI Chatbot Platform</title>
      </Head>

      <div className="min-h-screen bg-[#08090D] text-[#F8FAFC] font-sans flex flex-col justify-between overflow-x-hidden selection:bg-[#8B5CF6]/30 selection:text-[#8B5CF6]">
        
        {/* Subtle decorative mesh background */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#8B5CF6]/5 to-transparent pointer-events-none z-0"></div>
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#14B8A6]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Improved Navbar */}
        <header className="border-b border-[#252936] bg-[#08090D]/85 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/10">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#14B8A6] via-[#8B5CF6] to-pink-500 bg-clip-text text-transparent">
                CollegeRAG
              </span>
            </div>

            {/* Nav anchors */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#94A3B8]">
              <a href="#features" className="hover:text-[#F8FAFC] transition-colors">Features</a>
              <a href="#workflow" className="hover:text-[#F8FAFC] transition-colors">How It Works</a>
              <a href="#why-rag" className="hover:text-[#F8FAFC] transition-colors">RAG Architecture</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-4.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] hover:from-[#14B8A6]/90 hover:to-[#8B5CF6]/90 text-white shadow-lg shadow-[#8B5CF6]/15 hover:shadow-[#8B5CF6]/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111318] border border-[#252936] text-[10px] sm:text-xs text-[#14B8A6] font-bold tracking-wider uppercase mb-8 shadow-inner shadow-black/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>True Retrieval-Augmented Generation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl bg-gradient-to-b from-[#F8FAFC] to-[#94A3B8] bg-clip-text text-transparent">
            The Intelligent Knowledge Assistant for Your College
          </h1>

          <p className="mt-6 text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
            Ask questions and receive instant, grounded answers with exact document page references. Empowering students and simplifying university administration workloads.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center w-full max-w-sm sm:max-w-none">
            <Link 
              href="/register" 
              className="flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] hover:from-[#14B8A6]/95 hover:to-[#8B5CF6]/95 text-white shadow-lg shadow-[#8B5CF6]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Register as Student</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link 
              href="/login" 
              className="flex items-center justify-center px-8 py-4 rounded-xl font-bold bg-[#111318] hover:bg-[#161920] border border-[#252936] text-[#F8FAFC] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Login to Portal</span>
            </Link>
          </div>
        </section>

        {/* Chatbot Preview Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest">Interface Mockup</span>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-[#F8FAFC]">Chatbot Experience Preview</h2>
          </div>

          <div className="bg-[#111318] border border-[#252936] rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-[#8B5CF6] text-white rounded-2xl rounded-tr-none px-4 py-3 text-xs sm:text-sm max-w-md font-medium">
                What are the eligibility requirements for placements?
              </div>
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/25 border border-[#8B5CF6]/30 flex items-center justify-center text-xs font-bold text-[#8B5CF6] flex-shrink-0">U</div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="bg-[#08090D] border border-[#252936] rounded-2xl rounded-tl-none px-4 py-3.5 text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
                  According to the college rules, students must have a minimum CGPA of 7.5 and no active backlogs to be eligible for placement registrations.
                  <div className="mt-3.5 flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-[#14B8A6]/10 text-[#14B8A6] text-[9px] font-bold tracking-wider uppercase border border-[#14B8A6]/20">Grounded Context</span>
                  </div>
                </div>

                {/* Cited Sources Preview */}
                <div className="space-y-2.5">
                  <h5 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Retrieved Sources (2)</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-[#08090D] border border-[#252936] rounded-xl flex items-center space-x-3 hover:border-[#14B8A6]/30 transition-colors">
                      <FileText className="w-4 h-4 text-[#14B8A6]" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#F8FAFC]">Placement Policy</div>
                        <div className="text-[9px] text-[#94A3B8] font-semibold">Page 4 • 94% Relevance</div>
                      </div>
                    </div>
                    <div className="p-3 bg-[#08090D] border border-[#252936] rounded-xl flex items-center space-x-3 hover:border-[#14B8A6]/30 transition-colors">
                      <FileText className="w-4 h-4 text-[#14B8A6]" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#F8FAFC]">Student Handbook</div>
                        <div className="text-[9px] text-[#94A3B8] font-semibold">Page 27 • 89% Relevance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Polished RAG Workflow Visualization */}
        <section id="workflow" className="border-t border-[#252936] bg-[#111318]/30 py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest">System Pipeline</span>
              <h2 className="text-3xl font-extrabold mt-1 text-[#F8FAFC]">The Grounded RAG Architecture</h2>
              <p className="mt-4 text-sm text-[#94A3B8] max-w-xl mx-auto">
                Our workflow maps administrative inputs to verified responses using a strict document parsing and similarity retrieval pipeline.
              </p>
            </div>

            {/* Workflow steps flow grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
              {/* Step 1 */}
              <div className="p-5 bg-[#111318] border border-[#252936] rounded-2xl relative group hover:border-[#8B5CF6]/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] mb-4">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">1. College Docs</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-2 leading-relaxed">Official PDFs and DOCX notices are uploaded by administrators.</p>
                </div>
                <div className="text-[9px] font-mono text-[#8B5CF6] mt-4 font-bold uppercase">Source Input</div>
              </div>

              {/* Step 2 */}
              <div className="p-5 bg-[#111318] border border-[#252936] rounded-2xl relative group hover:border-[#8B5CF6]/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6] mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">2. Chunk & Embed</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-2 leading-relaxed">Texts are cleaned and chunked (900 tokens) before converting to 768-dim vectors.</p>
                </div>
                <div className="text-[9px] font-mono text-[#14B8A6] mt-4 font-bold uppercase">Processing</div>
              </div>

              {/* Step 3 */}
              <div className="p-5 bg-[#111318] border border-[#252936] rounded-2xl relative group hover:border-[#8B5CF6]/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] mb-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">3. Pinecone Index</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-2 leading-relaxed">Embeddings index directly in cloud vector memory, linked to MongoDB database chunks.</p>
                </div>
                <div className="text-[9px] font-mono text-[#8B5CF6] mt-4 font-bold uppercase">Storage</div>
              </div>

              {/* Step 4 */}
              <div className="p-5 bg-[#111318] border border-[#252936] rounded-2xl relative group hover:border-[#8B5CF6]/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6] mb-4">
                    <Search className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">4. Semantic Search</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-2 leading-relaxed">Student prompts search Pinecone using Cosine similarity (threshold filters &gt;= 0.65).</p>
                </div>
                <div className="text-[9px] font-mono text-[#14B8A6] mt-4 font-bold uppercase">Retrieval</div>
              </div>

              {/* Step 5 */}
              <div className="p-5 bg-[#111318] border border-[#252936] rounded-2xl relative group hover:border-[#8B5CF6]/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white mb-4">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">5. Grounded Answer</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-2 leading-relaxed">Gemini formulates answers strictly limited to retrieved context block source facts.</p>
                </div>
                <div className="text-[9px] font-mono text-purple-400 mt-4 font-bold uppercase">Output</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why CollegeRAG is a True RAG System */}
        <section id="why-rag" className="border-t border-[#252936] py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest">Architectural Pillars</span>
              <h2 className="text-3xl font-extrabold mt-1 text-[#F8FAFC]">Why CollegeRAG is a True RAG System</h2>
              <p className="mt-4 text-sm text-[#94A3B8] max-w-xl mx-auto">
                Unlike general AI wrappers, CollegeRAG enforces math-grounded verification constraints to guarantee data accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-6 bg-[#111318] border border-[#252936] rounded-2xl hover:translate-y-[-4px] hover:border-[#14B8A6]/40 hover:shadow-lg hover:shadow-[#14B8A6]/5 transition-all duration-300">
                <BookOpen className="w-6 h-6 text-[#14B8A6] mb-4" />
                <h4 className="text-base font-bold text-[#F8FAFC]">Document Knowledge</h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">Bound strictly to official university notice boards, rules, exam schedules, and calendars uploaded by admins.</p>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-[#111318] border border-[#252936] rounded-2xl hover:translate-y-[-4px] hover:border-[#8B5CF6]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/5 transition-all duration-300">
                <Cpu className="w-6 h-6 text-[#8B5CF6] mb-4" />
                <h4 className="text-base font-bold text-[#F8FAFC]">Dense Embeddings</h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">Converts document text chunks to mathematical vectors using Google's optimized embedding APIs.</p>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-[#111318] border border-[#252936] rounded-2xl hover:translate-y-[-4px] hover:border-[#14B8A6]/40 hover:shadow-lg hover:shadow-[#14B8A6]/5 transition-all duration-300">
                <Search className="w-6 h-6 text-[#14B8A6] mb-4" />
                <h4 className="text-base font-bold text-[#F8FAFC]">Semantic Search</h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">Queries vector database to extract relevant context, ignoring noise and irrelevant documents.</p>
              </div>

              {/* Card 4 */}
              <div className="p-6 bg-[#111318] border border-[#252936] rounded-2xl hover:translate-y-[-4px] hover:border-[#8B5CF6]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/5 transition-all duration-300">
                <Layers className="w-6 h-6 text-[#8B5CF6] mb-4" />
                <h4 className="text-base font-bold text-[#F8FAFC]">AI Generation</h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">Uses Gemini LLM models restricted strictly to provided query search results to answer.</p>
              </div>

              {/* Card 5 */}
              <div className="p-6 bg-[#111318] border border-[#252936] rounded-2xl hover:translate-y-[-4px] hover:border-[#14B8A6]/40 hover:shadow-lg hover:shadow-[#14B8A6]/5 transition-all duration-300">
                <FileCheck className="w-6 h-6 text-[#14B8A6] mb-4" />
                <h4 className="text-base font-bold text-[#F8FAFC]">Source References</h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">Every answer lists exactly which PDF/DOCX pages it extracted information from to build trust.</p>
              </div>

              {/* Card 6 */}
              <div className="p-6 bg-[#111318] border border-[#252936] rounded-2xl hover:translate-y-[-4px] hover:border-[#8B5CF6]/40 hover:shadow-lg hover:shadow-[#8B5CF6]/5 transition-all duration-300">
                <ShieldAlert className="w-6 h-6 text-[#8B5CF6] mb-4" />
                <h4 className="text-base font-bold text-[#F8FAFC]">Grounded Answers</h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">Enforces a strict hallucination guard: if the information is missing, the bot returns a refusal template.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature List Section */}
        <section id="features" className="border-t border-[#252936] py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest">Platform Capabilities</span>
              <h2 className="text-3xl font-extrabold mt-1 text-[#F8FAFC]">Project Features</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <MessageSquare className="w-6 h-6 text-[#14B8A6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">AI College Assistant</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">Grounded chatbot answers queries about leaves, placements, hostel, exams, and guidelines.</p>
              </div>

              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <FileText className="w-6 h-6 text-[#8B5CF6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">PDF/DOCX Knowledge Base</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">Administrators upload official documents directly in their dashboard to extend chatbot memory.</p>
              </div>

              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <Search className="w-6 h-6 text-[#14B8A6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">Semantic Retrieval</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">Uses dense embeddings and vector distance calculations to find highly matching context segments.</p>
              </div>

              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <FileCheck className="w-6 h-6 text-[#8B5CF6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">Source References</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">Renders clickable source citation badges showing file title, page references, and similarity score.</p>
              </div>

              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <Database className="w-6 h-6 text-[#14B8A6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">Admin Management</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">CRUD interface to delete files, reprocess documents, and inspect parsed chunks.</p>
              </div>

              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <History className="w-6 h-6 text-[#8B5CF6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">Chat History</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">Conversational memory allowing threads, sessions, continuation routing, and sidebar histories.</p>
              </div>

              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <Lock className="w-6 h-6 text-[#14B8A6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">Secure Authentication</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">Password hashing, JWT credentials tokens, and strict role-based access restrictions (Admin vs Student).</p>
              </div>

              <div className="p-5 bg-[#111318]/50 border border-[#252936] rounded-2xl space-y-3">
                <Cpu className="w-6 h-6 text-[#8B5CF6]" />
                <h4 className="text-sm font-bold text-[#F8FAFC]">Gemini & Pinecone APIs</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">Built on industry standard vector indexes and Google AI Studio LLMs with offline mock fallbacks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#252936] py-10 bg-[#08090D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-[#94A3B8] text-xs">
            <span>CollegeRAG © 2026. All rights reserved.</span>
            <div className="flex space-x-6">
              <span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#F8FAFC] transition-colors cursor-pointer">Terms of Service</span>
              <Link href="/login" className="hover:text-[#8B5CF6] transition-colors">Admin Login</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
