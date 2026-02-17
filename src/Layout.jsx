import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import UserMenu from './components/navigation/UserMenu';

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
            <p className="text-xs text-white/30">The Next Green Revolution</p>
          </div>
        </Link>
      </div>
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50">
        <UserMenu />
      </div>
      {children}
    </div>
  );
}