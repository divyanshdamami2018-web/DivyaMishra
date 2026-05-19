import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Tag } from 'lucide-react';

const posts = [
  {
    id: 1,
    category: 'Anxiety',
    title: 'Understanding Anxiety: What Your Worry Is Really Trying to Tell You',
    excerpt: 'Anxiety is not your enemy. It is a signal — often a misunderstood one. Learn how to decode what your nervous system is communicating and how evidence-based techniques can help you respond instead of react.',
    date: 'May 12, 2026',
    readTime: '6 min read',
    emoji: '🧠',
    color: 'from-blue-50 to-indigo-100',
    accent: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 2,
    category: 'Mindfulness',
    title: 'Practicing Mindfulness Daily: A Simple 5-Minute Morning Routine',
    excerpt: 'You do not need an hour of meditation to feel grounded. Discover a practical, science-backed 5-minute mindfulness routine that fits into any morning — even the busiest ones.',
    date: 'May 5, 2026',
    readTime: '4 min read',
    emoji: '🌿',
    color: 'from-emerald-50 to-green-100',
    accent: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    category: 'Self-Esteem',
    title: 'The Imposter Syndrome Trap — And How to Break Free',
    excerpt: 'Feeling like a fraud despite your achievements? Imposter syndrome affects 70% of people at some point. Explore the psychology behind it and practical CBT tools to reclaim your confidence.',
    date: 'April 28, 2026',
    readTime: '7 min read',
    emoji: '💪',
    color: 'from-amber-50 to-orange-100',
    accent: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    id: 4,
    category: 'Relationships',
    title: 'How to Have Difficult Conversations Without Damaging Your Relationships',
    excerpt: 'Most relationship problems are communication problems. Learn the "SBI" feedback model and non-violent communication techniques that turn conflict into connection.',
    date: 'April 20, 2026',
    readTime: '5 min read',
    emoji: '💬',
    color: 'from-rose-50 to-pink-100',
    accent: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
  },
];

const categories = ['All', 'Anxiety', 'Mindfulness', 'Self-Esteem', 'Relationships'];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen font-sans">

      {/* Hero */}
      <section className="bg-mesh-gradient pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-5 py-2 rounded-full border border-white/40 text-primary font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Mental Health Insights
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
            The Mind <span className="text-primary italic">Journal</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Evidence-based insights, practical tools, and compassionate perspectives to support your mental wellness journey.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-slate-100 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-emerald-900/10'
                  : 'bg-slate-100 text-slate-500 hover:bg-primaryLight hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {activeCategory === 'All' && (
        <section className="py-16 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-primary font-bold tracking-widest uppercase text-xs mb-6 px-1">Featured Article</p>
            <div className={`bg-gradient-to-br ${posts[0].color} rounded-[40px] overflow-hidden flex flex-col lg:flex-row gap-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer`}>
              <div className={`lg:w-2/5 flex items-center justify-center py-16 px-8 bg-gradient-to-br ${posts[0].color}`}>
                <span className="text-[120px] animate-float">{posts[0].emoji}</span>
              </div>
              <div className="lg:w-3/5 bg-white p-10 lg:p-14 flex flex-col justify-center space-y-5">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${posts[0].badge} w-fit`}>{posts[0].category}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">{posts[0].excerpt}</p>
                <div className="flex items-center gap-6 text-slate-400 text-sm">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {posts[0].readTime}</span>
                  <span>{posts[0].date}</span>
                </div>
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 font-bold ${posts[0].accent} group-hover:gap-3 transition-all`}
                >
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16 bg-white px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {activeCategory === 'All' && (
            <p className="text-primary font-bold tracking-widest uppercase text-xs mb-10 px-1">More Articles</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeCategory === 'All' ? filtered.slice(1) : filtered).map((post) => (
              <article
                key={post.id}
                className="group glass-card rounded-[32px] overflow-hidden border-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                {/* Visual */}
                <div className={`h-44 bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{post.emoji}</span>
                </div>
                {/* Content */}
                <div className="p-8 space-y-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${post.badge}`}>{post.category}</span>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                    <Link
                      to="/contact"
                      className="text-primary font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-primary px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl font-bold text-white">Start Your Healing Journey</h2>
          <p className="text-emerald-100 text-xl leading-relaxed">
            Reading is the first step. The next one is a conversation. Book a confidential session today.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 bg-white text-primary px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl active:scale-95 group transition-all"
          >
            Book a Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;
