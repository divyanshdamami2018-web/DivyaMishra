import React from 'react';
import { Heart, Globe, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-mesh-gradient pt-32 pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 animate-fade-in">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Meet Divya Mishra – <br />
              <span className="text-primary italic">A Psychologist for the World</span>
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed font-medium">
              Divya Mishra is a <span className="text-slate-900 font-bold underline decoration-primary/30 decoration-4">Clinical Psychology professional (M.A.)</span> dedicated to making mental health accessible, practical, and globally relevant.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Globe, text: "Globally Relevant Care" },
                { icon: Users, text: "Families & Professionals" },
                { icon: Heart, text: "Empathetic Approach" },
                { icon: Award, text: "Academic Excellence" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-slate-700">
                  <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center shadow-sm">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
              <img 
                src="/divya-mishra.jpg" 
                alt="Divya Mishra" 
                className="relative z-10 w-full max-w-md h-[550px] object-cover rounded-[50px] shadow-2xl border-4 border-white transform hover:rotate-2 transition-all duration-700" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-8 text-center">
            <p className="text-2xl text-slate-600 leading-relaxed italic">
              "Inspired by <span className="text-primary font-bold">Vasudhaiva Kutumbakam</span>, she believes mental well-being is not limited by geography—it is a universal human need."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
            <div className="glass-card p-10 rounded-[40px] border-none bg-slate-50 space-y-6">
              <h3 className="text-2xl font-bold text-slate-800">Transforming Lives</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Her approach combines academic expertise with real-life application—helping individuals not just understand their minds, but transform their lives.
              </p>
            </div>
            <div className="glass-card p-10 rounded-[40px] border-none bg-slate-50 space-y-6">
              <h3 className="text-2xl font-bold text-slate-800">Building Clarity</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                She works with students, professionals, and families to build clarity, emotional strength, and confidence in decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision Section */}
      <section className="pb-24 bg-white px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-primary p-12 rounded-[50px] text-white space-y-6">
            <h3 className="text-3xl font-bold">Our Mission</h3>
            <p className="text-xl opacity-90 leading-relaxed">
              To make professional mental health support accessible, affordable, and personalized for everyone, regardless of where they are in the world.
            </p>
          </div>
          <div className="bg-slate-900 p-12 rounded-[50px] text-white space-y-6">
            <h3 className="text-3xl font-bold">Our Vision</h3>
            <p className="text-xl opacity-90 leading-relaxed">
              A world where mental well-being is prioritized as a universal right and every individual has the guidance to lead a fulfilling, confident life.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
