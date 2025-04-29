import { supabase } from './supabase';

export async function sendPublishNotification(postId: string, userId: string) {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: { post_id: postId, user_id: userId },
  });

  if (error) {
    console.error('Error sending notification:', error);
    throw error;
  }

  return data;
}

export async function processImage(imageUrl: string) {
  const { data, error } = await supabase.functions.invoke('process-image', {
    body: { image_url: imageUrl },
  });

  if (error) {
    console.error('Error processing image:', error);
    throw error;
  }

  return data.url;
}

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