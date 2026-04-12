import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartHandshake, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primaryLight p-2 rounded-xl group-hover:bg-primary transition-colors">
                <HeartHandshake className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <span className="font-bold text-2xl text-slate-800 tracking-tight">MindfulPath</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-colors ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-500 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-6 border-l pl-8 border-slate-100">
                <Link
                  to="/dashboard"
                  className={`text-sm font-bold tracking-wide transition-colors ${
                    location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-500 hover:text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 text-slate-700">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-red-500 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-emerald-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-emerald-900/20 transform active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <Link
              to="/book"
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg transform active:scale-95"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-base font-bold text-slate-700 hover:text-primary hover:bg-emerald-50 rounded-2xl transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-slate-50 space-y-3">
            {user ? (
              <>
                <div className="px-4 py-2 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-slate-800">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-3 text-base font-bold text-red-500 hover:bg-red-50 rounded-2xl w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-primary text-white px-5 py-3 rounded-2xl font-bold"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/book"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
