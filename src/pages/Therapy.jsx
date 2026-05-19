import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Heart, Shield, Users, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';

const services = [
  {
    icon: Brain,
    title: 'Cognitive Behavioral Therapy (CBT)',
    desc: 'Identify and reshape negative thought patterns that fuel anxiety, depression, and self-doubt. CBT is one of the most evidence-backed approaches in modern psychology.',
    tags: ['Anxiety', 'Depression', 'OCD'],
  },
  {
    icon: Heart,
    title: 'Trauma-Informed Counseling',
    desc: 'A gentle, safe approach to processing past trauma. We work at your pace, building resilience and helping you reclaim your narrative with compassion.',
    tags: ['PTSD', 'Grief', 'Abuse Recovery'],
  },
  {
    icon: Shield,
    title: 'Mindfulness-Based Therapy',
    desc: 'Learn practical mindfulness techniques to manage stress, reduce rumination, and cultivate present-moment awareness for lasting emotional balance.',
    tags: ['Stress', 'Burnout', 'Overthinking'],
  },
  {
    icon: Users,
    title: 'Relationship & Family Counseling',
    desc: 'Navigate interpersonal conflicts, communication breakdowns, and relationship dynamics with professional guidance for healthier connections.',
    tags: ['Couples', 'Family', 'Communication'],
  },
  {
    icon: Sparkles,
    title: 'Self-Esteem & Identity Work',
    desc: 'Build a stronger, more authentic sense of self. We address imposter syndrome, low confidence, and identity confusion through structured sessions.',
    tags: ['Confidence', 'Identity', 'Growth'],
  },
  {
    icon: MessageCircle,
    title: 'Career & Academic Stress',
    desc: 'Academic pressure, career transitions, and performance anxiety are real. We provide targeted strategies to help you navigate with clarity and purpose.',
    tags: ['Students', 'Professionals', 'Exams'],
  },
];

const process = [
  { step: '01', title: 'Initial Consultation', desc: 'A free 15-minute intro call to understand your needs and match you to the right approach.' },
  { step: '02', title: 'Personalised Plan', desc: 'We co-create a therapy roadmap aligned with your goals, timeline, and comfort level.' },
  { step: '03', title: 'Weekly Sessions', desc: 'Structured 60-minute online sessions with exercises and reflections between meetings.' },
  { step: '04', title: 'Track Progress', desc: 'Regular check-ins to review growth, adjust techniques, and celebrate breakthroughs.' },
];

const Therapy = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">

      {/* Hero */}
      <section className="bg-mesh-gradient pt-28 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-5 py-2 rounded-full border border-white/40 text-primary font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Evidence-Based Therapy
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
            Therapy That <span className="text-primary italic">Actually</span> Works
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every mind is unique. Our therapeutic approaches are carefully selected and personalised — combining global psychology with the warmth of Indian cultural understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/book"
              className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              Book a Free Consult <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://wa.me/919929814206"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/60 backdrop-blur-sm border border-white/60 text-slate-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-white active:scale-95 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-500" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">What We Offer</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800">
              Specialised <span className="text-slate-400 font-light">Therapy Services</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="group p-8 rounded-[32px] border border-slate-100 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 bg-primaryLight rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                  <s.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-500" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">{s.title}</h4>
                <p className="text-slate-600 leading-relaxed mb-5 text-sm">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-bold border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto glass-card rounded-[50px] p-12 md:p-20 border-none shadow-xl">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Our Philosophy</h2>
            <h3 className="text-4xl font-bold text-slate-800">The Approach Behind the Healing</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { title: 'Non-Judgmental Space', desc: 'Every session is a safe harbour. No labels, no shame — only acceptance and understanding.' },
              { title: 'Culturally Sensitive', desc: 'Mental health is not one-size-fits-all. We integrate Indian values and global psychology seamlessly.' },
              { title: 'Goal-Oriented', desc: 'We work towards measurable, meaningful progress — not endless, open-ended sessions.' },
              { title: 'Strengths-Based', desc: 'We build on what you already have. You are not broken; you are becoming.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">How It Works</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-800">Your Therapy Journey</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {process.map((item, i) => (
              <div key={i} className="text-center group relative">
                <div className="text-[80px] font-black text-slate-50 absolute -top-14 left-1/2 -translate-x-1/2 select-none group-hover:text-emerald-50 transition-colors">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-primaryLight rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-500">
                  <span className="font-black text-primary group-hover:text-white text-lg transition-colors duration-500">{item.step}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Begin?</h2>
          <p className="text-xl text-emerald-100 leading-relaxed">
            The first step is the hardest — and the most important. Book your confidential session today.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 bg-white text-primary px-12 py-5 rounded-2xl font-bold text-xl transition-all hover:shadow-2xl active:scale-95 group"
          >
            Book Your Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Therapy;
