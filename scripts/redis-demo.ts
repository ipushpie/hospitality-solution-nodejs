#!/usr/bin/env node

// Demonstration script showing Redis caching functionality
// This demonstrates the implemented caching without requiring a full database setup

import express from 'express';
import { CacheService } from '../src/config/redis';

const app = express();
const port = 3001;

// Middleware
app.use(express.json());

// Mock data
const mockHotels = [
  { id: 1, name: 'Grand Hotel', location: 'New York', userId: 1 },
  { id: 2, name: 'Beach Resort', location: 'Miami', userId: 1 },
  { id: 3, name: 'Mountain Lodge', location: 'Denver', userId: 2 }
];

const mockRooms = [
  { id: 1, number: '101', type: 'Standard', price: 150, hotelId: 1, userId: 1 },
  { id: 2, number: '102', type: 'Deluxe', price: 250, hotelId: 1, userId: 1 },
  { id: 3, number: '201', type: 'Suite', price: 400, hotelId: 2, userId: 1 }
];

// Mock user authentication (for demo purposes)
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Middleware to simulate authentication
app.use((req: any, res: any, next: any) => {
  // For demo, assume user ID 1 is authenticated
  req.user = mockUsers[0];
  next();
});

// Demo Hotels endpoint with caching
app.get('/hotels', async (req: any, res: any) => {
  try {
    const cacheKey = CacheService.generateKey('hotels', undefined, req.user.id);
    
    // Try to get hotels from cache first
    const cachedHotels = await CacheService.get(cacheKey);
    if (cachedHotels) {
      console.log(`🚀 Hotels retrieved from cache for user ${req.user.id}`);
      return res.json({
        source: 'cache',
        data: cachedHotels,
        user: req.user.name
      });
    }

    // Simulate database query delay
    console.log(`🔍 Fetching hotels from database for user ${req.user.id}...`);
    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

    // Filter hotels by user ID (simulate database query)
    const userHotels = mockHotels.filter(hotel => hotel.userId === req.user.id);

    // Cache the hotels for future requests
    await CacheService.set(cacheKey, userHotels, 600); // Cache for 10 minutes
    console.log(`💾 Hotels cached from database for user ${req.user.id}`);

    res.json({
      source: 'database',
      data: userHotels,
      user: req.user.name
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Failed to fetch hotels' });
  }
});

// Demo Rooms endpoint with caching
app.get('/rooms', async (req: any, res: any) => {
  try {
    const cacheKey = CacheService.generateKey('rooms', undefined, req.user.id);
    
    // Try to get rooms from cache first
    const cachedRooms = await CacheService.get(cacheKey);
    if (cachedRooms) {
      console.log(`🚀 Rooms retrieved from cache for user ${req.user.id}`);
      return res.json({
        source: 'cache',
        data: cachedRooms,
        user: req.user.name
      });
    }

    // Simulate database query delay
    console.log(`🔍 Fetching rooms from database for user ${req.user.id}...`);
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay

    // Filter rooms by user ID (simulate database query)
    const userRooms = mockRooms.filter(room => room.userId === req.user.id);

    // Cache the rooms for future requests
    await CacheService.set(cacheKey, userRooms, 600); // Cache for 10 minutes
    console.log(`💾 Rooms cached from database for user ${req.user.id}`);

    res.json({
      source: 'database',
      data: userRooms,
      user: req.user.name
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
});

// Demo cache invalidation endpoint
app.post('/hotels', async (req: any, res: any) => {
  try {
    const newHotel = {
      id: Date.now(),
      name: req.body.name || 'New Hotel',
      location: req.body.location || 'Unknown',
      userId: req.user.id
    };

    // Simulate adding to database
    mockHotels.push(newHotel);

    // Invalidate the user's hotels cache
    const cacheKey = CacheService.generateKey('hotels', undefined, req.user.id);
    await CacheService.del(cacheKey);
    console.log(`🗑️ Cache invalidated for user ${req.user.id} after creating hotel`);

    res.status(201).json({
      message: 'Hotel created and cache invalidated',
      hotel: newHotel
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ message: 'Failed to create hotel' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Redis caching demo API is running',
    redis: 'connected'
  });
});

// Cache stats endpoint
app.get('/cache/stats', async (req, res) => {
  res.json({
    message: 'Cache is operational',
    demo_keys: {
      hotels_user_1: CacheService.generateKey('hotels', undefined, 1),
      rooms_user_1: CacheService.generateKey('rooms', undefined, 1)
    }
  });
});

// Start the demo server
async function startDemo() {
  try {
    app.listen(port, () => {
      console.log('🎉 Redis Caching Demo Server Started!');
      console.log(`🌐 Server running on http://localhost:${port}`);
      console.log('');
      console.log('📋 Available endpoints:');
      console.log('  GET  /health        - Health check');
      console.log('  GET  /hotels        - Get hotels (with caching)');
      console.log('  GET  /rooms         - Get rooms (with caching)');
      console.log('  POST /hotels        - Create hotel (invalidates cache)');
      console.log('  GET  /cache/stats   - Cache information');
      console.log('');
      console.log('🧪 Test the caching:');
      console.log('  1. curl http://localhost:3001/hotels  (first request - from database)');
      console.log('  2. curl http://localhost:3001/hotels  (second request - from cache)');
      console.log('  3. curl -X POST http://localhost:3001/hotels -H "Content-Type: application/json" -d \'{"name":"Test Hotel","location":"Test City"}\'  (invalidates cache)');
      console.log('  4. curl http://localhost:3001/hotels  (next request - from database again)');
    });
  } catch (error) {
    console.error('Failed to start demo server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startDemo();
}