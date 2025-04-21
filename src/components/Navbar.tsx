import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-sky-100 dark:border-sky-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Brain className="h-8 w-8 text-sky-500 dark:text-sky-400" />
              <span className="ml-2 text-xl font-bold text-sky-900 dark:text-sky-100">
                AISurfer Blog
              </span>
            </Link>
            <div className="hidden md:flex items-center ml-10 space-x-8">
              <Link to="/blog" className="text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400">
                Blog
              </Link>
              <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400"
                >
                  <User className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-sky-100 dark:border-sky-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}