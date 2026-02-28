import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { ProviderIntelligence } from '@/src/components/admin/provider-intelligence';
import { UserAnalytics } from '@/src/components/admin/user-analytics';
import { FinancialRecap } from '@/src/components/admin/financial-recap';
import { SystemHealth } from '@/src/components/admin/system-health';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Strict check for admin@221.com
      if (!user || user.email !== 'admin@221.com') {
        navigate('/dashboard'); // Redirect unauthorized users
      }
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Executive Admin Panel</h1>
        <p className="text-slate-400">System Overview & Control Center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProviderIntelligence />
        <SystemHealth />
        {/* Add more widgets here if needed */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinancialRecap />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <UserAnalytics />
      </div>
    </div>
  );
}
