import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, PenLine, ChevronDown, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <PenLine />
            <span>Pencraft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            {!user ? (
              <>
                <Link to="/sign-in" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
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
                <span className="text-gray-600 dark:text-gray-300">
                  {user.email}
                </span>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Account <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-10 animate-fade-in">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/create-post"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Create Post
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="text-gray-600 dark:text-gray-300 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-down">
            <Link
              to="/"
              className="block py-2 text-gray-600 dark:text-gray-300"
              onClick={closeMenu}
            >
              Home
            </Link>
            {!user ? (
              <>
                <Link
                  to="/sign-in"
                  className="block py-2 text-gray-600 dark:text-gray-300"
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
                <div className="py-2 text-gray-600 dark:text-gray-300">
                  {user.email}
                </div>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-600 dark:text-gray-300"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-600 dark:text-gray-300"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/create-post"
                  className="block py-2 text-gray-600 dark:text-gray-300"
                  onClick={closeMenu}
                >
                  Create Post
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="block w-full text-left py-2 text-gray-600 dark:text-gray-300"
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