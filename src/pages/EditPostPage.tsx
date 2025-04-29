import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Database } from '../types/supabase';

type Post = Database['public']['Tables']['posts']['Row'];

type PostFormData = {
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  published: boolean;
};

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data.user_id !== user.id) {
          showToast({
            type: 'error',
            message: 'You do not have permission to edit this post',
          });
          navigate('/dashboard');
          return;
        }

        setPost(data);
        reset({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || '',
          cover_image: data.cover_image || '',
          published: data.published,
        });
      } catch (error) {
        console.error('Error fetching post:', error);
        showToast({
          type: 'error',
          message: 'Failed to load post. Please try again.',
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate, reset]);

  const onSubmit = async (data: PostFormData) => {
    if (!user || !post) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          cover_image: data.cover_image,
          published: data.published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (error) throw error;

      showToast({
        type: 'success',
        message: 'Post updated successfully!',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      showToast({
        type: 'error',
        message: 'Failed to update post. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Post Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title', {
                required: 'Title is required',
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.title ? 'border-error-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="cover_image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cover Image URL
            </label>
            <input
              id="cover_image"
              type="text"
              {...register('cover_image')}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={2}
              {...register('excerpt')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="A short summary of your post"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={12}
              {...register('content', {
                required: 'Content is required',
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.content ? 'border-error-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-sm text-error-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              {...register('published')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="published"
              className="ml-2 block text-sm text-gray-700"
            >
              Published
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Saving...
                </>
              ) : (
                'Update Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;