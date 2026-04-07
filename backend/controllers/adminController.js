import axios from 'axios';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';
import Show from '../models/Show.js';

const TMDB_GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

export const seedDatabase = async (req, res) => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount > 0) return res.json({ message: 'Database already seeded' });

    const theater = await Theater.create({ name: 'Starlight Cinemas', location: 'Downtown' });
    const movie = await Movie.create({
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      duration: 148,
      genre: 'Sci-Fi',
      language: 'English',
      posterUrl: 'https://picsum.photos/seed/inception/400/600'
    });
    
    await Show.create({
      movieId: movie._id,
      theaterId: theater._id,
      showTime: new Date(Date.now() + 86400000),
      price: 15,
      totalSeats: 60
    });

    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const seedFromTMDB = async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'TMDB_API_KEY is not set. Please add it to your environment variables.' });
    }

    // Fetch "Now Playing" movies from TMDB
    const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`);
    const tmdbMovies = response.data.results.slice(0, 8); // Get top 8 movies

    // Clear existing data
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Theater.deleteMany({});

    const theater = await Theater.create({ name: 'Cineplex Central', location: 'Downtown' });

    for (const tmdbMovie of tmdbMovies) {
      const genreNames = tmdbMovie.genre_ids.map(id => TMDB_GENRES[id]).filter(Boolean).join(', ') || 'Unknown';
      
      const movie = await Movie.create({
        title: tmdbMovie.title,
        description: tmdbMovie.overview || 'No description available.',
        duration: Math.floor(Math.random() * (150 - 90 + 1)) + 90, // Random duration between 90-150 mins
        genre: genreNames,
        language: tmdbMovie.original_language.toUpperCase(),
        posterUrl: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      });

      // Create a couple of shows for each movie
      await Show.create({
        movieId: movie._id,
        theaterId: theater._id,
        showTime: new Date(Date.now() + 86400000), // Tomorrow
        price: 15,
        totalSeats: 100
      });
      
      await Show.create({
        movieId: movie._id,
        theaterId: theater._id,
        showTime: new Date(Date.now() + 86400000 + 10800000), // Tomorrow + 3 hours
        price: 12,
        totalSeats: 100
      });
    }

    res.json({ message: 'Successfully fetched and seeded movies from TMDB!' });
  } catch (err) {
    console.error('TMDB Seed Error:', err);
    res.status(500).json({ error: err.message });
  }
};
