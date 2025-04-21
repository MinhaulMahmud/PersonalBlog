import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      navigate('/admin');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Successful login will trigger the useEffect above through session change
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="y2k-gradient fixed inset-0 opacity-30"></div>
      <div className="max-w-md w-full space-y-8 relative">
        <div className="retro-card p-8 rounded-xl">
          <div className="text-center">
            <Lock className="mx-auto h-16 w-16 text-neon-purple animate-float" />
            <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-900 border-2 border-red-500 text-neon-pink px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="rounded-xl neo-border overflow-hidden">
              <div className="cyber-highlight">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 bg-black bg-opacity-50 text-neon-blue placeholder-neon-blue placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  placeholder="Email address"
                />
              </div>
              <div className="cyber-highlight">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-black bg-opacity-50 text-neon-blue placeholder-neon-blue placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Accessing Mainframe...' : 'Enter the Matrix'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}