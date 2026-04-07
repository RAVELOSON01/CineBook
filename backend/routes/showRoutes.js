import { Router } from 'express';
import { getShows, getShowSeats } from '../controllers/showController.js';

const router = Router();

router.get('/', getShows);
router.get('/:id/seats', getShowSeats);

export default router;
