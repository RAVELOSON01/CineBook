import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../lib/api.js';
import { Clock, PlayCircle } from 'lucide-react';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies');
        setMovies(res.data);
      } catch (err) {
        console.error('Failed to fetch movies', err);
        toast.error('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div className="text-center py-20">Loading movies...</div>;

  return (
    <div>
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Now Showing</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">Book tickets for the latest blockbusters and enjoy the ultimate cinematic experience.</p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="mb-6">No movies available right now.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => api.post('/admin/seed-tmdb').then(() => { toast.success('Movies seeded!'); window.location.reload(); }).catch(err => toast.error(err.response?.data?.error || 'Error seeding from TMDB'))}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              <PlayCircle size={20} /> Fetch Real Movies (TMDB)
            </button>
            <button 
              onClick={() => api.post('/admin/seed').then(() => { toast.success('Mock data seeded!'); window.location.reload(); })}
              className="text-zinc-400 hover:text-white underline px-4 py-2"
            >
              Use Mock Data
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map(movie => (
            <Link key={movie._id} to={`/movie/${movie._id}`} className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all">
              <div className="aspect-[2/3] w-full overflow-hidden">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold mb-1 line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span>{movie.genre}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {movie.duration}m</span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                <div className="bg-amber-500 text-zinc-950 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                  <PlayCircle size={20} /> Book Now
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
