import React from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <main className="relative">{children}</main>
      <footer className="relative bg-sky-50 dark:bg-slate-800 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sky-600 dark:text-sky-400 text-sm">
            © {new Date().getFullYear()} AI Insights. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}