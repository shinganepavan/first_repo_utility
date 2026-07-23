import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, Share2, HelpCircle, Keyboard } from 'lucide-react';
import { getToolById } from '../utils/toolDefinitions';
import { useFavorites } from '../context/FavoritesContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Import tool sub-modules
import { TextTools } from '../components/tools/TextTools';
import { DevTools } from '../components/tools/DevTools';
import { ImageTools } from '../components/tools/ImageTools';
import { PdfTools } from '../components/tools/PdfTools';
import { CalcTools } from '../components/tools/CalcTools';
import { AiTools } from '../components/tools/AiTools';
import { ProdTools } from '../components/tools/ProdTools';

export const ToolRunner: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { toggleFavorite, isFavorite, addRecent } = useFavorites();

  const tool = toolId ? getToolById(toolId) : undefined;

  useEffect(() => {
    if (toolId) {
      addRecent(toolId);
      // Log usage to backend in background if desired
      const token = localStorage.getItem('token');
      if (token && !token.startsWith('mock-')) {
        fetch(`${API_URL}/tools/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ tool_id: toolId })
        }).catch(() => {});
      }
    }
  }, [toolId]);

  if (!tool) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Utility Tool Not Found</h2>
        <Link to="/utilities">
          <Button variant="primary" size="sm">Back to Directory</Button>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(tool.id);

  // Dynamic selector for sub-tool UI
  const renderToolComponent = () => {
    switch (tool.category) {
      case 'text':
        return <TextTools toolId={tool.id} />;
      case 'dev':
        return <DevTools toolId={tool.id} />;
      case 'image':
        return <ImageTools toolId={tool.id} />;
      case 'pdf':
        return <PdfTools toolId={tool.id} />;
      case 'calc':
        return <CalcTools toolId={tool.id} />;
      case 'ai':
        return <AiTools toolId={tool.id} />;
      case 'prod':
        return <ProdTools toolId={tool.id} />;
      default:
        return <p className="text-xs text-slate-400">Loading utility interface...</p>;
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Back button & Action Header */}
      <div className="flex flex-col gap-4">
        <Link
          to={`/categories/${tool.category}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-sky-400 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to category
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {tool.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {tool.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(tool.id)}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                favorited
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  : 'bg-white dark:bg-slate-905 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${favorited ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Tool link copied to clipboard!');
              }}
              className="text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tool Runner Window */}
      <div className="relative z-10">
        {renderToolComponent()}
      </div>

      {/* Instructions & Help footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-slate-200/50 dark:border-slate-800/50">
        <Card hoverEffect={false} className="border border-slate-200/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/20 p-5 flex items-start gap-4">
          <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Local Browser Processing</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              This utility processes computations in your local browser sandbox using standard Web APIs. No data or strings are forwarded to external servers, protecting your credentials and keys.
            </p>
          </div>
        </Card>

        <Card hoverEffect={false} className="border border-slate-200/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/20 p-5 flex items-start gap-4">
          <Keyboard className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Standard Hotkeys</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Use standard keyboard hotkeys: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[9px]">Ctrl+C</kbd> to copy inputs, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[9px]">Ctrl+V</kbd> to paste contents, and tab controls to skip action forms.
            </p>
          </div>
        </Card>
      </div>

    </div>
  );
};
export default ToolRunner;
