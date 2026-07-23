import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Copy, Trash, Check } from 'lucide-react';

interface ToolProps {
  toolId: string;
}

export const TextTools: React.FC<ToolProps> = ({ toolId }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ chars: 0, words: 0, lines: 0, sentences: 0, readTime: 0 });
  const [copied, setCopied] = useState(false);

  // Readability variables
  const [readability, setReadability] = useState({ score: 0, grade: 'N/A', difficulty: 'N/A' });

  // Lorem states
  const [paragraphs, setParagraphs] = useState(3);

  // Random text states
  const [randLength, setRandLength] = useState(100);

  useEffect(() => {
    // Realtime word counter / stats
    const chars = input.length;
    const words = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const lines = input === '' ? 0 : input.split('\n').length;
    const sentences = input.trim() === '' ? 0 : input.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readTime = Math.ceil(words / 200); // 200 wpm average

    setStats({ chars, words, lines, sentences, readTime });

    // Readability Check (Flesch-Kincaid formula simulation)
    if (words > 5 && sentences > 0) {
      const syllables = words * 1.5; // approximation for average syllables
      const score = Math.round(206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words));
      let grade = 'Medium';
      let difficulty = 'Easy to Read';
      if (score < 30) {
        grade = 'College Graduate';
        difficulty = 'Very Difficult';
      } else if (score < 50) {
        grade = 'College';
        difficulty = 'Difficult';
      } else if (score < 70) {
        grade = 'High School';
        difficulty = 'Fairly Easy';
      } else if (score >= 90) {
        grade = '5th Grade';
        difficulty = 'Very Easy';
      }
      setReadability({ score: Math.max(0, Math.min(100, score)), grade, difficulty });
    } else {
      setReadability({ score: 0, grade: 'N/A', difficulty: 'N/A' });
    }
  }, [input]);

  const handleCopy = () => {
    const textToCopy = output || input;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  // Case Converter Options
  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'reverse') => {
    if (!input) return;
    if (type === 'upper') {
      setOutput(input.toUpperCase());
    } else if (type === 'lower') {
      setOutput(input.toLowerCase());
    } else if (type === 'title') {
      const title = input.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setOutput(title);
    } else if (type === 'sentence') {
      const sentence = input.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase());
      setOutput(sentence);
    } else if (type === 'camel') {
      const camel = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      setOutput(camel);
    } else if (type === 'reverse') {
      setOutput(input.split('').reverse().join(''));
    }
  };

  // Formatting operations
  const formatText = (op: 'remove-spaces' | 'remove-newlines' | 'remove-duplicates' | 'trim') => {
    if (!input) return;
    if (op === 'remove-spaces') {
      setOutput(input.replace(/\s+/g, ' ').trim());
    } else if (op === 'remove-newlines') {
      setOutput(input.replace(/\n+/g, ' ').trim());
    } else if (op === 'remove-duplicates') {
      const lines = input.split('\n');
      const unique = Array.from(new Set(lines));
      setOutput(unique.join('\n'));
    } else if (op === 'trim') {
      setOutput(input.split('\n').map(l => l.trim()).join('\n'));
    }
  };

  // Lorem Ipsum generator
  const generateLorem = () => {
    const baseLorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const arr = [];
    for (let i = 0; i < paragraphs; i++) {
      arr.push(baseLorem);
    }
    setOutput(arr.join('\n\n'));
  };

  // Random text generator
  const generateRandomText = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let result = '';
    for (let i = 0; i < randLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setOutput(result);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Core Input / Output Layout */}
      {toolId !== 'lorem-ipsum' && toolId !== 'random-text-gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Text</label>
            <textarea
              className="w-full h-80 px-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
              placeholder="Paste or type your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Result Output</label>
            <div className="relative">
              <textarea
                className="w-full h-80 px-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 focus:outline-none text-xs"
                placeholder="Results will appear here..."
                value={output}
                readOnly
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear} className="text-xs">
                  <Trash className="w-3.5 h-3.5 text-red-500" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Specific Tool Actions panel */}
      {toolId === 'word-counter' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{stats.chars}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Characters</p>
          </Card>
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{stats.words}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Words</p>
          </Card>
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{stats.lines}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Lines</p>
          </Card>
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{stats.sentences}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Sentences</p>
          </Card>
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{stats.readTime} min</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Read Time</p>
          </Card>
        </div>
      )}

      {toolId === 'character-counter' && (
        <Card hoverEffect={false} className="p-5 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">Density & Sizing stats</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-400">Total length</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{stats.chars}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Spaces count</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {(input.match(/\s/g) || []).length}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Digits count</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {(input.match(/\d/g) || []).length}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Special symbols</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {(input.match(/[^a-zA-Z0-9\s]/g) || []).length}
              </p>
            </div>
          </div>
        </Card>
      )}

      {toolId === 'case-converter' && (
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => convertCase('upper')}>UPPERCASE</Button>
          <Button variant="secondary" size="sm" onClick={() => convertCase('lower')}>lowercase</Button>
          <Button variant="secondary" size="sm" onClick={() => convertCase('title')}>Title Case</Button>
          <Button variant="secondary" size="sm" onClick={() => convertCase('sentence')}>Sentence case</Button>
          <Button variant="secondary" size="sm" onClick={() => convertCase('camel')}>camelCase</Button>
        </div>
      )}

      {toolId === 'reverse-text' && (
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => convertCase('reverse')}>Reverse All Characters</Button>
        </div>
      )}

      {(toolId === 'text-formatter' || toolId === 'remove-spaces' || toolId === 'duplicate-remover') && (
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => formatText('remove-spaces')}>Collapse Multiple Spaces</Button>
          <Button variant="secondary" size="sm" onClick={() => formatText('remove-newlines')}>Collapse Line breaks</Button>
          <Button variant="secondary" size="sm" onClick={() => formatText('remove-duplicates')}>Remove Duplicate Lines</Button>
          <Button variant="secondary" size="sm" onClick={() => formatText('trim')}>Trim Line Endings</Button>
        </div>
      )}

      {toolId === 'readability-checker' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{readability.score}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Flesch Reading Ease</p>
          </Card>
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{readability.grade}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Grade Level</p>
          </Card>
          <Card hoverEffect={false} className="p-4 text-center border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-bold text-indigo-500">{readability.difficulty}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Readability Rank</p>
          </Card>
        </div>
      )}

      {toolId === 'lorem-ipsum' && (
        <Card hoverEffect={false} className="p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6 bg-white/60 dark:bg-slate-900/60 max-w-xl mx-auto">
          <h4 className="text-sm font-bold text-slate-850 dark:text-white">Lorem Ipsum generator configuration</h4>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                label="Number of Paragraphs"
                type="number"
                min={1}
                max={20}
                value={paragraphs}
                onChange={(e) => setParagraphs(Number(e.target.value))}
              />
            </div>
            <Button onClick={generateLorem} className="text-xs py-2.5">Generate Lorem</Button>
          </div>
          {output && (
            <div className="relative mt-6 border border-slate-250/20 rounded-xl overflow-hidden bg-slate-950 p-4">
              <pre className="text-xs text-slate-300 whitespace-pre-wrap text-left max-h-60 overflow-y-auto">{output}</pre>
              <div className="absolute top-2 right-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="text-[10px]">Copy</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {toolId === 'random-text-gen' && (
        <Card hoverEffect={false} className="p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6 bg-white/60 dark:bg-slate-900/60 max-w-xl mx-auto">
          <h4 className="text-sm font-bold text-slate-855 dark:text-white">Random String configuration</h4>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                label="String Length"
                type="number"
                min={10}
                max={2000}
                value={randLength}
                onChange={(e) => setRandLength(Number(e.target.value))}
              />
            </div>
            <Button onClick={generateRandomText} className="text-xs py-2.5">Generate Text</Button>
          </div>
          {output && (
            <div className="relative mt-6 border border-slate-250/20 rounded-xl overflow-hidden bg-slate-950 p-4">
              <pre className="text-xs text-slate-350 whitespace-pre-wrap break-all text-left max-h-60 overflow-y-auto">{output}</pre>
              <div className="absolute top-2 right-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="text-[10px]">Copy</Button>
              </div>
            </div>
          )}
        </Card>
      )}

    </div>
  );
};
export default TextTools;
