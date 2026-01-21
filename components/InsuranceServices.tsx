
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  Loader2, 
  Plus, 
  Shield, 
  CreditCard,
  AlertCircle,
  Lock
} from 'lucide-react';
import { MOCK_VEHICLES } from '../constants';

const INSURANCE_PROVIDERS = [
  "National General Insurance",
  "United Transport Assurance",
  "New India Assurance Co.",
  "Digital Protect Motor Insurance",
  "HDFC ERGO General Insurance"
];

interface PolicyRecord {
  id: string;
  rcNumber: string;
  model: string;
  policyNumber: string;
  provider: string;
  expiryDate: string;
  status: 'Active' | 'Expired';
}

interface InsuranceProps {
  onBack: () => void;
  initialSearch?: string | null;
  user: any | null;
}

const InsuranceServices: React.FC<InsuranceProps> = ({ onBack, initialSearch, user }) => {
  const userPolicies = useMemo(() => {
    if (!user) return [];
    // Filter vehicles by user, then map to policies
    return Object.values(MOCK_VEHICLES)
      .filter(v => v.ownerName.toLowerCase() === user.name.toLowerCase())
      .map(v => ({
        id: `POL-${v.rcNumber}-${Math.random().toString(36).substr(2, 9)}`,
        rcNumber: v.rcNumber,
        model: v.model,
        policyNumber: `POL-${v.rcNumber.slice(-4)}-${Math.floor(Math.random() * 9000) + 1000}`,
        provider: INSURANCE_PROVIDERS[Math.floor(Math.random() * INSURANCE_PROVIDERS.length)],
        expiryDate: v.insuranceExpiry,
        status: new Date(v.insuranceExpiry) < new Date() ? 'Expired' : 'Active'
      }));
  }, [user]);

  const [policies, setPolicies] = useState<PolicyRecord[]>(userPolicies);
  const [query, setQuery] = useState(initialSearch || '');
  const [activeSubView, setActiveSubView] = useState<'vault' | 'checkout'>('vault');
  const [isRenewing, setIsRenewing] = useState<PolicyRecord | null>(null);
  const [isBuyingNew, setIsBuyingNew] = useState(false);
  const [renewalStep, setRenewalStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPolicies(userPolicies);
  }, [userPolicies]);

  useEffect(() => {
    if (initialSearch) setQuery(initialSearch);
  }, [initialSearch]);

  const startCheckout = (policy: PolicyRecord | null, isNew: boolean) => {
    setIsRenewing(policy);
    setIsBuyingNew(isNew);
    setRenewalStep('plan');
    setSelectedPlan(null);
    setActiveSubView('checkout');
  };

  const closeCheckout = () => {
    setActiveSubView('vault');
    setIsRenewing(null);
    setIsBuyingNew(false);
  };

  const handleRenewalComplete = () => {
    setLoading(true);
    setTimeout(() => {
      setRenewalStep('success');
      setLoading(false);
    }, 1500);
  };

  const filteredPolicies = policies.filter(p => 
    p.rcNumber.toLowerCase().includes(query.toLowerCase()) || 
    p.policyNumber.toLowerCase().includes(query.toLowerCase())
  );

  if (!user) {
    return (
      <div className="py-20 text-center space-y-6">
        <Lock className="h-16 w-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Security Threshold Required</h2>
        <p className="text-slate-400 font-medium">Please sign in to access your personal digital insurance vault.</p>
        <button onClick={onBack} className="text-indigo-400 font-black uppercase text-xs tracking-widest">Back to Dashboard</button>
      </div>
    );
  }

  if (activeSubView === 'checkout') {
    return (
      <div className="max-w-md mx-auto space-y-6 py-6 animate-in slide-in-from-right duration-500 flex flex-col min-h-[70vh]">
        <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <button onClick={closeCheckout} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h3 className="text-lg font-black uppercase text-white tracking-tight leading-none">Policy Renewal</h3>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">{isRenewing?.rcNumber || 'Asset Acquisition'}</p>
            </div>
          </div>
          <Shield className="h-7 w-7 text-indigo-400" />
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 flex-1 space-y-10 shadow-2xl">
          {renewalStep === 'plan' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Select Protection Tier</p>
              {[{ name: 'Basic 3rd Party', price: 2850, desc: 'Liability coverage for third party damage.' }, { name: 'Full Comprehensive', price: 8400, desc: 'Total coverage including own asset damage.' }].map(plan => (
                <button 
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all ${selectedPlan?.name === plan.name ? 'border-indigo-600 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-slate-800 bg-slate-950 hover:border-slate-600'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-black uppercase text-white tracking-widest">{plan.name}</span>
                    <span className="text-xl font-black text-white">₹{plan.price}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">{plan.desc}</p>
                </button>
              ))}
              <button 
                disabled={!selectedPlan}
                onClick={() => setRenewalStep('payment')}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl disabled:opacity-50 active:scale-95 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {renewalStep === 'payment' && (
            <div className="space-y-10 text-center animate-in fade-in duration-300">
              <div className="bg-slate-950 p-12 rounded-[3.5rem] border border-slate-800 shadow-inner">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-3">Total Auth Required</p>
                <h2 className="text-5xl font-black text-white tracking-tighter">₹{selectedPlan?.price}</h2>
              </div>
              <div className="space-y-4">
                <button onClick={handleRenewalComplete} className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-4">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <CreditCard className="h-6 w-6" />} Secure Authorization
                </button>
                <button onClick={() => setRenewalStep('plan')} className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400">Modify Tier</button>
              </div>
            </div>
          )}

          {renewalStep === 'success' && (
            <div className="text-center py-12 space-y-10 animate-in zoom-in duration-500">
              <div className="bg-emerald-950/40 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-900/40">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Vault Updated</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Your digital insurance records are now synchronized.</p>
              </div>
              <button onClick={closeCheckout} className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-lg border border-slate-800 hover:bg-slate-800 transition-colors">
                Return to Vault
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors">
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Insurance Vault</h2>
            <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-2">Personal Policy Management</p>
          </div>
        </div>
        <button onClick={() => startCheckout(null, true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all flex items-center gap-2">
          <Plus className="h-5 w-5" /> New Policy
        </button>
      </div>

      <div className="bg-slate-900 p-3 rounded-[2rem] border border-slate-800 shadow-2xl flex items-center gap-4 group focus-within:border-indigo-600 transition-all">
        <Search className="h-6 w-6 text-slate-600 ml-4 group-focus-within:text-indigo-400" />
        <input
          type="text"
          placeholder="SEARCH PERSONAL POLICIES BY RC NO..."
          className="flex-1 py-4 bg-transparent text-sm font-black uppercase tracking-widest outline-none placeholder:text-slate-800 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredPolicies.length === 0 ? (
           <div className="col-span-full py-24 text-center text-slate-700 font-black uppercase text-sm tracking-widest">No matching personal policies found.</div>
        ) : (
          filteredPolicies.map((p) => (
            <div key={p.id} className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl flex flex-col justify-between hover:border-indigo-900/50 transition-colors group">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{p.rcNumber}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{p.provider}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${p.status === 'Active' ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30' : 'text-rose-400 bg-rose-950/20 border-rose-900/30'}`}>
                    {p.status} Status
                  </span>
                </div>
                <div className="flex justify-between items-center mb-10 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-inner">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Expiration Threshold</p>
                      <p className="text-lg font-black text-slate-200 uppercase leading-none">{p.expiryDate}</p>
                   </div>
                   <button className="p-3 bg-slate-900 rounded-2xl text-slate-500 hover:text-indigo-400 transition-colors border border-slate-800">
                      <Download className="h-6 w-6" />
                   </button>
                </div>
              </div>
              <button onClick={() => startCheckout(p, false)} className="w-full py-5 bg-indigo-950/30 text-indigo-400 rounded-2xl text-xs font-black uppercase hover:bg-indigo-600 hover:text-white transition-all border border-indigo-900/30 shadow-lg tracking-widest">
                Initiate Renewal Protocol
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InsuranceServices;
