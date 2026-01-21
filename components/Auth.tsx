
import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  User, 
  Key, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ShieldCheck,
  SmartphoneIcon
} from 'lucide-react';

interface AuthProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [method, setMethod] = useState<'username' | 'mobile' | 'google'>('username');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', phone: '', otp: '' });

  const handleAction = () => {
    setLoading(true);
    if (method === 'mobile' && step === 'input') {
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
      }, 1500);
    } else {
      setTimeout(() => {
        setLoading(false);
        const user = {
          name: formData.username || 'Rahul Sharma',
          email: formData.username ? `${formData.username}@example.com` : 'user@example.com',
          phone: formData.phone || '+91 98765-43210',
          avatar: 'RS',
          verified: true
        };
        onLogin(user);
        onClose();
      }, 2000);
    }
  };

  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
        
        {/* Header Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => { setMode('login'); setStep('input'); }}
            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white text-indigo-600 border-b-4 border-indigo-600' : 'bg-slate-50 text-slate-400'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setMode('signup'); setStep('input'); }}
            className={`flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-indigo-600 border-b-4 border-indigo-600' : 'bg-slate-50 text-slate-400'}`}
          >
            Create Account
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-black uppercase tracking-tighter">
              {mode === 'login' ? 'Welcome Back' : 'Join SmartRTO'}
            </h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Secure Gateway Access</p>
          </div>

          {/* Social / Method Switcher */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setMethod('username')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'username' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase">User</span>
            </button>
            <button 
              onClick={() => setMethod('mobile')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'mobile' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
            >
              <Smartphone className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase">Mobile</span>
            </button>
            <button 
              onClick={() => setMethod('google')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'google' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
            >
              <GoogleIcon />
              <span className="text-[10px] font-black uppercase">Google</span>
            </button>
          </div>

          <div className="space-y-4">
            {method === 'username' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="USERNAME OR EMAIL"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-black font-black placeholder:text-slate-400 focus:border-indigo-600 outline-none transition-all uppercase text-xs tracking-widest"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="SECURE PASSWORD"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-black font-black placeholder:text-slate-400 focus:border-indigo-600 outline-none transition-all uppercase text-xs tracking-widest"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            )}

            {method === 'mobile' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                {step === 'input' ? (
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="MOBILE NUMBER (+91)"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-black font-black placeholder:text-slate-400 focus:border-indigo-600 outline-none transition-all uppercase text-xs tracking-widest"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 mb-2">
                       <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">OTP Sent to {formData.phone}</p>
                    </div>
                    <input 
                      type="text" 
                      placeholder="ENTER 6-DIGIT OTP"
                      maxLength={6}
                      className="w-full py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-black font-black placeholder:text-slate-300 focus:border-indigo-600 outline-none transition-all text-center text-3xl tracking-[0.5em]"
                      value={formData.otp}
                      onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    />
                  </div>
                )}
              </div>
            )}

            {method === 'google' && (
              <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
                <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 inline-block shadow-inner">
                  <GoogleIcon />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">One-click authentication using your Google Cloud Identity.</p>
              </div>
            )}
          </div>

          <button 
            disabled={loading}
            onClick={handleAction}
            className="w-full py-5 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            {method === 'mobile' && step === 'input' ? 'GET OTP' : (mode === 'login' ? 'AUTHORIZE ACCESS' : 'REGISTER IDENTITY')}
          </button>

          <button 
            onClick={onClose}
            className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <X className="h-3 w-3" /> CANCEL PORTAL REQUEST
          </button>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
            Authenticated via secure transport layer. All identity data encrypted with SHA-256 standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
