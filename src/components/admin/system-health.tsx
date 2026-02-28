import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { HardDrive } from 'lucide-react';

export function SystemHealth() {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          Disk Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">System Storage</span>
            <span className="text-white font-mono">45% Used</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[45%] bg-green-500 rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>234GB Free</span>
            <span>512GB Total</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
