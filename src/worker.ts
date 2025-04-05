import { FirebaseImageRepository } from './infrastructure/repositories/FirebaseImageRepository';
import { ReplicateImageProcessor } from './infrastructure/services/ReplicateImageProcessor';

const processRequests = async () => {
    const imageRepository = new FirebaseImageRepository();
    const imageProcessor = new ReplicateImageProcessor();

    const pendingImages = await imageRepository.findPendingImages(3);

    for (const image of pendingImages) {
        try {
            // Mark as processing
            const processingImage = image.markAsProcessing();
            await imageRepository.update(processingImage);

            // Process the image
            const stylizedImageUrl = await imageProcessor.processImage(image.url, image.style);

            // Save the stylized image
            const { url: savedStylizedUrl } = await imageProcessor.saveImageFromUrl(stylizedImageUrl, 'stylized');

            // Mark as done
            const completedImage = image.markAsDone(savedStylizedUrl);
            await imageRepository.update(completedImage);

        } catch (error) {
            // Mark as error
            const errorImage = image.markAsError(error instanceof Error ? error.message : 'Unknown error');
            await imageRepository.update(errorImage);
            console.error(`Error processing ${image.id}:`, error);
        }
    }
};

setInterval(processRequests, 3000);
