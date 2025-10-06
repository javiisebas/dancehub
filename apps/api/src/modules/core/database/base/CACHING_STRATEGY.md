# Caching Strategy

## Philosophy: Fresh Data, Cached Metadata

This repository system follows a **"fresh data, cached metadata"** approach:

### ✅ What IS Cached (Metadata Only)

1. **Repository Instances** (`repositoryCache` in `BaseRepository`)

    - Why: Singleton pattern for performance
    - Safe: Repositories are stateless service objects
    - Invalidation: Never (they don't change)

2. **ID Columns** (`idColumnCache` in `RelationLoader`)

    - Why: Schema reflection is expensive
    - Safe: Database schema doesn't change at runtime
    - Invalidation: Never (schema is static)

3. **Locale Column** (`localeColumnCache` in `BaseTranslatableRepository`)

    - Why: Schema reflection is expensive
    - Safe: Database schema doesn't change at runtime
    - Invalidation: Never (schema is static)

4. **Translation Field Registration** (`_translationFieldsRegistered` flag)
    - Why: Avoid redundant schema reflection
    - Safe: Schema doesn't change at runtime
    - Invalidation: Never (per repository instance)

### ❌ What is NOT Cached (Always Fresh)

1. **Domain Entities** - NEVER cached
2. **Relations** - ALWAYS fetched fresh from DB
3. **Translations** - ALWAYS fetched fresh from DB
4. **Query Results** - ALWAYS fetched fresh from DB

## Why This Approach?

### ✅ Pros

-   **Data Consistency**: Always get fresh data from DB
-   **Simple**: No complex invalidation logic
-   **Safe**: No stale data issues
-   **Scalable**: Works in multi-instance environments
-   **Predictable**: What you fetch is what you get

### ⚠️ Cons

-   **No Entity Caching**: Every fetch hits the DB

**Decision**: The cons are acceptable because:

1. PostgreSQL is FAST with proper indexes
2. Connection pooling handles concurrency well
3. Avoiding cache invalidation complexity is worth it
4. Data consistency is more important than speed

## Examples

### ✅ SAFE: Metadata Cache

```typescript
// This is cached (schema doesn't change)
const idColumn = this.getIdColumn(); // Cached after first call
```

### ❌ UNSAFE: Entity Cache (We DON'T do this)

```typescript
// BAD: Don't cache entities
private entityCache = new Map<string, Entity>(); // ❌ NEVER DO THIS

// GOOD: Always fetch fresh
const entity = await this.findById(id); // ✅ Fresh from DB
```

## Update Scenarios

### Scenario 1: Update Relations

```typescript
// 1. Fetch artist with albums
const artist = await artistRepo.findById(1, { with: ['albums'] });
console.log(artist.albums.length); // 5

// 2. Add new album
await albumRepo.create({ name: 'New Album', artistId: 1 });

// 3. Fetch again - NEW album is present ✅
const refreshedArtist = await artistRepo.findById(1, { with: ['albums'] });
console.log(refreshedArtist.albums.length); // 6 ✅
```

### Scenario 2: Update Translation

```typescript
// 1. Fetch with translation
const style = await danceStyleRepo.findById(1); // ES locale
console.log(style.translation.name); // "Salsa"

// 2. Update translation
await danceStyleRepo.updateTranslations(1, [
    { locale: 'es', name: 'Salsa Cubana', description: '...' },
]);

// 3. Fetch again - UPDATED translation ✅
const refreshed = await danceStyleRepo.findById(1);
console.log(refreshed.translation.name); // "Salsa Cubana" ✅
```

### Scenario 3: Nested Relations

```typescript
// 1. Fetch artist with nested relations
const artist = await artistRepo.findById(1, { with: ['albums.songs'] });
console.log(artist.albums[0].songs.length); // 10

// 2. Add new song to album
await songRepo.create({ name: 'New Song', albumId: artist.albums[0].id });

// 3. Fetch again - NEW song is present ✅
const refreshed = await artistRepo.findById(1, { with: ['albums.songs'] });
console.log(refreshed.albums[0].songs.length); // 11 ✅
```

## Multi-Instance Environments

This strategy works perfectly in **multi-instance** deployments:

-   Each instance has its own metadata cache (safe, schema is shared)
-   No entity caching means no cross-instance sync issues
-   All instances read from the same PostgreSQL database

## Performance Considerations

### Fast Queries

-   Proper indexes on foreign keys
-   Connection pooling (configured in DatabaseService)
-   Efficient JOINs (only when needed)

### When to Add Caching?

Only consider entity-level caching if:

1. Profiling shows DB is a bottleneck
2. Specific queries are slow (>100ms)
3. Data is read-heavy and changes rarely

If needed, use **external cache** (Redis) with proper TTL and invalidation.

## Testing

See `test-cache-consistency.sh` for comprehensive tests covering:

-   Update scenarios
-   Relation consistency
-   Translation updates
-   Nested relation updates

---

**Last Updated**: October 2025
**Status**: ✅ PRODUCTION READY
