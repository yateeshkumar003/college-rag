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
  FileCheck,
  Check,
  ChevronRight,
  Upload
} from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>CollegeRAG | Grounded College AI Chatbot Platform</title>
      </Head>

      <div className="min-h-screen bg-[#F7F8FA] text-[#172033] font-sans flex flex-col justify-between overflow-x-hidden selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
        
        {/* Main Navbar */}
        <header className="border-b border-[#E4E7EC] bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8.5 h-8.5 rounded-lg bg-[#12233F] flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-[#12233F]">
                CollegeRAG
              </span>
            </div>

            {/* Nav anchors */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#667085]">
              <a href="#features" className="hover:text-[#12233F] transition-colors">Features</a>
              <a href="#workflow" className="hover:text-[#12233F] transition-colors">How It Works</a>
              <a href="#why-rag" className="hover:text-[#12233F] transition-colors">RAG Architecture</a>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login" className="text-xs sm:text-sm font-bold text-[#667085] hover:text-[#12233F] transition-colors px-2 py-1.5">
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm transition-all transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[10px] sm:text-xs text-[#2563EB] font-bold tracking-wider uppercase mb-8">
            <span>AI-POWERED COLLEGE KNOWLEDGE ASSISTANT</span>
          </div>

          <h1 className="text-4xl sm:text-[52px] font-black tracking-tight leading-tight text-[#12233F] max-w-3xl">
            The Intelligent Knowledge Assistant for Your College
          </h1>

          <p className="mt-6 text-base text-[#667085] max-w-2xl leading-relaxed">
            Students can ask questions and receive answers grounded in college documents with source references. Enforcing verified inputs to eliminate AI hallucinations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center w-full max-w-xs sm:max-w-none">
            <Link 
              href="/register" 
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#workflow" 
              className="flex items-center justify-center px-6 py-3 rounded-lg font-bold bg-white hover:bg-[#F2F4F7] border border-[#E4E7EC] text-[#172033] transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Explore How It Works
            </a>
          </div>
        </section>

        {/* Hero Visual Mockup */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
          <div className="bg-white border border-[#E4E7EC] rounded-xl shadow-md p-5 sm:p-6 space-y-5">
            <div className="border-b border-[#E4E7EC] pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-semibold text-[#667085]">CollegeRAG Portal Preview</span>
              <div className="w-4"></div>
            </div>

            {/* Student Message */}
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-[#EFF6FF] text-[#12233F] border border-[#BFDBFE] rounded-lg px-4 py-2.5 text-xs sm:text-sm font-semibold max-w-md">
                What are the hostel entry timings?
              </div>
            </div>

            {/* AI response */}
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-[#12233F] flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#172033] leading-relaxed">
                  The hostel gates are normally open from **6:00 AM to 10:00 PM**.
                  <div className="mt-2.5 flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-[#16806A]/10 text-[#16806A] text-[9px] font-bold tracking-wider uppercase border border-[#16806A]/20">Grounded Answer</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Source Reference</h5>
                  <div className="p-2.5 bg-white border border-[#E4E7EC] rounded-lg flex items-center justify-between max-w-md hover:border-[#2563EB]/40 transition-colors">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span className="text-xs font-bold text-[#172033]">College Hostel Rules & Regulations</span>
                    </div>
                    <span className="text-[10px] text-[#667085] font-semibold bg-[#F2F4F7] px-2 py-0.5 rounded">Page 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works RAG Workflow Section */}
        <section id="workflow" className="border-t border-[#E4E7EC] bg-white py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Pipeline Details</span>
              <h2 className="text-3xl font-extrabold mt-1 text-[#12233F]">How CollegeRAG Works</h2>
              <p className="mt-4 text-sm text-[#667085] max-w-xl mx-auto">
                A structured overview of how documents are transformed from static files into interactive, grounded answers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
              {/* Card 1 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] font-mono">01</span>
                  <h4 className="text-xs font-bold text-[#12233F] mt-2">Documents</h4>
                  <p className="text-[#667085] text-[10px] mt-1.5 leading-relaxed">Admins upload official university PDFs and DOCX guidelines.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] font-mono">02</span>
                  <h4 className="text-xs font-bold text-[#12233F] mt-2">Text Extraction</h4>
                  <p className="text-[#667085] text-[10px] mt-1.5 leading-relaxed">System extracts and sanitizes raw text layout data.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] font-mono">03</span>
                  <h4 className="text-xs font-bold text-[#12233F] mt-2">Embeddings</h4>
                  <p className="text-[#667085] text-[10px] mt-1.5 leading-relaxed">Converts text chunks into dense 768-dimensional vectors.</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] font-mono">04</span>
                  <h4 className="text-xs font-bold text-[#12233F] mt-2">Semantic Search</h4>
                  <p className="text-[#667085] text-[10px] mt-1.5 leading-relaxed">Finds matching passages in Pinecone matching query vector.</p>
                </div>
              </div>

              {/* Card 5 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] font-mono">05</span>
                  <h4 className="text-xs font-bold text-[#12233F] mt-2">AI Generation</h4>
                  <p className="text-[#667085] text-[10px] mt-1.5 leading-relaxed">LLM crafts response restricted strictly to matched context.</p>
                </div>
              </div>

              {/* Card 6 */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] font-mono">06</span>
                  <h4 className="text-xs font-bold text-[#12233F] mt-2">Sources</h4>
                  <p className="text-[#667085] text-[10px] mt-1.5 leading-relaxed">The frontend displays clickable page citations for the answer.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RAG Core Technical Mapping Diagram */}
        <section id="why-rag" className="border-t border-[#E4E7EC] py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">System Architecture</span>
              <h2 className="text-3xl font-extrabold mt-1 text-[#12233F]">The True RAG Architecture</h2>
              <p className="mt-4 text-sm text-[#667085] max-w-xl mx-auto">
                Visualizing how queries flow through our semantic retrieval pipelines without hallucination.
              </p>
            </div>

            {/* Technical block flow diagram */}
            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs text-[#12233F]">
                
                <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">1. College Docs</span>
                  <span className="text-[10px] text-[#667085]">Academic files</span>
                </div>
                
                <div className="hidden md:flex justify-center text-[#667085]"><ChevronRight className="w-5 h-5" /></div>

                <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">2. Processing</span>
                  <span className="text-[10px] text-[#667085]">Clean text splits</span>
                </div>

                <div className="hidden md:flex justify-center text-[#667085]"><ChevronRight className="w-5 h-5" /></div>

                <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">3. Embeddings</span>
                  <span className="text-[10px] text-[#667085]">Google models</span>
                </div>

                <div className="hidden md:flex justify-center text-[#667085]"><ChevronRight className="w-5 h-5" /></div>

                <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">4. Pinecone Vector</span>
                  <span className="text-[10px] text-[#667085]">Semantic indexes</span>
                </div>
              </div>

              <div className="flex justify-center my-4 text-[#667085]"><ChevronRight className="w-5 h-5 transform rotate-90" /></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs text-[#12233F]">
                <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">5. Context Matching</span>
                  <span className="text-[10px] text-[#667085]">Filter score &gt;= 0.65</span>
                </div>
                
                <div className="hidden md:flex justify-center text-[#667085]"><ChevronRight className="w-5 h-5" /></div>

                <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">6. Gemini LLM</span>
                  <span className="text-[10px] text-[#667085]">Generate content</span>
                </div>

                <div className="hidden md:flex justify-center text-[#667085]"><ChevronRight className="w-5 h-5" /></div>

                <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">7. Grounded Answer</span>
                  <span className="text-[10px] text-[#2563EB]">Verified output</span>
                </div>

                <div className="hidden md:flex justify-center text-[#667085]"><ChevronRight className="w-5 h-5" /></div>

                <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-center flex-1">
                  <span className="font-bold block text-[#2563EB]">8. References</span>
                  <span className="text-[10px] text-[#2563EB]">Page citations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chatbot realistic preview section */}
        <section className="border-t border-[#E4E7EC] bg-white py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Mock Chat Simulation</span>
              <h2 className="text-2xl font-bold mt-1 text-[#12233F]">The Placement Grounding flow</h2>
            </div>

            <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-[#EFF6FF] text-[#12233F] border border-[#BFDBFE] rounded-lg px-4 py-2.5 text-xs sm:text-sm font-semibold max-w-sm">
                  What are the marks required for placement registration?
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-[#12233F] flex items-center justify-center text-white flex-shrink-0 text-xs font-bold">CR</div>
                <div className="space-y-4 flex-1">
                  <div className="bg-white border border-[#E4E7EC] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#172033] leading-relaxed">
                    According to the college documents, **80 percent marks** are required for placement registrations.
                    <div className="mt-2.5 flex">
                      <span className="px-2 py-0.5 rounded bg-[#16806A]/10 text-[#16806A] text-[9px] font-bold tracking-wider uppercase border border-[#16806A]/20">Grounded</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Retrieved Sources (2)</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white border border-[#E4E7EC] rounded-lg flex items-center justify-between">
                        <span className="text-xs font-bold text-[#172033]">Placement Policy</span>
                        <span className="text-[9px] text-[#667085] bg-[#F7F8FA] px-2 py-0.5 rounded">Page 4</span>
                      </div>
                      <div className="p-3 bg-white border border-[#E4E7EC] rounded-lg flex items-center justify-between">
                        <span className="text-xs font-bold text-[#172033]">Student Handbook</span>
                        <span className="text-[9px] text-[#667085] bg-[#F7F8FA] px-2 py-0.5 rounded">Page 27</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="border-t border-[#E4E7EC] py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Platform Capabilities</span>
              <h2 className="text-3xl font-extrabold mt-1 text-[#12233F]">Core Features</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <MessageSquare className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">AI College Assistant</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">Fully grounded chatbot answers student queries using only official college rules and guidelines.</p>
              </div>

              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <FileText className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">Knowledge Base</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">Enables administrators to upload PDF and DOCX files directly to expand the system memory.</p>
              </div>

              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <Search className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">Semantic Retrieval</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">Computes text query vectors and executes Pinecone searches to get accurate match context.</p>
              </div>

              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <FileCheck className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">Source References</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">Appends page numbers, relevance levels, and file name headers to answers to establish trust.</p>
              </div>

              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <Database className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">Admin Documents Control</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">Enables metadata updates, reprocessing loops, and vector deletes from Pinecone indexes.</p>
              </div>

              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <History className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">Chat History logs</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">Saves past student query threads allowing students to log back in and resume session logs.</p>
              </div>

              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <Lock className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">Secure Authentication</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">JWT verification tokens and strict route blocks isolating student portals from admin dashboards.</p>
              </div>

              <div className="p-5 bg-white border border-[#E4E7EC] rounded-xl space-y-2.5">
                <Cpu className="w-5 h-5 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-[#12233F]">Live Cloud Integrations</h4>
                <p className="text-[11px] text-[#667085] leading-relaxed">Runs on MongoDB Atlas database clusters, Pinecone serverless search, and stable Gemini LLMs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Factual Reliability checklist */}
        <section className="border-t border-[#E4E7EC] bg-white py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-[#12233F] text-center mb-10">System Reliability Guarantee</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-[#16806A] mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-[#12233F]">Source-Backed Answers</h5>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">Every response is strictly verified using extracted contexts to ensure validity.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-[#16806A] mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-[#12233F]">Semantic Document Retrieval</h5>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">Utilizes mathematical vector matching rather than plain keyword searches.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-[#16806A] mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-[#12233F]">Unknown-Question Refusals</h5>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">Instructs LLM models to refuse answering questions not covered in the knowledge base.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-[#16806A] mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-[#12233F]">Secure Verification</h5>
                  <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">Authenticates user access and protects administrative actions from unauthorized access.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Experience section */}
        <section className="border-t border-[#E4E7EC] py-24 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Admin Workflow</span>
              <h2 className="text-2xl font-bold mt-1 text-[#12233F]">The Admin Experience</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-mono text-[#12233F]">
              <div className="p-3.5 bg-white border border-[#E4E7EC] rounded-lg">
                <Upload className="w-4 h-4 text-[#2563EB] mx-auto mb-1.5" />
                <span className="font-bold">Upload</span>
              </div>
              <div className="p-3.5 bg-white border border-[#E4E7EC] rounded-lg">
                <Layers className="w-4 h-4 text-[#2563EB] mx-auto mb-1.5" />
                <span className="font-bold">Processing</span>
              </div>
              <div className="p-3.5 bg-white border border-[#E4E7EC] rounded-lg">
                <Cpu className="w-4 h-4 text-[#2563EB] mx-auto mb-1.5" />
                <span className="font-bold">Embedding</span>
              </div>
              <div className="p-3.5 bg-white border border-[#E4E7EC] rounded-lg">
                <Database className="w-4 h-4 text-[#2563EB] mx-auto mb-1.5" />
                <span className="font-bold">Indexed</span>
              </div>
              <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] mx-auto mb-1.5" />
                <span className="font-bold">Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E4E7EC] py-10 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-[#667085] text-xs">
            <div className="text-left">
              <span className="font-bold text-sm text-[#12233F] block">CollegeRAG</span>
              <span className="text-[10px] text-[#667085]">AI-powered college knowledge assistant.</span>
            </div>
            <div className="flex space-x-6 font-semibold">
              <span className="hover:text-[#12233F] transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#12233F] transition-colors cursor-pointer">Terms of Service</span>
              <Link href="/login" className="hover:text-[#2563EB] transition-colors">Admin Login</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
