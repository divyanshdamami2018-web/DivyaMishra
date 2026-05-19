import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, Ticket, ArrowRight, MessageSquareHeart, Phone, Mail } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const { ticketId, date, time, googleMeetLink } = location.state || {};

  if (!ticketId) return <Navigate to="/" replace />;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-mesh-gradient py-24 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full animate-fade-in">

        {/* Success Card */}
        <div className="glass-card rounded-[48px] overflow-hidden shadow-2xl border-none">

          {/* Green header band */}
          <div className="bg-gradient-to-r from-primary to-emerald-600 px-10 py-10 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <CheckCircle2 className="w-11 h-11 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed! 🎉</h1>
              <p className="text-emerald-100 text-base font-medium">
                Check your Email & WhatsApp for session details.
              </p>
            </div>
          </div>

          {/* Ticket details */}
          <div className="p-10 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 space-y-5 border border-slate-100">

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primaryLight rounded-xl flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ticket ID</p>
                  <p className="font-black text-slate-800 text-lg tracking-wide">{ticketId}</p>
                </div>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primaryLight rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date</p>
                  <p className="font-bold text-slate-800">{formattedDate}</p>
                </div>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primaryLight rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time Slot</p>
                  <p className="font-bold text-slate-800">{time}</p>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-bold text-emerald-800 text-sm mb-1">What happens next?</p>
                {googleMeetLink ? (
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    Your Google Meet link has been generated: 
                    <a href={googleMeetLink} target="_blank" rel="noopener noreferrer" className="font-bold underline ml-1 text-emerald-800">
                      Join Session Here
                    </a>. 
                    We have also sent this to your email. Please save your Ticket ID.
                  </p>
                ) : (
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    Divya Mishra will send your Google Meet session link via WhatsApp & Email
                    <strong> 15 minutes before</strong> your session starts. Please save your Ticket ID.
                  </p>
                )}
              </div>
            </div>

            {/* Contact quick links */}
            <div className="flex gap-3">
              <a
                href="https://wa.me/919929814206"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="mailto:dpsychologist01@gmail.com"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-emerald-900 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 group"
              >
                Go to Home <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={`/feedback/${ticketId}`}
                className="flex items-center justify-center gap-2 w-full bg-white hover:bg-primaryLight text-slate-700 border border-slate-200 py-4 rounded-2xl font-bold transition-all"
              >
                <MessageSquareHeart className="w-4 h-4 text-primary" /> Leave Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
