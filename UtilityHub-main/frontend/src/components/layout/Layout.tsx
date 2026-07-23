import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] transition-colors duration-300">
      
      {/* Background blobs for premium glassmorphism feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-400/10 dark:bg-sky-500/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Header onMenuToggle={toggleSidebar} />
      
      <div className="flex-1 flex relative z-10">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Backdrop for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 z-20 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:pl-64 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
          <Footer />
        </main>

      </div>
    </div>
  );
};
export default Layout;
