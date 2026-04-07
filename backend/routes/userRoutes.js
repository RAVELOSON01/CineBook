import { Router } from 'express';
import { getUserBookings } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/bookings', authenticate, getUserBookings);

export default router;
