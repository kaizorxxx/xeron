import { useEffect, useState } from 'react';
import { ceknoApi } from '@/src/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress'; // Need to create this
import { Loader2 } from 'lucide-react';

export function ProviderIntelligence() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await ceknoApi.get('/balance');
        // Assuming response structure { data: { balance: number } }
        setBalance(response.data.data?.balance || response.data.balance || 0);
      } catch (error) {
        console.error('Failed to fetch provider balance', error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Mock max balance for progress bar context
  const maxBalance = 1000000; 
  const percentage = balance ? Math.min((balance / maxBalance) * 100, 100) : 0;

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Provider Intelligence</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Syncing...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-white">
                Rp {balance?.toLocaleString('id-ID')}
              </span>
              <span className="text-sm text-secondary mb-1">Live</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#977DFF] to-[#0033FF] transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              Remaining balance at upstream provider. Auto-refreshes every 30s.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
