import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Ticket as TicketIcon, CheckCircle2, Video, MessageSquare, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, requestCancelBooking, requestRescheduleBooking } from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  const [activeBookingForActions, setActiveBookingForActions] = useState(null);
  const [requestType, setRequestType] = useState(null); // 'cancel' or 'reschedule'
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '', reason: '' });
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load your sessions');
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => !b.sessionCompleted);
  const pastBookings = bookings.filter(b => b.sessionCompleted);
  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleJoinSession = (booking) => {
    toast.success('Opening WhatsApp to get your session link…', { duration: 3000 });
    setTimeout(() => {
      window.open(
        `https://wa.me/919929814206?text=Hi%20Divya%2C%20my%20session%20is%20on%20${encodeURIComponent(booking.date)}%20at%20${encodeURIComponent(booking.time)}%20(Ticket%3A%20${booking.ticketId}).%20Please%20share%20the%20session%20link.`,
        '_blank'
      );
    }, 800);
  };

  const handleRequestReschedule = async (booking) => {
    if (!rescheduleForm.date || !rescheduleForm.time) {
      toast.error('Please select proposed date and time');
      return;
    }
    try {
      setSubmitting(true);
      await requestRescheduleBooking(booking._id, {
        proposedDate: rescheduleForm.date,
        proposedTime: rescheduleForm.time,
        reason: rescheduleForm.reason
      });
      toast.success('Reschedule request submitted successfully!');
      setActiveBookingForActions(null);
      setRequestType(null);
      setRescheduleForm({ date: '', time: '', reason: '' });
      fetchBookings();
    } catch (err) {
      toast.error(err.error || 'Failed to submit reschedule request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestCancel = async (booking) => {
    try {
      setSubmitting(true);
      await requestCancelBooking(booking._id, cancelReason);
      toast.success('Cancellation request submitted successfully!');
      setActiveBookingForActions(null);
      setRequestType(null);
      setCancelReason('');
      fetchBookings();
    } catch (err) {
      toast.error(err.error || 'Failed to submit cancellation request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh-gradient">
        <Loader className="w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="py-24 bg-mesh-gradient min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 animate-fade-in gap-6">
          <div className="space-y-3">
            <p className="text-primary font-bold tracking-widest uppercase text-xs">Client Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
              Namaste, <span className="text-slate-400 font-light">{user?.name}</span> 🙏
            </h1>
            <p className="text-lg text-slate-500">Your private healing sanctuary.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card p-5 rounded-[24px] border-none flex items-center space-x-4 shadow-xl">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <TicketIcon className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Total</p>
                <p className="text-3xl font-black text-slate-800">{bookings.length}</p>
              </div>
            </div>
            <div className="glass-card p-5 rounded-[24px] border-none flex items-center space-x-4 shadow-xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Done</p>
                <p className="text-3xl font-black text-slate-800">{pastBookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'upcoming', label: 'Upcoming Sessions', count: upcomingBookings.length },
            { id: 'past', label: 'Past Sessions', count: pastBookings.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-7 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-xl'
                  : 'bg-white/60 text-slate-500 hover:bg-white/80'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        {displayedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {displayedBookings.map((booking) => (
              <div key={booking._id} className="glass-card rounded-[28px] p-7 border-none shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-1.5">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-11 h-11 bg-primaryLight rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                    {booking.ticketId}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-bold text-slate-800">{formatDate(booking.date)}</h3>
                  <div className="flex items-center text-slate-500 font-medium text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span>{booking.time}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    booking.sessionCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {booking.sessionCompleted ? '✓ Completed' : '⏳ Upcoming'}
                  </span>
                  {booking.cancelRequested && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 animate-pulse">
                      🚨 Cancel Pending
                    </span>
                  )}
                  {booking.rescheduleRequested && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 animate-pulse">
                      📅 Reschedule Pending
                    </span>
                  )}
                </div>
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between w-full">
                  {activeTab === 'upcoming' ? (
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => handleJoinSession(booking)}
                        className="flex items-center text-primary font-bold hover:translate-x-1 transition-transform text-sm"
                      >
                        <Video className="mr-2 w-4 h-4" />
                        Get Session Link
                      </button>
                      {!booking.cancelRequested && !booking.rescheduleRequested ? (
                        <button
                          onClick={() => {
                            setActiveBookingForActions(booking);
                            setRequestType(null);
                          }}
                          className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          Cancel / Reschedule
                        </button>
                      ) : (
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                          Awaiting Review
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-emerald-600 font-bold text-sm w-full justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 w-4 h-4" />
                        Session Done
                      </div>
                      <button
                        onClick={() => navigate(`/feedback/${booking.ticketId}`)}
                        className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:bg-primaryLight hover:text-primary transition-all"
                        title="Share Feedback"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[40px] p-20 text-center animate-fade-in shadow-2xl">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-8">
              <TicketIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">No sessions yet.</h2>
            <p className="text-lg text-slate-500 mb-10">Your healing journey starts with one brave step.</p>
            <button
              onClick={() => navigate('/book')}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl active:scale-95 group transition-all"
            >
              Book Your First Session <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Action Modal */}
        {activeBookingForActions && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl animate-scale-in border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Manage Session</h3>
              <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-6">
                Ticket ID: {activeBookingForActions.ticketId}
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-2">
                <div className="flex items-center text-sm font-bold text-slate-700">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {formatDate(activeBookingForActions.date)}
                </div>
                <div className="flex items-center text-sm font-medium text-slate-500">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  {activeBookingForActions.time}
                </div>
              </div>

              {requestType === null ? (
                <>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    To make changes, submit a request below. Approved rescheduling updates your calendar slot automatically, and cancellations trigger a full refund.
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setRequestType('reschedule')}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform"
                    >
                      📅 Request Reschedule
                    </button>
                    <button
                      onClick={() => setRequestType('cancel')}
                      className="w-full py-4 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl font-bold transition-colors"
                    >
                      🚨 Request Cancellation & Refund
                    </button>
                    <button
                      onClick={() => setActiveBookingForActions(null)}
                      className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold transition-colors text-sm"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : requestType === 'reschedule' ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Suggested Reschedule Slot</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Proposed Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 focus:border-primary"
                        value={rescheduleForm.date}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Proposed Time Slot</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 focus:border-primary"
                        value={rescheduleForm.time}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                      >
                        <option value="">Select a slot...</option>
                        {[
                          '09:00 AM - 10:00 AM',
                          '10:30 AM - 11:30 AM',
                          '02:00 PM - 03:00 PM',
                          '04:00 PM - 05:00 PM',
                          '06:30 PM - 07:30 PM'
                        ].map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Reason (Optional)</label>
                      <textarea
                        rows="2"
                        placeholder="Why do you need to reschedule?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 focus:border-primary resize-none"
                        value={rescheduleForm.reason}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setRequestType(null)}
                      className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl font-bold transition-colors text-xs"
                    >
                      Back
                    </button>
                    <button
                      disabled={submitting}
                      onClick={() => handleRequestReschedule(activeBookingForActions)}
                      className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform text-xs disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold text-rose-600 text-sm">Reason for Cancellation</h4>
                  <div>
                    <textarea
                      rows="3"
                      placeholder="Please share the reason for cancellation (e.g. personal conflict, emergency)..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 focus:border-primary resize-none"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setRequestType(null)}
                      className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl font-bold transition-colors text-xs"
                    >
                      Back
                    </button>
                    <button
                      disabled={submitting}
                      onClick={() => handleRequestCancel(activeBookingForActions)}
                      className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-600/20 hover:-translate-y-0.5 transition-transform text-xs disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Confirm Request'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
