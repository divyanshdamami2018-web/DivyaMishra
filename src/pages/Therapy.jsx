import React from 'react';

const Therapy = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-5xl font-bold text-slate-900">Therapy Services</h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Explore our specialized therapeutic approaches designed to help you heal and grow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          {[
            { title: 'Individual Therapy', icon: '👤', desc: 'Personalized 1:1 sessions focused on your unique mental health goals.' },
            { title: 'Mindfulness', icon: '🌿', desc: 'Practical techniques to stay present and reduce stress.' },
            { title: 'Trauma Care', icon: '🤲', desc: 'Specialized support for navigating past experiences safely.' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-10 rounded-[40px] text-center hover:scale-105 transition-transform duration-500">
              <div className="text-4xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Therapy;
