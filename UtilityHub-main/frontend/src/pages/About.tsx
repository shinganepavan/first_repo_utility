import React from 'react';
import { Sparkles, Shield, Cpu, CloudLightning } from 'lucide-react';
import { Card } from '../components/common/Card';

export const About: React.FC = () => {
  const pillars = [
    {
      icon: Shield,
      title: 'Local Privacy First',
      desc: '95% of processing (formatting, compression, conversion) happens client-side in your browser. No files or strings leave your computer.',
    },
    {
      icon: CloudLightning,
      title: 'Ultra Low Latency',
      desc: 'By avoiding network hops for utility code, operations complete instantly, offline-ready with zero waiting.',
    },
    {
      icon: Cpu,
      title: 'AI Assisted Workflow',
      desc: 'Integrate text models directly into your workspace to write letters, summarize payloads, or explain complex scripts.',
    },
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 inline-flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          About UtilityHub AI System
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          UtilityHub AI is a professional developers and writers toolbox designed for speed, security, and portability. It replaces bookmarks, scattered online converters, and blackbox web services with a single, premium workbench.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pillars.map((p, idx) => (
          <Card key={idx} className="border border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col items-center text-center bg-white/50 dark:bg-slate-950/20">
            <span className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-4 inline-flex">
              <p.icon className="w-5 h-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
          </Card>
        ))}
      </div>

      {/* Performance section */}
      <Card hoverEffect={false} className="border border-indigo-500/20 dark:border-indigo-950/50 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 max-w-3xl mx-auto p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Progressive Web Application (PWA)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            UtilityHub AI runs offline and installs onto your operating system. Launch it directly from your applications drawer, configure custom keyboard hotkeys, and process code or text without internet access.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-fit text-center">
          <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-black text-indigo-500">66</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Ready Utilities</p>
          </div>
          <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-xl font-black text-indigo-500">0%</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">User Data Saved</p>
          </div>
        </div>
      </Card>

    </div>
  );
};
export default About;
