import { createClient } from '@supabase/supabase-js';

// Public credentials — safe to expose in client code.
// Security is enforced via Supabase Row Level Security (RLS).
const supabaseUrl = 'https://kvsswktjebgvjvbyrjob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c3N3a3RqZWJndmp2Ynlyam9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDg2NTIsImV4cCI6MjA5NzA4NDY1Mn0.mML7w5gmqzG0NQCpotHNJSDHUL2GZfjbTq4qAm5ZQYs';

export const isSupabaseConfigured = true;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
