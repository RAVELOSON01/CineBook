import Show from '../models/Show.js';
import Booking from '../models/Booking.js';

export const getShows = async (req, res) => {
  try {
    const { movieId } = req.query;
    const query = movieId ? { movieId } : {};
    const shows = await Show.find(query).populate('theaterId').sort({ showTime: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getShowSeats = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ error: 'Show not found' });

    const bookings = await Booking.find({ showId: show._id, paymentStatus: { $in: ['Confirmed', 'Pending'] } });
    const bookedSeats = bookings.flatMap(b => b.seats);

    res.json({ totalSeats: show.totalSeats, bookedSeats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
