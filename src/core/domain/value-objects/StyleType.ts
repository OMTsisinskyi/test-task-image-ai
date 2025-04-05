export type StyleType = 'anime' | 'pixel' | 'cartoon';

export const SupportedStyles: StyleType[] = ['anime', 'pixel', 'cartoon'];

export class Style {
    private constructor(private readonly value: StyleType) { }

    static create(style: string): Style {
        if (!SupportedStyles.includes(style as StyleType)) {
            throw new Error('Invalid style selected');
        }
        return new Style(style as StyleType);
    }

    getValue(): StyleType {
        return this.value;
    }
} 