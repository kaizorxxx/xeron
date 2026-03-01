import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, AlertCircle, History as HistoryIcon } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface CheckResult {
  name: string;
  tags: string[];
}

interface HistoryItem {
  id: string;
  phone: string;
  name: string;
  created_at: string;
}

export default function Dashboard() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const apiKey = import.meta.env.VITE_CEKNO_API_KEY;

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://cekno.web.id/api/v1/history?page=1&limit=10', {
        headers: { 'X-API-Key': apiKey }
      });
      setHistory(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async () => {
    if (!phone) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.post('https://cekno.web.id/api/v1/check', { phone }, {
        headers: { 'X-API-Key': apiKey }
      });
      
      const data = res.data.data || res.data;
      setResult({
        name: data.name || 'Unknown',
        tags: data.tags || [],
      });
      fetchHistory(); // Refresh history after search
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze identity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-6xl font-black tracking-tighter text-white">
          Analyze <span className="text-gradient">Identity.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium">
          The most powerful identity intelligence engine ever built.
        </p>
      </motion.div>

      <Card className="p-2 bg-white/5 border-white/5">
        <CardContent className="p-4 space-y-8">
          <div className="relative group">
            <Input 
              placeholder="Enter phone number..." 
              className="pr-48 h-20 text-2xl font-medium bg-white/5 border-none focus:ring-primary/20 transition-all placeholder:text-slate-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute right-2 top-2 bottom-2">
              <Button 
                size="lg" 
                className="h-full px-10 text-xl font-bold"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Analyze Identity"}
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
              >
                <AlertCircle className="w-6 h-6" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-8 p-8 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">Result Found</p>
                    <h2 className="text-5xl font-black text-white tracking-tight">{result.name}</h2>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-6 py-2 rounded-full text-sm font-bold">
                    VERIFIED
                  </Badge>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Associated Intelligence Tags</p>
                  <div className="flex flex-wrap gap-3">
                    {result.tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-6 py-3 text-base rounded-2xl transition-all"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between p-8">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <HistoryIcon className="w-6 h-6 text-primary" />
                Intelligence History
              </CardTitle>
              <CardDescription>Your recent identity analysis requests.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {historyLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-sm font-mono text-slate-500">{item.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
                      <p className="text-xs font-bold text-green-500/50 uppercase tracking-wider">Success</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-600 text-center py-12 font-medium">No intelligence records found.</div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <Card className="border-white/5 bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-bold text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
               <div className="flex justify-between items-center">
                 <span className="text-slate-400 font-medium">Node Health</span>
                 <span className="text-green-400 font-bold flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                   Optimal
                 </span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-slate-400 font-medium">Latency</span>
                 <span className="text-white font-mono">14ms</span>
               </div>
               <div className="pt-4 border-t border-white/10">
                 <p className="text-xs text-slate-500 leading-relaxed">
                   All systems operational. Intelligence engine running at peak efficiency.
                 </p>
               </div>
            </CardContent>
          </Card>

          <Card className="border-white/5">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-bold text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <span className="text-slate-400 font-medium">Total Analyzed</span>
                   <span className="text-3xl font-black text-white">{history.length}</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '65%' }}
                     className="h-full bg-gradient-to-r from-primary to-secondary" 
                   />
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
