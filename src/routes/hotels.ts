import express from 'express';
import { createHotel, getHotels, updateHotel, deleteHotel } from '../controllers/hotel-controller';

const router = express.Router();

router.get('/', getHotels);
router.post('/', createHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);

export default router;