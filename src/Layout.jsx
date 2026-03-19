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
          <div className="relative group">
            <button className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
              The Innovations
            </button>
            <div className="absolute left-0 mt-0 w-48 bg-black/95 border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <Link to={createPageUrl("Technology")} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                Technology
              </Link>
              <Link to={createPageUrl("BusinessModel")} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                Business Model
              </Link>
              <Link to={createPageUrl("Innovators")} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                Innovators
              </Link>
            </div>
          </div>
          <Link to={createPageUrl("Roadmap")} className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
            Roadmap
          </Link>

          <Link to={createPageUrl("Partnerships")} className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
            Partnerships
          </Link>
        </nav>
        <TaskCounter />
        <UserMenu />
      </div>
      {children}
      <footer className="bg-black border-t border-white/10 mt-24">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-sm">
          <p>&copy; 2026 E2Eden. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to={createPageUrl("Contact")} className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
      <MobileNav />
    </div>
  );
}