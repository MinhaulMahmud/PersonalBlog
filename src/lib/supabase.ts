import { createClient } from '@supabase/supabase-js';

// Default configuration for development
const DEFAULT_CONFIG = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

// Try to get environment variables, fallback to defaults if not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_CONFIG.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_CONFIG.anonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add error handling for operations
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<T>
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const result = await operation();
    return { data: result, error: null };
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return { data: null, error: error as Error };
  }
};