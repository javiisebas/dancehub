# 🛠️ DanceHub Scripts

Automation scripts for improved developer experience.

## Storage Module Scripts

### Setup Storage

Automated setup for the storage module:

```bash
pnpm storage:setup
```

**What it does:**

-   ✅ Checks Node.js and pnpm
-   ✅ Installs FFmpeg (platform-specific)
-   ✅ Installs Sharp dependencies
-   ✅ Checks/creates .env file
-   ✅ Installs npm dependencies
-   ✅ Optionally generates/pushes DB migrations

### Verify Storage

Check if storage module is ready:

```bash
pnpm storage:verify
```

**What it checks:**

-   ✅ Storage module exists
-   ✅ FFmpeg installed
-   ✅ Sharp (image processing)
-   ✅ Socket.IO (real-time)
-   ✅ AWS SDK (R2 storage)
-   ✅ Environment variables
-   ✅ Disk space (/tmp)

**Output:**

-   Green ✓ = Success
-   Yellow ⚠ = Warning
-   Red ✗ = Error

## Other Scripts

### Code Generation

```bash
pnpm generate
# or
pnpm g
```

Interactive generator for entities, modules, handlers, etc.

### Database

```bash
pnpm db:generate  # Generate migrations
pnpm db:push      # Push to database
pnpm db:studio    # Open Drizzle Studio
```

## Creating New Scripts

1. Create script in `scripts/` directory
2. Make executable: `chmod +x scripts/your-script.sh`
3. Add to `package.json` scripts section
4. Document here

---

For more information, see the main documentation in each module.
