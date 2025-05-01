import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, PenLine, Lightbulb, Users, Globe, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
};

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch featured posts
        const { data: featured, error: featuredError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .eq('published', true)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (featuredError) throw featuredError;
        setFeaturedPosts(featured || []);

        // Fetch recent posts
        const { data: recent, error: recentError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentError) throw recentError;
        setRecentPosts(recent || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const RecentPostsSection = () => (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Publications
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest stories from our community
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <LoadingSpinner size="large" />
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img
                      src={post.cover_image || 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {post.profiles?.avatar_url ? (
                        <img
                          src={post.profiles.avatar_url}
                          alt={post.profiles.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User size={20} className="text-primary-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {post.profiles?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt || post.content.substring(0, 120) + '...'}
                    </p>
                    <span className="text-primary-600 font-medium inline-flex items-center group-hover:text-primary-700">
                      Read more <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No posts published yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-900 pt-32 pb-20 md:pt-40 md:pb-32 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Tell Your Story to the World
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-10">
              Create, share, and grow with your persolnal blogging platform built for young creator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/SignUpPage"
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
              >
                Start Writing
              </Link>
              <Link
                to="#features"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Pencraft?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to create, share and grow your blog.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-6">
                <PenLine size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Intuitive Editor
              </h3>
              <p className="text-gray-600 mb-4">
                A powerful and intuitive editor that makes writing and formatting your content a breeze.
              </p>
              <Link
                to="#"
                className="text-primary-600 font-medium inline-flex items-center hover:text-primary-700"
              >
                Learn more <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 mb-6">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Smart Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Get actionable insights about your audience and content performance.
              </p>
              <Link
                to="#"
                className="text-primary-600 font-medium inline-flex items-center hover:text-primary-700"
              >
                Learn more <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Global Reach
              </h3>
              <p className="text-gray-600 mb-4">
                Share your ideas with readers from around the world and build your audience.
              </p>
              <Link
                to="#"
                className="text-primary-600 font-medium inline-flex items-center hover:text-primary-700"
              >
                Learn more <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover thought-provoking content from our community.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center my-12">
              <LoadingSpinner size="large" />
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <img
                        src={post.cover_image || 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt || post.content.substring(0, 120) + '...'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-primary-600 font-medium inline-flex items-center group-hover:text-primary-700">
                          Read more <ChevronRight size={16} className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No featured posts yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      <RecentPostsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Writing Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              Join thousands of writers and share your perspective with the world.
            </p>
            <Link
              to="/sign-up"
              className="bg-white text-primary-800 hover:bg-primary-50 px-8 py-3 rounded-md font-medium text-lg inline-block transition-colors"
            >
              Create Your Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;