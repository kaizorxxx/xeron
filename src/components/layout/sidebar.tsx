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
    <aside className="w-72 bg-navy-950/50 backdrop-blur-[20px] border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-10">
        <h1 className="text-3xl font-black tracking-tighter text-white">XERON.</h1>
      </div>
      
      <nav className="flex-1 px-6 space-y-3 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-white/10 text-white shadow-xl shadow-primary/10 border border-white/10" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-600 group-hover:text-primary")} />
              <span className="font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin-intelligence"
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group mt-12 border border-primary/20 bg-primary/5 hover:bg-primary/10",
              location.pathname === '/admin-intelligence' ? "bg-primary/10 text-primary" : "text-primary"
            )}
          >
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-tight">Intelligence Engine</span>
          </Link>
        )}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 w-full text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-bold"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
