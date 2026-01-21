
import React, { useState } from 'react';
import { Search, Info, CheckCircle, AlertCircle, Calendar, User, ShieldCheck, Fuel, ArrowLeft } from 'lucide-react';
import { MOCK_VEHICLES, MOCK_LICENSES } from '../constants';
import { VehicleDetails, LicenseDetails } from '../types';

interface StatusLookupProps {
  type: 'RC' | 'DL';
  onBack: () => void;
  titleOverride?: string;
}

const StatusLookup: React.FC<StatusLookupProps> = ({ type, onBack, titleOverride }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<VehicleDetails | LicenseDetails | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = () => {
    setError(false);
    if (type === 'RC') {
      const data = MOCK_VEHICLES[query.toUpperCase().replace(/\s/g, '')];
      if (data) setResult(data);
      else setError(true);
    } else {
      const data = MOCK_LICENSES[query.toUpperCase().replace(/\s/g, '')];
      if (data) setResult(data);
      else setError(true);
    }
  };

  const isVehicle = (res: VehicleDetails | LicenseDetails): res is VehicleDetails => {
    return (res as VehicleDetails).rcNumber !== undefined;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-6">
        <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="text-left space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
            {titleOverride || (type === 'RC' ? 'Vehicle Registry' : 'License Verification')}
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.25em]">Central Transport Node Gateway</p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-6 w-6" />
            <input
              type="text"
              placeholder={type === 'RC' ? 'E.G. MH12AB1234' : 'E.G. DL1420150012345'}
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-black placeholder:text-slate-600 focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all uppercase outline-none text-lg tracking-widest"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95 text-xs"
          >
            Verify Identity
          </button>
        </div>
        <div className="bg-indigo-950/20 mt-8 p-4 rounded-2xl border border-indigo-900/30 flex items-center gap-4">
          <Info className="h-5 w-5 text-indigo-400" />
          <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.2em] leading-relaxed">
            Direct handshake with mParivahan servers active. Encryption key: RSA-4096.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/30 border border-rose-900/30 p-8 rounded-[2rem] flex items-center gap-6 text-rose-500 animate-in zoom-in shadow-2xl">
          <div className="bg-rose-900/20 p-4 rounded-2xl border border-rose-900/40">
            <AlertCircle className="h-10 w-10" />
          </div>
          <div>
            <p className="font-black text-2xl uppercase tracking-tighter">Record Not Found</p>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-500/60">Verify the alphanumeric string and re-authenticate.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="bg-indigo-600 px-10 py-10 text-white flex justify-between items-center">
            <div>
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Authenticated Registry Entry</p>
              <h3 className="text-4xl font-black tracking-tighter uppercase">{isVehicle(result) ? result.rcNumber : result.dlNumber}</h3>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
              <span className="font-black uppercase tracking-widest text-xs">Verified Asset</span>
            </div>
          </div>

          <div className="p-10">
            {isVehicle(result) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  {[
                    { label: 'Registered Owner', value: result.ownerName, icon: User },
                    { label: 'Asset Make & Model', value: result.model, icon: ShieldCheck },
                    { label: 'Propulsion Type', value: result.fuelType, icon: Fuel }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 group-hover:border-indigo-600 transition-colors shadow-inner">
                        <item.icon className="h-8 w-8 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xl font-black text-white uppercase tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-inner space-y-8">
                  <h4 className="font-black text-white flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
                    <Calendar className="h-5 w-5 text-indigo-400" /> Temporal Matrix
                  </h4>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Registration</p>
                      <p className="font-black text-white text-sm">{result.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Fitness Cap</p>
                      <p className="font-black text-white text-sm">{result.fitnessUpTo}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Ins. Expiry</p>
                      <p className={`font-black text-sm ${new Date(result.insuranceExpiry) < new Date() ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {result.insuranceExpiry}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Chassis UID</p>
                      <p className="font-mono font-black text-indigo-400 text-xs tracking-tighter">••••{result.chassisNumber.slice(-6)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  {[
                    { label: 'Credential Holder', value: result.name, icon: User },
                    { label: 'Identity DOB', value: result.dob, icon: Calendar }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 group-hover:border-indigo-600 transition-colors shadow-inner">
                        <item.icon className="h-8 w-8 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xl font-black text-white uppercase tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-inner space-y-8">
                  <h4 className="font-black text-white flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
                    <ShieldCheck className="h-5 w-5 text-indigo-400" /> Validity Domain
                  </h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Non-Transport</span>
                      <span className="font-black text-white">{result.validityNonTransport}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transport</span>
                      <span className="font-black text-white">{result.validityTransport}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                      <span className="px-5 py-2 bg-emerald-950 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-[0.25em] border border-emerald-900/50">
                        {result.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusLookup;
