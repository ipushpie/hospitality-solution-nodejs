import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany();
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const newRoom = await prisma.room.create({
            data: req.body,
        });
        res.status(201).json(newRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create room' });
    }
}

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const updatedRoom = await prisma.room.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json(updatedRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update room' });
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        await prisma.room.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete room' });
    }
};