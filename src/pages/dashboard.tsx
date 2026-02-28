import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ceknoApi } from '@/src/lib/api';

interface CheckResult {
  name: string;
  tags: string[];
}

export default function Dashboard() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!phone) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await ceknoApi.post('/check', { phone });
      // Assuming the API returns data in a format we can map to name/tags
      // Adjusting based on common API patterns if specific schema isn't known
      const data = response.data.data || response.data;
      
      setResult({
        name: data.name || 'Unknown',
        tags: data.tags || [],
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze identity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome back, User.</p>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl">Cek Cepat</CardTitle>
          <CardDescription>Analyze phone numbers instantly without slash commands.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Input 
              placeholder="Enter phone number (e.g., 08123456789)" 
              className="text-lg py-6 px-4 bg-black/20 border-white/10 focus:border-primary/50"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
            <Button 
              size="lg" 
              className="h-auto px-8 text-lg bg-gradient-to-r from-secondary to-primary hover:opacity-90 transition-all shadow-lg shadow-primary/25"
              onClick={handleCheck}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
              Analyze Identity
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4 pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Identified Name</p>
                    <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 px-3 py-1">
                    Verified
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-3">Associated Tags</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                    {result.tags.length > 0 ? (
                      result.tags.map((tag, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-4 py-2 text-sm whitespace-nowrap"
                          >
                            {tag}
                          </Badge>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No tags found.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Placeholder for History or other widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-500 text-center py-8">No recent checks found.</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-slate-400">Total Checks</span>
                 <span className="text-white font-bold">0</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-slate-400">Success Rate</span>
                 <span className="text-green-400 font-bold">100%</span>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
