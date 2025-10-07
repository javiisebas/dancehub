# 🗄️ Database Module - Guía Completa

Sistema de repositorios type-safe basado en Drizzle ORM con soporte completo para relaciones, traducciones, filtrado y paginación.

## 🎯 Características

-   ✅ **Type-Safe**: Inferencia automática de tipos
-   ✅ **Zero Boilerplate**: Sin constructores ni tipos redundantes
-   ✅ **Relations**: OneToMany, ManyToOne, ManyToMany, OneToOne
-   ✅ **Translations**: i18n automático con fallback
-   ✅ **Filtering**: AND, OR, 13 operadores, campos anidados
-   ✅ **Sorting**: ASC/DESC, NULLS, campos traducidos
-   ✅ **Pagination**: Completa con metadata
-   ✅ **Type Inference**: `InferFields`, `InferRelations`, `defineRelations`
-   ✅ **Unit of Work**: Transacciones automáticas

---

## 🚀 Quick Start

### 1. Crear Schema (Drizzle)

```typescript
// infrastructure/schemas/artist.schema.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const artists = pgTable('artists', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    country: varchar('country', { length: 100 }).notNull(),
    bio: varchar('bio', { length: 1000 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### 2. Crear Entity (Domain)

```typescript
// domain/entities/artist.entity.ts
export class Artist extends BaseEntity {
    constructor(
        id: string,
        public name: string,
        public country: string,
        public bio: string | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    // Business logic
    isFromCountry(country: string): boolean {
        return this.country === country;
    }

    updateBio(bio: string): void {
        this.bio = bio;
    }
}
```

### 3. Crear Repository

```typescript
// infrastructure/repositories/artist.repository.ts
import { BaseRepository, defineRelations, relation } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';

// ✨ NUEVO: defineRelations para mejor IntelliSense
const artistRelations = defineRelations({
    albums: relation.oneToMany({
        entity: Album,
        table: albums,
        foreignKey: 'artistId',
    }),
});

@Injectable()
export class ArtistRepository extends BaseRepository<
    Artist,
    typeof artists,
    typeof artistRelations
> {
    protected readonly table = artists;
    protected readonly entityName = 'Artist';
    protected readonly relations = artistRelations;

    protected toDomain(schema: typeof artists.$inferSelect): Artist {
        return new Artist(
            schema.id,
            schema.name,
            schema.country,
            schema.bio,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Artist): Partial<typeof artists.$inferInsert> {
        return {
            name: entity.name,
            country: entity.country,
            bio: entity.bio,
        };
    }

    // Custom methods
    async findByCountry(country: string): Promise<Artist[]> {
        return this.findMany({
            filter: { field: 'country', operator: 'eq', value: country },
        });
    }
}
```

---

## 📚 Tipos de Relaciones

### OneToMany

```typescript
// Artist tiene muchos Albums
const artistRelations = defineRelations({
    albums: relation.oneToMany({
        entity: Album,
        table: albums,
        foreignKey: 'artistId', // FK en tabla albums
    }),
});

// Uso
const artist = await artistRepo.findById(1, { with: ['albums'] });
artist.albums; // Album[] ✅ Type-safe array
```

### ManyToOne

```typescript
// Album pertenece a un Artist
const albumRelations = defineRelations({
    artist: relation.manyToOne({
        entity: Artist,
        table: artists,
        foreignKey: 'artistId', // FK en esta tabla
    }),
});

// Uso
const album = await albumRepo.findById(1, { with: ['artist'] });
album.artist; // Artist ✅ Type-safe single entity
```

### ManyToMany

```typescript
// Venue tiene muchos DanceStyles (y viceversa)
const venueRelations = defineRelations({
    danceStyles: relation.manyToMany({
        entity: DanceStyle,
        table: danceStyles,
        joinTable: venueDanceStyles, // Tabla pivote
        foreignKey: 'venueId',
        relatedKey: 'danceStyleId',
    }),
});

// Uso
const venue = await venueRepo.findById(1, { with: ['danceStyles'] });
venue.danceStyles; // DanceStyle[] ✅ Type-safe array
```

### OneToOne

```typescript
// User tiene un Profile
const userRelations = defineRelations({
    profile: relation.oneToOne({
        entity: Profile,
        table: profiles,
        foreignKey: 'userId',
    }),
});

// Uso
const user = await userRepo.findById(1, { with: ['profile'] });
user.profile; // Profile ✅ Type-safe single entity
```

---

## 🔍 Filtering

### Operadores Disponibles

```typescript
type Operator =
    | 'eq' // Igual
    | 'ne' // No igual
    | 'gt' // Mayor que
    | 'gte' // Mayor o igual
    | 'lt' // Menor que
    | 'lte' // Menor o igual
    | 'in' // En array
    | 'not_in' // No en array
    | 'like' // Búsqueda (case-sensitive)
    | 'ilike' // Búsqueda (case-insensitive)
    | 'is_null' // Es null
    | 'is_not_null' // No es null
    | 'between'; // Entre dos valores
```

### Filtros Simples

```typescript
// Igual
await artistRepo.findMany({
    filter: { field: 'country', operator: 'eq', value: 'Spain' },
});

// Like (case-insensitive)
await artistRepo.findMany({
    filter: { field: 'name', operator: 'ilike', value: '%jazz%' },
});

// IN array
await artistRepo.findMany({
    filter: { field: 'country', operator: 'in', value: ['Spain', 'France', 'Italy'] },
});

// Between
await artistRepo.findMany({
    filter: {
        field: 'createdAt',
        operator: 'between',
        value: [new Date('2024-01-01'), new Date('2024-12-31')],
    },
});
```

### Filtros Compuestos (AND/OR)

```typescript
// AND
await artistRepo.findMany({
    filter: {
        operator: 'and',
        conditions: [
            { field: 'country', operator: 'eq', value: 'Spain' },
            { field: 'active', operator: 'eq', value: true },
        ],
    },
});

// OR
await artistRepo.findMany({
    filter: {
        operator: 'or',
        conditions: [
            { field: 'country', operator: 'eq', value: 'Spain' },
            { field: 'country', operator: 'eq', value: 'France' },
        ],
    },
});

// Anidados (AND con OR interno)
await artistRepo.findMany({
    filter: {
        operator: 'and',
        conditions: [
            { field: 'active', operator: 'eq', value: true },
            {
                operator: 'or',
                conditions: [
                    { field: 'country', operator: 'eq', value: 'Spain' },
                    { field: 'country', operator: 'eq', value: 'France' },
                ],
            },
        ],
    },
});
```

### Filtros en Campos Traducidos

```typescript
// Buscar por nombre traducido
await danceStyleRepo.findMany({
    filter: { field: 'translation.name', operator: 'ilike', value: '%salsa%' },
    locale: 'es',
});
```

---

## 📊 Sorting

```typescript
// Simple ASC
await artistRepo.findMany({
    sort: { field: 'name', order: 'asc' },
});

// DESC
await artistRepo.findMany({
    sort: { field: 'createdAt', order: 'desc' },
});

// Con NULLS
await artistRepo.findMany({
    sort: { field: 'bio', order: 'desc', nulls: 'last' },
});

// Múltiples campos
await artistRepo.findMany({
    sort: [
        { field: 'country', order: 'asc' },
        { field: 'name', order: 'asc' },
    ],
});

// Por campo traducido
await danceStyleRepo.findMany({
    sort: { field: 'translation.name', order: 'asc' },
    locale: 'es',
});
```

---

## 📄 Paginación

```typescript
const result = await artistRepo.paginate(
    { page: 1, limit: 10 },
    {
        filter: { field: 'country', operator: 'eq', value: 'Spain' },
        sort: { field: 'name', order: 'asc' },
        with: ['albums'],
    },
);

// result = {
//   data: Artist[], // Array de entities
//   meta: {
//     page: 1,
//     limit: 10,
//     total: 45,
//     totalPages: 5,
//     hasNext: true,
//     hasPrev: false,
//   }
// }
```

---

## 🌍 Traducciones

### Crear Repository Traducible

```typescript
import { BaseTranslatableRepository } from '@api/modules/core/database/base';

@Injectable()
export class DanceStyleRepository extends BaseTranslatableRepository<
    DanceStyle,
    DanceStyleTranslation,
    typeof danceStyles,
    typeof danceStyleTranslations
> {
    protected readonly table = danceStyles;
    protected readonly translationTable = danceStyleTranslations;
    protected readonly entityName = 'DanceStyle';

    protected toDomain(schema: typeof danceStyles.$inferSelect): DanceStyle {
        return new DanceStyle(schema.id, schema.slug, schema.createdAt, schema.updatedAt);
    }

    protected toSchema(entity: DanceStyle): Partial<typeof danceStyles.$inferInsert> {
        return { slug: entity.slug };
    }

    protected translationToDomain(
        schema: typeof danceStyleTranslations.$inferSelect,
    ): DanceStyleTranslation {
        return new DanceStyleTranslation(
            schema.id,
            schema.locale,
            schema.name,
            schema.description,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected translationToSchema(
        translation: DanceStyleTranslation,
        entityId: string,
    ): Partial<typeof danceStyleTranslations.$inferInsert> {
        return {
            danceStyleId: entityId,
            locale: translation.locale,
            name: translation.name,
            description: translation.description,
        };
    }

    protected getTranslationEntityIdColumn(): PgColumn {
        return danceStyleTranslations.danceStyleId;
    }
}
```

### Uso

```typescript
// Obtener con traducción en español
const style = await danceStyleRepo.findById(1, { locale: 'es' });
style.translation.name; // "Salsa" (en español)

// Obtener con traducción en inglés
const style = await danceStyleRepo.findById(1, { locale: 'en' });
style.translation.name; // "Salsa" (en inglés)

// Fallback automático a inglés si no existe la traducción
const style = await danceStyleRepo.findById(1, { locale: 'fr' });
style.translation.name; // "Salsa" (fallback a 'en')

// Obtener todas las traducciones
const style = await danceStyleRepo.findById(1, { includeAllTranslations: true });
style.translations; // DanceStyleTranslation[] con todos los idiomas
```

---

## 🔗 Relaciones

### Cargar Relaciones

```typescript
// Una relación
const artist = await artistRepo.findById(1, { with: ['albums'] });

// Múltiples relaciones
const album = await albumRepo.findById(1, { with: ['artist', 'songs'] });

// Relaciones anidadas (3+ niveles)
const artist = await artistRepo.findById(1, { with: ['albums', 'albums.songs'] });

// Todas las entities con sus relaciones
const artists = await artistRepo.findMany({ with: ['albums'] });
```

### Cargar Relaciones Después

```typescript
// Cargar una relación después
const artist = await artistRepo.findById(1);
const albums = await artistRepo.loadRelation(artist, 'albums');

// Cargar múltiples relaciones
const relations = await artistRepo.loadRelations(artist, ['albums', 'concerts']);
```

---

## 💾 CRUD Operations

```typescript
// Create
const artist = new Artist('id', 'Artist Name', 'Spain', 'Bio', new Date(), new Date());
await artistRepo.save(artist);

// Read
const artist = await artistRepo.findById('id');
const artists = await artistRepo.findMany();
const artist = await artistRepo.findOne({
    filter: { field: 'name', operator: 'eq', value: 'Artist Name' },
});

// Update
artist.updateBio('New bio');
await artistRepo.updateEntity(artist);

// Delete
await artistRepo.delete('id');

// Count
const total = await artistRepo.count();
const filtered = await artistRepo.count({ field: 'country', operator: 'eq', value: 'Spain' });
```

---

## 🔄 Unit of Work (Transacciones)

### Automático con Decorator

```typescript
@Injectable()
export class ArtistService {
    constructor(private readonly artistRepo: ArtistRepository) {}

    @UnitOfWork()
    async createArtistWithAlbums(data: CreateArtistDto): Promise<Artist> {
        // Todo dentro de una transacción automática
        const artist = await this.artistRepo.save(new Artist(...));
        const album1 = await this.albumRepo.save(new Album(...));
        const album2 = await this.albumRepo.save(new Album(...));

        // Si algo falla, todo hace rollback automáticamente
        return artist;
    }
}
```

### Manual

```typescript
await this.unitOfWork.executeInTransaction(async () => {
    const artist = await this.artistRepo.save(new Artist(...));
    const album = await this.albumRepo.save(new Album(...));
    // Todo dentro de una transacción
});
```

---

## 🎨 Type Inference

### InferFields

Infiere campos del schema excluyendo `id`, `createdAt`, `updatedAt`.

```typescript
import { InferFields } from '@api/modules/core/database/base';

type ArtistFields = InferFields<typeof artists>;
// type ArtistFields = 'name' | 'country' | 'bio'

// Uso en filtros
const filter: Filter<ArtistFields> = {
    field: 'name', // ✅ Type-safe
    operator: 'eq',
    value: 'Test',
};
```

### InferRelations

Infiere tipos de relaciones correctamente (arrays vs single entities).

```typescript
import { InferRelations } from '@api/modules/core/database/base';

const artistRelations = defineRelations({
    albums: relation.oneToMany({ entity: Album, table: albums, foreignKey: 'artistId' }),
});

type ArtistRelationsType = InferRelations<typeof artistRelations>;
// type ArtistRelationsType = { albums: Album[] } ✅ Array inferido correctamente

const artist = await artistRepo.findById(1, { with: ['albums'] });
artist.albums; // Album[] ✅ Type-safe!
```

### defineRelations

Helper para mejor IntelliSense.

```typescript
import { defineRelations, relation } from '@api/modules/core/database/base';

// ✅ RECOMENDADO: Usa defineRelations
const artistRelations = defineRelations({
    albums: relation.oneToMany({
        entity: Album,
        table: albums,
        foreignKey: 'artistId',
    }),
});

// ❌ ANTIGUO: Sin helper (funciona pero menos IntelliSense)
const artistRelations = {
    albums: relation.oneToMany({
        entity: Album,
        table: albums,
        foreignKey: 'artistId',
    }),
} as const;
```

---

## 🧪 Testing

```typescript
describe('ArtistRepository', () => {
    let repository: ArtistRepository;

    beforeEach(() => {
        repository = createTestRepository(ArtistRepository);
    });

    it('should find artist by country', async () => {
        const artists = await repository.findByCountry('Spain');
        expect(artists).toHaveLength(5);
        expect(artists.every((a) => a.country === 'Spain')).toBe(true);
    });

    it('should load albums relation', async () => {
        const artist = await repository.findById('id', { with: ['albums'] });
        expect(artist.albums).toBeDefined();
        expect(Array.isArray(artist.albums)).toBe(true);
    });

    it('should filter with complex conditions', async () => {
        const artists = await repository.findMany({
            filter: {
                operator: 'and',
                conditions: [
                    { field: 'country', operator: 'eq', value: 'Spain' },
                    { field: 'name', operator: 'ilike', value: '%jazz%' },
                ],
            },
        });

        expect(artists.length).toBeGreaterThan(0);
    });
});
```

---

## 🚀 Best Practices

1. **Usa `defineRelations`** para mejor IntelliSense
2. **Define relaciones como `const`** fuera de la clase
3. **Usa `InferFields` e `InferRelations`** para types
4. **Implementa métodos custom** en repositories cuando sea necesario
5. **Usa `UnitOfWork`** para operaciones que requieren transacciones
6. **Cachea queries caras** cuando sea apropiado
7. **Valida entities** en el domain layer
8. **Separa lógica de negocio** de lógica de persistencia
9. **Testea repositories** con datos reales cuando sea posible
10. **Documenta relaciones complejas** en el código

---

## 🔍 Troubleshooting

### Type errors en relaciones

-   Verificar que usas `typeof relationName` en el generic
-   Asegurarte de que las relaciones están definidas como `const`

### Relaciones no cargan

-   Verificar que el `foreignKey` existe en la tabla correcta
-   Comprobar que la entidad está registrada en el registry

### Traducciones no funcionan

-   Verificar que extiendes `BaseTranslatableRepository`
-   Comprobar que implementas todos los métodos requeridos

### Performance lenta

-   Añadir índices en campos frecuentemente filtrados
-   Limitar relaciones cargadas solo a las necesarias
-   Usar paginación para resultados grandes

---

## 📝 Próximas Mejoras

-   [ ] Soft delete automático
-   [ ] Audit trail (createdBy, updatedBy)
-   [ ] Optimistic locking
-   [ ] Query caching avanzado
-   [ ] Eager/Lazy loading configurable
