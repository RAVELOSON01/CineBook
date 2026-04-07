import Stripe from 'stripe';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';

export const getConfig = async (req, res) => {
  try {
    const pubKey = (process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
    if (pubKey && !pubKey.startsWith('pk_')) {
      return res.status(400).json({ error: 'Invalid Publishable Key format. It must start with "pk_". Please check your AI Studio secrets.' });
    }
    res.json({ publishableKey: pubKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createIntent = async (req, res) => {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const pubKey = (process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
    
    if (secretKey && !secretKey.startsWith('sk_')) {
      return res.status(400).json({ error: 'Invalid Secret Key format. It must start with "sk_". Please check your AI Studio secrets.' });
    }
    if (pubKey && !pubKey.startsWith('pk_')) {
      return res.status(400).json({ error: 'Invalid Publishable Key format. It must start with "pk_". Please check your AI Studio secrets.' });
    }

    const { showId, seats } = req.body;
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ error: 'Show not found' });

    const totalAmount = show.price * seats.length;

    const existingBookings = await Booking.find({ showId, paymentStatus: { $in: ['Confirmed', 'Pending'] } });
    const bookedSeats = existingBookings.flatMap(b => b.seats);
    const unavailable = seats.filter(s => bookedSeats.includes(s));
    if (unavailable.length > 0) {
      return res.status(400).json({ error: `Seats ${unavailable.join(', ')} are already booked.` });
    }

    let clientSecret = 'mock_secret_for_demo';
    let paymentIntentId = 'mock_intent_id_' + Date.now();

    if (secretKey && pubKey) {
      try {
        const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount * 100,
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
          metadata: { userId: req.user.id, showId, seats: seats.join(',') }
        });
        clientSecret = paymentIntent.client_secret;
        paymentIntentId = paymentIntent.id;
      } catch (stripeErr) {
        console.error("Stripe initialization failed, falling back to demo mode:", stripeErr.message);
        // Fallback to mock secret if keys are invalid
      }
    }

    const booking = new Booking({
      userId: req.user.id,
      showId,
      seats,
      totalAmount,
      paymentStatus: 'Pending',
      paymentIntentId
    });
    await booking.save();

    res.json({ clientSecret, bookingId: booking._id, totalAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    booking.paymentStatus = 'Confirmed';
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const retryIntent = async (req, res) => {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('showId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    if (booking.paymentStatus === 'Confirmed') return res.status(400).json({ error: 'Already paid' });

    let clientSecret = 'mock_secret_for_demo';
    
    if (secretKey && secretKey.startsWith('sk_')) {
      try {
        const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
        const paymentIntent = await stripe.paymentIntents.create({
          amount: booking.totalAmount * 100,
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
          metadata: { userId: req.user.id, showId: booking.showId._id.toString(), bookingId: booking._id.toString() }
        });
        clientSecret = paymentIntent.client_secret;
        booking.paymentIntentId = paymentIntent.id;
        await booking.save();
      } catch (stripeErr) {
        console.error("Stripe initialization failed in retry:", stripeErr.message);
      }
    }

    res.json({ clientSecret, bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({ path: 'showId', populate: [{ path: 'movieId' }, { path: 'theaterId' }] })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
