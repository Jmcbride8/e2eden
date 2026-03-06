import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import UserMenu from './components/navigation/UserMenu';
import MobileNav from './components/navigation/MobileNav';
import TaskCounter from './components/navigation/TaskCounter.jsx';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-6 left-6 sm:top-8 sm:left-8 z-50">
        <Link to={createPageUrl("Home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/aba199569_Brand_Yellow.png"
            alt="E2Eden"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-amber-400 tracking-tight">E2Eden</h1>
            <p className="text-xs text-white/80">The Next Green Revolution</p>
          </div>
        </Link>
      </div>
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center gap-2">
        <nav className="hidden sm:flex items-center gap-1 mr-2">
          <Link to={createPageUrl("TheInnovations")} className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
            The Innovations
          </Link>
          <Link to={createPageUrl("Roadmap")} className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
            Roadmap
          </Link>
          <Link to={createPageUrl("Funding")} className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
            Funding
          </Link>
          <Link to={createPageUrl("Partnerships")} className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
            Partnerships
          </Link>
        </nav>
        <TaskCounter />
        <UserMenu />
      </div>
      {children}
      <MobileNav />
    </div>
  );
}