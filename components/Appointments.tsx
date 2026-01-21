
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Trash2, Edit2, Plus, ArrowLeft, Loader2, Bell, Mail, Smartphone, AlertTriangle, X } from 'lucide-react';
import { Appointment } from '../types';

const RTO_LOCATIONS = [
  "Pune North (MH-12)",
  "Pune South (MH-14)",
  "Mumbai West (MH-02)",
  "Bangalore Central (KA-01)",
  "Delhi South (DL-03)"
];

const SERVICES = [
  "Learner's License Test",
  "Driving Skill Test (LMV)",
  "Vehicle Registration (New)",
  "RC Transfer of Ownership",
  "High Security Number Plate (HSRP)",
  "Fitness Certificate Renewal"
];

const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:30 AM - 12:30 PM",
  "02:00 PM - 03:00 PM",
  "03:30 PM - 04:30 PM"
];

interface AppointmentProps {
  onBack: () => void;
}

const Appointments: React.FC<AppointmentProps> = ({ onBack }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APP-1029',
      serviceType: 'High Security Number Plate (HSRP)',
      location: 'Pune North (MH-12)',
      date: '2024-06-15',
      timeSlot: '11:30 AM - 12:30 PM',
      status: 'Confirmed',
      reminders: { sms: true, email: true }
    }
  ]);

  const [isBooking, setIsBooking] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    serviceType: SERVICES[0],
    location: RTO_LOCATIONS[0],
    date: '',
    timeSlot: TIME_SLOTS[0],
    smsReminder: true,
    emailReminder: true
  });

  const resetForm = () => {
    setFormData({ 
      serviceType: SERVICES[0], 
      location: RTO_LOCATIONS[0], 
      date: '', 
      timeSlot: TIME_SLOTS[0],
      smsReminder: true,
      emailReminder: true
    });
    setIsBooking(false);
    setEditingId(null);
  };

  const handleBookOrUpdate = () => {
    if (!formData.date) return alert("Please select a date");
    
    setLoading(true);
    setTimeout(() => {
      if (editingId) {
        setAppointments(appointments.map(app => 
          app.id === editingId 
            ? { 
                ...app, 
                serviceType: formData.serviceType,
                location: formData.location,
                date: formData.date,
                timeSlot: formData.timeSlot,
                status: 'Rescheduled',
                reminders: { sms: formData.smsReminder, email: formData.emailReminder }
              } 
            : app
        ));
      } else {
        const newApp: Appointment = {
          id: `APP-${Math.floor(Math.random() * 9000) + 1000}`,
          serviceType: formData.serviceType,
          location: formData.location,
          date: formData.date,
          timeSlot: formData.timeSlot,
          status: 'Confirmed',
          reminders: { sms: formData.smsReminder, email: formData.emailReminder }
        };
        setAppointments([newApp, ...appointments]);
      }
      setLoading(false);
      resetForm();
    }, 1000);
  };

  const startReschedule = (app: Appointment) => {
    setEditingId(app.id);
    setFormData({
      serviceType: app.serviceType,
      location: app.location,
      date: app.date,
      timeSlot: app.timeSlot,
      smsReminder: app.reminders?.sms ?? true,
      emailReminder: app.reminders?.email ?? true
    });
    setIsBooking(true);
  };

  const confirmCancel = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    setShowCancelConfirm(null);
  };

  const isFormView = isBooking || editingId !== null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative bg-slate-950 min-h-screen">
      {/* Custom Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-rose-950/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-rose-900/30">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-white text-center mb-2 uppercase tracking-tight">Cancel Entry?</h3>
            <p className="text-slate-400 text-center mb-8 font-medium">This action terminates the scheduled slot permanently.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelConfirm(null)}
                className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors uppercase text-xs tracking-widest"
              >
                Go Back
              </button>
              <button 
                onClick={() => confirmCancel(showCancelConfirm)}
                className="flex-1 px-4 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20 uppercase text-xs tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-colors">
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div className="text-left space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">RTO Appointments</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Schedule your physical presence</p>
          </div>
        </div>
        {!isFormView && (
          <button
            onClick={() => setIsBooking(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="h-5 w-5" /> Book New Slot
          </button>
        )}
      </div>

      {isFormView ? (
        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-950 p-6 text-white flex items-center gap-4 border-b border-slate-800">
            <button onClick={resetForm} className="hover:bg-slate-800 p-2 rounded-xl transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-black uppercase tracking-tight">
              {editingId ? `Reschedule ${editingId}` : 'Slot Allocation'}
            </h3>
          </div>
          
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Service Category</label>
                <select 
                  className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none text-white font-bold text-sm"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  disabled={!!editingId}
                >
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Regional Office</label>
                <select 
                  className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none text-white font-bold text-sm"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                  {RTO_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Reminder Section */}
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-xs mb-6">
                  <Bell className="h-4 w-4" />
                  <span>Notification Preferences</span>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 rounded-lg border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-600"
                      checked={formData.smsReminder}
                      onChange={(e) => setFormData({...formData, smsReminder: e.target.checked})}
                    />
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-slate-500" />
                      <span className="text-sm text-slate-300 font-bold">SMS Broadcast (24h lead)</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 rounded-lg border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-600"
                      checked={formData.emailReminder}
                      onChange={(e) => setFormData({...formData, emailReminder: e.target.checked})}
                    />
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-slate-500" />
                      <span className="text-sm text-slate-300 font-bold">Email Dispatch (Priority)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Target Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none text-white font-bold text-sm [color-scheme:dark]"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Temporal Slot</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setFormData({...formData, timeSlot: slot})}
                      className={`p-4 text-xs rounded-2xl border-2 transition-all font-black uppercase tracking-widest ${
                        formData.timeSlot === slot 
                        ? 'border-indigo-600 bg-indigo-950 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-8 border-t border-slate-800 flex justify-end gap-6">
              <button 
                disabled={loading}
                onClick={resetForm}
                className="px-8 py-4 text-slate-500 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
              >
                Abort
              </button>
              <button 
                disabled={loading}
                onClick={handleBookOrUpdate}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                {editingId ? 'Update Slot' : 'Confirm Allocation'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-sm mb-4">
            <Clock className="h-5 w-5 text-indigo-400" />
            Active Schedule
          </div>
          
          {appointments.length === 0 ? (
            <div className="bg-slate-900 p-16 rounded-[3rem] border-2 border-dashed border-slate-800 text-center shadow-inner">
              <Calendar className="h-16 w-16 text-slate-800 mx-auto mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No scheduled visits detected.</p>
              <button onClick={() => setIsBooking(true)} className="text-indigo-400 font-black uppercase text-xs tracking-widest mt-4 hover:text-indigo-300">Request allocation now</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {appointments.map((app) => (
                <div key={app.id} className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between gap-8 hover:border-indigo-900 transition-all group relative overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="bg-slate-950 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[110px] border border-slate-800 shadow-inner group-hover:border-indigo-600/30 transition-colors">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">{new Date(app.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-4xl font-black text-white tracking-tighter">{new Date(app.date).getDate()}</span>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{new Date(app.date).getFullYear()}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${
                          app.status === 'Rescheduled' ? 'bg-amber-950 text-amber-400 border-amber-900/40' : 'bg-emerald-950 text-emerald-400 border-emerald-900/40'
                        }`}>{app.status}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">UID: {app.id}</span>
                        {(app.reminders?.sms || app.reminders?.email) && (
                          <div className="flex gap-2 ml-4 border-l border-slate-800 pl-4">
                            {app.reminders?.sms && <Smartphone className="h-4 w-4 text-indigo-500/60" />}
                            {app.reminders?.email && <Mail className="h-4 w-4 text-indigo-500/60" />}
                          </div>
                        )}
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight">{app.serviceType}</h4>
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                          <MapPin className="h-4 w-4 text-indigo-400" /> {app.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                          <Clock className="h-4 w-4 text-indigo-400" /> {app.timeSlot}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
                    <button 
                      onClick={() => startReschedule(app)}
                      className="p-4 text-slate-500 hover:text-indigo-400 bg-slate-950 rounded-2xl transition-all border border-slate-800 hover:border-indigo-600/30" 
                      title="Update Schedule"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setShowCancelConfirm(app.id)}
                      className="p-4 text-slate-500 hover:text-rose-500 bg-slate-950 rounded-2xl transition-all border border-slate-800 hover:border-rose-600/30" 
                      title="Terminate Slot"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-indigo-950/20 p-8 rounded-[2rem] border border-indigo-900/30 flex items-start gap-6">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-3">
              <h5 className="font-black text-white uppercase tracking-widest text-sm">Procedural Guidelines</h5>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Applicants must present original biometric IDs and document physicals. Arrive <span className="text-indigo-400 font-black">15 minutes</span> prior to temporal slot for staging.
              </p>
              <div className="flex items-center gap-2 py-2 text-[10px] font-black uppercase text-indigo-400/80 tracking-widest">
                <Smartphone className="h-4 w-4" />
                <span>Encrypted alerts dispatched 24H prior to event.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
