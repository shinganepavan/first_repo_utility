import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Star, Sparkles, Grid } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../utils/toolDefinitions';
import { Card } from '../components/common/Card';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { useFavorites } from '../context/FavoritesContext';

export const Utilities: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeCategory = searchParams.get('category') || 'all';
  const filterType = searchParams.get('filter') || 'all'; // 'all' | 'popular' | 'featured' | 'favorites'

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      // 1. Search Query filter
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Category filter
      if (activeCategory !== 'all' && tool.category !== activeCategory) {
        return false;
      }

      // 3. Filter Type filter
      if (filterType === 'popular' && !tool.isPopular) return false;
      if (filterType === 'featured' && !tool.isFeatured) return false;
      if (filterType === 'favorites' && !isFavorite(tool.id)) return false;

      return true;
    });
  }, [searchQuery, activeCategory, filterType, isFavorite]);

  const handleCategorySelect = (catId: string) => {
    setSearchParams((prev) => {
      if (catId === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', catId);
      }
      return prev;
    });
  };

  const handleFilterTypeSelect = (type: string) => {
    setSearchParams((prev) => {
      if (type === 'all') {
        prev.delete('filter');
      } else {
        prev.set('filter', type);
      }
      return prev;
    });
  };

  const quickFilters = [
    { id: 'all', label: 'All Tools', icon: Grid },
    { id: 'popular', label: 'Popular', icon: Star },
    { id: 'featured', label: 'Featured', icon: Sparkles },
    { id: 'favorites', label: 'Favorites', icon: Star },
  ];

  return (
    <div className="space-y-10 py-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Utility Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, filter, and run any of the 66 client-side and AI tools.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search all 66 utilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Filters */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
              Filter Utilities
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {quickFilters.map((f) => {
                const isActive = filterType === f.id;
                const IconComponent = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleFilterTypeSelect(f.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold w-full text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-white/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories select */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
              Modules
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-1">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold w-full text-left transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-sky-400 font-bold'
                    : 'text-slate-600 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:bg-slate-900/40'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold w-full text-left transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-sky-400 font-bold'
                      : 'text-slate-600 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <DynamicIcon name={cat.icon} size={13} className="text-slate-400" />
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {TOOLS.filter(t => t.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Tools Grid */}
        <div className="lg:col-span-3 space-y-6">
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
                        <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <DynamicIcon name={tool.icon} size={16} />
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${favorited ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                      
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-500 dark:group-hover:text-sky-400 transition-colors truncate">
                        {tool.name}
                      </h3>
                      
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    <Link
                      to={`/tools/${tool.id}`}
                      className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-sky-400 border-t border-slate-200/40 dark:border-slate-800/40 pt-3.5"
                    >
                      <span>Open Tool</span>
                      <DynamicIcon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/20 dark:bg-slate-950/10">
              <p className="text-xs font-medium">No tools found matching your selection.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default Utilities;
