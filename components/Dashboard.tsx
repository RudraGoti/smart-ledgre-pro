
import React from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight,
  History,
  LayoutGrid,
  FileText,
  Smartphone,
  Search,
  Lock,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface DashboardProps {
  onSelectService: (view: string) => void;
  user: any | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectService, user }) => {
  const publicUtilities = [
    { title: 'Public License', icon: UserCheck, color: 'text-indigo-400 bg-indigo-950/30', action: 'dl-lookup', desc: 'Verify DL Identity' },
    { title: 'Public Insurance', icon: ShieldCheck, color: 'text-blue-400 bg-blue-950/30', action: 'insurance-lookup', desc: 'Check Validity' },
    { title: 'Public Challan', icon: History, color: 'text-rose-400 bg-rose-950/30', action: 'challan-lookup', desc: 'Search by ID' },
    { title: 'Slots', icon: CreditCard, color: 'text-emerald-400 bg-emerald-950/30', action: 'appointments', desc: 'Book RTO Visit' },
  ];

  const personalStats = [
    { label: 'MY LICENSES', value: user ? '01' : '??', action: 'active-licenses', icon: UserCheck },
    { label: 'MY VEHICLES', value: user ? '02' : '??', action: 'registered-vehicles', icon: LayoutGrid },
    { label: 'MY CHALLANS', value: user ? '02' : '??', action: 'challan', icon: AlertTriangle },
    { label: 'MY POLICIES', value: user ? '02' : '??', action: 'insurance', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Hero Welcome */}
      <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg mb-6 border border-indigo-500/20">
            <Smartphone className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-300">Unified Transport Gateway</span>
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tighter uppercase leading-tight">
            {user ? `Welcome, ${user.name.split(' ')[0]}` : 'SmartRTO Hub'}
          </h1>
          <p className="text-slate-400 text-base mb-8 leading-relaxed font-medium">
            Access secure personal transport records or use our public utility tools for vehicle and challan verification.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onSelectService('ai-assistant')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Consult AI Assistant <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onSelectService('services')}
              className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-700 hover:bg-slate-700 transition-all active:scale-95"
            >
              Service Map
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </section>

      {/* Personal Vault Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
             <Lock className="h-4 w-4" /> Personal Vault
           </h3>
           {!user && <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-950/20 px-3 py-1 rounded-full border border-rose-900/30">Auth Required</span>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {personalStats.map((stat, i) => (
            <button 
              key={i}
              onClick={() => onSelectService(stat.action)}
              className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-lg flex flex-col items-start gap-4 hover:border-indigo-500 transition-all group text-left relative overflow-hidden"
            >
              <div className="w-full flex justify-between items-center">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <stat.icon className="h-5 w-5 text-slate-700 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="w-full flex justify-between items-end">
                <span className="text-4xl font-black text-white tracking-tighter">{stat.value}</span>
                <ChevronRight className="h-6 w-6 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              {!user && <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Lock className="h-8 w-8 text-white/20" />
              </div>}
            </button>
          ))}
        </div>
      </div>

      {/* Public Utilities Bar */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
          <LayoutGrid className="h-4 w-4" /> Public Utilities
        </h3>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {publicUtilities.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onSelectService(action.action)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-600 transition-all group"
              >
                <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform shadow-lg`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="font-black text-slate-200 text-sm uppercase tracking-widest block leading-tight group-hover:text-white">{action.title}</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{action.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-white uppercase tracking-widest">Enforcement Feed</h3>
            <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-900/50">Live Sync</span>
          </div>
          <div className="space-y-4">
             {[
               { text: 'Sync: RC KA01MJ5678 Verified', color: 'bg-emerald-500', desc: 'Public Registry Lookup match' },
               { text: 'Expiry: MH12AB1234 Insurance', color: 'bg-rose-500', desc: 'Valid for 12 more days' }
             ].map((item, i) => (
               <div key={i} className="flex gap-4 items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                 <div className={`w-2 h-2 ${item.color} rounded-full shadow-lg shadow-inherit animate-pulse`}></div>
                 <div className="min-w-0">
                   <p className="text-sm font-black text-slate-200 uppercase tracking-tight">{item.text}</p>
                   <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Knowledge Hub</h3>
              <p className="text-indigo-100 text-base leading-relaxed font-medium max-w-xs">
                Access official traffic law documentation or practice for your Learner's License.
              </p>
            </div>
            <button 
              onClick={() => onSelectService('mock-test')}
              className="inline-flex items-center gap-3 bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
            >
              Start Mock Practice <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <HelpCircle className="absolute top-4 right-4 w-32 h-32 text-white/10 -mr-6 -mt-6 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
