import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { CacheService } from '../config/redis';
import { User } from '../types/user';

interface AuthRequest extends Request {
  user?: User; 
}

export const getRooms = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const cacheKey = CacheService.generateKey('rooms', undefined, req.user.id);
      
      // Try to get rooms from cache first
      const cachedRooms = await CacheService.get(cacheKey);
      if (cachedRooms) {
        console.log('Rooms retrieved from cache');
        return res.json(cachedRooms);
      }

      // Fetch rooms from database
      const rooms = await prisma.room.findMany({
        where: {
          userId: req.user.id,
        },
      });

      // Cache the rooms for future requests
      await CacheService.set(cacheKey, rooms, 600); // Cache for 10 minutes
      console.log('Rooms cached from database');

      res.json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const newRoom = await prisma.room.create({
        data: {
          ...req.body,
          userId: req.user.id,
        },
      });

      // Invalidate the user's rooms cache after creating a new room
      const cacheKey = CacheService.generateKey('rooms', undefined, req.user.id);
      await CacheService.del(cacheKey);

      res.status(201).json(newRoom);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create room' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const roomId = Number(req.params.id);

      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (room.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this room' });
      }

      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: req.body,
      });

      // Invalidate related cache entries
      const userRoomsCacheKey = CacheService.generateKey('rooms', undefined, req.user.id);
      const specificRoomCacheKey = CacheService.generateKey('room', roomId, req.user.id);
      
      await Promise.all([
        CacheService.del(userRoomsCacheKey),
        CacheService.del(specificRoomCacheKey)
      ]);

      res.json(updatedRoom);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update room' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const roomId = Number(req.params.id);

      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (room.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this room' });
      }

      await prisma.room.delete({
        where: { id: roomId },
      });

      // Invalidate related cache entries
      const userRoomsCacheKey = CacheService.generateKey('rooms', undefined, req.user.id);
      const specificRoomCacheKey = CacheService.generateKey('room', roomId, req.user.id);
      
      await Promise.all([
        CacheService.del(userRoomsCacheKey),
        CacheService.del(specificRoomCacheKey)
      ]);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete room' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};