import express from 'express';
import * as dotenv from 'dotenv';
import hotelsRouter from './routes/hotels';
import roomsRouter from './routes/rooms';
import bookingsRouter from './routes/bookings';
import authMiddleware from './middleware/authMiddleware';
import authRouter from './routes/auth';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = Number(process.env.PORT) || 8080;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('Hospitality Solution API is running!');
});

// Routes
app.use('/auth', authRouter);
app.use('/hotels', authMiddleware, hotelsRouter);
app.use('/rooms', authMiddleware, roomsRouter);
app.use('/bookings', authMiddleware, bookingsRouter);
// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Hospitality Solution API is running on port ${port}`);
});
