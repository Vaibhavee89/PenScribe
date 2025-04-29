import { serve } from 'https://deno.land/std@0.200.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { SMTPClient } from 'npm:emailjs@4.0.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const smtp = new SMTPClient({
  user: Deno.env.get('SMTP_USER'),
  password: Deno.env.get('SMTP_PASSWORD'),
  host: Deno.env.get('SMTP_HOST'),
  port: 587,
  tls: true,
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { post_id, user_id } = await req.json();

    // Get post and user details
    const { data: post } = await supabase
      .from('posts')
      .select('title, slug')
      .eq('id', post_id)
      .single();

    const { data: user } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single();

    const { data: settings } = await supabase
      .from('notification_settings')
      .select('email_notifications')
      .eq('user_id', user_id)
      .single();

    if (!post || !user || !settings?.email_notifications) {
      return new Response(
        JSON.stringify({ message: 'Notification not required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email
    await smtp.send({
      from: 'noreply@yourblog.com',
      to: user.email,
      subject: `Your post "${post.title}" has been published!`,
      text: `Hello ${user.full_name},\n\nYour post "${post.title}" has been published successfully!\n\nView it here: ${Deno.env.get('PUBLIC_URL')}/post/${post.slug}`,
    });

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send notification' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});