
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import StatusLookup from './components/StatusLookup';
import MockTest from './components/MockTest';
import AIAssistant from './components/AIAssistant';
import Appointments from './components/Appointments';
import ActiveLicenses from './components/ActiveLicenses';
import RegisteredVehicles from './components/RegisteredVehicles';
import ChallanInfo from './components/ChallanInfo';
import MyChallans from './components/MyChallans';
import Auth from './components/Auth';
import Profile from './components/Profile';
import InsuranceServices from './components/InsuranceServices';
import { 
  Truck, 
  MessageCircle, 
  UserCheck, 
  Car, 
  ShieldCheck, 
  Receipt, 
  FolderLock, 
  AlertTriangle,
  ArrowLeft,
  LayoutGrid,
  CalendarDays,
  Lock
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewContext, setViewContext] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const navigateTo = (view: string, context: string | null = null) => {
    // List of personal views that require auth
    const personalViews = ['active-licenses', 'registered-vehicles', 'challan', 'insurance', 'profile'];
    
    if (personalViews.includes(view) && !user) {
      setShowAuth(true);
      return;
    }

    setCurrentView(view);
    setViewContext(context);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onSelectService={(v) => navigateTo(v)} user={user} />;
      case 'profile':
        return user && (
          <Profile 
            user={user} 
            onLogout={handleLogout} 
            onSelectService={(v) => navigateTo(v)}
            onClose={() => navigateTo('dashboard')}
          />
        );
      case 'rc-lookup': // General vehicle search
        return <StatusLookup type="RC" onBack={() => navigateTo('dashboard')} />;
      case 'dl-lookup': // Public License Verification
        return <StatusLookup type="DL" onBack={() => navigateTo('dashboard')} titleOverride="Public License Check" />;
      case 'active-licenses': // Personal
        return <ActiveLicenses onBack={() => navigateTo('dashboard')} user={user} />;
      case 'registered-vehicles': // Personal
        return <RegisteredVehicles onBack={() => navigateTo('dashboard')} onAction={(v, rc) => navigateTo(v, rc)} user={user} />;
      case 'mock-test': // General
        return <MockTest />;
      case 'ai-assistant': // General
        return <AIAssistant />;
      case 'appointments': // Slots
        return <Appointments onBack={() => navigateTo('dashboard')} />;
      case 'insurance': // Personal Vault
        return <InsuranceServices onBack={() => navigateTo('dashboard')} initialSearch={viewContext} user={user} />;
      case 'insurance-lookup': // Public Insurance Check
        return <StatusLookup type="RC" onBack={() => navigateTo('dashboard')} titleOverride="Public Insurance Check" />;
      case 'challan': // Personal
        return <MyChallans onBack={() => navigateTo('dashboard')} initialVehicleRC={viewContext} user={user} />;
      case 'challan-lookup': // Public Challan Search
        return <ChallanInfo onBack={() => navigateTo('dashboard')} />;
      case 'services':
        return (
          <div className="py-8 text-center space-y-12 animate-in fade-in duration-500">
            <div className="space-y-2 text-left px-2 max-w-5xl mx-auto">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Service Directory</h2>
              <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">Digital RTO Gateways</p>
            </div>
            
            {/* Split View in Services */}
            <div className="space-y-10 max-w-5xl mx-auto">
              {/* Public Tools */}
              <div className="text-left space-y-6">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] px-2">Public Utilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Public License', action: 'dl-lookup', desc: 'Verify DL authenticity', icon: UserCheck },
                    { name: 'Public Insurance', action: 'insurance-lookup', desc: 'Check validity by RC', icon: ShieldCheck },
                    { name: 'Public Challans', action: 'challan-lookup', desc: 'Search enforcement records', icon: AlertTriangle },
                    { name: 'Slots & Booking', action: 'appointments', desc: 'Schedule physical visit', icon: CalendarDays },
                  ].map(s => (
                    <div key={s.name} onClick={() => navigateTo(s.action)} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-indigo-500 transition-all cursor-pointer group text-left">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-indigo-950 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg"><s.icon className="h-6 w-6" /></div>
                        <h3 className="text-base font-black uppercase text-white group-hover:text-indigo-400">{s.name}</h3>
                      </div>
                      <p className="text-sm font-medium text-slate-400">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Tools */}
              <div className="text-left space-y-6">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] px-2">Personal Vault (Auth Req)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'My Garage', action: 'registered-vehicles', desc: 'Manage your owned vehicles', icon: LayoutGrid },
                    { name: 'My Licenses', action: 'active-licenses', desc: 'Linked digital driving permits', icon: FolderLock },
                    { name: 'Policy Vault', action: 'insurance', desc: 'Your personal insurance history', icon: ShieldCheck },
                    { name: 'My Violations', action: 'challan', desc: 'Personal enforcement history', icon: Receipt }
                  ].map(s => (
                    <div key={s.name} onClick={() => navigateTo(s.action)} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-emerald-500 transition-all cursor-pointer group text-left relative">
                      {!user && <Lock className="absolute top-4 right-4 h-4 w-4 text-slate-700" />}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-emerald-950 rounded-xl text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg"><s.icon className="h-6 w-6" /></div>
                        <h3 className="text-base font-black uppercase text-white group-hover:text-emerald-400">{s.name}</h3>
                      </div>
                      <p className="text-sm font-medium text-slate-400">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigateTo('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all font-bold uppercase text-xs tracking-widest"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
          </div>
        );
      default:
        return <Dashboard onSelectService={(v) => navigateTo(v)} user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-indigo-500 selection:text-white">
      <Navigation 
        onNavigate={(v) => navigateTo(v)} 
        currentView={currentView} 
        user={user}
        onOpenAuth={() => setShowAuth(true)}
      />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {renderView()}
      </main>

      {showAuth && (
        <Auth 
          onClose={() => setShowAuth(false)} 
          onLogin={(u) => { setUser(u); setShowAuth(false); }} 
        />
      )}

      {currentView !== 'ai-assistant' && (
        <button 
          onClick={() => navigateTo('ai-assistant')}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 border border-indigo-500/20"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="font-black text-white uppercase tracking-[0.2em] text-lg">SmartRTO</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-indigo-400 transition-colors">Compliance</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
          </div>
          <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">© 2024 National Gateway</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
