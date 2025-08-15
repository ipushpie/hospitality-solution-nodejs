#!/usr/bin/env node

// Simple Redis test script
import { CacheService } from '../src/config/redis';

async function testRedis() {
  console.log('Testing Redis connection and caching...');
  
  try {
    // Test basic set/get operations
    const testKey = 'test:redis:key';
    const testData = { message: 'Hello Redis!', timestamp: new Date() };
    
    console.log('Setting test data...');
    await CacheService.set(testKey, testData, 60);
    
    console.log('Getting test data...');
    const retrievedData = await CacheService.get(testKey);
    
    if (retrievedData) {
      console.log('✅ Redis test successful!');
      console.log('Retrieved data:', retrievedData);
    } else {
      console.log('❌ Redis test failed - no data retrieved');
    }
    
    // Test cache key generation
    const userKey = CacheService.generateKey('hotels', undefined, 123);
    console.log('Generated cache key:', userKey);
    
    // Clean up
    await CacheService.del(testKey);
    console.log('Cleaned up test data');
    
  } catch (error) {
    console.error('❌ Redis test failed with error:', error);
  }
  
  process.exit(0);
}

if (require.main === module) {
  testRedis();
}