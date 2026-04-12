import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import InputField from '../components/InputField';
import Loader from '../components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    const toastId = toast.loading('Opening your sanctuary...');

    try {
      const data = await loginUser(formData);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}! 💚`, { id: toastId });
      navigate('/');
    } catch (err) {
      toast.error(err.error || 'Login failed', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-mesh-gradient min-h-screen font-sans flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-card rounded-[40px] p-10 md:p-12 animate-fade-in relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-primaryLight rounded-[20px] flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Your journey continues here.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <InputField 
            label="Email Address" 
            id="email" 
            type="email" 
            placeholder="hello@sanctuary.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <InputField 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-emerald-900 text-white py-5 rounded-[24px] font-bold text-lg transition-all shadow-xl hover:shadow-emerald-900/20 active:scale-95 flex items-center justify-center group"
          >
            {isSubmitting ? <Loader className="text-white" /> : (
              <>Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <p className="text-slate-500 font-medium">
            New to MindfulPath? {' '}
            <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
