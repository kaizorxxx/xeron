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
    <header className="h-20 bg-navy-950/50 backdrop-blur-[20px] border-b border-white/5 fixed top-0 right-0 left-72 z-40 flex items-center justify-end px-12 gap-8">
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Available Funds</p>
          <p className="text-2xl font-black text-white">Rp{balance.toLocaleString('id-ID')}</p>
        </div>
        <Button size="sm" className="h-10 px-6 font-bold shadow-blue-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Deposit
        </Button>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1px]">
        <div className="w-full h-full rounded-2xl bg-navy-950 flex items-center justify-center">
          <span className="font-black text-white text-xl uppercase">{username.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}
