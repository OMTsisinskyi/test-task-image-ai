import Replicate from 'replicate';
import { IImageProcessor } from '../../core/domain/interfaces/IImageProcessor';
import { bucket } from '../../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

export class ReplicateImageProcessor implements IImageProcessor {
    private replicate: Replicate;
    private stylePrompts: { [key: string]: string } = {
        anime: 'Transform the image into an anime-style character with vibrant colors and big expressive eyes.',
        pixel: 'Convert the image into a pixel art style, resembling classic 8-bit or 16-bit video games.',
        cartoon: 'Stylize the image to look like a colorful cartoon.'
    };

    constructor() {
        this.replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
    }

    async processImage(imageUrl: string, style: string): Promise<string> {
        const prompt = this.stylePrompts[style];
        if (!prompt) {
            throw new Error('Invalid style selected');
        }

        const output = await this.replicate.run(
            "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
            {
                input: {
                    image: imageUrl,
                    prompt
                },
            }
        ) as string[];

        if (!output || output.length === 0) {
            throw new Error('No output received from Replicate');
        }

        return output[0];
    }

    async saveImage(fileBuffer: Buffer, prefix: string = ''): Promise<{ id: string; url: string }> {
        const id = uuidv4();
        const fileName = prefix ? `${prefix}_${id}.jpg` : `${id}.jpg`;

        const file = bucket.file(fileName);

        await file.save(fileBuffer, {
            contentType: 'image/jpeg',
            public: true,
        });

        const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        return { id, url };
    }

    async saveImageFromUrl(imageUrl: string, prefix: string = ''): Promise<{ id: string; url: string }> {
        try {
            const response = await fetch(imageUrl);
            const buffer = await response.buffer();
            return await this.saveImage(buffer, prefix);
        } catch (error) {
            throw new Error('Failed to save image from URL: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async deleteImage(id: string): Promise<void> {
        try {
            const fileName = `${id}.jpg`;
            const file = bucket.file(fileName);
            const [exists] = await file.exists();
            if (exists) await file.delete();
        } catch (error) {
            throw new Error('Failed to delete image: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
} 