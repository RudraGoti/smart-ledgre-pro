
import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Bike, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  X,
  History,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { VehicleDetails } from '../types';
import { MOCK_VEHICLES } from '../constants';

interface GarageProps {
  onBack: () => void;
  onAction: (view: string, context: string) => void;
  user: any | null;
}

const RegisteredVehicles: React.FC<GarageProps> = ({ onBack, onAction, user }) => {
  // Filter vehicles owned by the current user
  const userVehicles = useMemo(() => {
    if (!user) return [];
    return Object.values(MOCK_VEHICLES).filter(v => v.ownerName.toLowerCase() === user.name.toLowerCase());
  }, [user]);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);

  const getStatusColor = (expiryDate?: string) => {
    if (!expiryDate) return 'text-slate-500';
    const date = new Date(expiryDate);
    const diff = (date.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    if (diff < 0) return 'text-rose-500';
    if (diff < 30) return 'text-amber-500';
    return 'text-emerald-500';
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Authentication Required</h2>
        <p className="text-slate-400 font-medium">Please sign in to access your personal vehicle registry.</p>
        <button onClick={onBack} className="text-indigo-400 font-black uppercase text-xs tracking-widest">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Personal Garage</h2>
            <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Registry for {user.name}</p>
          </div>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all">
          <Plus className="h-4 w-4 inline mr-2" /> Register Asset
        </button>
      </div>

      {userVehicles.length === 0 ? (
        <div className="bg-slate-900 p-20 rounded-[3rem] border-2 border-dashed border-slate-800 text-center">
          <Car className="h-16 w-16 text-slate-700 mx-auto mb-6 opacity-30" />
          <p className="text-slate-500 font-black uppercase tracking-widest">No vehicles linked to your identity.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {userVehicles.map((v) => (
            <div 
              key={v.rcNumber} 
              onClick={() => setSelectedVehicle(v)}
              className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl text-slate-500 group-hover:text-indigo-400 transition-colors border border-slate-800 shadow-inner">
                    {v.vehicleClass === 'MCWG' ? <Bike className="h-8 w-8" /> : <Car className="h-8 w-8" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight">{v.rcNumber}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{v.model}</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Insurance Exp.</p>
                  <p className={`text-sm font-black ${getStatusColor(v.insuranceExpiry)}`}>{v.insuranceExpiry}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Fitness Valid</p>
                  <p className="text-sm font-black text-slate-300">{v.fitnessUpTo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVehicle && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-[3rem] w-full max-w-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
               <div>
                 <h3 className="text-2xl font-black uppercase text-white tracking-tighter leading-none">{selectedVehicle.rcNumber}</h3>
                 <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Comprehensive Asset Profile</p>
               </div>
               <button onClick={() => setSelectedVehicle(null)} className="p-3 hover:bg-slate-800 rounded-2xl transition-colors">
                 <X className="h-7 w-7 text-slate-400" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: 'Assigned Owner', value: selectedVehicle.ownerName },
                  { label: 'Registration Hub', value: selectedVehicle.registrationDate },
                  { label: 'Fuel Sequence', value: selectedVehicle.fuelType },
                  { label: 'Asset Category', value: selectedVehicle.vehicleClass },
                  { label: 'Chassis UID', value: selectedVehicle.chassisNumber },
                  { label: 'Engine Sequence', value: selectedVehicle.engineNumber }
                ].map(d => (
                  <div key={d.label} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">{d.label}</p>
                    <p className="text-base font-black text-slate-100 uppercase leading-none truncate">{d.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2">Lifecycle Management</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setSelectedVehicle(null); onAction('insurance', selectedVehicle.rcNumber); }}
                    className="p-6 bg-blue-950/30 rounded-3xl border border-blue-900/40 flex items-center justify-between group hover:bg-blue-600 transition-all shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg"><ShieldCheck className="h-6 w-6" /></div>
                      <span className="text-sm font-black uppercase text-white tracking-widest">Policy Vault</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-blue-400 group-hover:text-white" />
                  </button>
                  <button 
                    onClick={() => { setSelectedVehicle(null); onAction('challan', selectedVehicle.rcNumber); }}
                    className="p-6 bg-rose-950/30 rounded-3xl border border-rose-900/40 flex items-center justify-between group hover:bg-rose-600 transition-all shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-600 text-white rounded-xl shadow-lg"><History className="h-6 w-6" /></div>
                      <span className="text-sm font-black uppercase text-white tracking-widest">Violations</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-rose-400 group-hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button className="flex-1 py-5 bg-slate-950 text-xs font-black uppercase text-white rounded-2xl border border-slate-800 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
                   <Download className="h-5 w-5 text-indigo-400" /> Export Form 23
                 </button>
                 <button className="flex-1 py-5 bg-indigo-600 text-white text-xs font-black uppercase rounded-2xl shadow-xl hover:bg-indigo-500 transition-all">
                   Fitness Validation
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredVehicles;
