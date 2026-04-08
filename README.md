# CineBook

CineBook is a full-stack MERN application that provides a modern, seamless experience for browsing movie listings and booking tickets. Designed with responsiveness and ease of use in mind, it integrates a rich feature set spanning front-end aesthetics to secure back-end payment processing.

## 🚀 Features

- **Dynamic Movie Listings:** Fetches real movie datasets dynamically utilizing the TMDB API.
- **Seat Selection Engine:** Intuitive, interactive UI to select seats and visualize booked/available seating.
- **Secure Authentication:** JWT-based robust authentication and authorization with role-based access control (Admin/User).
- **Stripe Payment Integration:** Secure and simple checkout pipeline simulating real-world booking payments.
- **Responsive Design:** A beautifully styled, fully responsive frontend using Tailwind CSS for all device sizes, including a mobile-friendly collapsing navigation bar.
- **Dashboard Management:** Users can view their past and upcoming tickets, check payment statuses, and retry failed payments.
- **Admin Capabilities:** Authorized users have the ability to sync new movies from TMDB with a single click.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Payments:** Stripe API

## 📋 Prerequisites

Please ensure that you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or a cloud MongoDB Atlas URI)
- Git

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cinebook.git
   cd cinebook
   ```

2. **Install all dependencies:**
   This project uses a root workspace configuration. From the root directory, simply run:
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the provided `.env.example` file to a new `.env` file at the root of your project:
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables in your `.env` file:
   - `PORT`: (Default: `3000`)
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure string for generating JWT tokens.
   - `TMDB_API_KEY`: API Key from [The Movie Database](https://developer.themoviedb.org/).
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (optional).
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (optional).
   > **Note:** If Stripe keys are omitted, the application securely falls back to a built-in "Demo Mode" for payments!

4. **Run the Development Server:**
   Start the development server (runs both the frontend Vite sever and backend Express server concurrently):
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

## 👨‍💻 Admin Setup

To utilize admin features (e.g., Syncing movies from TMDB):
1. Sign up for a new account through the web interface.
2. Open your MongoDB GUI (e.g., MongoDB Compass) and locate your newly created user document in the `users` collection.
3. Update the `role` field from `"user"` to `"admin"`.
4. Refresh your dashboard to see the **Sync TMDB Movies** button at the top right corner.

## 📦 Production Build

To generate an optimized build for production deployment:
```bash
npm run build
npm start
```
This correctly compiles the Vite frontend and configures Express to statically serve the built React application.
