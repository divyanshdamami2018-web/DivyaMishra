import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageSquareHeart } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitFeedback } from '../services/api';
import Loader from '../components/Loader';

const Feedback = () => {
  const { ticketId } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitFeedback({ ticketId, rating, message });
      toast.success('Thank you for your feedback!');
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primaryLight text-primary rounded-full mb-4">
            <MessageSquareHeart className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">How was your session?</h1>
          <p className="text-slate-600">Your feedback helps us improve our care. (Ticket: {ticketId})</p>
        </div>

        {isSubmitted ? (
          <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-100 animate-fade-in">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Thank You! 💚</h2>
            <p className="text-green-600 mb-6">We have received your valuable feedback.</p>
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium transition-all"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-8">
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
                    className={`w-12 h-12 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-200'
                    } transition-colors duration-200`} 
                  />
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Care to share more details? (Optional)
              </label>
              <textarea
                id="message"
                rows="5"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                placeholder="How did the counselor help you? What could we do better?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-70 shadow-md flex items-center justify-center transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                <><Loader size={20} className="text-white mr-2" /> Submitting...</>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
