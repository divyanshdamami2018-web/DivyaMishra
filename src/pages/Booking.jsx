import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Clock, Lock, ShieldCheck, HeartPulse, ArrowRight, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Loader from '../components/Loader';
import { createOrder, verifyPayment } from '../services/api';

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const SESSION_FEE_INR = 1500;
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date: '',
    timeSlot: '',
  });

  const availableSlots = [
    '09:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:30 PM - 07:30 PM',
  ];

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.timeSlot) {
      toast.error('Please fill in all fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit WhatsApp number');
      return false;
    }

    return true;
  };

  const handleRazorpayPayment = async (order) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error("Razorpay SDK not loaded"));
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "MindfulPath",
        description: "Professional Clinical Counseling",
        order_id: order.id,
        handler: function (response) {
          resolve(response);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#2a5b46" // Calm Emerald
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        reject(new Error(response.error.description || "Payment failed"));
      });
      rzp1.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    const orderToastId = toast.loading('Initializing secure checkout...');

    try {
      // 1. Create order
      const order = await createOrder({ ...formData, amount: SESSION_FEE_INR });
      toast.success('Secure gateway ready', { id: orderToastId });

      // 2. Open Razorpay
      const paymentResponse = await handleRazorpayPayment(order);

      // 3. Verify Payment
      toast.loading('Verifying transaction...', { id: orderToastId });
      const verifyResult = await verifyPayment(paymentResponse, { 
        ...formData, 
        userId: user?.id 
      });

      if (verifyResult.success) {
        toast.success('Reservation Confirmed! 🌿', { id: orderToastId });
        navigate('/success', { 
          state: { 
            ticketId: verifyResult.ticketId,
            date: formData.date,
            time: formData.timeSlot 
          } 
        });
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Transaction failed or was cancelled', { id: orderToastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-24 bg-mesh-gradient min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-[40px] shadow-2xl overflow-hidden border-none animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
            {/* Left Info Panel */}
            <div className="lg:col-span-2 bg-primary p-12 text-white flex flex-col justify-between">
              <div className="space-y-8">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <HeartPulse className="w-7 h-7" />
                 </div>
                 <h1 className="text-4xl font-bold leading-tight">Secure Your Private Space</h1>
                 <p className="text-emerald-100/80 text-lg leading-relaxed">
                   Enter your details below to finalize your session with Divya Mishra. Your sanctuary is just a moment away.
                 </p>
              </div>

              <div className="space-y-6 pt-12">
                 <div className="flex items-center space-x-4 group">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">100% Encrypted & Private</span>
                 </div>
                 <div className="flex items-center space-x-4 group">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                       <CalendarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Flexible Scheduling</span>
                 </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-3 p-12 bg-white/50">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Full Name" 
                      id="name" 
                      type="text" 
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={isProcessing}
                    />
                    <InputField 
                      label="Email Address" 
                      id="email" 
                      type="email" 
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={isProcessing}
                    />
                  </div>
                  <InputField 
                    label="WhatsApp Number" 
                    id="phone" 
                    type="tel" 
                    placeholder="99999 99999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800">Session Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2 px-1">Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2 px-1">Time Slot</label>
                      <select
                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 appearance-none"
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                        disabled={isProcessing}
                      >
                        <option value="" disabled>Select Time</option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-8">
                  <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div>
                      <span className="text-slate-500 font-semibold block text-sm uppercase tracking-wider">Session Fee</span>
                      <span className="text-3xl font-bold text-slate-800 italic">₹{SESSION_FEE_INR.toLocaleString()} <span className="text-lg text-slate-400 font-light not-italic">total</span></span>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl">
                       <CreditCard className="w-6 h-6" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-emerald-900 text-white py-5 rounded-[24px] font-bold text-xl transition-all disabled:opacity-80 shadow-xl hover:shadow-emerald-900/20 flex items-center justify-center transform active:scale-95 group"
                  >
                    {isProcessing ? (
                      <><Loader className="text-white mr-3" /> Processing...</>
                    ) : (
                      <>Initialize Secure Payment <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-10 flex items-center justify-center">
          <Lock className="w-3.5 h-3.5 mr-2" /> All transactions are secured with 256-bit encryption.
        </p>
      </div>
    </div>
  );
};

export default Booking;
