
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Car, 
  Bike, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  History, 
  Camera, 
  X,
  CreditCard,
  Loader2,
  Lock
} from 'lucide-react';
import { MOCK_VEHICLES, MOCK_CHALLANS } from '../constants';
import { VehicleDetails, Challan } from '../types';

interface ChallanProps {
  onBack: () => void;
  initialVehicleRC?: string | null;
  user: any | null;
}

const MyChallans: React.FC<ChallanProps> = ({ onBack, initialVehicleRC, user }) => {
  const [localChallans, setLocalChallans] = useState<Challan[]>(MOCK_CHALLANS);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [activeChallan, setActiveChallan] = useState<Challan | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');

  // Filter vehicles owned by user
  const userVehicles = useMemo(() => {
    if (!user) return [];
    return Object.values(MOCK_VEHICLES).filter(v => v.ownerName.toLowerCase() === user.name.toLowerCase());
  }, [user]);

  useEffect(() => {
    if (initialVehicleRC) {
      const v = userVehicles.find(v => v.rcNumber === initialVehicleRC);
      if (v) setSelectedVehicle(v);
    }
  }, [initialVehicleRC, userVehicles]);

  const vehicleChallans = useMemo(() => {
    if (!selectedVehicle) return [];
    return localChallans.filter(c => c.vehicleNumber === selectedVehicle.rcNumber);
  }, [selectedVehicle, localChallans]);

  const handlePay = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      if (activeChallan) {
        setLocalChallans(prev => prev.map(c => 
          c.id === activeChallan.id ? { ...c, status: 'Paid' } : c
        ));
      }
      setPaymentStep('success');
    }, 1500);
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-6">
        <Lock className="h-16 w-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Access Denied</h2>
        <p className="text-slate-400 font-medium">Please sign in to view personal traffic violations.</p>
        <button onClick={onBack} className="text-indigo-400 font-black uppercase text-xs tracking-widest">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-6">
        <button 
          onClick={selectedVehicle && !initialVehicleRC ? () => setSelectedVehicle(null) : onBack}
          className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            {selectedVehicle ? `${selectedVehicle.rcNumber} Records` : 'My Violations'}
          </h2>
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-1">Personal Enforcement Dashboard</p>
        </div>
      </div>

      {!selectedVehicle ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {userVehicles.length === 0 ? (
             <div className="col-span-full py-20 bg-slate-900 rounded-[3rem] border border-slate-800 text-center">
                <p className="text-slate-500 uppercase font-black text-sm tracking-widest">No vehicles registered to your profile.</p>
             </div>
          ) : (
            userVehicles.map((v) => {
              const count = localChallans.filter(c => c.vehicleNumber === v.rcNumber && c.status === 'Pending').length;
              return (
                <button
                  key={v.rcNumber}
                  onClick={() => setSelectedVehicle(v)}
                  className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex items-center justify-between hover:border-indigo-500 transition-all text-left shadow-xl group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl shadow-inner ${count > 0 ? 'bg-rose-950/40 text-rose-500 border border-rose-900/30' : 'bg-emerald-950/40 text-emerald-500 border border-emerald-900/30'}`}>
                      {v.vehicleClass === 'MCWG' ? <Bike className="h-8 w-8" /> : <Car className="h-8 w-8" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight leading-none mb-2">{v.rcNumber}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{count} Outstanding Citations</p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col sm:flex-row justify-between items-center border border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex items-center gap-8">
                <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 shadow-inner">
                   {selectedVehicle.vehicleClass === 'MCWG' ? <Bike className="h-10 w-10 text-indigo-400" /> : <Car className="h-10 w-10 text-indigo-400" />}
                </div>
                <div>
                   <h3 className="text-4xl font-black tracking-tighter uppercase">{selectedVehicle.rcNumber}</h3>
                   <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-widest">{selectedVehicle.model}</p>
                </div>
             </div>
             <div className="text-center sm:text-right relative z-10">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">Aggregate Liability</p>
                <p className="text-5xl font-black text-rose-500 tracking-tighter">₹{vehicleChallans.filter(c => c.status === 'Pending').reduce((acc, c) => acc + c.amount, 0)}</p>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vehicleChallans.length === 0 ? (
               <div className="col-span-full py-16 text-center text-slate-600 font-black uppercase text-xs tracking-widest">No citation history found.</div>
            ) : (
              vehicleChallans.map((c) => (
                <div key={c.id} className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-xl overflow-hidden flex flex-col hover:border-indigo-900/40 transition-colors">
                  <div className={`p-6 flex justify-between items-start ${c.status === 'Paid' ? 'bg-emerald-950/20' : 'bg-rose-950/20'}`}>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-500 tracking-widest">ID: {c.id}</p>
                      <h4 className="text-sm font-black text-white uppercase leading-tight tracking-tight">{c.violationType}</h4>
                    </div>
                    <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase border ${c.status === 'Paid' ? 'text-emerald-400 border-emerald-900/30 bg-emerald-950/30' : 'text-rose-400 border-rose-900/30 bg-rose-950/30'}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="p-8 flex justify-between items-end bg-slate-900 flex-1">
                     <div className="space-y-2">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{c.date}</p>
                        <p className="text-3xl font-black text-white tracking-tighter">₹{c.amount}</p>
                     </div>
                     <button onClick={() => setActiveChallan(c)} className="bg-slate-950 p-4 rounded-2xl text-slate-600 hover:text-indigo-400 transition-colors border border-slate-800 shadow-inner">
                       <Camera className="h-6 w-6" />
                     </button>
                  </div>
                  {c.status === 'Pending' && (
                    <button 
                      onClick={() => { setActiveChallan(c); setIsPaying(true); setPaymentStep('details'); }}
                      className="mx-8 mb-8 py-5 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl tracking-widest hover:bg-rose-500 transition-all active:scale-95"
                    >
                      Authorize Payment
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Payment/Evidence Modal Reuse Logic */}
      {activeChallan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-slate-900 rounded-[3rem] w-full max-w-2xl overflow-hidden border border-slate-800 shadow-2xl">
             <div className="p-8 bg-slate-950 flex justify-between items-center border-b border-slate-800">
               <h3 className="text-xl font-black uppercase text-white tracking-tight">Record Evidence</h3>
               <button onClick={() => { setActiveChallan(null); setIsPaying(false); }} className="p-3 hover:bg-slate-800 rounded-2xl transition-colors">
                 <X className="h-7 w-7 text-white" />
               </button>
             </div>
             
             <div className="p-10 space-y-10">
                {!isPaying ? (
                  <div className="space-y-10">
                    {activeChallan.evidenceUrl ? (
                      <div className="rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative">
                        <img src={activeChallan.evidenceUrl} className="w-full h-64 object-cover opacity-60" alt="Capture" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 font-mono font-black text-white text-lg bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm">{activeChallan.id}</div>
                      </div>
                    ) : (
                      <div className="h-64 bg-slate-950 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-800 border border-slate-800">
                        <Camera className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-xs font-black uppercase tracking-widest">Metadata Redacted</p>
                      </div>
                    )}
                    <div className="bg-slate-950 p-8 rounded-[2rem] text-left border border-slate-800 shadow-inner">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Violation Sequence</p>
                      <p className="text-base font-black text-white uppercase leading-relaxed">{activeChallan.violationType}</p>
                    </div>
                    <button onClick={() => setIsPaying(true)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Proceed to Checkout</button>
                  </div>
                ) : (
                   <div className="space-y-12 py-6 text-center">
                     {paymentStep === 'details' && (
                        <div className="space-y-10">
                          <div className="bg-slate-950 p-10 rounded-[3.5rem] inline-block border border-slate-800 shadow-2xl">
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Liability Auth</p>
                             <h2 className="text-6xl font-black text-white tracking-tighter">₹{activeChallan.amount}</h2>
                          </div>
                          <button onClick={handlePay} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-4 shadow-xl active:scale-95">
                            <CreditCard className="h-6 w-6" /> Finalize via Secure Gateway
                          </button>
                        </div>
                     )}
                     {paymentStep === 'processing' && (
                        <div className="flex flex-col items-center gap-6 py-20">
                           <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
                           <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Handshake in progress...</p>
                        </div>
                     )}
                     {paymentStep === 'success' && (
                        <div className="space-y-10 py-6 animate-in zoom-in duration-500">
                          <CheckCircle2 className="h-24 w-24 text-emerald-400 mx-auto" />
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Citations Settled</h3>
                          <button onClick={() => { setActiveChallan(null); setIsPaying(false); }} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest text-xs border border-slate-800 hover:bg-slate-800 transition-all shadow-2xl">Return to Enforcement Portal</button>
                        </div>
                     )}
                   </div>
                )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MyChallans;
