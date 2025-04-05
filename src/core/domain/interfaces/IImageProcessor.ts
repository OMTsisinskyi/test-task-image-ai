export interface IImageProcessor {
    processImage(imageUrl: string, style: string): Promise<string>;
    saveImage(fileBuffer: Buffer, prefix?: string): Promise<{ id: string; url: string }>;
    saveImageFromUrl(imageUrl: string, prefix?: string): Promise<{ id: string; url: string }>;
    deleteImage(id: string): Promise<void>;
} 