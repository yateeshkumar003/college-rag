import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../store/authStore';
import { 
  LogOut, 
  Settings, 
  BookOpen, 
  User, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function AppShell({ children }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path) => router.pathname === path;

  // Define navigation links based on user roles
  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'RAG Chatbot', path: '/chat', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Hub', path: '/admin', icon: LayoutDashboard },
    { name: 'Knowledge Base', path: '/admin/documents', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#172033] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-[#E4E7EC] bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#12233F] flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <Link href={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex flex-col">
                <span className="font-extrabold text-lg leading-tight tracking-tight text-[#12233F]">
                  CollegeRAG
                </span>
                <span className="text-[10px] text-[#667085] font-bold uppercase tracking-widest leading-none">
                  AI Info Portal
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      active 
                        ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' 
                        : 'text-[#667085] hover:text-[#12233F] hover:bg-[#F2F4F7]'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${active ? 'text-[#2563EB]' : 'text-[#667085]'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile Dropdown / Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 border-r border-[#E4E7EC] pr-4">
                <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] font-bold text-sm">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#172033]">{user?.name}</span>
                  <span className="text-[10px] text-[#667085] font-semibold capitalize">{user?.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-[#D92D20] hover:bg-[#FEF3F2] border border-[#FDA29B] hover:border-[#F04438] transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#172033] focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E4E7EC] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <div className="px-3 py-3 border-b border-[#E4E7EC] flex items-center space-x-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] font-bold">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#172033]">{user?.name}</span>
                <span className="text-xs text-[#667085] capitalize">{user?.role}</span>
              </div>
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-semibold transition-all ${
                    active
                      ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                      : 'text-[#667085] hover:text-[#12233F] hover:bg-[#F2F4F7]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#D92D20] hover:bg-[#FEF3F2] border border-[#FDA29B] hover:border-[#F04438] transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E7EC] py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#667085] font-semibold">
          CollegeRAG © 2026. Built with Google Gemini & Pinecone.
        </div>
      </footer>
    </div>
  );
}
