# How to Create a Feature

Complete guide for creating features in the web application.

## Example: Profile Feature

### Step 1: Generate DTOs

```bash
pnpm cli generate:dto UpdateProfile
```

### Step 2: Create Zod Schema

```typescript
// src/features/profile/schemas/profile.schemas.ts
import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
```

### Step 3: Create Server Action

```typescript
// src/features/profile/actions/profile.actions.ts
'use server';

import { authenticatedActionClient } from '@web/core/lib';
import { updateProfileSchema } from '../schemas';
import { profileService } from '../api/profile.service';

export const updateProfileAction = authenticatedActionClient
    .schema(updateProfileSchema)
    .action(async ({ parsedInput, ctx }) => {
        const updatedProfile = await profileService.update(ctx.userId, parsedInput);

        return {
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile,
        };
    });
```

### Step 4: Create API Service

```typescript
// src/features/profile/api/profile.service.ts
import { apiClient } from '@web/shared/api';
import type { UpdateProfileInput } from '../schemas';

export const profileService = {
    update: async (userId: string, data: UpdateProfileInput) => {
        return apiClient.patch(`/users/${userId}/profile`, data);
    },

    getProfile: async (userId: string) => {
        return apiClient.get(`/users/${userId}/profile`);
    },
};
```

### Step 5: Create Form Component

```typescript
// src/features/profile/components/update-profile-form.tsx
'use client';

import { AutoForm } from '@web/shared/components/forms';
import { useRouter } from 'next/navigation';
import { updateProfileAction, updateProfileSchema } from '../';

interface UpdateProfileFormProps {
    defaultValues?: {
        firstName?: string;
        lastName?: string;
        bio?: string;
    };
}

export function UpdateProfileForm({ defaultValues }: UpdateProfileFormProps) {
    const router = useRouter();

    return (
        <AutoForm
            schema={updateProfileSchema}
            action={updateProfileAction}
            defaultValues={defaultValues}
            submitText="Update Profile"
            onSuccess={() => {
                router.refresh();
            }}
            fieldConfig={{
                firstName: {
                    label: 'First Name',
                    placeholder: 'John',
                },
                lastName: {
                    label: 'Last Name',
                    placeholder: 'Doe',
                },
                bio: {
                    label: 'Bio',
                    placeholder: 'Tell us about yourself...',
                },
            }}
        />
    );
}
```

### Step 6: Use in a Page

```typescript
// src/app/[locale]/(protected)/profile/page.tsx
import { UpdateProfileForm } from '@web/features/profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@web/app/api/auth/[...nextauth]/options';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="container max-w-2xl py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

            <UpdateProfileForm
                defaultValues={{
                    firstName: session?.user?.firstName,
                    lastName: session?.user?.lastName,
                    bio: session?.user?.bio,
                }}
            />
        </div>
    );
}
```

## Feature Structure

```
src/features/profile/
├── actions/
│   ├── profile.actions.ts
│   └── index.ts
├── schemas/
│   ├── profile.schemas.ts
│   └── index.ts
├── components/
│   ├── update-profile-form.tsx
│   ├── profile-card.tsx
│   └── index.ts
├── api/
│   ├── profile.service.ts
│   └── index.ts
├── types/
│   └── index.ts
└── index.ts
```

## RBAC Example (Admin Only)

### Server Action

```typescript
// src/features/admin/actions/user-management.actions.ts
'use server';

import { adminActionClient } from '@web/core/lib';
import { deleteUserSchema } from '../schemas';
import { userManagementService } from '../api';

export const deleteUserAction = adminActionClient
    .schema(deleteUserSchema)
    .action(async ({ parsedInput, ctx }) => {
        await userManagementService.deleteUser(parsedInput.userId);

        return {
            success: true,
            message: 'User deleted successfully',
        };
    });
```

### Component with Role Check

```typescript
// src/features/admin/components/delete-user-button.tsx
'use client';

import { useIsAdmin } from '@web/shared/hooks';
import { Button } from '@web/shared/components/ui/button';
import { deleteUserAction } from '../actions';

export function DeleteUserButton({ userId }: { userId: string }) {
    const isAdmin = useIsAdmin();

    if (!isAdmin) return null;

    const handleDelete = async () => {
        const confirmed = confirm('Are you sure?');
        if (!confirmed) return;

        await deleteUserAction({ userId });
    };

    return (
        <Button variant="destructive" onClick={handleDelete}>
            Delete User
        </Button>
    );
}
```

## Quick Commands

```bash
# 1. Generate DTO
pnpm cli generate:dto [FeatureName]

# 2. Create feature structure
mkdir -p src/features/[feature]/{actions,schemas,components,api,types}

# 3. Create base files
touch src/features/[feature]/actions/[feature].actions.ts
touch src/features/[feature]/schemas/[feature].schemas.ts
touch src/features/[feature]/api/[feature].service.ts
touch src/features/[feature]/index.ts
```

## Checklist for New Feature

-   [ ] DTO generated with CLI
-   [ ] Zod schema created
-   [ ] Server action created (with auth if needed)
-   [ ] API service created
-   [ ] Form component created
-   [ ] Types exported
-   [ ] Feature tested in page
-   [ ] Documented in feature index
