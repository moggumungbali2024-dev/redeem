import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Env Variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Checking rnf_partners table...");
  const { data, error } = await supabase.from('rnf_partners').select('*').limit(1);
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Successfully connected! Data sample:", data);
  }

  console.log("Checking rnf_settings table...");
  const { data: sData, error: sErr } = await supabase.from('rnf_settings').select('*').limit(1);
  if (sErr) {
    console.error("Settings Query Error:", sErr);
  } else {
    console.log("Settings Sample:", sData);
  }
}

test();
