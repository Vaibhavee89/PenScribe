import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { showToast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Edit, Calendar, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Post = Database['public']['Tables']['posts']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Post not found or not published
            setLoading(false);
            return;
          }
          throw error;
        }

        setPost(data);

        // Fetch the author's profile
        if (data.user_id) {
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user_id)
            .single();

          if (authorError && authorError.code !== 'PGRST116') {
            throw authorError;
          }

          setAuthor(authorData);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        showToast({
          type: 'error',
          message: 'Failed to load post. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">
          The post you're looking for may not exist or is not published.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const postDate = new Date(post.created_at);

  // Split content into paragraphs
  const paragraphs = post.content.split('\n').filter(Boolean);

  return (
    <div className="pt-16">
      {/* Post Header with Cover Image */}
      <div className="relative h-96 bg-gray-900">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-800 to-primary-900" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-gray-200 gap-4">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <span>{format(postDate, 'MMMM d, yyyy')}</span>
              </div>
              {author && (
                <div className="flex items-center">
                  <User size={18} className="mr-2" />
                  <span>{author.full_name}</span>
                </div>
              )}
              {user && post.user_id === user.id && (
                <Link
                  to={`/edit-post/${post.id}`}
                  className="flex items-center text-primary-300 hover:text-primary-100 ml-2"
                >
                  <Edit size={18} className="mr-1" />
                  <span>Edit Post</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {post.excerpt && (
            <div className="mb-8 text-xl text-gray-700 italic border-l-4 border-primary-500 pl-4 py-2">
              {post.excerpt}
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">About the Author</h3>
              <div className="mt-4 flex items-start">
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={author.full_name || ''}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <h4 className="text-base font-medium text-gray-900">
                    {author.full_name}
                  </h4>
                  {author.bio && <p className="mt-1 text-gray-600">{author.bio}</p>}
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-primary-600 hover:text-primary-800 inline-block"
                    >
                      {author.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;