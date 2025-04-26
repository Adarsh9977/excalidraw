# Excalidraw

This is a monorepo for Excalidraw project using Turborepo.

## What's inside?

This repository includes the following packages/apps:

### Apps

- `excalidraw-frontend`: A [Next.js](https://nextjs.org/) app for the main Excalidraw interface
- `http-backend`: Express.js backend service for HTTP API endpoints
- `ws-backend`: WebSocket backend service for real-time collaboration

### Packages

- `@repo/common`: Shared types and utilities
- `@repo/db`: Database client and Prisma schema
- `@repo/ui`: React component library shared across applications
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This project has some additional tools already setup:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Docker](https://www.docker.com/) for containerization
- [Prisma](https://www.prisma.io/) for database ORM

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 10.8.1
- Docker and Docker Compose

### Development

1. Install dependencies:
```sh
pnpm install
```
