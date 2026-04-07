import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import { Ticket, Calendar, MapPin, Clock, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils.js';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/user/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-20">Loading your tickets...</div>;

  const handleSyncTMDB = async () => {
    try {
      setSyncing(true);
      await api.post('/admin/seed-tmdb');
      alert('TMDB Movies Synced Successfully!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to sync movies');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tickets</h1>
        {user?.role === 'admin' && (
          <button 
            onClick={handleSyncTMDB} 
            disabled={syncing}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
          >
            {syncing ? 'Syncing...' : 'Sync TMDB Movies'}
          </button>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="bg-zinc-900 p-12 rounded-2xl border border-zinc-800 text-center">
          <Ticket size={48} className="mx-auto text-zinc-700 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tickets found</h2>
          <p className="text-zinc-500">You haven't booked any movies yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map(booking => {
            const showDate = new Date(booking.showId.showTime);
            const isPast = showDate < new Date();

            return (
              <div 
                key={booking._id} 
                className={cn(
                  "flex flex-col md:flex-row bg-zinc-900 rounded-2xl border overflow-hidden",
                  isPast ? "border-zinc-800 opacity-60" : "border-zinc-700"
                )}
              >
                <div className="w-full md:w-48 shrink-0">
                  <img 
                    src={booking.showId.movieId.posterUrl} 
                    alt={booking.showId.movieId.title} 
                    className="w-full h-full object-cover aspect-[2/3] md:aspect-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold">{booking.showId.movieId.title}</h2>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                        booking.paymentStatus === 'Confirmed' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-400 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-amber-500" />
                        <span>{showDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-amber-500" />
                        <span>{showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin size={16} className="text-amber-500" />
                        <span>{booking.showId.theaterId.name}, {booking.showId.theaterId.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                    <div>
                      <span className="text-sm text-zinc-500 block mb-1">Seats</span>
                      <div className="flex flex-wrap gap-2">
                        {booking.seats.map(seat => (
                          <span key={seat} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-sm font-mono">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      {booking.paymentStatus === 'Pending' && !isPast && (
                        <button
                          onClick={() => navigate('/checkout', { state: { showId: booking.showId._id, seats: booking.seats, bookingId: booking._id } })}
                          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 text-sm"
                        >
                          <CreditCard size={16} /> Pay Now
                        </button>
                      )}
                      <div>
                        <span className="text-sm text-zinc-500 block mb-1">Total {booking.paymentStatus === 'Pending' ? 'Due' : 'Paid'}</span>
                        <span className="text-xl font-bold">${booking.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
