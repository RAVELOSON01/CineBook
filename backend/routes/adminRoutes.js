import { Router } from 'express';
import { seedDatabase, seedFromTMDB } from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/seed', authenticate, isAdmin, seedDatabase);
router.post('/seed-tmdb', authenticate, isAdmin, seedFromTMDB);

export default router;
