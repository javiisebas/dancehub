export class TranslatableCacheKeys {
    constructor(private readonly entityName: string) {}

    entity(id: string): string {
        return `${this.entityName}:entity:${id}`;
    }

    translation(id: string, locale: string): string {
        return `${this.entityName}:translation:${id}:${locale}`;
    }

    translations(id: string): string {
        return `${this.entityName}:translations:${id}`;
    }

    composite(id: string, locale: string): string {
        return `${this.entityName}:composite:${id}:${locale}`;
    }

    compositeAll(id: string): string {
        return `${this.entityName}:composite:${id}:all`;
    }

    entityPattern(id: string): string {
        return `${this.entityName}:*:${id}*`;
    }

    translationPattern(id: string, locale?: string): string {
        if (locale) {
            return `${this.entityName}:translation:${id}:${locale}`;
        }
        return `${this.entityName}:translation:${id}:*`;
    }

    allPattern(): string {
        return `${this.entityName}:*`;
    }
}
