/**
 * Sorts object keys recursively to ensure consistent serialization
 *
 * @param obj - Object to sort keys for
 * @returns Object with sorted keys
 */
export function sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => sortObjectKeys(item));
    }

    return Object.keys(obj)
        .sort()
        .reduce(
            (result, key) => {
                result[key] = sortObjectKeys(obj[key]);
                return result;
            },
            {} as Record<string, any>,
        );
}

/**
 * Creates a canonical JSON string representation
 * Manual implementation that ensures consistent ordering
 *
 * @param data - Data to serialize
 * @returns Canonical JSON string
 */
export function createCanonicalJson(data: Record<string, any>): string {
    if (typeof data !== 'object' || data === null) {
        return JSON.stringify(data);
    }

    if (Array.isArray(data)) {
        return '[' + data.map((item) => createCanonicalJson(item)).join(',') + ']';
    }

    const sortedKeys = Object.keys(data).sort();
    const parts = sortedKeys.map((key) => {
        const value = data[key];
        return JSON.stringify(key) + ':' + createCanonicalJson(value);
    });

    return '{' + parts.join(',') + '}';
}

/**
 * Serializes parameters into a consistent base64 string representation
 * Suitable for cache keys and other use cases requiring compact representation
 *
 * @param params - Parameters to serialize
 * @returns Base64 encoded serialized parameter string
 */
export function serializeToBase64(params: Record<string, any>): string {
    try {
        const sortedParams = sortObjectKeys(params);
        return Buffer.from(JSON.stringify(sortedParams))
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    } catch (error) {
        return String(params);
    }
}

/**
 * Creates a hash from an object for consistent key generation
 * Uses canonical JSON to ensure consistency
 *
 * @param data - Data to create hash from
 * @returns Canonical JSON string
 */
export function createObjectHash(data: Record<string, any>): string {
    return createCanonicalJson(data);
}
