'use client';

import React, { useState } from 'react';
import { CommitHistory } from './CommitHistory';

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <button 
        onClick={toggleMenu} 
        className="fixed top-4 right-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded"
      >
        ☰
      </button>
      <main className="flex-auto min-w-0 flex flex-col h-screen">
        {children}
        <div 
          className={`fixed inset-y-0 right-0 w-64 bg-gray-800 p-5 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          } z-40`}
        >
          <button 
            onClick={toggleMenu} 
            className="absolute top-4 right-4 text-white"
          >
            ✕
          </button>
          <div className="mt-12">
            <CommitHistory />
          </div>
        </div>
        {menuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMenu}
          ></div>
        )}
      </main>
    </>
  );
}
