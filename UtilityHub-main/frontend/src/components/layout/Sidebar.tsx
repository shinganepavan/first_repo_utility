import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Star, History, LayoutGrid } from 'lucide-react';
import { CATEGORIES, TOOLS, getToolsByCategory } from '../../utils/toolDefinitions';
import { DynamicIcon } from '../common/DynamicIcon';
import { useFavorites } from '../../context/FavoritesContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { favorites, recentlyUsed } = useFavorites();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    text: false,
    dev: false,
    image: false,
    pdf: false,
    calc: false,
    ai: false,
    prod: false,
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const favoritedTools = TOOLS.filter(t => favorites.includes(t.id));
  const recentTools = TOOLS.filter(t => recentlyUsed.includes(t.id)).slice(0, 5);

  return (
    <aside
      className={`
        fixed inset-y-16 left-0 z-30
        w-64 h-[calc(100vh-4rem)]
        bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md
        border-r border-slate-200/50 dark:border-slate-800/50
        overflow-y-auto
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="p-4 flex flex-col gap-6">
        
        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 px-3">
            Quick Navigation
          </h4>
          <div className="flex flex-col gap-0.5">
            <NavLink
              to="/utilities"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/20 dark:text-sky-400'
                    : 'text-slate-600 hover:text-indigo-500 dark:text-slate-300 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`
              }
            >
              <LayoutGrid className="w-4 h-4" />
              All Utilities
            </NavLink>
          </div>
        </div>

        {/* Favorites section */}
        {favoritedTools.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Favorites
            </h4>
            <div className="flex flex-col gap-0.5">
              {favoritedTools.map((tool) => (
                <NavLink
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/20 dark:text-sky-400 font-semibold'
                        : 'text-slate-600 hover:text-indigo-500 dark:text-slate-300 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                    }`
                  }
                >
                  <DynamicIcon name={tool.icon} size={13} className="text-slate-400" />
                  <span className="truncate">{tool.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Recents section */}
        {recentTools.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              Recently Used
            </h4>
            <div className="flex flex-col gap-0.5">
              {recentTools.map((tool) => (
                <NavLink
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/20 dark:text-sky-400 font-semibold'
                        : 'text-slate-600 hover:text-indigo-500 dark:text-slate-300 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                    }`
                  }
                >
                  <DynamicIcon name={tool.icon} size={13} className="text-slate-400" />
                  <span className="truncate">{tool.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tree */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3">
            Tool Categories
          </h4>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((cat) => {
              const isExpanded = expandedCategories[cat.id];
              const catTools = getToolsByCategory(cat.id);
              const isCatActive = location.pathname === `/categories/${cat.id}`;
              
              return (
                <div key={cat.id} className="flex flex-col">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={`/categories/${cat.id}`}
                      onClick={onClose}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isCatActive
                          ? 'bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/20 dark:text-sky-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                      }`}
                    >
                      <DynamicIcon name={cat.icon} size={14} className="text-slate-400" />
                      <span>{cat.name}</span>
                    </NavLink>
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Category Sub-items */}
                  {isExpanded && (
                    <div className="ml-7 mt-0.5 pl-2 border-l border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-0.5">
                      {catTools.map((tool) => (
                        <NavLink
                          key={tool.id}
                          to={`/tools/${tool.id}`}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                              isActive
                                ? 'bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/20 dark:text-sky-400 font-semibold'
                                : 'text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-900/20'
                            }`
                          }
                        >
                          <span className="truncate">{tool.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
};
