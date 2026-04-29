-- Fix: public.helena_stats view was defined as SECURITY DEFINER (Postgres default for views).
-- That bypasses RLS — view runs with creator's privileges instead of caller's.
-- Switch to SECURITY INVOKER so the view respects RLS of the querying user.
-- Run once in Supabase Dashboard → SQL Editor → paste → Run.
-- Idempotent: safe to re-run.

alter view public.helena_stats set (security_invoker = true);

-- Verify with:
--   select schemaname, viewname, viewowner from pg_views where viewname = 'helena_stats';
--   select c.relname, c.reloptions from pg_class c where c.relname = 'helena_stats';
