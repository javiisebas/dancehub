import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class RepositoryRegistry implements OnModuleInit {
    // CACHE STRATEGY: Cache repository instances only (singletons)
    // Repositories are stateless services, safe to cache
    // Used for dynamic nested relation loading
    private repositories = new Map<string, any>();
    private repositoryTokens = new Map<string, symbol>();

    constructor(private moduleRef: ModuleRef) {}

    onModuleInit() {
        // Registry is ready after all modules are initialized
    }

    register(entityName: string, repository: any, token?: symbol): void {
        this.repositories.set(entityName.toLowerCase(), repository);
        if (token) {
            this.repositoryTokens.set(entityName.toLowerCase(), token);
        }
    }

    get<T = any>(entityName: string): T | undefined {
        return this.repositories.get(entityName.toLowerCase());
    }

    getByToken<T = any>(token: symbol): T | undefined {
        for (const [name, repoToken] of this.repositoryTokens.entries()) {
            if (repoToken === token) {
                return this.repositories.get(name);
            }
        }
        return undefined;
    }

    has(entityName: string): boolean {
        return this.repositories.has(entityName.toLowerCase());
    }

    getAll(): Map<string, any> {
        return new Map(this.repositories);
    }

    clear(): void {
        this.repositories.clear();
        this.repositoryTokens.clear();
    }
}
