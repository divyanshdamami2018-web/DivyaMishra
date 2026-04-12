import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Ticket as TicketIcon, CheckCircle2, Video, MessageSquare, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load your journey');
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => !b.sessionCompleted);
  const pastBookings = bookings.filter(b => b.sessionCompleted);

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

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
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Dashboard</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
              Namaste, <span className="text-slate-400 font-light">{user?.name}</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium">Welcome to your private healing sanctuary.</p>
          </div>
          
          <div className="mt-8 md:mt-0 glass-card p-6 rounded-[28px] border-none flex items-center space-x-4 shadow-xl">
             <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10">
                <TicketIcon className="text-white w-7 h-7" />
             </div>
             <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Total Sessions</p>
                <p className="text-2xl font-black text-slate-800">{bookings.length}</p>
             </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'upcoming' 
                ? 'bg-primary text-white shadow-xl shadow-emerald-900/10' 
                : 'bg-white/40 text-slate-500 hover:bg-white/60'
            }`}
          >
            Upcoming Sessions ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'past' 
                ? 'bg-primary text-white shadow-xl shadow-emerald-900/10' 
                : 'bg-white/40 text-slate-500 hover:bg-white/60'
            }`}
          >
            Past Conversations ({pastBookings.length})
          </button>
        </div>

        {/* Grid Content */}
        {displayedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {displayedBookings.map((booking) => (
              <div key={booking._id} className="glass-card rounded-[32px] p-8 border-none shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 bg-primaryLight rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Calendar className="w-6 h-6" />
                   </div>
                   <div className="px-4 py-1.5 bg-white/50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 italic">
                      {booking.ticketId}
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <h3 className="text-xl font-bold text-slate-800">{booking.date}</h3>
                   <div className="flex items-center text-slate-500 font-medium">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{booking.time}</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   {activeTab === 'upcoming' ? (
                     <button className="flex items-center text-primary font-bold hover:translate-x-1 transition-transform group/btn">
                        <span>Join Session</span>
                        <Video className="ml-2 w-4 h-4" />
                     </button>
                   ) : (
                     <div className="flex items-center text-emerald-600 font-bold">
                        <CheckCircle2 className="mr-2 w-4 h-4" />
                        <span>Completed</span>
                     </div>
                   )}
                   
                   <button 
                     onClick={() => navigate(`/feedback/${booking.ticketId}`)}
                     className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-primaryLight hover:text-primary transition-colors"
                     title="Share Feedback"
                   >
                     <MessageSquare className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[40px] p-20 text-center animate-fade-in shadow-2xl">
            <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-8">
               <TicketIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">No sessions found here.</h2>
            <p className="text-lg text-slate-500 mb-10 font-medium">Your journey to healing starts with the first step.</p>
            <button 
              onClick={() => navigate('/book')}
              className="bg-primary text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:shadow-emerald-900/20 active:scale-95 group transition-all"
            >
              Book Your First Session <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
