import { createClient } from '@supabase/supabase-js';

// Check if configured
const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholders to prevent crash if env vars are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Create real client if configured, otherwise create a mock
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signInWithPassword: async ({ email, password }: any) => {
          console.log('Mock SignIn:', email);
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (email && password) {
             return { 
               data: { 
                 user: { id: 'mock-user-id', email: email }, 
                 session: { access_token: 'mock-token' } 
               }, 
               error: null 
             };
          }
          return { data: { user: null, session: null }, error: { message: 'Invalid credentials' } };
        },
        signUp: async ({ email, password }: any) => {
          console.log('Mock SignUp:', email);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { 
             data: { 
               user: { id: 'mock-user-id', email: email }, 
               session: { access_token: 'mock-token' } 
             }, 
             error: null 
           };
        },
        getUser: async (token: string) => {
          if (token === 'mock-token') {
            return { data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null };
          }
          return { data: { user: null }, error: { message: 'Invalid token' } };
        },
        signOut: async () => {
          return { error: null };
        },
        onAuthStateChange: (callback: any) => {
           // Mock subscription
           // callback('SIGNED_IN', { user: { id: 'mock-user-id' } });
           return { data: { subscription: { unsubscribe: () => {} } } };
        },
        getSession: async () => {
           return { data: { session: null }, error: null };
        }
      },
      from: (table: string) => {
        return {
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: [], error: null }),
          update: () => Promise.resolve({ data: [], error: null }),
          delete: () => Promise.resolve({ data: [], error: null }),
        }
      }
    } as any;

export const isSupabaseConfigured = () => isConfigured;
