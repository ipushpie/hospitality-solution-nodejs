import express from 'express';
import * as dotenv from 'dotenv';
import hotelsRouter from './routes/hotels';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('Hotel Management System API is running!');
});

// Routes
app.use('/hotels', hotelsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Hotel Management System API is running on port ${port}`);
});
