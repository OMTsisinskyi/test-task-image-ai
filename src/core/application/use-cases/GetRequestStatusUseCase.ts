import { IImageRepository } from '../../domain/interfaces/IImageRepository';

export class GetRequestStatusUseCase {
    constructor(
        private readonly imageRepository: IImageRepository
    ) {}

    async execute(id: string): Promise<{
        status: string;
        url?: string;
        stylizedImageUrl?: string;
        errorMessage?: string;
    }> {
        const image = await this.imageRepository.findById(id);
        
        if (!image) {
            throw new Error('Request not found');
        }

        return {
            status: image.status,
            url: image.url,
            stylizedImageUrl: image.stylizedImageUrl,
            errorMessage: image.errorMessage
        };
    }
} 