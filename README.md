# ChittyOS Standard Framework Installer

Official installer for the ChittyOS Standard Framework - a comprehensive integration platform for ChittyApps ecosystem.

## Overview

The ChittyOS Standard Framework provides a unified foundation for building and integrating ChittyApps applications. It includes shared dependencies, UI components, utilities, and seamless integration capabilities.

## Features

- **Unified Dependencies**: Centralized management of all common dependencies
- **Shared UI Components**: Pre-built Radix UI and shadcn/ui components
- **Framework Integration**: Seamless integration between multiple ChittyApps
- **Database Support**: Built-in PostgreSQL/Neon database configuration
- **Authentication**: Ready-to-use authentication system
- **Docker Support**: Optional containerization configuration

## Installation

### Quick Install

```bash
npx @chittyos/standard-installer
```

Or with npm:

```bash
npm install -g @chittyos/standard-installer
chitty-install
```

### Manual Installation

1. Clone the installer:
```bash
git clone https://github.com/ChittyOS/standard-installer.git
cd chittystandard-installer
npm install
```

2. Run the installer:
```bash
npm run install-standard
```

## Installation Options

### Framework Levels

- **Minimal**: Core dependencies only (no apps)
- **Standard** (Recommended): Essential apps (ChittyResolution, ChittyChronicle)
- **Professional**: Full legal suite (5 apps)
- **Enterprise**: Complete ecosystem (all 8+ apps)
- **Custom**: Select specific apps to install

### Available ChittyApps

| App | Description | Category |
|-----|-------------|----------|
| **ChittyResolution** | Dispute resolution & case management | Legal |
| **ChittyChronicle** | Timeline management & litigation support | Legal |
| **ChittyEvidence** | Evidence tracking & verification | Legal |
| **ChittyFlow** | Workflow automation & process management | Automation |
| **ChittyIntel** | AI-powered legal intelligence & analysis | Intelligence |
| **ChittyTrace** | Document processing & litigation support | Legal |
| **ChittyCloude** | Universal cloud deployment (Cloudflare, Vercel, etc.) | Deployment |
| **Contradiction Engine** | Logic analysis & contradiction detection | Analysis |

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/chittydb
SESSION_SECRET=your-secret-key
VITE_API_URL=http://localhost:3000
```

### ChittyOS Config

The installer creates `src/chitty.config.ts` with your selected configuration:

```typescript
export const chittyConfig = {
  framework: 'standard',
  version: '1.0.0',
  apps: ['chittyresolution', 'chittychronicle'],
  features: {
    database: true,
    authentication: true,
    docker: false
  }
};
```

## Project Structure

```
my-chittyapp/
├── src/
│   ├── chitty.config.ts    # Framework configuration
│   ├── auth/               # Authentication setup
│   ├── db/                 # Database schema
│   └── components/         # Your components
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── drizzle.config.ts      # Database config
└── docker-compose.yml     # Optional Docker setup
```

## Commands

### Check Dependencies
```bash
npm run check-deps
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Shared Dependencies

The ChittyOS Standard Framework includes:

- **UI Framework**: React 18, TypeScript 5
- **Styling**: Tailwind CSS, CSS-in-JS
- **Components**: Radix UI, shadcn/ui, Lucide icons
- **State Management**: Zustand, React Query
- **Forms**: React Hook Form, Zod validation
- **Database**: Drizzle ORM, PostgreSQL/Neon
- **Utilities**: date-fns, nanoid, clsx

## System Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)
- Git 2.0.0 or higher
- PostgreSQL 14+ (if using database features)

## Troubleshooting

### Installation Fails

1. Check system requirements:
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

2. Clear npm cache:
```bash
npm cache clean --force
```

3. Try with different package manager:
```bash
yarn create @chittyos/app
# or
pnpm create @chittyos/app
```

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
psql --version
```

2. Check connection string in `.env`
3. Run database migrations:
```bash
npm run db:push
```

### Missing Dependencies

If a ChittyApp fails to install:
```bash
npm install @chittyapps/[app-name] --save
```

## Support

- **Documentation**: [https://docs.chittyos.com](https://docs.chittyos.com)
- **Issues**: [GitHub Issues](https://github.com/ChittyOS/standard-installer/issues)
- **Discord**: [ChittyOS Community](https://discord.gg/chittyos)

## License

MIT © ChittyOS

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

Built with ❤️ by the ChittyOS Team