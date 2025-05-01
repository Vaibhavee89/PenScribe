import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, PenLine, ChevronDown, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const isHomePage = location.pathname === '/';
  const navbarClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage
      ? 'dark:bg-dark-800 dark:border-dark-700 bg-white shadow-md py-3'
      : 'bg-transparent py-5'
  }`;

  const linkClass = `font-medium transition-colors ${
    isScrolled || !isHomePage
      ? 'dark:text-gray-300 dark:hover:text-white text-gray-800 hover:text-primary-600'
      : 'text-white hover:text-primary-100'
  }`;

  const logoClass = `flex items-center gap-2 font-bold text-xl ${
    isScrolled || !isHomePage ? 'text-primary-800' : 'text-white'
  }`;

  return (
    <nav className={navbarClass}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className={logoClass}>
            <PenLine className="w-6 h-6" />
            <span>Pencraft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass}>
              Home
            </Link>
            {!user ? (
              <>
                <Link to="/sign-in" className={linkClass}>
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/create-post" className={linkClass}>
                  Write
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="flex items-center gap-2">
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <User size={20} className="text-primary-600" />
                        </div>
                      )}
                      <span className={linkClass}>
                        {user.user_metadata?.full_name || user.email}
                      </span>
                      <ChevronDown size={16} className={isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'} />
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10 animate-fade-in border border-gray-100">
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-gray-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-down bg-white rounded-lg shadow-lg">
            {user && (
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <User size={24} className="text-primary-600" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            )}
            <Link
              to="/"
              className="block py-2 text-gray-800 font-medium"
              onClick={closeMenu}
            >
              Home
            </Link>
            {!user ? (
              <>
                <Link
                  to="/sign-in"
                  className="block py-2 text-gray-800 font-medium"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="mt-2 block text-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-800 font-medium"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-800 font-medium"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/create-post"
                  className="block py-2 text-gray-800 font-medium"
                  onClick={closeMenu}
                >
                  Create Post
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="block w-full text-left py-2 text-gray-800 font-medium"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;