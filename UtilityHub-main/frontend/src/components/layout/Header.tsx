import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Sparkles, User as UserIcon, LogOut, Menu, X, ArrowUpRight, SearchSlash } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { searchTools } from '../../utils/toolDefinitions';
import type { ToolDefinition } from '../../utils/toolDefinitions';
import { Button } from '../common/Button';
import { DynamicIcon } from '../common/DynamicIcon';

export const Header: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ToolDefinition[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search results
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setSearchResults(searchTools(searchQuery).slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSelect = (toolId: string) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/tools/${toolId}`);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Utilities', path: '/utilities' },
    { label: 'Categories', path: '/categories' },
    { label: 'AI Tools', path: '/categories/ai' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav-light dark:glass-nav-dark transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <Link to="/" className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              UtilityHub<span className="text-indigo-500 dark:text-sky-400 font-medium">AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors duration-200 ${
                location.pathname === link.path
                  ? 'text-indigo-500 dark:text-sky-400'
                  : 'text-slate-600 hover:text-indigo-500 dark:text-slate-300 dark:hover:text-sky-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          
          {/* Universal Search bar */}
          <div ref={searchRef} className="relative hidden md:block w-64 lg:w-72">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search 66 utilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-12 left-0 right-0 w-80 max-h-96 overflow-y-auto glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl p-2 z-50">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                      Tools Found
                    </p>
                    {searchResults.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleSearchSelect(tool.id)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                          <DynamicIcon name={tool.icon} size={15} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {tool.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {tool.description}
                          </p>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                    <SearchSlash className="w-8 h-8 mb-2 stroke-1" />
                    <p className="text-xs font-medium">No utilities matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-sky-400 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800/20 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex items-center gap-1.5 border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <UserIcon className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800/20 hover:scale-105 active:scale-95 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="text-xs">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile navigation links */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-800/50 px-4 py-4 flex flex-col gap-3 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md">
          {/* Mobile Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 66 utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-200 focus:outline-none"
            />
            {searchQuery && (
              <div className="mt-2 glass-card-light dark:glass-card-dark p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 max-h-60 overflow-y-auto">
                {searchTools(searchQuery).slice(0, 5).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSearchQuery('');
                      setMobileMenuOpen(false);
                      navigate(`/tools/${tool.id}`);
                    }}
                    className="flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  >
                    <DynamicIcon name={tool.icon} size={14} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{tool.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-sky-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold py-2 px-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
