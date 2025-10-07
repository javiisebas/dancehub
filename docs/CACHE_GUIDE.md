# 💾 Cache Module - Guía Completa

Sistema de caché basado en Redis con soporte para traducciones, TTL configurable y patrones de invalidación.

## 🎯 Características

-   ✅ **Redis Backend**: Almacenamiento distribuido y persistente
-   ✅ **Type-Safe**: API con inferencia de tipos
-   ✅ **TTL Configurable**: 5 niveles predefinidos
-   ✅ **Pattern Invalidation**: Invalidación masiva por patrones
-   ✅ **Translation Support**: Caché específico para entidades traducibles
-   ✅ **Get-or-Set Pattern**: Patrón común simplificado
-   ✅ **Namespace Organization**: Keys organizadas por namespace

---

## 🚀 Quick Start

### 1. Configuración

```typescript
// .env
CACHE_HOST=localhost
CACHE_PORT=6379
CACHE_PASSWORD=your_redis_password
CACHE_DB=0
CACHE_TTL=300  # TTL por defecto en segundos (5 minutos)
```

### 2. Uso Básico

```typescript
import { CacheService } from '@api/modules/core/cache/cache.service';
import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';

@Injectable()
export class MyService {
    constructor(private readonly cacheService: CacheService) {}

    async getData(id: string): Promise<Data> {
        const key = new BaseCacheKey('data', id);

        // Get or Set pattern
        return this.cacheService.getOrSet(
            key,
            async () => {
                // Solo se ejecuta si no está en caché
                return await this.fetchDataFromDB(id);
            },
            { ttl: 300 }, // 5 minutos
        );
    }
}
```

---

## 📚 API Reference

### CacheService

#### get<T>(key, defaultValue?)

Obtener valor del caché.

```typescript
const key = new BaseCacheKey('user', userId);
const user = await cacheService.get<User>(key);

// Con valor por defecto
const user = await cacheService.get<User>(key, null);
```

#### set<T>(key, value, options?)

Guardar valor en caché.

```typescript
const key = new BaseCacheKey('user', userId);
await cacheService.set(key, user, { ttl: 300 });
```

#### del(key)

Eliminar valor del caché.

```typescript
const key = new BaseCacheKey('user', userId);
await cacheService.del(key);
```

#### has(key)

Verificar si existe en caché.

```typescript
const key = new BaseCacheKey('user', userId);
const exists = await cacheService.has(key);
```

#### getOrSet<T>(key, factory, options?)

Obtener o generar y guardar.

```typescript
const user = await cacheService.getOrSet(
    new BaseCacheKey('user', userId),
    async () => await userRepo.findById(userId),
    { ttl: 300 },
);
```

#### delPattern(pattern)

Eliminar múltiples keys por patrón.

```typescript
// Eliminar todos los users
await cacheService.delPattern('user:*');

// Eliminar users de un país específico
await cacheService.delPattern('user:*:ES');
```

---

## 🔑 Cache Keys

### Tipos de Keys

#### Simple Key

```typescript
const key = new BaseCacheKey('namespace', 'identifier');
// Resultado: "namespace:identifier"
```

#### Key con Sufijo

```typescript
const key = new BaseCacheKey('user', userId, 'profile');
// Resultado: "user:123:profile"
```

#### Key por ID

```typescript
const key = BaseCacheKey.byId(userId);
// Resultado: "id:123"
```

#### Key Paginada

```typescript
const request = new PaginatedRequest({ page: 1, limit: 10 });
const key = BaseCacheKey.paginated(request);
// Resultado: "paginated:page=1&limit=10"
```

### Patrones

```typescript
// Pattern para todas las keys de un namespace
const pattern = BaseCacheKey.namespacePattern('user');
// "user:*"

// Pattern de una key específica
const key = new BaseCacheKey('user', userId);
const pattern = key.toPattern();
// "user:123*"
```

---

## ⏱️ TTL (Time To Live)

### Valores Predefinidos

```typescript
import { CacheTTL } from '@api/modules/core/cache/constants';

CacheTTL.VERY_SHORT; // 60 segundos (1 minuto)
CacheTTL.SHORT; // 300 segundos (5 minutos)
CacheTTL.MEDIUM; // 900 segundos (15 minutos)
CacheTTL.LONG; // 3600 segundos (1 hora)
CacheTTL.VERY_LONG; // 86400 segundos (24 horas)
```

### Uso

```typescript
// Con constante
await cacheService.set(key, value, { ttl: CacheTTL.LONG });

// Valor custom
await cacheService.set(key, value, { ttl: 7200 }); // 2 horas
```

---

## 🌍 Caché para Traducciones

### TranslatableCacheService

Servicio especializado para entidades traducibles que necesitan invalidación por locale.

```typescript
import { TranslatableCacheService } from '@api/modules/core/cache/translatable-cache.service';

@Injectable()
export class DanceStyleService {
    constructor(private readonly cache: TranslatableCacheService) {}

    async getDanceStyle(id: string, locale: string): Promise<DanceStyle> {
        return this.cache.getOrSet(
            'dancestyle',
            id,
            locale,
            async () => {
                return await this.repo.findById(id, { locale });
            },
            { ttl: CacheTTL.LONG },
        );
    }
}
```

### API

```typescript
// Get con locale
const entity = await translatableCache.get('dancestyle', id, locale);

// Set con locale
await translatableCache.set('dancestyle', id, locale, entity, { ttl: 300 });

// Delete una traducción específica
await translatableCache.del('dancestyle', id, locale);

// Delete todas las traducciones de una entidad
await translatableCache.delAll('dancestyle', id);

// Get or Set con locale
const entity = await translatableCache.getOrSet('dancestyle', id, locale, async () => factory(), {
    ttl: 300,
});
```

---

## 📊 Estrategias de Caché

### 1. Cache-Aside (Lazy Loading)

```typescript
async getUser(id: string): Promise<User> {
    const key = new BaseCacheKey('user', id);

    // Intentar obtener de caché
    const cached = await this.cacheService.get<User>(key);
    if (cached) return cached;

    // Si no existe, obtener de DB
    const user = await this.userRepo.findById(id);

    // Guardar en caché
    await this.cacheService.set(key, user, { ttl: CacheTTL.LONG });

    return user;
}
```

### 2. Get-or-Set Pattern (Simplificado)

```typescript
async getUser(id: string): Promise<User> {
    return this.cacheService.getOrSet(
        new BaseCacheKey('user', id),
        async () => await this.userRepo.findById(id),
        { ttl: CacheTTL.LONG },
    );
}
```

### 3. Write-Through

```typescript
async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    // Actualizar en DB
    const user = await this.userRepo.update(id, data);

    // Actualizar en caché inmediatamente
    const key = new BaseCacheKey('user', id);
    await this.cacheService.set(key, user, { ttl: CacheTTL.LONG });

    return user;
}
```

### 4. Invalidation on Write

```typescript
async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    // Actualizar en DB
    const user = await this.userRepo.update(id, data);

    // Invalidar caché
    const key = new BaseCacheKey('user', id);
    await this.cacheService.del(key);

    // Próxima lectura regenerará el caché
    return user;
}
```

---

## 🔥 Patrones de Invalidación

### Invalidar por ID

```typescript
// Invalidar user específico
await cacheService.del(new BaseCacheKey('user', userId));
```

### Invalidar por Namespace

```typescript
// Invalidar TODOS los users
await cacheService.delPattern('user:*');
```

### Invalidar por Criterio

```typescript
// Invalidar users de un país
await cacheService.delPattern(`user:*:${countryCode}`);

// Invalidar paginaciones de artists
await cacheService.delPattern('artist:paginated:*');
```

### Invalidar Traducción

```typescript
// Una traducción específica
await translatableCache.del('dancestyle', id, 'es');

// Todas las traducciones
await translatableCache.delAll('dancestyle', id);
```

---

## 🎯 Casos de Uso

### 1. Cachear Lista Paginada

```typescript
@Injectable()
export class ArtistService {
    async getArtists(page: number, limit: number): Promise<PaginatedResponse<Artist>> {
        const request = new PaginatedRequest({ page, limit });
        const key = new BaseCacheKey('artist', 'paginated', `${page}:${limit}`);

        return this.cacheService.getOrSet(
            key,
            async () => {
                return await this.artistRepo.paginate(request);
            },
            { ttl: CacheTTL.SHORT },
        );
    }

    async createArtist(data: CreateArtistDto): Promise<Artist> {
        const artist = await this.artistRepo.save(new Artist(...));

        // Invalidar todas las paginaciones
        await this.cacheService.delPattern('artist:paginated:*');

        return artist;
    }
}
```

### 2. Cachear con Filtros

```typescript
async searchArtists(country: string): Promise<Artist[]> {
    const key = new BaseCacheKey('artist', 'search', country);

    return this.cacheService.getOrSet(
        key,
        async () => {
            return await this.artistRepo.findMany({
                filter: { field: 'country', operator: 'eq', value: country },
            });
        },
        { ttl: CacheTTL.MEDIUM },
    );
}
```

### 3. Cachear Estadísticas

```typescript
async getStatistics(): Promise<Statistics> {
    const key = new BaseCacheKey('stats', 'general');

    return this.cacheService.getOrSet(
        key,
        async () => {
            const totalArtists = await this.artistRepo.count();
            const totalAlbums = await this.albumRepo.count();
            const totalSongs = await this.songRepo.count();

            return { totalArtists, totalAlbums, totalSongs };
        },
        { ttl: CacheTTL.VERY_LONG }, // 24 horas
    );
}
```

### 4. Cachear Relaciones

```typescript
async getArtistWithAlbums(id: string): Promise<Artist> {
    const key = new BaseCacheKey('artist', id, 'with-albums');

    return this.cacheService.getOrSet(
        key,
        async () => {
            return await this.artistRepo.findById(id, { with: ['albums'] });
        },
        { ttl: CacheTTL.LONG },
    );
}
```

---

## 🔒 Consideraciones de Seguridad

### 1. No Cachear Datos Sensibles

```typescript
// ❌ MAL: No cachear passwords, tokens, etc
const user = await userRepo.findById(id);
await cacheService.set(key, user); // user contiene password hash!

// ✅ BIEN: Sanitizar antes de cachear
const user = await userRepo.findById(id);
const safeUser = { id: user.id, name: user.name, email: user.email };
await cacheService.set(key, safeUser);
```

### 2. Validar TTL

```typescript
// ❌ MAL: TTL muy largo para datos que cambian frecuentemente
await cacheService.set(userKey, user, { ttl: CacheTTL.VERY_LONG });

// ✅ BIEN: TTL apropiado según frecuencia de cambios
await cacheService.set(userKey, user, { ttl: CacheTTL.SHORT });
```

### 3. Namespace por Módulo

```typescript
// ✅ BIEN: Usar namespaces descriptivos y únicos
const artistKey = new BaseCacheKey('artist', id);
const albumKey = new BaseCacheKey('album', id);
const userKey = new BaseCacheKey('user', id);
```

---

## 📈 Monitoreo y Debugging

### Debug Keys

```typescript
// Verificar si existe
const exists = await cacheService.has(key);
console.log(`Key exists: ${exists}`);

// Ver estructura de key
console.log(`Key: ${key.toString()}`);
console.log(`Pattern: ${key.toPattern()}`);
console.log(`Namespace: ${key.getNamespace()}`);
```

### Logging

```typescript
// El CacheService ya tiene logging integrado
// Verás logs automáticos en consola para:
// - Cache hits
// - Cache misses
// - Cache sets
// - Cache deletes
// - Errores
```

---

## 🧪 Testing

```typescript
describe('CacheService', () => {
    let cacheService: CacheService;

    beforeEach(() => {
        cacheService = module.get<CacheService>(CacheService);
    });

    afterEach(async () => {
        // Limpiar caché después de cada test
        await cacheService.delPattern('*');
    });

    it('should cache and retrieve value', async () => {
        const key = new BaseCacheKey('test', '1');
        const value = { name: 'Test' };

        await cacheService.set(key, value);
        const cached = await cacheService.get(key);

        expect(cached).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
        const key = new BaseCacheKey('test', 'non-existent');
        const cached = await cacheService.get(key);

        expect(cached).toBeNull();
    });

    it('should use getOrSet pattern', async () => {
        const key = new BaseCacheKey('test', '2');
        const factory = jest.fn().mockResolvedValue({ name: 'Generated' });

        // Primera llamada ejecuta factory
        const result1 = await cacheService.getOrSet(key, factory);
        expect(factory).toHaveBeenCalledTimes(1);

        // Segunda llamada usa caché
        const result2 = await cacheService.getOrSet(key, factory);
        expect(factory).toHaveBeenCalledTimes(1);
        expect(result1).toEqual(result2);
    });

    it('should invalidate by pattern', async () => {
        await cacheService.set(new BaseCacheKey('user', '1'), { name: 'User 1' });
        await cacheService.set(new BaseCacheKey('user', '2'), { name: 'User 2' });
        await cacheService.set(new BaseCacheKey('artist', '1'), { name: 'Artist 1' });

        await cacheService.delPattern('user:*');

        const user1 = await cacheService.get(new BaseCacheKey('user', '1'));
        const user2 = await cacheService.get(new BaseCacheKey('user', '2'));
        const artist1 = await cacheService.get(new BaseCacheKey('artist', '1'));

        expect(user1).toBeNull();
        expect(user2).toBeNull();
        expect(artist1).not.toBeNull();
    });
});
```

---

## 🚀 Best Practices

1. **Usa namespaces descriptivos** para organizar keys
2. **Define TTL apropiado** según frecuencia de cambios
3. **Invalida al escribir** para mantener consistencia
4. **No cachees datos sensibles** sin sanitizar
5. **Usa patrones para invalidación masiva** cuando sea necesario
6. **Implementa fallback** si Redis falla
7. **Monitorea hit rate** para optimizar TTL
8. **Usa `getOrSet`** para simplificar código
9. **Documenta estrategia de caché** en cada servicio
10. **Testea invalidación** en tus tests

---

## ⚠️ Errores Comunes

### 1. TTL muy corto

```typescript
// ❌ MAL: TTL muy corto, muchos cache misses
await cacheService.set(key, value, { ttl: 10 });

// ✅ BIEN: TTL apropiado
await cacheService.set(key, value, { ttl: CacheTTL.SHORT });
```

### 2. No invalidar al actualizar

```typescript
// ❌ MAL: Actualizar DB sin invalidar caché
await artistRepo.update(id, data);

// ✅ BIEN: Invalidar al actualizar
await artistRepo.update(id, data);
await cacheService.del(new BaseCacheKey('artist', id));
```

### 3. Keys sin namespace

```typescript
// ❌ MAL: Key sin namespace
const key = new BaseCacheKey('', userId);

// ✅ BIEN: Key con namespace
const key = new BaseCacheKey('user', userId);
```

---

## 📝 Próximas Mejoras

-   [ ] Cache warming strategies
-   [ ] Automatic cache invalidation
-   [ ] Cache analytics dashboard
-   [ ] Multi-level caching (L1/L2)
-   [ ] Compression for large values
-   [ ] Cache versioning
