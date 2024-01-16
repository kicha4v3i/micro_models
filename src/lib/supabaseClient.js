import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://jccnczjfptwqcondbyph.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjY25jempmcHR3cWNvbmRieXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExMDMyNDEsImV4cCI6MjAxNjY3OTI0MX0.i8PfCm30AwfBz-C0LIDalDI33ap7flgVzdqS5-e8cf0')