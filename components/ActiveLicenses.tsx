
import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Bike, 
  Car, 
  AlertCircle, 
  ChevronRight,
  Calendar,
  User,
  ArrowLeft,
  X,
  Smartphone,
  ShieldAlert,
  Loader2,
  Key
} from 'lucide-react';
import { LicenseDetails } from '../types';
import { MOCK_LICENSES } from '../constants';

const ActiveLicenses: React.FC<{ onBack: () => void, user: any | null }> = ({ onBack, user }) => {
  // Mock filter for the logged-in user
  const userLicenses = useMemo(() => {
    if (!user) return [];
    return Object.values(MOCK_LICENSES).filter(l => l.name.toLowerCase() === user.name.toLowerCase());
  }, [user]);

  const [isLinking, setIsLinking] = useState(false);
  const [linkStep, setLinkStep] = useState<'details' | 'otp' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ dlNumber: '', dob: '' });
  const [otp, setOtp] = useState('');

  if (!user) {
    return (
      <div className="py-20 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Authentication Required</h2>
        <p className="text-slate-400 font-medium">Please sign in to access your digital driving permits.</p>
        <button onClick={onBack} className="text-indigo-400 font-black uppercase text-xs tracking-widest">Back to Dashboard</button>
      </div>
    );
  }

  const handleStartLinking = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLinkStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLinkStep('success');
    }, 2000);
  };

  const closeLinking = () => {
    setIsLinking(false);
    setLinkStep('details');
    setFormData({ dlNumber: '', dob: '' });
    setOtp('');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors">
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Personal Permits</h2>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.25em] mt-2">Authenticated: {user.name}</p>
          </div>
        </div>
        <button
          onClick={() => setIsLinking(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Sync License Registry
        </button>
      </div>

      <div className="space-y-12">
        {userLicenses.length === 0 ? (
          <div className="bg-slate-900 p-24 rounded-[3.5rem] border-2 border-dashed border-slate-800 text-center">
             <CreditCard className="h-16 w-16 text-slate-800 mx-auto mb-6 opacity-30" />
             <p className="text-slate-500 font-black uppercase tracking-widest">No active permits discovered in your vault.</p>
          </div>
        ) : (
          userLicenses.map((license, idx) => (
            <div key={idx} className="relative group bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
              <div className="bg-indigo-600 p-10 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="bg-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/20">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-indigo-100 uppercase tracking-[0.4em]">Republic of India</p>
                    <h3 className="text-3xl font-black tracking-tighter uppercase">Driving Permit</h3>
                  </div>
                </div>
                <div className="text-center sm:text-right bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-indigo-100 font-black uppercase tracking-widest mb-1">Authorization ID</p>
                  <p className="font-mono text-xl font-black tracking-widest">{license.dlNumber}</p>
                </div>
              </div>

              <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex gap-10">
                    <div className="w-40 h-52 bg-slate-950 rounded-[2rem] flex items-center justify-center border border-slate-800 relative overflow-hidden shadow-inner group">
                      <User className="h-20 w-20 text-slate-700 group-hover:text-indigo-600 transition-colors" />
                      <div className="absolute inset-0 bg-indigo-600/5 mix-blend-overlay"></div>
                    </div>
                    <div className="space-y-6">
                       <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${license.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border-emerald-900/30' : 'bg-rose-950 text-rose-400 border-rose-900/30'}`}>
                         {license.status} Identity
                       </span>
                       <div className="space-y-4">
                         <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
                            <Bike className="h-6 w-6 text-slate-500" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">MCWG Approved</span>
                         </div>
                         <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
                            <Car className="h-6 w-6 text-slate-500" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">LMV Approved</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Authenticated Name</p>
                      <p className="text-2xl font-black text-white uppercase tracking-tight leading-none">{license.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">DOB Registry</p>
                         <p className="text-base font-black text-white">{license.dob}</p>
                       </div>
                       <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Valid (Non-TR)</p>
                         <p className="text-base font-black text-indigo-400">{license.validityNonTransport}</p>
                       </div>
                    </div>
                  </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Linking Modal */}
      {isLinking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-800">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Credential Sync</h3>
              <button onClick={closeLinking} className="p-3 hover:bg-slate-800 rounded-2xl transition-colors"><X className="h-7 w-7 text-white" /></button>
            </div>
            
            <div className="space-y-8">
              {linkStep === 'details' && (
                <div className="space-y-6">
                  <div className="relative">
                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600" />
                    <input
                      type="text"
                      placeholder="DL NUMBER (E.G. DL14201...)"
                      className="w-full pl-16 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-black placeholder:text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all uppercase tracking-widest text-lg"
                      value={formData.dlNumber}
                      onChange={(e) => setFormData({...formData, dlNumber: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <button onClick={handleStartLinking} disabled={!formData.dlNumber} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50">Initiate Handshake</button>
                </div>
              )}

              {linkStep === 'otp' && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <div className="bg-indigo-950/40 p-6 rounded-3xl border border-indigo-900/30 text-center">
                    <Smartphone className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                    <p className="text-xs font-black text-indigo-300 uppercase tracking-widest">Aadhaar Security Code Sent</p>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="ENTER 6-DIGIT OTP"
                    className="w-full py-6 bg-slate-950 border border-slate-800 rounded-2xl text-center text-4xl font-black tracking-[1em] text-white placeholder:text-slate-800 outline-none focus:border-indigo-600"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <button onClick={handleVerifyOtp} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />} Finalize Verification
                  </button>
                </div>
              )}

              {linkStep === 'success' && (
                <div className="text-center py-10 space-y-10 animate-in zoom-in duration-500">
                  <div className="bg-emerald-950/40 w-32 h-32 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-900/30">
                    <CheckCircle2 className="h-16 w-16" />
                  </div>
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Registry Linked</h3>
                  <button onClick={closeLinking} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest text-xs border border-slate-800 hover:bg-slate-800 transition-colors shadow-2xl">Return to Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveLicenses;
