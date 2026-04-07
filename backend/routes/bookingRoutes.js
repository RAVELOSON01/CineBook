import { Router } from 'express';
import { createIntent, confirmBooking, getConfig, retryIntent } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/config', authenticate, getConfig);
router.post('/create-intent', authenticate, createIntent);
router.post('/retry-intent', authenticate, retryIntent);
router.post('/confirm', authenticate, confirmBooking);

export default router;
