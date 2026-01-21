
import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  LogOut, 
  MapPin,
  Settings,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  Fingerprint,
  IdCard,
  X,
  Loader2,
  CheckCircle2,
  Key,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { rtoService } from '../services/geminiService';

interface ProfileProps {
  user: any;
  onLogout: () => void;
  onSelectService: (service: string) => void;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onClose }) => {
  const [isLinking, setIsLinking] = useState<'aadhaar' | 'pan' | null>(null);
  const [linkStep, setLinkStep] = useState<'input' | 'processing' | 'success' | 'error'>('input');
  const [formData, setFormData] = useState({ id: '' });
  const [aiRemarks, setAiRemarks] = useState<string | null>(null);
  
  const [identities, setIdentities] = useState({
    aadhaar: { linked: false, value: '' },
    pan: { linked: false, value: '' }
  });

  const handleStartLink = (type: 'aadhaar' | 'pan') => {
    setIsLinking(type);
    setLinkStep('input');
    setFormData({ id: '' });
    setAiRemarks(null);
  };

  const handleVerify = async () => {
    if (!isLinking) return;
    setLinkStep('processing');
    
    const result = await rtoService.verifyIdentityDocument(isLinking, formData.id);
    
    if (result.isValid) {
      setAiRemarks(result.remarks);
      setIdentities(prev => ({
        ...prev,
        [isLinking]: { linked: true, value: formData.id }
      }));
      setLinkStep('success');
    } else {
      setAiRemarks(result.remarks);
      setLinkStep('error');
    }
  };

  const maskId = (val: string, type: 'aadhaar' | 'pan') => {
    if (!val) return '';
    if (type === 'aadhaar') return `XXXX XXXX ${val.slice(-4)}`;
    return `${val.slice(0, 5)}XXXX${val.slice(-1)}`;
  };

  return (
    <div className="max-w-xl mx-auto py-12 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center justify-between bg-slate-900 px-6 py-4 rounded-3xl shadow-xl border border-slate-800">
        <button onClick={onClose} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" /> Return
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-950 text-rose-400 border border-rose-900/40 hover:bg-rose-900 transition-all text-xs font-black uppercase tracking-widest shadow-lg"
        >
          <LogOut className="h-4 w-4" /> Terminate Session
        </button>
      </div>

      <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden p-10 space-y-10">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
            {user.avatar}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">{user.name}</h2>
            <div className="flex flex-wrap gap-3">
              <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-900/40 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Identity Verified
              </span>
              <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1.5 uppercase tracking-widest bg-indigo-950 px-3 py-1 rounded-full border border-indigo-900/40 shadow-sm">
                <ShieldAlert className="h-3.5 w-3.5" /> DigiLocker Active
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Government IDs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-6 rounded-[2rem] border transition-all ${identities.aadhaar.linked ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${identities.aadhaar.linked ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                  <Fingerprint className="h-6 w-6" />
                </div>
                {identities.aadhaar.linked ? (
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-950 px-3 py-1 rounded-full border border-indigo-900/30">Linked</span>
                ) : (
                  <button onClick={() => handleStartLink('aadhaar')} className="text-[9px] font-black text-white uppercase tracking-widest bg-indigo-600 px-3 py-1 rounded-full shadow-lg">Link Now</button>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Aadhaar Card</p>
              <p className={`text-sm font-mono font-black ${identities.aadhaar.linked ? 'text-white' : 'text-slate-800'}`}>
                {identities.aadhaar.linked ? maskId(identities.aadhaar.value, 'aadhaar') : 'XXXX XXXX XXXX'}
              </p>
            </div>

            <div className={`p-6 rounded-[2rem] border transition-all ${identities.pan.linked ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${identities.pan.linked ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                  <IdCard className="h-6 w-6" />
                </div>
                {identities.pan.linked ? (
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-900/30">Linked</span>
                ) : (
                  <button onClick={() => handleStartLink('pan')} className="text-[9px] font-black text-white uppercase tracking-widest bg-emerald-600 px-3 py-1 rounded-full shadow-lg">Link Now</button>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">PAN Card</p>
              <p className={`text-sm font-mono font-black ${identities.pan.linked ? 'text-white' : 'text-slate-800'}`}>
                {identities.pan.linked ? maskId(identities.pan.value, 'pan').toUpperCase() : 'ABCDE1234F'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Communication Registry</h3>
           <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Primary Mobile', value: user.phone, icon: Smartphone },
              { label: 'E-Mail Address', value: user.email, icon: Mail },
              { label: 'Default RTO Office', value: 'MH-12 Pune North', icon: MapPin },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 transition-all hover:border-slate-700 group">
                <div className="p-3 bg-slate-900 rounded-xl text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <item.icon className="h-5 w-5 shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-base font-bold text-slate-200 truncate leading-none">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800">
           <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all group">
             <div className="flex items-center gap-4">
               <Settings className="h-5 w-5 text-slate-500 group-hover:rotate-45 transition-transform" />
               <span className="text-sm font-black uppercase text-slate-300 tracking-widest group-hover:text-white transition-colors">Security & Preferences</span>
             </div>
             <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
           </button>
        </div>
      </div>

      {isLinking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-[3rem] w-full max-w-md overflow-hidden border border-slate-800 shadow-2xl p-10 space-y-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Identity Sync</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{isLinking === 'aadhaar' ? 'Aadhaar (UIDAI)' : 'PAN (Income Tax)'} Handshake</p>
              </div>
              <button onClick={() => setIsLinking(null)} className="p-3 hover:bg-slate-800 rounded-2xl transition-colors">
                <X className="h-7 w-7 text-white" />
              </button>
            </div>

            {linkStep === 'input' && (
              <div className="space-y-6">
                <div className="relative">
                  {isLinking === 'aadhaar' ? <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 h-6 w-6" /> : <IdCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 h-6 w-6" />}
                  <input 
                    type="text" 
                    placeholder={isLinking === 'aadhaar' ? '12 DIGIT AADHAAR NUMBER' : '10 CHARACTER PAN ID'}
                    maxLength={isLinking === 'aadhaar' ? 12 : 10}
                    className="w-full pl-16 pr-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-black placeholder:text-slate-800 focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all uppercase outline-none text-lg tracking-widest"
                    value={formData.id}
                    onChange={(e) => setFormData({ id: e.target.value.toUpperCase() })}
                  />
                </div>
                <button 
                  onClick={handleVerify}
                  disabled={!formData.id || (isLinking === 'aadhaar' && formData.id.length < 12) || (isLinking === 'pan' && formData.id.length < 10)}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Activity className="h-4 w-4" /> Initiate AI Verification
                </button>
              </div>
            )}

            {linkStep === 'processing' && (
              <div className="py-12 text-center space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-indigo-500 mx-auto" />
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter">Cryptographic Sync</h4>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic animate-pulse">Running Gemini-Powered Structural Analysis...</p>
                </div>
              </div>
            )}

            {linkStep === 'success' && (
              <div className="py-10 text-center space-y-8 animate-in zoom-in duration-500">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border ${isLinking === 'aadhaar' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30'}`}>
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Asset Linked</h3>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Identity vault updated successfully</p>
                </div>
                {aiRemarks && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">AI Audit Remarks</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{aiRemarks}</p>
                  </div>
                )}
                <button 
                  onClick={() => setIsLinking(null)}
                  className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest text-xs border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Return to Profile
                </button>
              </div>
            )}

            {linkStep === 'error' && (
              <div className="py-10 text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto bg-rose-950/40 text-rose-400 border border-rose-900/30">
                  <AlertTriangle className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Rejected</h3>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Structural mismatch detected</p>
                </div>
                {aiRemarks && (
                  <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-900/20 text-left">
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-1">Reason for Failure</p>
                    <p className="text-[10px] text-rose-300 font-medium leading-relaxed">{aiRemarks}</p>
                  </div>
                )}
                <button 
                  onClick={() => setLinkStep('input')}
                  className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest text-xs border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center space-y-2 py-4">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
          Secure Auth Environment • v2.5.0
        </p>
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em]">
          Grounded Identity Engine Active
        </p>
      </div>
    </div>
  );
};

export default Profile;
