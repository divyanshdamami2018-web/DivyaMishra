import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartHandshake, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Therapy', path: '/therapy' },
    { name: 'Career', path: '/career' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100'
        : 'bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base text-slate-800 tracking-tight">Mental Health</span>
                <span className="font-semibold text-xs text-primary tracking-wide">with Divya Mishra</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'text-primary bg-primaryLight'
                    : 'text-slate-500 hover:text-primary hover:bg-primaryLight/60'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-100">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                      isActive('/dashboard') ? 'text-primary bg-primaryLight' : 'text-slate-500 hover:text-primary hover:bg-primaryLight/60'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin-panel"
                      className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                        isActive('/admin-panel') ? 'bg-primary text-white' : 'text-primary bg-primaryLight hover:bg-primary/20'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl">
                    <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors px-3 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary hover:bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <Link
                to="/book"
                className="bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-primary hover:bg-primaryLight rounded-xl focus:outline-none transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 text-base font-semibold rounded-2xl mb-1 transition-colors ${
                isActive(link.path)
                  ? 'text-primary bg-primaryLight'
                  : 'text-slate-700 hover:text-primary hover:bg-primaryLight/60'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <div className="px-4 py-2 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primaryLight rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-slate-800">{user.name}</span>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin-panel" className="block px-4 py-3 text-base font-bold text-primary bg-primaryLight rounded-2xl">
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="block px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-primaryLight/60 rounded-2xl">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-3 text-base font-semibold text-red-500 hover:bg-red-50 rounded-2xl w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full text-center px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-2xl">
                  Log In
                </Link>
                <Link to="/signup" className="block w-full text-center bg-primary text-white px-5 py-3 rounded-2xl font-bold">
                  Sign Up
                </Link>
              </>
            )}
            <Link to="/book" className="block w-full text-center bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
