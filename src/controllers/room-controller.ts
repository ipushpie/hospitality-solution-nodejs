import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User; 
}

export const getRooms = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const rooms = await prisma.room.findMany({
        where: {
          userId: req.user.id,
        },
      });
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
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete room' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};