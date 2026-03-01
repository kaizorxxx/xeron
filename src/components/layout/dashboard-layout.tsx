import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { StatusBar } from './status-bar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 font-sans selection:bg-primary/30">
      <Sidebar />
      <StatusBar />
      <main className="pl-72 pt-16 min-h-screen">
        <div className="container mx-auto p-12 max-w-7xl animate-in fade-in duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
