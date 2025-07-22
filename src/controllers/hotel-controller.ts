import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { User } from '@prisma/client';


interface AuthRequest extends Request {
  user?: User; 
}

// Create a new hotel
export const createHotel = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const { name, location } = req.body;

      // Create the hotel and associate it with the user
      const newHotel = await prisma.hotel.create({
        data: {
          name,
          location,
          userId: req.user.id, // Associate the hotel with the authenticated user
        },
      });

      res.status(201).json(newHotel);
    } catch (error) {
      console.error('Error creating hotel:', error);
      res.status(500).json({ message: 'Failed to create hotel' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get all hotels for the authenticated user
export const getHotels = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      // Fetch only the hotels that belong to the authenticated user
      const hotels = await prisma.hotel.findMany({
        where: {
          userId: req.user.id, // Filter hotels by user ID
        },
      });
      res.json(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ message: 'Failed to fetch hotels' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Update a hotel
export const updateHotel = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const hotelId = parseInt(req.params.id); // Get the hotel ID from the request parameters
      const { name, location } = req.body;

      // Find the hotel and check if the user owns it
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: hotelId,
        },
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      if (hotel.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this hotel' });
      }

      // Update the hotel
      const updatedHotel = await prisma.hotel.update({
        where: {
          id: hotelId,
        },
        data: {
          name,
          location,
        },
      });

      res.json(updatedHotel);
    } catch (error) {
      console.error('Error updating hotel:', error);
      res.status(500).json({ message: 'Failed to update hotel' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Delete a hotel
export const deleteHotel = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    try {
      const hotelId = parseInt(req.params.id); // Get the hotel ID from the request parameters

      // Find the hotel and check if the user owns it
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: hotelId,
        },
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      if (hotel.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not own this hotel' });
      }

      // Delete the hotel
      await prisma.hotel.delete({
        where: {
          id: hotelId,
        },
      });

      res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ message: 'Failed to delete hotel' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};