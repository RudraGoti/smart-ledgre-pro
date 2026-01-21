
import React from 'react';
import { Truck, Bell, User, LogIn, Menu } from 'lucide-react';

interface NavigationProps {
  onNavigate: (view: string) => void;
  currentView: string;
  user: any | null;
  onOpenAuth: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentView, user, onOpenAuth }) => {
  return (
    <nav className="bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Truck className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Smart<span className="text-indigo-400">RTO</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            {[
              { id: 'dashboard', label: 'Home' },
              { id: 'services', label: 'Services' },
              { id: 'mock-test', label: 'Mock Test' }
            ].map((view) => (
              <button 
                key={view.id}
                onClick={() => onNavigate(view.id)}
                className={`text-xs font-black uppercase tracking-[0.25em] transition-all relative py-2 ${
                  currentView === view.id 
                    ? 'text-indigo-400' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {view.label}
                {currentView === view.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"></span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden sm:block p-2.5 text-slate-500 hover:text-indigo-400 relative transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2.5 right-2.5 block h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-slate-950"></span>
            </button>
            
            {user ? (
              <button 
                onClick={() => onNavigate('profile')}
                className={`flex items-center gap-4 pl-5 pr-2 py-2 rounded-2xl border-2 transition-all group ${
                  currentView === 'profile' 
                    ? 'border-indigo-600 bg-indigo-950/20' 
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-widest text-slate-200 hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg group-hover:rotate-3 transition-transform">
                  {user.avatar}
                </div>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-600/10"
              >
                Sign In
              </button>
            )}
            
            <button className="md:hidden p-2 text-slate-400">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
