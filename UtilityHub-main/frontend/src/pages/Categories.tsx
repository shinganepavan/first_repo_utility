import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { CATEGORIES, getToolsByCategory } from '../utils/toolDefinitions';
import { Card } from '../components/common/Card';
import { DynamicIcon } from '../components/common/DynamicIcon';

export const Categories: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Tool Categories
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse through 66 tools classified into developer, designer, text, and calculator modules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-sky-400 text-xs font-semibold flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4" />
            7 Modules Active
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const categoryTools = getToolsByCategory(cat.id);
          
          return (
            <Card key={cat.id} className="relative overflow-hidden group border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 flex flex-col justify-between h-full bg-white/60 dark:bg-[#0c101d]/60">
              {/* background design accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-500/5 dark:from-slate-100/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
              
              <div>
                <div className={`p-3 w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/5`}>
                  <DynamicIcon name={cat.icon} size={20} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-indigo-500 dark:group-hover:text-sky-400 transition-colors">
                  {cat.name}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {cat.description}
                </p>

                {/* mini tool list preview */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {categoryTools.slice(0, 5).map(t => (
                    <span key={t.id} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                      {t.name}
                    </span>
                  ))}
                  {categoryTools.length > 5 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-sky-400">
                      +{categoryTools.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                  {categoryTools.length} Utilities
                </span>
                
                <Link
                  to={`/categories/${cat.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-500 dark:text-sky-400 group-hover:translate-x-1.5 transition-transform"
                >
                  Explore Category
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};
export default Categories;
