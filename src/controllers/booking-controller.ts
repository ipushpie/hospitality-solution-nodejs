import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User; 
}

export const getBookings = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const bookings = await prisma.booking.findMany({
        where: {
          userId: req.user.id,
        },
      });
      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const newBooking = await prisma.booking.create({
        data: {
          ...req.body,
          userId: req.user.id,
        },
      });
      res.status(201).json(newBooking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const bookingId = Number(req.params.id);

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this booking' });
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: req.body,
      });
      res.json(updatedBooking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const bookingId = Number(req.params.id);

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this booking' });
      }

      await prisma.booking.delete({
        where: { id: bookingId },
      });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete booking' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};