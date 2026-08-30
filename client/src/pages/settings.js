import { useAuthStore } from '../store/authStore';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Account Settings</h1>
        <p className="text-slate-400 text-xs mt-1">Manage your user profile and active sessions</p>
      </div>

      {/* Profile Details Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Name */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name</span>
            <div className="flex items-center space-x-2 text-slate-200 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-900">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
          </div>

          {/* User Email */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</span>
            <div className="flex items-center space-x-2 text-slate-200 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-900">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
          </div>

          {/* User Role */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">User Role</span>
            <div className="flex items-center space-x-2 text-slate-200 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-900">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold capitalize text-indigo-400">{user?.role}</span>
            </div>
          </div>

          {/* Account Created */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Account Created</span>
            <div className="flex items-center space-x-2 text-slate-200 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-900">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions and Security Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center space-x-2 text-rose-400">
          <LogOut className="w-5 h-5 text-rose-400" />
          <span>Active Session</span>
        </h2>
        
        <p className="text-slate-400 text-xs leading-relaxed">
          You are currently logged in as a <span className="font-semibold text-slate-300 capitalize">{user?.role}</span>. Logging out will clear the session storage cache and redirect you to the authentication page.
        </p>

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-rose-950/30 text-rose-400 border border-rose-900/40 hover:bg-rose-950/50 hover:text-rose-350 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout Session</span>
          </button>
        </div>
      </div>

    </div>
  );
}
