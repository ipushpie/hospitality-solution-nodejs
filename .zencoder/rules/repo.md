---
description: Repository Information Overview
alwaysApply: true
---

# Hotel Management System Information

## Summary
A TypeScript-based hotel management system API built with Express.js and Prisma ORM. The application provides endpoints for managing hotels, rooms, and bookings with a PostgreSQL database backend.

## Structure
- **src/**: Contains the application source code
  - **controllers/**: API endpoint handlers
  - **routes/**: Express route definitions
  - **middleware/**: Express middleware
  - **config/**: Application configuration
  - **types/**: TypeScript type definitions
  - **utils/**: Utility functions
- **prisma/**: Prisma ORM schema and migrations

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.8.3
**Build System**: ts-node
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- Express.js (^5.1.0): Web framework
- Prisma (^6.12.0): ORM for database access
- PostgreSQL (^8.16.3): Database driver
- dotenv (^17.2.0): Environment variable management

**Development Dependencies**:
- ts-node (^10.9.2): TypeScript execution environment
- Prisma CLI (^6.12.0): Database schema management

## Build & Installation
```bash
npm install
npx prisma generate
npm start
```

## Docker
**Configuration**: Docker Compose setup for PostgreSQL database
**Image**: postgres:15
**Ports**: 5434:5432
**Environment**:
- POSTGRES_USER: postgres
- POSTGRES_PASSWORD: password
- POSTGRES_DB: hotel_db

## Database
**Type**: PostgreSQL
**Schema**: Prisma schema with Hotel, Room, and Booking models
**Migrations**: Managed through Prisma migrations
**Connection**: Environment variable DATABASE_URL

## API Endpoints
**Hotels**:
- GET /hotels: List all hotels
- POST /hotels: Create a new hotel
- PUT /hotels/:id: Update a hotel
- DELETE /hotels/:id: Delete a hotel

**Rooms**:
- Endpoints for room management

**Bookings**:
- Endpoints for booking management