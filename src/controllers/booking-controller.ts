import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany();
        res.json(bookings);
    } catch (error) {
        console.error(error);
    }
}

export const createBooking = async (req: Request, res: Response) => {
    try {
        const newBooking = await prisma.booking.create({
            data: req.body,
        });
        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
    }
}

export const updateBooking = async (req: Request, res: Response) => {
    try {
        await prisma.booking.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        })
        res.sendStatus(204)

    } catch (error) {
        console.error(error);
    }

}

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        await prisma.booking.delete({
            where: { id: Number(req.params.id) },
        });
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
    }
}