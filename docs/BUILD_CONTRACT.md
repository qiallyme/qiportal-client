# QiPortal Build Contract

## Monorepo Layout

```
qiportal-client/
├── apps/
│   ├── client/                    # Main client application
│   │   ├── index.html
│   │   ├── public/
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── admin/                     # Admin application
│       ├── index.html
│       ├── public/
│       ├── src/
│       ├── tsconfig.json
│       └── vite.config.ts
├── shared/                        # Shared code and utilities
│   ├── auth/                      # Authentication components
│   ├── lib/                       # Utility libraries
│   ├── hooks/                     # Custom React hooks
│   └── schema.ts                  # Shared TypeScript schemas
├── packages/
│   └── ui/                        # UI component library
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── components/        # UI components
│       │   └── index.ts           # Export barrel
│       └── README.md
├── configs/                       # Centralized configuration
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── components.json
│   └── drizzle.config.ts
├── server/                        # Backend server
├── sql/                          # Database schemas and migrations
├── scripts/                      # Build and utility scripts
├── docs/                         # Documentation
└── archive/                      # Legacy code (if any)
```

## TypeScript Path Aliases

Root `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["apps/client/src/*"],
      "@admin/*": ["apps/admin/src/*"],
      "@shared/*": ["shared/*"],
      "@ui/*": ["packages/ui/src/*"]
    }
  }
}
```

## Tailwind Configuration

`configs/tailwind.config.js`:
```js
module.exports = {
  content: [
    "./apps/**/index.html",
    "./apps/**/src/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{ts,tsx}",
    "./packages/ui/src/**/*.{ts,tsx}"
  ],
  // ... rest of config
}
```

## Workspace Configuration

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "shared"
  - "server"
```

## Root Package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"pnpm run dev:client\" \"pnpm run dev:admin\" \"pnpm run dev:server\"",
    "dev:client": "pnpm --filter client dev",
    "dev:admin": "pnpm --filter admin dev",
    "dev:server": "pnpm --filter server dev",
    "build": "pnpm run build:client && pnpm run build:admin && pnpm run build:server",
    "build:client": "pnpm --filter client build",
    "build:admin": "pnpm --filter admin build",
    "build:server": "pnpm --filter server build",
    "start": "node server/dist/index.js",
    "typecheck": "pnpm run typecheck:client && pnpm run typecheck:admin && pnpm run typecheck:server",
    "typecheck:client": "pnpm --filter client typecheck",
    "typecheck:admin": "pnpm --filter admin typecheck",
    "typecheck:server": "pnpm --filter server typecheck"
  }
}
```

## One-Liner Commands

**Development:**
```bash
pnpm install && pnpm dev
```

**Production:**
```bash
pnpm install --frozen-lockfile && pnpm run build && pnpm start
```

## Entry Points

- **Client App**: `apps/client/src/main.tsx`
- **Admin App**: `apps/admin/src/main.tsx`
- **Server**: `server/index.ts`

## CSS Import Strategy

- `shared/index.css` contains Tailwind directives
- Each app imports CSS from `@shared/index.css`
- UI components use Tailwind classes directly

## Build Outputs

- **Client**: `apps/client/dist/`
- **Admin**: `apps/admin/dist/`
- **Server**: `server/dist/`
