import { createClient } from '@supabase/supabase-js';
export const supabaseUrl = 'https://viocclflxeizomapqxsm.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpb2NjbGZseGVpem9tYXBxeHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDUyNTAsImV4cCI6MjAyMzYyMTI1MH0.-CCGHZzqixiPGEBZFAaYebktTqM_2cvPu7Kv9jaw8so';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
