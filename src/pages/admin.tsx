import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { supabase } from '@/src/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { 
  Loader2, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Activity, 
  HardDrive, 
  Cpu,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [providerBalance, setProviderBalance] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [revenue, setRevenue] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [activeTab, setActiveTab] = useState('intelligence');
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_CEKNO_API_KEY;

  const fetchProviderBalance = async () => {
    try {
      const res = await axios.get('https://cekno.web.id/api/v1/balance', {
        headers: { 'X-API-Key': apiKey }
      });
      setProviderBalance(res.data.data?.balance || 0);
    } catch (err) {
      console.error('Failed to fetch provider balance', err);
    }
  };

  const fetchStats = async () => {
    // Mocking revenue stats from Supabase logic
    setRevenue({
      daily: 1250000,
      weekly: 8750000,
      monthly: 32400000
    });
    
    // Mocking active users
    setActiveUsers(Math.floor(Math.random() * 50) + 10);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Logic Gate: admin@221.com
      if (!user || user.email !== 'admin@221.com') {
        navigate('/dashboard');
        return;
      }
      setLoading(false);
      fetchProviderBalance();
      fetchStats();
    };

    checkAdmin();

    const interval = setInterval(() => {
      fetchProviderBalance();
      fetchStats();
    }, 60000); // 60s polling

    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-navy-950">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1 rounded-full text-xs font-bold tracking-widest">
            ADMIN INTELLIGENCE ENGINE
          </Badge>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            System <span className="text-gradient">Control.</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <Button 
            variant={activeTab === 'intelligence' ? 'default' : 'outline'}
            onClick={() => setActiveTab('intelligence')}
            className="rounded-2xl"
          >
            Intelligence
          </Button>
          <Button 
            variant={activeTab === 'architecture' ? 'default' : 'outline'}
            onClick={() => setActiveTab('architecture')}
            className="rounded-2xl"
          >
            System Architecture
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'intelligence' ? (
          <motion.div 
            key="intelligence"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-3xl bg-primary/20 text-primary">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-none">LIVE</Badge>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Provider Balance</p>
                <h3 className="text-4xl font-black text-white">
                  Rp {providerBalance?.toLocaleString('id-ID')}
                </h3>
                <p className="text-xs text-slate-500 mt-4">Upstream: cekno.web.id</p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-secondary/10 to-transparent border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-3xl bg-secondary/20 text-secondary">
                    <Users className="w-8 h-8" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-none">ACTIVE</Badge>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Live User Tracker</p>
                <h3 className="text-4xl font-black text-white">{activeUsers} SESSIONS</h3>
                <p className="text-xs text-slate-500 mt-4">Real-time active connections</p>
              </Card>

              <Card className="p-8 border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-3xl bg-white/5 text-white">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Daily Profit</p>
                <h3 className="text-4xl font-black text-white">
                  Rp {revenue.daily.toLocaleString('id-ID')}
                </h3>
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold mt-4">
                  <ArrowUpRight className="w-4 h-4" />
                  +12.5% from yesterday
                </div>
              </Card>
            </div>

            <Card className="p-8 border-white/5">
              <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white">Revenue Intelligence</CardTitle>
                  <CardDescription>Visualizing system-wide financial growth.</CardDescription>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weekly</p>
                    <p className="text-xl font-black text-white">Rp {revenue.weekly.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly</p>
                    <p className="text-xl font-black text-white">Rp {revenue.monthly.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </CardHeader>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0033FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0033FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `Rp${value}k`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0033FF" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="architecture"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <Card className="p-12 border-white/5 flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 110}
                    initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 110) * (1 - 0.45) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white">45%</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Used</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white">SpaceX Server Node Health</h3>
                <p className="text-slate-400">Primary Storage Cluster: Node-01 (California)</p>
              </div>
              <div className="grid grid-cols-2 gap-8 w-full pt-8 border-t border-white/5">
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Available</p>
                  <p className="text-xl font-bold text-white">234 GB</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-xl font-bold text-white">512 GB</p>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              <Card className="p-8 border-white/5">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-3xl bg-green-500/20 text-green-400">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">CPU LOAD</p>
                    <h4 className="text-2xl font-black text-white">12.4%</h4>
                  </div>
                </div>
              </Card>
              <Card className="p-8 border-white/5">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-3xl bg-blue-500/20 text-blue-400">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">NETWORK THROUGHPUT</p>
                    <h4 className="text-2xl font-black text-white">1.2 GB/s</h4>
                  </div>
                </div>
              </Card>
              <Card className="p-8 border-white/5">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-3xl bg-purple-500/20 text-purple-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">FIREWALL STATUS</p>
                    <h4 className="text-2xl font-black text-white">ACTIVE</h4>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
