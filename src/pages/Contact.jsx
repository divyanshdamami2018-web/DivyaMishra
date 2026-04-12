import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import InputField from '../components/InputField';
import { submitContact } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading('Sending your message to Divya Mishra...');
    
    try {
      await submitContact(formData);
      toast.success('Message sent! Admin will contact you soon. 🌿', { id: toastId });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.error || 'Failed to send message', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-mesh-gradient min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Connect With Us</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight">
            We’re Here <span className="text-slate-400 font-light">to Listen.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mt-6">
            Your healing journey is shared. Reach out for consultations, inquiries, or just to say hello.
          </p>
        </div>

        <div className="glass-card rounded-[40px] shadow-2xl overflow-hidden border-none animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Contact Info Panel */}
            <div className="lg:w-2/5 bg-primary p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="space-y-12 z-10">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold">Contact Details</h2>
                  <p className="text-emerald-100/70 text-lg leading-relaxed">
                    Our team typically responds within 24 business hours. We value your privacy and time.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center space-x-5 group transition-all duration-300">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20">
                      <Phone className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-emerald-300/60 mb-1">Direct Line</p>
                        <p className="text-lg font-medium">+91 99298 14206</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-5 group transition-all duration-300">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20">
                      <Mail className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-emerald-300/60 mb-1">Email Sanctuary</p>
                        <p className="text-lg font-medium">dpsychologist01@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5 group transition-all duration-300">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20">
                      <MapPin className="w-6 h-6 text-emerald-200" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-emerald-300/60 mb-1">Location</p>
                        <p className="text-lg font-medium">Varanasi, UP, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 text-blue-200/40 text-sm font-medium z-10">
                 ESTABLISHED 2024 • MINDFULPATH
              </div>
            </div>

            {/* Contact Form Panel */}
            <div className="lg:w-3/5 p-12 lg:p-20 bg-white/50">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField 
                    label="Full Name" 
                    id="name" 
                    type="text" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <InputField 
                    label="Email Address" 
                    id="email" 
                    type="email" 
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-bold text-slate-600 mb-2 px-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 resize-none font-medium"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-primary hover:bg-emerald-900 text-white px-12 py-5 rounded-[24px] font-bold text-lg transition-all shadow-xl hover:shadow-emerald-900/20 active:scale-95 flex items-center justify-center space-x-3 group"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
