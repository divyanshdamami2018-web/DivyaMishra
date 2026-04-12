import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, CalendarCheck, CreditCard, Quote, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-mesh-gradient relative pt-20 pb-32 overflow-hidden px-4 md:px-0">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between z-10 relative">
          <div className="lg:w-1/2 mb-16 lg:mb-0 space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/40 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/40 shadow-sm text-sm font-semibold text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Accepting New Clients Today</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
              Your Journey to <br />
              <span className="text-primary italic">Inner Peace</span> Starts Here.
            </h1>
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
              Experience the guidance of <span className="font-bold text-slate-800">Divya Mishra</span>, a certified clinical psychologist dedicated to providing a serene, safe, and professional environment for your mental growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <Link
                to="/book"
                className="group relative bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl text-center transition-all shadow-xl hover:shadow-emerald-900/20 active:scale-95 flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Book A Session <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 translate-x-[-150%]"></div>
              </Link>
              <a
                href="#how-it-works"
                className="bg-white/50 backdrop-blur-sm text-slate-700 border border-white/60 px-10 py-5 rounded-2xl font-bold text-xl text-center transition-all hover:bg-white/80 hover:shadow-lg active:scale-95"
              >
                Explore Services
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              <div className="absolute -inset-10 bg-emerald-200/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="glass-card p-4 rounded-[40px] transform rotate-2 group-hover:rotate-0 transition-transform duration-700">
                <img 
                  src="/hero-zen.png" 
                  alt="Mindful Sanctuary" 
                  className="rounded-[32px] shadow-2xl object-cover w-full h-[450px] lg:h-[600px] max-w-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services At a Glance */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">The MindfulPath Difference</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-800">Holistic Care <span className="text-slate-400 font-light">for the Modern Soul</span></h3>
            </div>
            <p className="text-slate-500 text-lg max-w-sm">We provide world-class clinical support using evidence-based therapy in a calming digital ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: ShieldCheck, title: 'Confidentiality', desc: 'Secure, HIPAA-compliant digital sanctuary for your thoughts.' },
              { icon: UserCheck, title: 'Certified Care', desc: 'Specialized clinical expertise from BHU trained professionals.' },
              { icon: CalendarCheck, title: 'Seamless Access', desc: 'Effortless scheduling that adapts to your lifestyle.' },
              { icon: CreditCard, title: 'Crystal Clear', desc: 'Transparent, secure payments with zero hidden overheads.' },
            ].map((feature, i) => (
              <div key={i} className="group p-2">
                <div className="w-16 h-16 bg-primaryLight rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Profile */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-[50px] overflow-hidden flex flex-col lg:flex-row shadow-2xl items-stretch border-none">
            <div className="lg:w-2/5 p-4">
               <img 
                src="/divya-mishra.jpg" 
                alt="Divya Mishra" 
                className="w-full h-full object-cover rounded-[40px] shadow-lg min-h-[500px]"
              />
            </div>
            <div className="lg:w-3/5 p-12 lg:p-20 flex flex-col justify-center space-y-8">
               <div className="space-y-4">
                 <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Lead Clinical Psychologist</h2>
                 <h3 className="text-4xl md:text-5xl font-bold text-slate-800">Divya Mishra</h3>
                 <p className="text-2xl text-slate-500 font-light leading-relaxed">
                   "Empathy is the cornerstone of healing. I offer a non-judgmental space to navigate your complexities with resilience."
                 </p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
                 <div className="space-y-5">
                   <h4 className="text-lg font-bold text-slate-800 flex items-center">
                     <span className="w-8 h-[2px] bg-primary mr-3"></span> Qualifications
                   </h4>
                   <ul className="space-y-3 text-slate-600">
                     <li>• M.A. in Clinical Psychology (BHU)</li>
                     <li>• PG Diploma in Psychotherapy</li>
                     <li>• Evidence-based CBT Specialist</li>
                   </ul>
                 </div>
                 <div className="space-y-5">
                   <h4 className="text-lg font-bold text-slate-800 flex items-center">
                     <span className="w-8 h-[2px] bg-primary mr-3"></span> Specialization
                   </h4>
                   <ul className="space-y-3 text-slate-600">
                     <li>• Depression & Anxiety Care</li>
                     <li>• OCD Behavioral Therapy</li>
                     <li>• Trauma-Informed Counseling</li>
                   </ul>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Simplified Process</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800">Your Path to <span className="text-emerald-500">Recovery</span></h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { num: '01', title: 'Consultation', desc: 'Secure your preference through our curated timetable.' },
              { num: '02', title: 'Reservation', desc: 'Confirm with a seamless, encrypted payment flow.' },
              { num: '03', title: 'Connection', desc: 'Instant session credentials via WhatsApp & Email.' },
              { num: '04', title: 'Dialogue', desc: 'Join your specialized counseling session online.' },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="text-[100px] font-bold text-slate-50 absolute -top-20 left-1/2 -translate-x-1/2 -z-10 select-none transition-colors duration-500 group-hover:text-emerald-50">
                  {item.num}
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 space-y-4">
             <Quote className="w-16 h-16 text-emerald-300 mx-auto opacity-50" />
             <h3 className="text-4xl font-bold">Client Experiences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: 'Sarah L.', text: "Truly life-changing. The serene approach and professional depth at MindfulPath helped me reclaim my joy." },
              { name: 'Michael T.', text: "The most effortless booking system I've used. Clinical expertise delivered with genuine empathy." },
              { name: 'Priya M.', text: "Highly recommended for those seeking a professional and secure space to speak their heart out." },
            ].map((review, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-10 rounded-[40px] border border-white/20">
                <p className="text-xl italic leading-relaxed mb-8 opacity-90">"{review.text}"</p>
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold">
                     {review.name.charAt(0)}
                   </div>
                   <span className="font-bold text-lg tracking-wide uppercase">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
