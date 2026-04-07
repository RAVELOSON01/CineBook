import { Router } from 'express';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', authenticate, createMovie);
router.put('/:id', authenticate, updateMovie);
router.delete('/:id', authenticate, deleteMovie);

export default router;
