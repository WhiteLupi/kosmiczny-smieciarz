-- Kosmiczny Śmieciarz — reset leaderboard.
-- Wycina wszystkie istniejące przebiegi (śmieciowe wpisy 00:00 z dev-skip i
-- z pętli reset->finale->resubmit). Schema, polityki i indeksy zostają.
-- Uruchom w Supabase Dashboard → SQL Editor.
truncate table public.runs restart identity;
