import { supabase } from '@/lib/supabase';

export interface RunRow {
  id: string;
  user_id: string | null;
  display_name: string;
  finished_at: string;
  correct: number;
  errors: number;
  time_seconds: number;
  ending_choice: 'collect' | 'refuse';
  helena_passed: boolean;
  f17b_solved: boolean;
  arbiter_clues: number;
}

export interface HelenaStats {
  passed: number;
  failed: number;
  total: number;
}

export interface SubmitRunInput {
  userId: string | null;
  displayName: string;
  correct: number;
  errors: number;
  timeSeconds: number;
  endingChoice: 'collect' | 'refuse';
  helenaPassed: boolean;
  f17bSolved: boolean;
  arbiterClues: number;
}

export async function submitRun(input: SubmitRunInput): Promise<RunRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('runs')
    .insert({
      user_id: input.userId,
      display_name: input.displayName.slice(0, 40),
      correct: input.correct,
      errors: input.errors,
      time_seconds: input.timeSeconds,
      ending_choice: input.endingChoice,
      helena_passed: input.helenaPassed,
      f17b_solved: input.f17bSolved,
      arbiter_clues: input.arbiterClues,
    })
    .select()
    .single();
  if (error || !data) return null;
  return data as RunRow;
}

export async function getTopRuns(limit = 10): Promise<RunRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .order('time_seconds', { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return data as RunRow[];
}

export async function getHelenaStats(): Promise<HelenaStats | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('helena_stats').select('*').maybeSingle();
  if (error || !data) return null;
  return data as HelenaStats;
}
