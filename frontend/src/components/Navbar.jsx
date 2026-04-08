import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Film, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-amber-400">
            <Film size={28} />
            <span>CineBook</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-amber-400 transition-colors">Movies</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                  <UserIcon size={18} />
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-amber-400 transition-colors">Login</Link>
                <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-zinc-900 px-4 py-2 rounded-md font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <div className="px-4 py-4 space-y-3 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-amber-400 transition-colors text-lg">Movies</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-amber-400 transition-colors text-lg">
                  <UserIcon size={20} />
                  <span>{user.name}'s Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors text-lg"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-amber-400 transition-colors text-lg">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md bg-amber-500 text-zinc-900 font-medium hover:bg-amber-600 transition-colors mt-2 text-center text-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
