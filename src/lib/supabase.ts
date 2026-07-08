import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cijticsinhqcvqgcwcab.supabase.co';
const supabaseKey = 'sb_publishable_C53DCQsPu6LawOeFutiARw_qvzgHKOH';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);  