type DeepResolved<T> =
    T extends Promise<infer U>
        ? DeepResolved<U>
        : T extends Array<infer U>
          ? Array<DeepResolved<U>>
          : T extends object
            ? { [K in keyof T]: DeepResolved<T[K]> }
            : T;

export const deepResolvePromises = async <T>(input: T): Promise<DeepResolved<T>> => {
    if (input instanceof Promise) {
        return (await input) as DeepResolved<T>;
    }

    if (Array.isArray(input)) {
        const resolvedArray = await Promise.all(input.map(deepResolvePromises));
        return resolvedArray as DeepResolved<T>;
    }

    if (input instanceof Date) {
        return input as DeepResolved<T>;
    }

    if (typeof input === 'object' && input !== null) {
        const resolvedObject: Partial<DeepResolved<T>> = {};

        for (const key of Object.keys(input) as Array<keyof T>) {
            const resolvedValue = await deepResolvePromises(input[key]);
            (resolvedObject as any)[key] = resolvedValue;
        }

        return resolvedObject as DeepResolved<T>;
    }

    return input as DeepResolved<T>;
};
