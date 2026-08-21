import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dnodktqjmrnyezujoius.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRub2RrdHFqbXJueWV6dWpvaXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjk1OTUsImV4cCI6MjA4NjcwNTU5NX0.8mMVmMBXuXHdk1bYFCruVBTX6Ivv-0bnRS5H3KY94o4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
