import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { cn } from '../lib/utils.js';
import { Monitor } from 'lucide-react';

export const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate a simple 10x10 grid
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await api.get(`/shows/${id}/seats`);
        setBookedSeats(res.data.bookedSeats);
      } catch (err) {
        console.error('Failed to fetch seats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [id]);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    navigate('/checkout', { state: { showId: id, seats: selectedSeats } });
  };

  if (loading) return <div className="text-center py-20">Loading seats...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Select Your Seats</h1>
        <p className="text-zinc-400">Choose your preferred seats for the show.</p>
      </div>

      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Screen */}
          <div className="mb-12 text-center">
            <div className="h-2 w-3/4 mx-auto bg-gradient-to-b from-amber-500 to-transparent rounded-t-full opacity-50 blur-[2px]" />
            <div className="h-1 w-3/4 mx-auto bg-amber-400 rounded-t-full shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
            <p className="text-zinc-500 text-sm mt-4 flex items-center justify-center gap-2 uppercase tracking-widest">
              <Monitor size={16} /> Screen
            </p>
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col gap-4 items-center">
            {rows.map(row => (
              <div key={row} className="flex items-center gap-4">
                <div className="w-6 text-center text-zinc-500 font-mono">{row}</div>
                <div className="flex gap-2">
                  {cols.map(col => {
                    const seatId = `${row}${col}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    // Add a gap in the middle for an aisle
                    const isAisle = col === 5;

                    return (
                      <React.Fragment key={seatId}>
                        <button
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatId)}
                          className={cn(
                            "w-8 h-8 rounded-t-lg rounded-b-sm text-xs font-mono transition-all duration-200",
                            isBooked 
                              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" 
                              : isSelected 
                                ? "bg-amber-500 text-zinc-950 shadow-[0_0_10px_rgba(251,191,36,0.4)] scale-110" 
                                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                          )}
                        >
                          {col}
                        </button>
                        {isAisle && <div className="w-6" />}
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="w-6 text-center text-zinc-500 font-mono">{row}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Action */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="flex gap-6 mb-6 md:mb-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg rounded-b-sm bg-zinc-700" />
            <span className="text-sm text-zinc-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg rounded-b-sm bg-amber-500" />
            <span className="text-sm text-zinc-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg rounded-b-sm bg-zinc-800" />
            <span className="text-sm text-zinc-400">Booked</span>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="text-right flex-1 md:flex-none">
            <div className="text-sm text-zinc-400">Selected Seats</div>
            <div className="font-bold text-xl">{selectedSeats.length || 0}</div>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 px-8 py-3 rounded-lg font-bold transition-colors w-full md:w-auto"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};
