import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Rocket, 
  CheckCircle2, 
  MessageCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

const Career = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F9FAFB] text-slate-900">
      
      {/* Hero Section - Matching Screenshot */}
      <section className="bg-white pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6 animate-fade-in">
          <h2 className="text-emerald-600 text-sm font-bold tracking-[0.2em] uppercase">
            Career Counselling
          </h2>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 tracking-tight">
            Guiding Futures with Psychology
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-relaxed">
            Career is not just a decision—it's a reflection of identity, passion, and purpose.<br />
            Our counselling combines psychological insights with practical strategies to help individuals make confident, well-informed career choices.
          </p>
        </div>
      </section>

      {/* Core Service Cards - Matching Screenshot */}
      <section className="bg-white pb-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: 'Career Assessments', 
              desc: 'Interest, Aptitude, and Personality assessments to uncover your strengths and direction.' 
            },
            { 
              title: 'Student Guidance', 
              desc: 'Comprehensive guidance for Class 10–12 and college students navigating academic and career decisions.' 
            },
            { 
              title: 'Career Transition Support', 
              desc: 'Professional support for adults navigating career changes with confidence and clarity.' 
            },
            { 
              title: 'Resume Building & Interview Prep', 
              desc: 'Craft compelling resumes and develop interview skills grounded in psychological confidence.' 
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 p-12 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-shadow duration-500 group">
              <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6 group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Psychological Career Mapping - Re-styled for Minimalism */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto glass-card bg-white border border-slate-100 p-12 md:p-20 rounded-[40px] shadow-sm text-center space-y-10">
          <div className="inline-block bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
            Recommended Service
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800">Psychological Career Mapping 🧠</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A deep-dive session where we analyze your personality, thinking patterns, and strengths to identify the most suitable career paths.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
             {[
                'Career personality profile',
                'Best-fit career options',
                'Strength & weakness analysis',
                'Clear direction roadmap'
             ].map((item, idx) => (
               <div key={idx} className="flex items-center text-slate-600 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3" />
                 {item}
               </div>
             ))}
          </div>
          <div className="pt-8">
            <Link to="/book" className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-lg">
              Book A Mapping Session
            </Link>
          </div>
        </div>
      </section>

      {/* Roadmap Section - Minimalist Style */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-4xl font-serif font-bold text-slate-900">Career Roadmap Program🚀</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Goal Setting', desc: 'Defining clear, achievable targets.' },
              { title: 'Step-by-Step Plan', desc: 'A custom monthly execution roadmap.' },
              { title: 'Skill Strategy', desc: 'Identifying the right certifications.' },
              { title: 'Backup Options', desc: 'Contingency plans for total security.' },
            ].map((item, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-emerald-50/50 transition-colors">
                <h5 className="text-xl font-bold mb-4">{item.title}</h5>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean White Grid */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-serif font-bold text-slate-900">Transparent Pricing</h2>
            <p className="text-lg text-slate-500">Invest in your most valuable asset—your future.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Basic Session', price: '₹499 – ₹999' },
              { title: 'Career Assessment', price: '₹1499 – ₹2999' },
              { title: 'Career Mapping', price: '₹1999 – ₹4999', highlight: true },
              { title: 'Roadmap Program', price: '₹5000+' },
            ].map((plan, i) => (
              <div key={i} className={`bg-white p-10 rounded-3xl border ${plan.highlight ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-100'} text-center space-y-6 shadow-sm`}>
                <h5 className="text-lg font-bold text-slate-800">{plan.title}</h5>
                <div className="text-3xl font-bold text-emerald-700">{plan.price}</div>
                <Link to="/book" className={`block w-full py-4 rounded-xl font-bold transition-all ${plan.highlight ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Minimal & Clean */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-slate-900 text-center mb-16">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How many sessions are needed?', a: 'Typically, 1-2 sessions are enough for basic clarity, but our Roadmap Program (3-5 sessions) is recommended for comprehensive tracking.' },
              { q: 'Is this suitable for students?', a: 'Absolutely. We specialize in guidance for Class 9-12 students and college students navigating academic choices.' },
              { q: 'Is online counselling effective?', a: 'Yes! Career counselling is highly effective online as it allows for digital assessment sharing and flexible scheduling.' },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full py-8 text-left flex justify-between items-center bg-transparent focus:outline-none"
                >
                   <span className="text-lg font-medium text-slate-800">{faq.q}</span>
                   <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="pb-8 text-slate-500 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 px-4 text-center space-y-10">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Start Your Career Journey Today</h2>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/book" className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all">
              Book Career Session
            </Link>
            <button
               onClick={() => window.open('https://wa.me/919929814206', '_blank')}
               className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6 mr-2" /> Chat on WhatsApp
            </button>
        </div>
      </section>

    </div>
  );
};

export default Career;
