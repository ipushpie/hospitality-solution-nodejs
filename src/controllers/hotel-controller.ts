import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await prisma.hotel.findMany();
        res.json(hotels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
};

export const createHotel = async (req: Request, res: Response) => {
    try {

        const { name, location } = req.body;
        if (!name || !location) {
            return res.status(400).json({ error: 'Name and location are required fields.' });
        }

        const newHotel = await prisma.hotel.create({
            data: { name, location },
        });

        res.status(201).json(newHotel);
    } catch (error) {
        console.error('Error creating hotel:', error);
        res.status(500).json({ error: 'Failed to create a hotel' });
    }
};

export const updateHotel = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedHotel = await prisma.hotel.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
        res.json(updatedHotel);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Hotel not found or failed to update' });
    }
}

export const deleteHotel = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.hotel.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Hotel not found or failed to delete' });
    }
};