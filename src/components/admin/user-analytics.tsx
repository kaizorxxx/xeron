import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

// Mock data
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', balance: 50000, status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', balance: 12500, status: 'Active' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', balance: 0, status: 'Banned' },
  { id: 4, name: 'David Lee', email: 'david@example.com', balance: 75000, status: 'Active' },
  { id: 5, name: 'Eve Wilson', email: 'eve@example.com', balance: 2500, status: 'Active' },
];

export function UserAnalytics() {
  return (
    <Card className="border-white/10 bg-white/5 col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-white">User Analytics</CardTitle>
        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
          {users.length} Total Users
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-white/5">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">User</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-slate-500 text-xs">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    Rp {user.balance.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant={user.status === 'Active' ? 'default' : 'destructive'}
                      className={user.status === 'Active' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : ''}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
