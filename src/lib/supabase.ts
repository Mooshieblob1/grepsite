import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Create a mock client if env vars are missing (for demo/development)
let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found - using fallback mode");
  
  // Create a mock supabase client for demo purposes
  supabase = {
    from: (table: string) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null })
    }),
    auth: {
      signIn: () => ({ user: null, error: null }),
      signOut: () => ({ error: null }),
      user: () => null
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
