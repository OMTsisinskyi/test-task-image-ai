export class Image {
    constructor(
        public readonly id: string,
        public readonly url: string,
        public readonly style: string,
        public readonly status: 'pending' | 'processing' | 'done' | 'error',
        public readonly createdAt: Date,
        public readonly updatedAt?: Date,
        public readonly stylizedImageUrl?: string,
        public readonly errorMessage?: string
    ) { }

    static create(
        id: string,
        url: string,
        style: string
    ): Image {
        return new Image(
            id,
            url,
            style,
            'pending',
            new Date()
        );
    }

    markAsProcessing(): Image {
        return new Image(
            this.id,
            this.url,
            this.style,
            'processing',
            this.createdAt,
            new Date()
        );
    }

    markAsDone(stylizedImageUrl: string): Image {
        return new Image(
            this.id,
            this.url,
            this.style,
            'done',
            this.createdAt,
            new Date(),
            stylizedImageUrl
        );
    }

    markAsError(errorMessage: string): Image {
        return new Image(
            this.id,
            this.url,
            this.style,
            'error',
            this.createdAt,
            new Date(),
            undefined,
            errorMessage
        );
    }
} 