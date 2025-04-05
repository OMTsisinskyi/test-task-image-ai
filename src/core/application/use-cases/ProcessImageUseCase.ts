import { IImageRepository } from '../../domain/interfaces/IImageRepository';
import { IImageProcessor } from '../../domain/interfaces/IImageProcessor';
import { Image } from '../../domain/entities/Image';
import { Style } from '../../domain/value-objects/StyleType';

export class ProcessImageUseCase {
    constructor(
        private readonly imageRepository: IImageRepository,
        private readonly imageProcessor: IImageProcessor
    ) { }

    async execute(fileBuffer: Buffer, style: string): Promise<{ requestId: string; url: string }> {
        const styleValue = Style.create(style);

        // Save the original image
        const { id, url } = await this.imageProcessor.saveImage(fileBuffer);

        // Create and save the image entity
        const image = Image.create(id, url, styleValue.getValue());
        const savedImage = await this.imageRepository.save(image);

        return {
            requestId: savedImage.id,
            url: savedImage.url
        };
    }
} 