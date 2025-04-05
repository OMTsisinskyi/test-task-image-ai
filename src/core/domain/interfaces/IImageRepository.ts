import { Image } from '../entities/Image';

export interface IImageRepository {
    save(image: Image): Promise<Image>;
    findById(id: string): Promise<Image | null>;
    findPendingImages(limit: number): Promise<Image[]>;
    update(image: Image): Promise<Image>;
} 