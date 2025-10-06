export type NestedRelation = string | { [key: string]: NestedRelation[] };

export type RelationPath = string[]; // ['albums', 'songs']

export function parseNestedRelations(
    relations: (string | NestedRelation)[],
): Map<string, string[]> {
    const relationMap = new Map<string, string[]>();

    relations.forEach((rel) => {
        if (typeof rel === 'string') {
            if (rel.includes('.')) {
                const parts = rel.split('.');
                const first = parts[0];
                const rest = parts.slice(1).join('.');

                if (!relationMap.has(first)) {
                    relationMap.set(first, []);
                }
                if (rest) {
                    relationMap.get(first)!.push(rest);
                }
            } else {
                if (!relationMap.has(rel)) {
                    relationMap.set(rel, []);
                }
            }
        } else if (typeof rel === 'object') {
            Object.entries(rel).forEach(([key, nestedRels]) => {
                if (!relationMap.has(key)) {
                    relationMap.set(key, []);
                }
                nestedRels.forEach((nested) => {
                    if (typeof nested === 'string') {
                        relationMap.get(key)!.push(nested);
                    }
                });
            });
        }
    });

    return relationMap;
}
