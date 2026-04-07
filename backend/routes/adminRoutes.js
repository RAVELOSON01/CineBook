import { Router } from 'express';
import { seedDatabase, seedFromTMDB } from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/seed', seedDatabase);
router.post('/seed-tmdb', seedFromTMDB);

export default router;
