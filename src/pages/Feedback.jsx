import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageSquareHeart, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitFeedback } from '../services/api';
import Loader from '../components/Loader';

const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent!' };

const Feedback = () => {
  const { ticketId } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    setIsSubmitting(true);
    try {
      await submitFeedback({ ticketId, rating, message });
      toast.success('Thank you for your feedback! 💚');
      setIsSubmitted(true);
    } catch (error) {
      const msg = error?.error || 'Failed to submit feedback. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-gradient py-24 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full animate-fade-in">
        <div className="glass-card rounded-[48px] overflow-hidden shadow-2xl border-none">

          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-emerald-600 px-10 py-10 text-center text-white relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquareHeart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Share Your Experience</h1>
              <p className="text-emerald-100 text-sm font-medium">
                Ticket: <span className="font-bold tracking-wide">{ticketId}</span>
              </p>
            </div>
          </div>

          <div className="p-10">
            {isSubmitted ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Thank You! 💚</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Your feedback has been received and will help us improve our care. We deeply value your trust.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-emerald-900 shadow-lg active:scale-95 group"
                >
                  Back to Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">How was your session?</p>
                  <div className="flex justify-center gap-3 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        disabled={isSubmitting}
                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`w-12 h-12 transition-all duration-200 ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400 scale-110'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {(hoverRating || rating) > 0 && (
                    <p className="text-primary font-bold text-sm animate-fade-in">
                      {ratingLabels[hoverRating || rating]}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-bold text-slate-600 uppercase tracking-widest">
                    Your Experience <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 resize-none"
                    placeholder="How did the session help you? What could we improve?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-emerald-900 text-white py-5 rounded-[24px] font-bold text-lg transition-all disabled:opacity-70 shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <><Loader className="text-white" /> Submitting...</>
                  ) : (
                    <>Submit Feedback <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
