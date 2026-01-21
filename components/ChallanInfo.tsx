
import React, { useState } from 'react';
import { 
  Search, 
  AlertCircle, 
  CreditCard, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Info, 
  Camera, 
  ShieldCheck, 
  Loader2, 
  X, 
  History, 
  Scale,
  Calendar,
  ArrowLeft,
  Smartphone,
  ChevronLeft,
  QrCode,
  Lock,
  Wallet
} from 'lucide-react';
import { MOCK_CHALLANS } from '../constants';
import { Challan } from '../types';
import { rtoService } from '../services/geminiService';

interface ChallanInfoProps {
  onBack: () => void;
}

const ChallanInfo: React.FC<ChallanInfoProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [challans, setChallans] = useState<Challan[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'input' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Form states for checkout
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const filtered = MOCK_CHALLANS.filter(c => 
      c.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setChallans(filtered);
    setHasSearched(true);
  };

  const startPayment = (challan: Challan) => {
    setSelectedChallan(challan);
    setIsPaying(true);
    setPaymentStep('method');
    setPaymentMethod(null);
  };

  const handleMethodSelect = (method: 'upi' | 'card') => {
    setPaymentMethod(method);
    setPaymentStep('input');
  };

  const handlePay = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      if (selectedChallan) {
        setChallans(prev => prev.map(c => 
          c.id === selectedChallan.id ? { ...c, status: 'Paid' } : c
        ));
      }
      setPaymentStep('success');
    }, 2500);
  };

  const fetchAiExplanation = async (challan: Challan) => {
    setExplaining(true);
    const prompt = `Explain the traffic violation: "${challan.violationType}" under Section "${challan.section}". What is the typical penalty and why is this rule important for road safety in India? Keep it concise.`;
    const result = await rtoService.getAssistantResponse(prompt);
    setAiExplanation(result.text);
    setExplaining(false);
  };

  const resetModal = () => {
    setSelectedChallan(null);
    setIsPaying(false);
    setPaymentStep('method');
    setPaymentMethod(null);
    setAiExplanation(null);
    setUpiId('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-6">
        <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="text-left space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">E-Challan Portal</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.25em]">Public Violation Settlement Hub</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-6 w-6" />
            <input
              type="text"
              placeholder="VEHICLE NO. OR CHALLAN ID"
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-black placeholder:text-slate-600 focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all uppercase outline-none text-lg tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-10 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-xl active:scale-95 text-xs"
          >
            Retrieve
          </button>
        </div>
        <div className="bg-slate-950 mt-8 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <Info className="h-5 w-5 text-slate-500" />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">
            Requests are logged via authenticated national gateway.
          </p>
        </div>
      </div>

      {hasSearched && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-tight text-xl">
              <History className="h-6 w-6 text-rose-500" /> 
              Records ({challans.length})
            </h3>
            <div className="flex gap-4">
              <span className="text-rose-400 bg-rose-950/40 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-900/30">PENDING: {challans.filter(c => c.status === 'Pending').length}</span>
              <span className="text-emerald-400 bg-emerald-950/40 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-900/30">SETTLED: {challans.filter(c => c.status === 'Paid').length}</span>
            </div>
          </div>

          {challans.length === 0 ? (
            <div className="bg-slate-900 p-20 rounded-[3.5rem] border-2 border-dashed border-slate-800 text-center shadow-inner">
              <div className="bg-emerald-950/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-900/30 shadow-lg shadow-emerald-950/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <p className="text-white font-black text-2xl uppercase tracking-tighter">Identity Unlinked</p>
              <p className="text-slate-500 max-w-xs mx-auto mt-2 font-bold uppercase text-[10px] tracking-widest leading-relaxed">No enforcement records found for the queried identifier.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {challans.map((challan) => (
                <div 
                  key={challan.id}
                  className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden hover:border-indigo-900/40 transition-all group flex flex-col"
                >
                  <div className={`p-8 flex justify-between items-start ${challan.status === 'Paid' ? 'bg-emerald-950/10' : 'bg-rose-950/10'}`}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Entry ID</span>
                        <span className="text-xs font-mono font-black text-white">{challan.id}</span>
                      </div>
                      <h4 className="font-black text-white leading-tight text-lg uppercase tracking-tight">{challan.violationType}</h4>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      challan.status === 'Paid' ? 'text-emerald-400 border-emerald-900/40 bg-emerald-950/40' : 'text-rose-400 border-rose-900/40 bg-rose-950/40'
                    }`}>
                      {challan.status}
                    </span>
                  </div>
                  
                  <div className="p-8 space-y-8 flex-1 bg-slate-900">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Time Registry</p>
                          <p className="text-xs font-bold text-slate-300">{challan.date} | {challan.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <MapPin className="h-5 w-5 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Coordinates</p>
                          <p className="text-xs font-bold text-slate-300 truncate max-w-[100px]">{challan.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Scale className="h-5 w-5 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">MV Section</p>
                          <p className="text-xs font-bold text-slate-300">{challan.section || 'General'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <span className="text-3xl font-black text-white">₹{challan.amount}</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex gap-4">
                      <button 
                        onClick={() => setSelectedChallan(challan)}
                        className="flex-1 py-4 bg-slate-950 text-slate-300 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all border border-slate-800 flex items-center justify-center gap-2"
                      >
                        <Camera className="h-4 w-4" /> Proof
                      </button>
                      {challan.status === 'Pending' && (
                        <button 
                          onClick={() => startPayment(challan)}
                          className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/10 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" /> Pay Fine
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Unified Modal (Evidence + Advanced Checkout) */}
      {selectedChallan && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-800 relative">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 p-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {isPaying && paymentStep !== 'success' && paymentStep !== 'processing' ? (
                  <button 
                    onClick={() => {
                      if (paymentStep === 'input') setPaymentStep('method');
                      else setIsPaying(false);
                    }}
                    className="p-3 hover:bg-slate-800 rounded-2xl transition-colors -ml-2"
                  >
                    <ChevronLeft className="h-6 w-6 text-slate-400" />
                  </button>
                ) : (
                  <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-900/30">
                    <AlertCircle className="h-7 w-7 text-rose-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    {isPaying ? 'Secure Settlement' : 'Record Verification'}
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">ID: {selectedChallan.id}</p>
                </div>
              </div>
              <button 
                onClick={resetModal}
                className="p-3 hover:bg-slate-800 rounded-2xl transition-colors"
              >
                <X className="h-7 w-7 text-slate-400" />
              </button>
            </div>

            <div className="p-10 space-y-10">
              {!isPaying ? (
                <>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-4">Digital Evidence Proof</h4>
                    {selectedChallan.evidenceUrl ? (
                      <div className="relative group rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
                        <img 
                          src={selectedChallan.evidenceUrl} 
                          alt="Capture" 
                          className="w-full h-80 object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                           <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                             <p className="text-[10px] text-slate-400 font-black uppercase mb-1">OCR Detected</p>
                             <p className="text-xl font-mono font-black text-white tracking-widest">{selectedChallan.vehicleNumber}</p>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950 h-64 rounded-[2.5rem] flex flex-col items-center justify-center border border-slate-800 text-slate-700">
                        <Camera className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-xs font-black uppercase tracking-widest">Metadata Redacted</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-widest text-xs">
                        <ShieldCheck className="h-5 w-5" /> Penal Code Guidance
                      </div>
                      {!aiExplanation && !explaining && (
                        <button 
                          onClick={() => fetchAiExplanation(selectedChallan)}
                          className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-950/40 border border-indigo-900/40 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          Request AI Breakdown
                        </button>
                      )}
                    </div>
                    
                    {explaining ? (
                      <div className="flex items-center gap-4 py-2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                        <span className="text-xs font-black text-slate-500 italic uppercase tracking-widest">Consulting law nodes...</span>
                      </div>
                    ) : aiExplanation ? (
                      <div className="bg-indigo-950/20 p-6 rounded-2xl border border-indigo-900/20 animate-in fade-in">
                        <p className="text-sm text-slate-300 leading-relaxed font-bold italic">
                          {aiExplanation}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 font-bold">Violation processed under Section <span className="font-black text-white">{selectedChallan.section}</span>.</p>
                    )}
                  </div>

                  <div className="pt-6 flex gap-6">
                    <button 
                      onClick={() => { setSelectedChallan(null); }}
                      className="flex-1 py-5 bg-slate-950 text-slate-500 rounded-3xl font-black uppercase tracking-widest text-xs border border-slate-800 hover:text-white transition-colors"
                    >
                      Exit View
                    </button>
                    {selectedChallan.status === 'Pending' && (
                      <button 
                        onClick={() => { setIsPaying(true); setPaymentStep('method'); }}
                        className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                      >
                        Proceed to Settlement
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="animate-in slide-in-from-right duration-300">
                  {paymentStep === 'method' && (
                    <div className="space-y-10">
                      <div className="text-center space-y-2">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Liability</p>
                        <h2 className="text-5xl font-black text-white tracking-tighter">₹{selectedChallan.amount}</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button 
                          onClick={() => handleMethodSelect('upi')}
                          className="p-8 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col items-center gap-4 hover:border-indigo-600 transition-all group shadow-inner"
                        >
                          <div className="bg-indigo-950/40 p-4 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                            <Smartphone className="h-8 w-8" />
                          </div>
                          <span className="text-sm font-black text-white uppercase tracking-widest">Unified Interface (UPI)</span>
                        </button>
                        
                        <button 
                          onClick={() => handleMethodSelect('card')}
                          className="p-8 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col items-center gap-4 hover:border-indigo-600 transition-all group shadow-inner"
                        >
                          <div className="bg-emerald-950/40 p-4 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                            <CreditCard className="h-8 w-8" />
                          </div>
                          <span className="text-sm font-black text-white uppercase tracking-widest">Debit / Credit Card</span>
                        </button>
                      </div>

                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <Lock className="h-5 w-5 text-slate-600" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                          Transactions are secured by 256-bit SSL encryption. Payment processed by National Payment Gateway.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentStep === 'input' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="flex justify-between items-end mb-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                          {paymentMethod === 'upi' ? 'UPI Virtual Address' : 'Card Credentials'}
                        </h4>
                        <span className="text-xl font-black text-indigo-400">₹{selectedChallan.amount}</span>
                      </div>

                      {paymentMethod === 'upi' ? (
                        <div className="space-y-6">
                          <div className="relative">
                            <QrCode className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 h-6 w-6" />
                            <input 
                              type="text" 
                              placeholder="USER@VPA (E.G. RAHUL@OKAXIS)"
                              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-black placeholder:text-slate-800 focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all uppercase tracking-widest"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                          </div>
                          <div className="p-6 bg-indigo-950/20 rounded-2xl border border-indigo-900/30 flex items-center gap-4">
                             <Info className="h-5 w-5 text-indigo-400" />
                             <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                               You will receive a notification in your UPI app to authorize.
                             </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 h-6 w-6" />
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000"
                              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-black placeholder:text-slate-800 focus:ring-2 focus:ring-emerald-600/50 outline-none transition-all tracking-[0.2em]"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                              maxLength={19}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              placeholder="MM / YY"
                              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-black placeholder:text-slate-800 focus:ring-2 focus:ring-emerald-600/50 outline-none transition-all tracking-widest text-center"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                            />
                            <input 
                              type="password" 
                              placeholder="CVV"
                              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-black placeholder:text-slate-800 focus:ring-2 focus:ring-emerald-600/50 outline-none transition-all tracking-widest text-center"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              maxLength={3}
                            />
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={handlePay}
                        disabled={(paymentMethod === 'upi' && !upiId) || (paymentMethod === 'card' && (!cardNumber || !expiry || !cvv))}
                        className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                      >
                        Authorize & Pay ₹{selectedChallan.amount}
                      </button>
                    </div>
                  )}

                  {paymentStep === 'processing' && (
                    <div className="py-20 space-y-10 text-center">
                      <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto" />
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Synchronizing</h3>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Handshaking with Banking Gateway...</p>
                      </div>
                    </div>
                  )}

                  {paymentStep === 'success' && (
                    <div className="py-10 space-y-10 animate-in zoom-in duration-500 text-center">
                      <div className="bg-emerald-950/40 w-32 h-32 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-900/30 shadow-2xl">
                        <CheckCircle2 className="h-16 w-16" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Citations Settled</h3>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Global Digital Receipt Generated</p>
                      </div>
                      
                      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-left space-y-3 shadow-inner">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase">
                          <span>Reference Code</span>
                          <span className="text-white font-mono">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase">
                          <span>Amount Settled</span>
                          <span className="text-emerald-400">₹{selectedChallan.amount}.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase border-t border-slate-900 pt-3">
                          <span>Status</span>
                          <span className="text-emerald-400">AUTHENTICATED</span>
                        </div>
                      </div>

                      <button 
                        onClick={resetModal}
                        className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest text-xs border border-slate-800 hover:bg-slate-800 transition-colors shadow-2xl"
                      >
                        Exit Settlement Portal
                      </button>
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

export default ChallanInfo;
