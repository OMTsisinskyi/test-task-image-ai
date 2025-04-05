import express from 'express';
import { getRequestStatus, processImageController } from '../controllers/ImageController';

const router = express.Router();

router.post('/process', ...processImageController);
router.get('/:id/status', getRequestStatus);

export default router; 