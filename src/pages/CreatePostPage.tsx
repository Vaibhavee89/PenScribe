import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import { sendPublishNotification, processImage } from '../lib/api';

type PostFormData = {
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  published: boolean;
};

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PostFormData>();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .trim() + '-' + Math.floor(Math.random() * 1000);
  };

  const onSubmit = async (data: PostFormData) => {
    if (!user) return;

    setSaving(true);
    try {
      // Process cover image if exists
      let coverImage = data.cover_image;
      if (coverImage) {
        coverImage = await processImage(coverImage);
      }

      const slug = generateSlug(data.title);

      const { error, data: post } = await supabase.from('posts').insert({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        cover_image: coverImage,
        user_id: user.id,
        slug,
        published: data.published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select().single();

      if (error) throw error;

      // Initialize post stats
      await supabase.from('post_stats').insert({
        post_id: post.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Send notification if post is published
      if (data.published) {
        await sendPublishNotification(post.id, user.id);
      }

      showToast({
        type: 'success',
        message: data.published
          ? 'Post published successfully!'
          : 'Post saved as draft!',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
      showToast({
        type: 'error',
        message: 'Failed to create post. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setValue('cover_image', url);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
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
              Cover Image
            </label>
            <ImageUpload onUploadComplete={handleImageUpload} className="mb-2" />
            <input
              id="cover_image"
              type="text"
              {...register('cover_image')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Or enter image URL directly"
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
              Publish immediately
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
                'Save Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;