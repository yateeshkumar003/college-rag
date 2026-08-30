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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <Link href={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CollegeRAG
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-none">
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active 
                        ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/50' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile Dropdown / Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 border-r border-slate-900 pr-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-semibold text-sm">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium capitalize">{user?.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-900/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1">
            <div className="px-3 py-3 border-b border-slate-900 flex items-center space-x-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-semibold">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
                <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
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
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                    active
                      ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-900/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-rose-400 hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-900/30"
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
      <footer className="border-t border-slate-900/60 py-4 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
          CollegeRAG © 2026. Built with Google Gemini & Pinecone.
        </div>
      </footer>
    </div>
  );
}
