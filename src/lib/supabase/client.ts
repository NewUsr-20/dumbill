import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    // 1. Delete this URL and paste YOUR URL inside the single quotes
    'https://wgneoptptznkiighnedg.supabase.co', 
    
    // 2. Delete this key and paste YOUR ANON KEY inside the single quotes
    'sb_publishable_zN_YbrqL1Bi1G72UMHmu6g_TnALqPE_'
  )
}

/*import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}*/