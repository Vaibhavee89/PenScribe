import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, PenLine, ChevronDown } from 'lucide-react';

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
      ? 'bg-white shadow-md py-3'
      : 'bg-transparent py-5'
  }`;

  const linkClass = `font-medium transition-colors ${
    isScrolled || !isHomePage
      ? 'text-gray-800 hover:text-primary-600'
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
            <PenLine />
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
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <span className={`${linkClass} cursor-default`}>
                  {user.email}
                </span>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center gap-1 ${linkClass}`}
                  >
                    Account <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 animate-fade-in">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/create-post"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Create Post
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-down">
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
                <div className="py-2 text-gray-800 font-medium">
                  {user.email}
                </div>
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