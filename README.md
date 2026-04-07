# CineBook v2 🎬  
*A Full-Stack MERN Application for Movie Ticket Bookings*

Welcome to **CineBook v2**! This application fulfills the Full-Stack Project pre-requisites involving a MongoDB, Express, React, and Node.js architecture. It enables users to browse movie listings (populated dynamically from the TMDB API), select seats, checkout securely using Stripe, and manage their bookings.

## 🌟 Key Features

* **JWT Authentication**: User registration and login utilizing bcrypt hashed security and JSON Web Tokens.
* **Modern UI**: Fully responsive UI designed with Tailwind CSS, lucide-icons, and React context for state management.
* **Role-Based CRUD**: User dashboard for viewing bookings, and an Admin capability for syncing TMDB movies.
* **Payment Integration**: Secure Stripe checkout simulation utilizing Payment Elements, with a built-in fallback Demo Mode if keys are not present.
* **Vite + Express Configuration**: Run both backend and frontend efficiently using server-side Vite middlewares in development.

## 🏗️ Project Structure

```
cinebook v2
├── backend/                  # Node.js + Express Backend
│   ├── config/               # Database configurations
│   ├── controllers/          # Request handlers (movies, auth, admin, etc.)
│   ├── middleware/           # JWT and Role-validation middleware
│   ├── models/               # Mongoose schemas for User, Movie, Booking, Theater
│   ├── routes/               # API endpoints
│   └── server.js             # Main server entrypoint
│
├── frontend/                 # React Frontend via Vite
│   ├── src/                  # React components, pages, lib, context
│   ├── index.html            # App shell
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configurations
│
├── .env.example              # Environment variables template
├── package.json              # Root workspace management
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/en/) (v16+)
- [MongoDB](https://www.mongodb.com/) (running locally or a Cloud Atlas URI)

### 2. Environment Variables

Clone `.env.example` into a new `.env` file at the root.

```bash
cp .env.example .env
```

Set up these **Required Variables** inside your `.env`:
- `PORT`: (Default: `3000`)
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure string for generating JWT tokens.
- `TMDB_API_KEY`: API Key from [The Movie Database](https://developer.themoviedb.org/docs/getting-started).
- `STRIPE_SECRET_KEY`: Your Stripe secret key (optional).
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (optional).
*Note: If Stripe keys are omitted, the application falls back safely into "Demo Mode" during checkout!*

### 3. Install Dependencies

Install root workspace dependencies:
```bash
npm install
```

### 4. Running the Development Server

You can start **both** the Express API server and the Vite Frontend together with a single command!

```bash
npm run dev
```

This launches the server at `http://localhost:3000`. The Vite frontend will be seamlessly served alongside the API.

## 👨‍💻 Admin Capabilities & Fetching TMDB

By default, an ordinary registered user is granted the `user` role. If you want to enable **Admin Actions** (such as Syncing TMDB Movies):
1. Register a new account via the frontend.
2. Open your MongoDB GUI (e.g. MongoDB Compass) and locate your database (default `movie-booking`).
3. Locate the `users` collection, edit your User Document, and change the `role` field from `"user"` to `"admin"`.
4. Refresh your Dashboard page. You'll now see the **Sync TMDB Movies** button at the top header, which instantly seeds top-playing movies into the database!

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```
This commands your system to generate static artifacts for the frontend in `frontend/dist` and start the server aggressively resolving those files without requiring Vite middlewares.
