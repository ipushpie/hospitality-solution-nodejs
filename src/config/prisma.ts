import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient to be used throughout the application
const prisma = new PrismaClient();

// Add logging in development environment if needed
// const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn', 'error'],
// });

export default prisma;