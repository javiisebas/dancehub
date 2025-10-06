# Sistema de Relaciones - Guía de Uso

## Características

- ✅ **Zero Configuration**: Las relaciones se definen directamente en el repositorio
- ✅ **Batch Loading Automático**: Optimiza N+1 queries sin esfuerzo
- ✅ **Type-Safe**: TypeScript te ayuda en todo momento
- ✅ **Helpers Incorporados**: Para los casos más comunes (OneToMany, ManyToOne, etc.)
- ✅ **Flexible**: Puedes crear loaders personalizados para casos complejos

## Uso Básico

### 1. Definir Relaciones en el Repositorio

```typescript
import { BaseRepository, RelationHelpers } from '@api/modules/core/database/base';

@Injectable()
export class UserRepositoryImpl extends BaseRepository<User, typeof users, UserField> {
    protected table = users;
    protected entityName = 'User';

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
        @Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository,
        @Inject(PROFILE_REPOSITORY) private readonly profileRepository: IProfileRepository,
    ) {
        super(databaseService, unitOfWorkService, logger);
    }

    // Define tus relaciones aquí
    protected configureRelations(): void {
        // ONE TO MANY: Un usuario tiene muchos posts
        this.relation('posts').many(
            RelationHelpers.oneToMany(this.postRepository, 'userId')
        );

        // ONE TO ONE: Un usuario tiene un perfil
        this.relation('profile').one(
            RelationHelpers.oneToOne(this.profileRepository, 'userId')
        );
    }

    // ... resto del código
}
```

### 2. Usar las Relaciones

```typescript
// Cargar usuario con posts
const user = await userRepository.findById('123', {
    relations: ['posts']
});
// user.posts estará disponible

// Cargar usuario con perfil
const user = await userRepository.findById('123', {
    relations: ['profile']
});
// user.profile estará disponible

// Cargar múltiples relaciones
const user = await userRepository.findById('123', {
    relations: ['posts', 'profile']
});
// Ambos estarán disponibles

// También funciona con findMany y paginate
const users = await userRepository.findMany(
    { field: 'status', operator: FilterOperator.EQ, value: 'active' },
    undefined,
    undefined,
    { relations: ['posts', 'profile'] }
);
// Batch loading automático: una sola query por relación, sin importar cuántos usuarios
```

## Tipos de Relaciones

### ONE TO MANY

```typescript
// Ejemplo: Usuario -> Posts
this.relation('posts').many(
    RelationHelpers.oneToMany(this.postRepository, 'userId')
);
```

### MANY TO ONE

```typescript
// Ejemplo: Post -> Autor
this.relation('author').one(
    RelationHelpers.manyToOne(this.userRepository, 'userId')
);
```

### ONE TO ONE

```typescript
// Ejemplo: Usuario -> Perfil
this.relation('profile').one(
    RelationHelpers.oneToOne(this.profileRepository, 'userId')
);
```

### MANY TO MANY

```typescript
// Ejemplo: Usuario -> Roles (a través de user_roles)
this.relation('roles').many(
    RelationHelpers.manyToManyViaJunction(
        this.roleRepository,
        async (userIds) => {
            // Carga los registros de la tabla intermedia
            const junctions = await this.db
                .select()
                .from(userRoles)
                .where(inArray(userRoles.userId, userIds));
            
            return junctions.map(j => ({
                parentId: j.userId,
                relatedId: j.roleId
            }));
        }
    )
);
```

### CUSTOM LOADER

Para casos más complejos:

```typescript
this.relation('recentPosts').many(
    RelationHelpers.custom(async (userIds) => {
        // Tu lógica personalizada
        const posts = await this.db
            .select()
            .from(postsTable)
            .where(inArray(postsTable.userId, userIds))
            .orderBy(desc(postsTable.createdAt))
            .limit(5);

        // Agrupa por userId
        const grouped = new Map<string | number, Post[]>();
        for (const userId of userIds) {
            grouped.set(userId, []);
        }
        
        for (const post of posts) {
            const postDomain = this.postToDomain(post);
            grouped.get(post.userId)?.push(postDomain);
        }

        return grouped;
    })
);
```

## Ejemplo Completo: Post Repository

```typescript
import { 
    BaseRepository, 
    RelationHelpers,
    WithRelationsOptions 
} from '@api/modules/core/database/base';
import { Injectable, Inject } from '@nestjs/common';
import { Post } from '../../domain/entities/post.entity';
import { USER_REPOSITORY } from '@api/modules/user/domain/repositories/i-user.repository';
import { COMMENT_REPOSITORY } from '../domain/repositories/i-comment.repository';
import { TAG_REPOSITORY } from '../domain/repositories/i-tag.repository';

@Injectable()
export class PostRepositoryImpl 
    extends BaseRepository<Post, typeof posts, PostField> 
{
    protected table = posts;
    protected entityName = 'Post';

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        @Inject(COMMENT_REPOSITORY) private readonly commentRepository: ICommentRepository,
        @Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository,
    ) {
        super(databaseService, unitOfWorkService, logger);
    }

    protected configureRelations(): void {
        // MANY TO ONE: Post -> Autor
        this.relation('author').one(
            RelationHelpers.manyToOne(this.userRepository, 'userId')
        );

        // ONE TO MANY: Post -> Comentarios
        this.relation('comments').many(
            RelationHelpers.oneToMany(this.commentRepository, 'postId')
        );

        // MANY TO MANY: Post -> Tags
        this.relation('tags').many(
            RelationHelpers.manyToManyViaJunction(
                this.tagRepository,
                async (postIds) => {
                    const junctions = await this.db
                        .select()
                        .from(postTags)
                        .where(inArray(postTags.postId, postIds));
                    
                    return junctions.map(j => ({
                        parentId: j.postId,
                        relatedId: j.tagId
                    }));
                }
            )
        );
    }

    protected toDomain(schema: typeof posts.$inferSelect): Post {
        return new Post(
            schema.id,
            schema.title,
            schema.content,
            schema.userId,
            schema.createdAt,
            schema.updatedAt
        );
    }

    protected toSchema(entity: Post): any {
        return {
            title: entity.title,
            content: entity.content,
            userId: entity.userId,
        };
    }
}
```

### Usando el Post Repository con Relaciones

```typescript
// En tu handler o servicio
@Injectable()
export class GetPostHandler {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository
    ) {}

    async execute(id: string) {
        // Cargar post con todas sus relaciones
        const post = await this.postRepository.findById(id, {
            relations: ['author', 'comments', 'tags']
        });

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author, // Usuario completo
            comments: post.comments, // Array de comentarios
            tags: post.tags, // Array de tags
        };
    }
}

// Para listados con batch loading
@Injectable()
export class GetPostsHandler {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository
    ) {}

    async execute(request: PaginatedPostRequest) {
        // Carga 10 posts con sus autores
        // Solo hace 2 queries: una para posts, una para autores
        const result = await this.postRepository.paginate(request, {
            relations: ['author', 'tags']
        });

        return result;
    }
}
```

## Ventajas de este Sistema

1. **No contamina las entidades de dominio**: Las relaciones están en la capa de infraestructura
2. **Batch loading automático**: El sistema agrupa queries para evitar N+1
3. **Opt-in**: Solo cargas lo que necesitas cuando lo necesitas
4. **Type-safe**: TypeScript te ayuda a no equivocarte
5. **Flexible**: Puedes hacer loaders customizados para casos complejos
6. **Compatible con traducciones**: Funciona perfecto con entidades traducibles

## Notas Importantes

- Las relaciones se configuran **solo una vez** en `configureRelations()`
- El batch loading funciona automáticamente con `findMany()` y `paginate()`
- Puedes mezclar diferentes tipos de relaciones sin problema
- Los helpers cubren el 99% de los casos de uso
- Para casos especiales, usa `RelationHelpers.custom()`

