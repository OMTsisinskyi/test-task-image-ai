import { Request, Response } from 'express';
import multer from 'multer';
import { ProcessImageUseCase } from '../../core/application/use-cases/ProcessImageUseCase';
import { GetRequestStatusUseCase } from '../../core/application/use-cases/GetRequestStatusUseCase';
import { FirebaseImageRepository } from '../../infrastructure/repositories/FirebaseImageRepository';
import { ReplicateImageProcessor } from '../../infrastructure/services/ReplicateImageProcessor';

const upload = multer({ storage: multer.memoryStorage() });
const imageRepository = new FirebaseImageRepository();
const imageProcessor = new ReplicateImageProcessor();

export const processImageController = [
    upload.single('image'),
    async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No image uploaded' });
                return;
            }

            const { style } = req.body;
            if (!style) {
                res.status(400).json({ message: 'Invalid or missing style' });
                return;
            }

            const processImageUseCase = new ProcessImageUseCase(imageRepository, imageProcessor);
            const result = await processImageUseCase.execute(req.file.buffer, style);

            res.status(200).json({
                requestId: result.requestId,
                url: result.url,
                statusInfo: `/images/${result.requestId}/status`
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    },
];

export const getRequestStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const getRequestStatusUseCase = new GetRequestStatusUseCase(imageRepository);
        const result = await getRequestStatusUseCase.execute(id);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error && error.message === 'Request not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error retrieving status' });
        }
    }
}; 