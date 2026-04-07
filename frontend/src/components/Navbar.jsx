import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Film, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
          
          <div className="flex items-center gap-6">
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
        </div>
      </div>
    </nav>
  );
};
