import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Sharp from 'npm:sharp@0.32.6';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { image_url } = await req.json();

    // Download image
    const response = await fetch(image_url);
    const imageBuffer = await response.arrayBuffer();

    // Process image
    const processedBuffer = await Sharp(imageBuffer)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload processed image
    const fileName = `processed-${Date.now()}.jpg`;
    const { error: uploadError, data } = await supabase.storage
      .from('blog-images')
      .upload(`processed/${fileName}`, processedBuffer, {
        contentType: 'image/jpeg',
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(`processed/${fileName}`);

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process image' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});