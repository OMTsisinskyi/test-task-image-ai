import { firestore } from '../../config/firebase.config';
import { IImageRepository } from '../../core/domain/interfaces/IImageRepository';
import { Image } from '../../core/domain/entities/Image';

export class FirebaseImageRepository implements IImageRepository {
    async save(image: Image): Promise<Image> {
        const data: Record<string, any> = {
            imageUrl: image.url,
            style: image.style,
            status: image.status,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt || new Date()
        };

        if (image.stylizedImageUrl !== undefined) {
            data.stylizedImageUrl = image.stylizedImageUrl;
        }

        if (image.errorMessage !== undefined) {
            data.errorMessage = image.errorMessage;
        }

        Object.keys(data).forEach(key => {
            if (data[key] === undefined) {
                delete data[key];
            }
        });

        const docRef = await firestore.collection('requests').add(data);

        return new Image(
            docRef.id,
            image.url,
            image.style,
            image.status,
            image.createdAt,
            image.updatedAt,
            image.stylizedImageUrl,
            image.errorMessage
        );
    }

    async findById(id: string): Promise<Image | null> {
        const doc = await firestore.collection('requests').doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data()!;
        return new Image(
            doc.id,
            data.imageUrl,
            data.style,
            data.status,
            data.createdAt.toDate(),
            data.updatedAt?.toDate(),
            data.stylizedImageUrl,
            data.errorMessage
        );
    }

    async findPendingImages(limit: number): Promise<Image[]> {
        const snapshot = await firestore
            .collection('requests')
            .where('status', '==', 'pending')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return new Image(
                doc.id,
                data.imageUrl,
                data.style,
                data.status,
                data.createdAt.toDate(),
                data.updatedAt?.toDate(),
                data.stylizedImageUrl,
                data.errorMessage
            );
        });
    }

    async update(image: Image): Promise<Image> {
        const data: Record<string, any> = {
            status: image.status,
            updatedAt: image.updatedAt || new Date()
        };

        if (image.stylizedImageUrl !== undefined) {
            data.stylizedImageUrl = image.stylizedImageUrl;
        }

        if (image.errorMessage !== undefined) {
            data.errorMessage = image.errorMessage;
        }

        Object.keys(data).forEach(key => {
            if (data[key] === undefined) {
                delete data[key];
            }
        });

        await firestore.collection('requests').doc(image.id).update(data);

        return image;
    }
} 