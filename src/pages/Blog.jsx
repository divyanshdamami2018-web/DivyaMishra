import React from 'react';

const Blog = () => {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-5xl font-bold text-slate-900">Mental Health Blog</h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Insights, tips, and stories to support your journey towards mental well-being.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 text-left">
          {[
            { title: 'Understanding Anxiety', date: 'April 10, 2024', category: 'Therapy' },
            { title: 'Practicing Mindfulness Daily', date: 'April 8, 2024', category: 'Wellness' },
          ].map((post, i) => (
            <div key={i} className="glass-card overflow-hidden rounded-[40px] group cursor-pointer hover:shadow-2xl transition-all border-none">
              <div className="h-48 bg-slate-200 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="p-10 space-y-4">
                <span className="text-primary font-bold text-sm tracking-widest uppercase">{post.category}</span>
                <h3 className="text-3xl font-bold text-slate-800">{post.title}</h3>
                <p className="text-slate-500">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
