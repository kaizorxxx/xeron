import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export function FinancialRecap() {
  return (
    <Card className="border-white/10 bg-white/5 col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">Financial Recap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-slate-400 uppercase">Today</p>
            <p className="text-2xl font-bold text-white">Rp 1.2M</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-slate-400 uppercase">This Week</p>
            <p className="text-2xl font-bold text-white">Rp 8.5M</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-slate-400 uppercase">This Month</p>
            <p className="text-2xl font-bold text-white">Rp 32.4M</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#977DFF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#977DFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `Rp${value/1000}k`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#977DFF" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
