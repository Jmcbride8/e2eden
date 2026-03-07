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
      <footer className="bg-black border-t border-white/10 mt-24">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link to={createPageUrl("TheInnovations")} className="hover:text-white transition-colors">The Innovations</Link></li>
                <li><Link to={createPageUrl("Roadmap")} className="hover:text-white transition-colors">Roadmap</Link></li>
                <li><Link to={createPageUrl("Projects")} className="hover:text-white transition-colors">Projects</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link to={createPageUrl("About")} className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="mailto:hello@e2eden.com" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Partnerships</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link to={createPageUrl("Partnerships")} className="hover:text-white transition-colors">Partner With Us</Link></li>
                <li><Link to={createPageUrl("Funding")} className="hover:text-white transition-colors">Investment</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Opportunities</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">&copy; 2026 E2Eden. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">LinkedIn</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
      <MobileNav />
    </div>
  );
}