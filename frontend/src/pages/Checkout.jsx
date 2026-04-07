import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../lib/api.js';
import { CheckCircle, AlertTriangle } from 'lucide-react';

// Cache the stripe promise outside the component so it doesn't get recreated
// on React Strict Mode re-renders, which destroys the Elements store.
let stripePromiseCache = null;

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !isReady) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // elements.submit() is required before confirmPayment when using PaymentElement
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        // Note: clientSecret is intentionally omitted here because it was already passed to <Elements>
        confirmParams: {
          return_url: window.location.origin + '/dashboard',
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        setError(confirmError.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await onSuccess();
      } else {
        setError('Payment processing. Please check your dashboard later.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement onReady={() => setIsReady(true)} />
      {!isReady && (
        <div className="text-sm text-zinc-400 text-center animate-pulse py-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
          Loading secure payment fields...
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        disabled={!isReady || isProcessing || !stripe || !elements}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 px-6 py-4 rounded-lg font-bold transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showId, seats, bookingId: existingBookingId } = location.state || { showId: null, seats: [], bookingId: null };

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [bookingId, setBookingId] = useState(existingBookingId);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Guard against React 18 Strict Mode double-mounting
  const initialized = useRef(false);

  useEffect(() => {
    if (!showId || seats.length === 0) {
      navigate('/');
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    const createIntent = async () => {
      try {
        const configRes = await api.get('/bookings/config');
        if (configRes.data.publishableKey) {
          if (!stripePromiseCache) {
            stripePromiseCache = loadStripe(configRes.data.publishableKey);
          }
          setStripePromise(stripePromiseCache);
        }

        let res;
        if (existingBookingId) {
          res = await api.post('/bookings/retry-intent', { bookingId: existingBookingId });
        } else {
          res = await api.post('/bookings/create-intent', { showId, seats });
        }

        setClientSecret(res.data.clientSecret);
        if (!existingBookingId) setBookingId(res.data.bookingId);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to initialize payment.');
      }
    };

    createIntent();
  }, [showId, seats, navigate]);

  const handlePaymentSuccess = async () => {
    try {
      await api.post('/bookings/confirm', { bookingId });
      setSuccess(true);
    } catch (err) {
      setError('Payment succeeded, but failed to confirm booking on our server.');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
        <p className="text-zinc-400 mb-8">Your tickets have been successfully booked. You can view them in your dashboard.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-8 py-3 rounded-lg font-bold transition-colors"
        >
          View My Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-zinc-800 pb-4">Order Summary</h2>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-zinc-400">
            <span>Seats</span>
            <span className="font-mono text-white">{seats.join(', ')}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Ticket Count</span>
            <span className="text-white">{seats.length}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {clientSecret && stripePromise ? (
          <div className="mt-8">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <CheckoutForm onSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 animate-pulse">
            Loading secure payment...
          </div>
        )}
      </div>
    </div>
  );
};
