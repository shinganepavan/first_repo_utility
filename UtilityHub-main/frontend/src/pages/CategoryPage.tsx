import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Star, MoveRight } from 'lucide-react';
import { CATEGORIES, getToolsByCategory } from '../utils/toolDefinitions';
import { Card } from '../components/common/Card';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { useFavorites } from '../context/FavoritesContext';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [query, setQuery] = useState('');

  const category = CATEGORIES.find(c => c.id === categoryId);
  
  if (!category) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Category not found</h2>
        <Link to="/categories">
          <span className="text-indigo-500 hover:underline">Back to Categories</span>
        </Link>
      </div>
    );
  }

  const categoryTools = getToolsByCategory(category.id);
  const filteredTools = categoryTools.filter(
    t => t.name.toLowerCase().includes(query.toLowerCase()) || 
         t.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-10 py-6">
      
      {/* Back button & title header */}
      <div className="flex flex-col gap-4">
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-sky-400 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to categories
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
          <div className="flex items-center gap-4">
            <span className={`p-3.5 rounded-2xl bg-gradient-to-br ${category.color} text-white flex items-center justify-center shadow-lg shadow-indigo-500/10`}>
              <DynamicIcon name={category.icon} size={24} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {category.description}
              </p>
            </div>
          </div>
          
          {/* Search bar specifically for this category */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search in ${category.name}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tools List */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const favorited = isFavorite(tool.id);
            
            return (
              <Card
                key={tool.id}
                className="relative group border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-full bg-white/60 dark:bg-[#0c101d]/60 hover:border-indigo-500/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                      <DynamicIcon name={tool.icon} size={18} />
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${favorited ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 dark:group-hover:text-sky-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <Link
                  to={`/tools/${tool.id}`}
                  className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-sky-400 border-t border-slate-200/40 dark:border-slate-800/40 pt-4"
                >
                  <span>Open Utility</span>
                  <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/20 dark:bg-slate-950/10">
          <p className="text-sm font-medium">No tools found matching "{query}"</p>
        </div>
      )}

    </div>
  );
};
export default CategoryPage;
