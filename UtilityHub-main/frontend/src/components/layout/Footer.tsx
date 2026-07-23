import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { CATEGORIES } from '../../utils/toolDefinitions';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-[#030712]/40 backdrop-blur-md pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                UtilityHub<span className="text-indigo-500 dark:text-sky-400 font-medium">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              UtilityHub AI is a premium all-in-one developer and text utility workbench. Compute, compress, generate, format, and translate directly inside your browser. No data leaves your machine.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Categories
            </h5>
            <ul className="flex flex-col gap-2.5">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/categories/${cat.id}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-sky-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Remaining Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              More Tools
            </h5>
            <ul className="flex flex-col gap-2.5">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/categories/${cat.id}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-sky-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Updates
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Subscribe to get notified when we publish new browser-based utilities.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email..."
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-medium transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} UtilityHub AI. All rights reserved. Built with privacy in mind.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for developers.
          </p>
        </div>

      </div>
    </footer>
  );
};
