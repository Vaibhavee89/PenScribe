import { supabase } from './supabase';

export async function incrementPostStats(postId: string, field: 'views' | 'likes' | 'shares') {
  const { data: existingStats } = await supabase
    .from('post_stats')
    .select('*')
    .eq('post_id', postId)
    .single();

  if (!existingStats) {
    await supabase
      .from('post_stats')
      .insert({ post_id: postId, [field]: 1 });
  } else {
    await supabase
      .from('post_stats')
      .update({ [field]: existingStats[field] + 1, updated_at: new Date().toISOString() })
      .eq('post_id', postId);
  }
}