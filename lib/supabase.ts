import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxcztxyzskewgernopyh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Y3p0eHl6c2tld2dlcm5vcHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzY3MjQsImV4cCI6MjA1OTQ1MjcyNH0.X9FjnB2FDtfGf0m4P6yNsyiQIL871zfe73kt_bfiQVA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 