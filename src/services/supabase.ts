import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_ID = 'dnqrcttcjnkdawjgtdtz';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_j1bEh1KbYKgQSSQGcog61w_NX7p3_Kj';

export const supabaseUrl: string =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;

export const supabaseAnonKey: string =
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

export const supabaseProjectId: string = SUPABASE_PROJECT_ID;


let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return clientInstance;
}

export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  message: string;
  tablesFound: string[];
}> {
  try {
    const res = await fetch('/api/supabase/status');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback client check
  }

  try {
    const client = getSupabase();
    const { error } = await client.from('parlors').select('id').limit(1);
    return {
      connected: !error,
      projectId: SUPABASE_PROJECT_ID,
      url: supabaseUrl,
      message: !error ? 'Connected to Supabase' : error.message,
      tablesFound: !error ? ['parlors'] : []
    };
  } catch (e: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      url: supabaseUrl,
      message: e.message || 'Connection failed',
      tablesFound: []
    };
  }
}
