import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { supabase } from '@/src/lib/supabase';

export function StatusBar() {
  const [balance, setBalance] = useState<number>(0);
  const [username, setUsername] = useState<string>('User');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Set username from metadata
        setUsername(session.user.user_metadata?.username || 'User');

        // Fetch balance from backend
        try {
          const response = await fetch('/api/balance', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setBalance(data.balance);
          }
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="h-16 glass-panel border-b border-white/10 fixed top-0 right-0 left-64 z-40 flex items-center justify-end px-8 gap-6">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Saldo</p>
          <p className="text-lg font-bold text-white">Rp{balance.toLocaleString('id-ID')}</p>
        </div>
        <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          Deposit
        </Button>
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary p-[1px]">
        <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center">
          <span className="font-bold text-white uppercase">{username.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}
