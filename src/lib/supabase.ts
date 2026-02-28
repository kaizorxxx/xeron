import { createClient } from '@supabase/supabase-js';

// Use placeholders to prevent crash if env vars are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nfwtvtwsjuezxtajbdor.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5md3R2dHdzanVlenh0YWpiZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTI4MDksImV4cCI6MjA4Nzg2ODgwOX0.uRFVCMJk0BFKcMt-ojSjif2zyad8tfkkSto1SXUzap8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
};
