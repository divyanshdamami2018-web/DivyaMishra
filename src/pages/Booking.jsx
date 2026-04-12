import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Lock, 
  ShieldCheck, 
  HeartPulse, 
  ArrowRight, 
  CreditCard,
  ChevronLeft,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Wallet,
  BrainCircuit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Loader from '../components/Loader';
import { createOrder, verifyPayment } from '../services/api';

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const SESSION_FEE_INR = 1500;
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date: '',
    timeSlot: '',
    assessment: {
      age: '',
      gender: '',
      cityState: '',
      education: '',
      occupation: '',
      income: '',
      primaryConcern: '',
      moodRating: 5,
      description: ''
    }
  });

  const availableSlots = [
    '09:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:30 PM - 07:30 PM',
  ];

  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.timeSlot) {
          toast.error('Please fill in all contact and schedule details');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
          toast.error('Please enter a valid 10-digit WhatsApp number');
          return false;
        }
        return true;
      case 2:
        if (!formData.assessment.age || !formData.assessment.gender || !formData.assessment.cityState) {
          toast.error('Please complete demographic details');
          return false;
        }
        return true;
      case 3:
        if (!formData.assessment.education || !formData.assessment.occupation || !formData.assessment.income) {
          toast.error('Please provide background information');
          return false;
        }
        return true;
      case 4:
        if (!formData.assessment.primaryConcern || !formData.assessment.description) {
          toast.error('Please describe your mind status and concerns');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
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
          color: "#2a5b46"
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
    if (!validateStep(4)) return;

    setIsProcessing(true);
    const orderToastId = toast.loading('Initializing secure checkout...');

    try {
      const order = await createOrder({ ...formData, amount: SESSION_FEE_INR });
      toast.success('Secure gateway ready', { id: orderToastId });

      const paymentResponse = await handleRazorpayPayment(order);

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

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, label: 'Schedule' },
      { id: 2, label: 'Identity' },
      { id: 3, label: 'Background' },
      { id: 4, label: 'Mind Status' }
    ];
    return (
      <div className="flex items-center justify-between mb-12 px-2">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 shadow-sm
                ${currentStep >= s.id ? 'bg-primary text-white scale-110 shadow-emerald-900/20' : 'bg-slate-200 text-slate-500'}`}>
                {s.id}
              </div>
              <span className={`text-[10px] uppercase tracking-tighter font-bold mt-2 absolute -bottom-6 w-20 text-center
                ${currentStep >= s.id ? 'text-primary' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-[2px] mx-4 transition-all duration-700
                ${currentStep > s.id ? 'bg-primary' : 'bg-slate-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="py-24 bg-mesh-gradient min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-[40px] shadow-2xl overflow-hidden border-none animate-fade-in translate-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            
            {/* Left Info Panel (Sticky-like) */}
            <div className="lg:col-span-4 bg-primary p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="space-y-10 relative z-10">
                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <HeartPulse className="w-8 h-8" />
                 </div>
                 <div className="space-y-4">
                   <h1 className="text-4xl font-bold leading-tight">Step {currentStep} of 4</h1>
                   <p className="text-emerald-100/70 text-lg leading-relaxed font-medium">
                     {currentStep === 1 && "Choose your preferred time to start your healing journey."}
                     {currentStep === 2 && "Tell us a bit about yourself to help us prepare."}
                     {currentStep === 3 && "This information is confidential and used for general understanding."}
                     {currentStep === 4 && "Help us understand your current mental state."}
                   </p>
                 </div>
              </div>

              <div className="space-y-6 pt-12 relative z-10">
                 <div className="flex items-center space-x-4 group bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <ShieldCheck className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-white/50 uppercase font-bold tracking-widest">Privacy First</span>
                      <span className="text-sm font-semibold">100% Encrypted</span>
                    </div>
                 </div>
                 <p className="text-[10px] text-white/40 italic text-center">
                   "Vibrant Support for Every Mind, Focused on Today’s Generation."
                 </p>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-8 p-8 md:p-12 bg-white/60">
              {renderStepIndicator()}

              <form onSubmit={(e) => e.preventDefault()} className="space-y-8 animate-fade-in mt-6">
                
                {/* Step 1: Schedule & Contact */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        <User className="mr-3 text-primary w-6 h-6" /> Personal Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField 
                          label="Full Name / पूरा नाम" 
                          id="name" 
                          type="text" 
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={isProcessing}
                        />
                        <InputField 
                          label="Email Address / ईमेल" 
                          id="email" 
                          type="email" 
                          placeholder="rahul@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={isProcessing}
                        />
                      </div>
                      <InputField 
                        label="WhatsApp Number / मोबाइल नंबर" 
                        id="phone" 
                        type="tel" 
                        placeholder="99999 99999"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        <Clock className="mr-3 text-primary w-6 h-6" /> Session Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-600 mb-2 px-1 text-xs uppercase tracking-wider">Date / तिथि</label>
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
                          <label className="block text-sm font-bold text-slate-600 mb-2 px-1 text-xs uppercase tracking-wider">Time Slot / समय</label>
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
                  </div>
                )}

                {/* Step 2: Demographics */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <MapPin className="mr-3 text-primary w-6 h-6" /> Socio-Demographic Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Age / आयु" 
                        id="age" 
                        type="number" 
                        placeholder="e.g. 25"
                        value={formData.assessment.age}
                        onChange={(e) => setFormData({
                          ...formData, 
                          assessment: {...formData.assessment, age: e.target.value}
                        })}
                        disabled={isProcessing}
                      />
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2 px-1 text-xs uppercase tracking-wider">Gender / लिंग</label>
                        <select
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 appearance-none"
                          value={formData.assessment.gender}
                          onChange={(e) => setFormData({
                            ...formData, 
                            assessment: {...formData.assessment, gender: e.target.value}
                          })}
                          disabled={isProcessing}
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                    <InputField 
                      label="City & State / शहर और राज्य" 
                      id="cityState" 
                      type="text" 
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={formData.assessment.cityState}
                      onChange={(e) => setFormData({
                        ...formData, 
                        assessment: {...formData.assessment, cityState: e.target.value}
                      })}
                      disabled={isProcessing}
                    />
                  </div>
                )}

                {/* Step 3: Background */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <GraduationCap className="mr-3 text-primary w-6 h-6" /> Professional Background
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-3 px-1 text-xs uppercase tracking-wider flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2" /> Education Level / शिक्षा
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['School', 'Graduate', 'Postgraduate', 'Other'].map(level => (
                             <button
                              key={level}
                              type="button"
                              onClick={() => setFormData({...formData, assessment: {...formData.assessment, education: level}})}
                              className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all
                                ${formData.assessment.education === level 
                                  ? 'bg-primary text-white border-primary shadow-lg shadow-emerald-900/10' 
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'}`}
                             >
                               {level}
                             </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-3 px-1 text-xs uppercase tracking-wider flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" /> Occupation / व्यवसाय
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Student', 'Working Professional', 'Homemaker', 'Unemployed'].map(job => (
                             <button
                              key={job}
                              type="button"
                              onClick={() => setFormData({...formData, assessment: {...formData.assessment, occupation: job}})}
                              className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all
                                ${formData.assessment.occupation === job 
                                  ? 'bg-primary text-white border-primary shadow-lg shadow-emerald-900/10' 
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'}`}
                             >
                               {job}
                             </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                        <label className="block text-sm font-bold text-slate-700 px-1 text-xs uppercase tracking-wider flex items-center">
                          <Wallet className="w-4 h-4 mr-2 text-primary" /> Monthly Family Income
                        </label>
                        <p className="text-[10px] text-slate-400 mt-[-10px] items-center flex uppercase tracking-tighter">
                          <Lock className="w-2.5 h-2.5 mr-1" /> Confidential & used for general understanding only.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {[
                            'Below ₹10,000', 
                            '₹10,000 – ₹30,000', 
                            '₹30,000 – ₹60,000', 
                            'Above ₹60,000', 
                            'Prefer not to say'
                          ].map(range => (
                             <label key={range} className="flex items-center p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/30 transition-colors">
                               <input 
                                type="radio" 
                                name="income" 
                                className="w-4 h-4 text-primary focus:ring-primary"
                                checked={formData.assessment.income === range}
                                onChange={() => setFormData({...formData, assessment: {...formData.assessment, income: range}})}
                               />
                               <span className="ml-3 text-sm font-medium text-slate-600">{range}</span>
                             </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Mind Status */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <BrainCircuit className="mr-3 text-primary w-6 h-6" /> Mind Status Assessment
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2 px-1 text-xs uppercase tracking-wider">Primary Concern / मुख्य चिंता</label>
                        <select
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 appearance-none"
                          value={formData.assessment.primaryConcern}
                          onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, primaryConcern: e.target.value}})}
                          disabled={isProcessing}
                        >
                          <option value="" disabled>Select Primary Concern</option>
                          <option value="Anxiety/Overthinking">Anxiety / Overthinking</option>
                          <option value="Stress Management">Stress Management</option>
                          <option value="Relationship Issues">Relationship Issues</option>
                          <option value="Career/Academic Stress">Career / Academic Stress</option>
                          <option value="Low Self-Esteem">Low Self-Esteem</option>
                          <option value="Depression/Low Mood">Depression / Low Mood</option>
                          <option value="Grief/Loss">Grief / Loss</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-bold text-slate-600 px-1 text-xs uppercase tracking-wider">How is your mood today? (1-10)</label>
                          <span className="font-bold text-primary">{formData.assessment.moodRating}</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" max="10" 
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                          value={formData.assessment.moodRating}
                          onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, moodRating: parseInt(e.target.value)}})}
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                          <span>Struggling</span>
                          <span>Stable</span>
                          <span>Excellent</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2 px-1 text-xs uppercase tracking-wider">Personal Note / संक्षिप्त विवरण</label>
                        <textarea
                          placeholder="Briefly describe what's on your mind or what you'd like to achieve in this session..."
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 min-h-[120px] resize-none"
                          value={formData.assessment.description}
                          onChange={(e) => setFormData({...formData, assessment: {...formData.assessment, description: e.target.value}})}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-inner group">
                        <div>
                          <span className="text-emerald-600 font-bold block text-xs uppercase tracking-wider mb-1">Total Consultation Fee</span>
                          <span className="text-3xl font-black text-slate-800 italic">₹{SESSION_FEE_INR.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                           <CreditCard className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={isProcessing}
                      className="flex-1 bg-white border-2 border-slate-100 hover:border-primary/20 text-slate-600 py-5 rounded-[24px] font-bold text-lg transition-all flex items-center justify-center shadow-sm active:scale-95"
                    >
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </button>
                  )}
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-[2] bg-primary hover:bg-emerald-900 text-white py-5 rounded-[24px] font-bold text-xl transition-all shadow-xl hover:shadow-emerald-900/20 flex items-center justify-center transform active:scale-95 group"
                    >
                      Continue to Next Step <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="flex-[2] bg-primary hover:bg-emerald-900 text-white py-5 rounded-[24px] font-bold text-xl transition-all disabled:opacity-80 shadow-xl hover:shadow-emerald-900/20 flex items-center justify-center transform active:scale-95 group"
                    >
                      {isProcessing ? (
                        <><Loader className="text-white mr-3" /> Securing Session...</>
                      ) : (
                        <>Pay & Confirm Booking <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-10 flex items-center justify-center opacity-60">
          <Lock className="w-3.5 h-3.5 mr-2" /> HIPAA-compliant data encryption. Your safe space is fully protected.
        </p>
      </div>
    </div>
  );
};

export default Booking;
