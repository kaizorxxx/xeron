import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Wallet, 
  User, 
  Key, 
  BookOpen, 
  Activity,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Search, label: 'Cek Nomor', href: '/check' },
  { icon: History, label: 'Riwayat', href: '/history' },
  { icon: Wallet, label: 'Deposit', href: '/deposit' },
  { icon: User, label: 'Akun', href: '/account' },
  { icon: Key, label: 'API Key', href: '/api-key' },
  { icon: BookOpen, label: 'Dokumentasi', href: '/docs' },
  { icon: Activity, label: 'Status Server', href: '/status' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'admin@221.com') {
        setIsAdmin(true);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="w-64 glass-panel border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gradient">TRINITY</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-white/10 text-white shadow-lg shadow-primary/10 border border-white/5" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-secondary" : "text-slate-500 group-hover:text-secondary")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group mt-6 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10",
              location.pathname === '/admin' ? "bg-red-500/10 text-red-400" : "text-red-400"
            )}
          >
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="font-medium">Admin Control</span>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
