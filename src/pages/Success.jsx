import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, Ticket } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const { ticketId, date, time } = location.state || {};

  // If accessed directly without state, redirect to home
  if (!ticketId) {
    return <Navigate to="/" replace />;
  }

  // Format date nicely
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-10 transform transition-all">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Booking Confirmed 🎉</h1>
        <p className="text-slate-600 mb-8 text-lg">Check your email and WhatsApp for details</p>
        
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 text-primary">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Ticket ID</p>
              <p className="font-bold text-slate-800">{ticketId}</p>
            </div>
          </div>
          
          <div className="h-px bg-slate-200"></div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Date</p>
              <p className="font-bold text-slate-800">{formattedDate}</p>
            </div>
          </div>
          
          <div className="h-px bg-slate-200"></div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Time</p>
              <p className="font-bold text-slate-800">{time}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg"
          >
            Go to Home
          </Link>
          <Link
            to={`/feedback/${ticketId}`}
            className="block w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3 rounded-xl font-medium transition-all"
          >
            Leave Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
