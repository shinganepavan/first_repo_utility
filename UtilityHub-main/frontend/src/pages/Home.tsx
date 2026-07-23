import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Star, ChevronDown, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { CATEGORIES, TOOLS, searchTools } from '../utils/toolDefinitions';
import type { ToolDefinition } from '../utils/toolDefinitions';
export const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ToolDefinition[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setSearchResults(searchTools(searchQuery).slice(0, 6));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/tools/${searchResults[0].id}`);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Select 6 popular tools
  const popularTools = TOOLS.filter((t) => t.isPopular).slice(0, 6);
  // Select 3 featured tools
  const featuredTools = TOOLS.filter((t) => t.isFeatured).slice(0, 3);
  // Select 4 recently added tools
  const recentlyAddedTools = TOOLS.slice(0, 4);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Full Stack Engineer',
      avatar: 'SC',
      text: 'UtilityHub AI has completely replaced the 15 separate bookmark tools I had. Having code formatters, image compressors, and AI generators in one glassmorphic dashboard is incredible.',
    },
    {
      name: 'Marcus Vance',
      role: 'Product Designer',
      avatar: 'MV',
      text: 'The QR generator and client-side image cropper are super fast. The UI is absolutely stunning, dark mode looks amazing, and I love that all files remain private on my system.',
    },
    {
      name: 'Arjun Mehta',
      role: 'Technical Writer',
      avatar: 'AM',
      text: 'The AI email writer and grammar checker save me hours. It generates outlines and replies instantly. Combined with markdown tools, it makes productivity seamless.',
    },
  ];

  const faqs = [
    {
      q: 'Are my files and data secure on UtilityHub AI?',
      a: 'Absolutely. 95% of our utilities (including image compressors, JSON formatters, and PDF handlers) run completely client-side. Your inputs, codes, and documents never leave your browser. AI tools communicate with our secure backend only to fetch completions and are never cached.',
    },
    {
      q: 'Does this platform support offline usage (PWA)?',
      a: 'Yes! The entire platform is a Progressive Web App (PWA). Once loaded, all offline-capable client-side tools (converters, timers, regulators, math calculators) will continue to work perfectly without an internet connection.',
    },
    {
      q: 'How do I use the AI utilities?',
      a: 'AI features require a prompt and generate resumes, cover letters, posts, or grammar checks. You can log in to sync generations across devices and view usage statistics on your dashboard.',
    },
    {
      q: 'Is there a limit on file uploads?',
      a: 'Client-side operations do not have explicit size bounds, though your local RAM determines processing speed. Standard image compressors support files up to 50MB and PDF mergers support combining dozens of files.',
    },
  ];

  return (
    <div className="space-y-24 py-6">
      
      {/* 1. Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-10 pb-4">
        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-sky-400 text-xs font-semibold mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The Ultimate Browser Toolkit
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          All the utilities you need, <br />
          <span className="text-gradient-primary">supercharged with AI</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Format files, compress images, generate mock data, code structures, and compile documents with 66 secure, client-side tools.
        </motion.p>

        {/* Dynamic Search stage */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-xl mx-auto z-20"
        >
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="What tool do you need? (e.g. JSON Formatter, BMI, AI Resume)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xl shadow-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <Button type="submit" size="sm" className="text-xs rounded-xl py-2">
                Find
              </Button>
            </div>
          </form>

          {/* Search results dropdown */}
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-16 left-0 right-0 glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl p-2 text-left z-30 max-h-96 overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {searchResults.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => navigate(`/tools/${tool.id}`)}
                        className="flex items-center gap-3.5 w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          <DynamicIcon name={tool.icon} size={16} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {tool.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {tool.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No tools match "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 2. Featured Tools */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Featured Utilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Handpicked tools built with advanced capabilities and premium interfaces.
            </p>
          </div>
          <Link to="/utilities">
            <Button variant="outline" size="sm" className="text-xs">
              View all 66 tools
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
            <Card key={tool.id} className="relative overflow-hidden group border border-slate-200/50 dark:border-slate-800/50">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-4 mb-4">
                <span className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-sky-500/10 text-indigo-500 dark:text-sky-400 flex items-center justify-center">
                  <DynamicIcon name={tool.icon} size={24} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-sky-400">
                  Featured
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                {tool.description}
              </p>
              <Link to={`/tools/${tool.id}`}>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Open Tool
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Browse by Category
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Quickly locate tools by functional groups. Each category contains a focused collection of developer operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/categories/${cat.id}`}>
              <Card className="h-full flex flex-col justify-between border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 group">
                <div>
                  <div className={`p-2.5 w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/5`}>
                    <DynamicIcon name={cat.icon} size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 dark:group-hover:text-sky-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 dark:text-sky-400 group-hover:translate-x-1.5 transition-transform">
                  Browse {TOOLS.filter(t => t.category === cat.id).length} Tools
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Popular Tools list */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Most Popular
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The utilities used most frequently by developer teams and digital designers.
            </p>
          </div>
          <Link to="/utilities?filter=popular">
            <Button variant="outline" size="sm" className="text-xs">
              View all popular
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <Link key={tool.id} to={`/tools/${tool.id}`}>
              <Card className="flex items-start gap-4 p-5 border border-slate-200/50 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-900/40">
                <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <DynamicIcon name={tool.icon} size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tool.name}
                    </h4>
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      Popular
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Recently Added & Stats */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recently Added */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Recently Added Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentlyAddedTools.map((tool) => (
              <Link key={tool.id} to={`/tools/${tool.id}`}>
                <Card className="flex items-center gap-3 p-4 border border-slate-200/50 dark:border-slate-800/50">
                  <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <DynamicIcon name={tool.icon} size={15} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tool.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {tool.category.toUpperCase()} TOOL
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 flex flex-col justify-between">
          <div>
            <span className="p-2 rounded-xl bg-indigo-500 text-white inline-flex items-center justify-center mb-6">
              <Activity className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Performance Monitor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Track platform metrics. All computation remains localized for low-latency response times.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-6">
            <div>
              <p className="text-xl font-extrabold text-indigo-500">66</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Tools</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-indigo-500">0ms</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">API Latency</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-indigo-500">100%</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Private</p>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. Testimonials */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            What Developers Are Saying
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Professionals from startups and major enterprises use UtilityHub AI to clean code, convert files, and generate templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="relative p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-full bg-white/50 dark:bg-slate-950/20">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {t.avatar}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need to know about security, browser performance, and PWA capabilities.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-slate-800 dark:text-slate-200 hover:bg-slate-100/30 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <span className="text-xs font-bold">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/10 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
export default Home;
