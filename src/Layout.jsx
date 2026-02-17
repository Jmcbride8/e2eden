import React from 'react';
import UserMenu from './components/navigation/UserMenu';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50">
        <UserMenu />
      </div>
      {children}
    </div>
  );
}