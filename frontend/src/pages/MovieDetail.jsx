import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api.js';
import { Clock, Calendar, MapPin } from 'lucide-react';

export const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/shows?movieId=${id}`)
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch (err) {
        console.error('Failed to fetch details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!movie) return <div className="text-center py-20">Movie not found</div>;

  // Group shows by date
  const showsByDate = shows.reduce((acc, show) => {
    const date = new Date(show.showTime).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(show);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/3 shrink-0">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full rounded-xl shadow-2xl shadow-amber-500/10"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6">
            <span className="bg-zinc-800 px-3 py-1 rounded-full">{movie.genre}</span>
            <span className="bg-zinc-800 px-3 py-1 rounded-full">{movie.language}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {movie.duration} mins</span>
          </div>
          <p className="text-lg text-zinc-300 leading-relaxed mb-8">{movie.description}</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-800">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calendar className="text-amber-500" /> Show Timings
        </h2>
        
        {Object.keys(showsByDate).length === 0 ? (
          <p className="text-zinc-500">No shows scheduled for this movie currently.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(showsByDate).map(([date, dayShows]) => (
              <div key={date}>
                <h3 className="text-xl font-semibold mb-4 text-amber-400">{date}</h3>
                <div className="grid gap-4">
                  {dayShows.map(show => (
                    <div key={show._id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                      <div className="mb-4 sm:mb-0">
                        <div className="font-medium text-lg flex items-center gap-2">
                          {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {show.theaterId.name}, {show.theaterId.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold">${show.price}</div>
                        <Link 
                          to={`/show/${show._id}/seats`}
                          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-6 py-2 rounded-lg font-bold transition-colors text-center"
                        >
                          Select Seats
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
