import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
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
  Sparkles,
  HelpCircle,
  MessageSquarePlus,
  Home,
  Clock
} from 'lucide-react';

export default function AppShell({ children }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { resetChat } = useChatStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNewChat = () => {
    resetChat();
    router.push('/chat');
  };

  const isActive = (path) => {
    if (path === '/chat') {
      return router.pathname.startsWith('/chat');
    }
    return router.pathname === path;
  };

  const isStudent = user?.role !== 'admin';

  // If the user is an admin, we render a clean Top Header layout
  if (!isStudent) {
    const adminLinks = [
      { name: 'Admin Hub', path: '/admin', icon: LayoutDashboard },
      { name: 'Knowledge Base', path: '/admin/documents', icon: FileText },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
      <div className="min-h-screen bg-[#F7F8FA] text-[#172033] flex flex-col font-sans">
        <header className="border-b border-[#E4E7EC] bg-white sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8.5 h-8.5 rounded-lg bg-[#12233F] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-[#12233F] leading-none">CollegeRAG</span>
                  <span className="text-[9px] text-[#667085] font-bold tracking-widest uppercase mt-0.5">Admin Portal</span>
                </div>
              </div>

              <nav className="hidden md:flex items-center space-x-1">
                {adminLinks.map((link) => {
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
                      <Icon className={`w-4 h-4 ${active ? 'text-[#2563EB]' : 'text-[#667085]'}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

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

              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-white border border-[#E4E7EC] text-[#667085]"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[#E4E7EC] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-semibold ${
                      active ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#667085]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#D92D20] hover:bg-[#FEF3F2]"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  // ==================================================
  // STUDENT PORTAL: Premium Left Sidebar Layout Shell
  // ==================================================
  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, action: null },
    { name: 'New Chat', path: '/chat', icon: MessageSquarePlus, action: handleNewChat },
    { name: 'Conversations', path: '/chat', icon: MessageSquare, action: null },
    { name: 'Profile', path: '/settings', icon: User, action: null },
    { name: 'Settings', path: '/settings', icon: Settings, action: null },
    { name: 'Help & Support', path: '/settings', icon: HelpCircle, action: null },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#172033] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Navbar (Student) */}
      <header className="md:hidden border-b border-[#E4E7EC] bg-white h-16 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-sm text-[#12233F] tracking-tight">CollegeRAG</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white border border-[#E4E7EC] text-[#667085]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E4E7EC] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg fixed top-16 left-0 right-0 z-40">
          {studentLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <button
                key={link.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.action) link.action();
                  else router.push(link.path);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-semibold ${
                  active ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#667085]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-semibold text-[#D92D20]"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Desktop Left Sidebar (Student) */}
      <aside className="hidden md:flex w-64 border-r border-[#E4E7EC] bg-white p-6 flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-30">
        <div className="space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-base text-[#12233F] tracking-tight">CollegeRAG</span>
          </div>

          {/* Navigation link list */}
          <nav className="space-y-1">
            {studentLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <button
                  key={link.name}
                  onClick={link.action ? link.action : () => router.push(link.path)}
                  className={`w-full relative flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    active 
                      ? 'bg-[#EFF6FF] text-[#2563EB]' 
                      : 'text-[#667085] hover:text-[#12233F] hover:bg-[#F2F4F7]'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 bg-[#2563EB] rounded-r"></span>
                  )}
                  <Icon className={`w-5 h-5 ${active ? 'text-[#2563EB]' : 'text-[#667085]'}`} />
                  <span>{link.name}</span>
                </button>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-[#667085] hover:text-[#D92D20] hover:bg-[#FEF3F2] transition-all"
            >
              <LogOut className="w-5 h-5 text-[#667085] hover:text-[#D92D20]" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* User Card at bottom */}
        <div className="pt-4 border-t border-[#E4E7EC]">
          <div className="flex items-center justify-between bg-[#F7F8FA] border border-[#E4E7EC] rounded-lg p-3">
            <div className="flex items-center space-x-2 min-w-0">
              <User className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#667085] font-semibold leading-none">Logged in as</span>
                <span className="text-[11px] font-bold text-[#172033] truncate mt-0.5">{user?.name || 'Student'}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#2563EB]/10 text-[#2563EB] text-[9px] font-bold tracking-wider capitalize border border-[#2563EB]/25">
              {user?.role || 'Student'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Student) */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* Simple Top Bar (Only visible on Desktop to greet user) */}
        <div className="hidden md:flex justify-end items-center h-14 px-8 bg-white border-b border-[#E4E7EC]">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-semibold text-[#667085]">
              Welcome, <span className="text-[#172033] font-bold">{user?.name || 'Student'}</span>
            </span>
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'S'}
            </div>
          </div>
        </div>

        <main className="flex-1 p-6 md:p-8 flex flex-col">
          {children}
        </main>
      </div>

    </div>
  );
}
