import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../common/Toast';
import { CommandPalette } from '../common/CommandPalette';

export const Layout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      setIsCommandPaletteOpen((prev) => !prev);
    };
    window.addEventListener('toggle-command-palette', handleToggle);
    return () => window.removeEventListener('toggle-command-palette', handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      {/* Subtle Ambient Illumination */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[300px] bg-indigo-500/[0.03] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[300px] bg-emerald-500/[0.02] rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Sidebar (Responsive fixed/desktop) */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen transition-all duration-300">
        <Topbar onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 px-3.5 sm:px-5 lg:px-6 py-5 w-full mx-auto max-w-[1600px] overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
