# WhiteBoard

A real-time collaborative whiteboard built as a Turborepo monorepo. Create boards, invite teammates with roles, and draw together on a shared canvas with live sync over WebSockets.

## Features

- **Authentication** — Sign up and sign in with JWT sessions stored in cookies
- **Dashboard** — Create, list, open, and delete whiteboard rooms
- **Collaborative canvas** — Custom HTML Canvas drawing with circle, rectangle, triangle, pencil, arrow, and eraser tools
- **Stroke controls** — Color palette and stroke width, with light/dark canvas backgrounds
- **Real-time sync** — Shapes stream over WebSockets and persist so boards reload with full history
- **Online presence** — See who is currently in a room
- **Invites & roles** — Email invites with **admin**, **editor**, and **viewer** roles; accept via join link
- **Collaborators management** — List collaborators, change roles, and remove users from a board
- **Profile settings** — Update name, email, bio, and password; appearance and notification preferences
- **Marketing landing page** — Public home page with product overview

## Tech Stack

| Layer | Technologies |
| ----- | ------------ |
| **Monorepo** | pnpm workspaces, Turborepo |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS 4, Radix UI / shadcn-style components, Framer Motion, next-themes |
| **HTTP API** | Express, CORS, JWT, bcrypt |
| **Realtime** | `ws` (WebSocket server) |
| **Database** | PostgreSQL 15, Prisma ORM |
| **Validation** | Zod (shared via `@repo/common`) |
| **Email** | Nodemailer (invite emails) |
| **Tooling** | TypeScript, ESLint, Prettier, esbuild, Docker Compose |
| **CI/CD** | GitHub Actions (backend, frontend, WebSocket deploys) |

## High-Level Architecture

```
┌─────────────────────────────────────┐
│         Browser (Next.js)           │
│      excalidraw-frontend :3000      │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼ HTTP           ▼ WebSocket (?token=JWT)
┌──────────────┐  ┌──────────────────┐
│ http-backend │  │   ws-backend     │
│ Express :3001│  │   ws :8080       │
│              │  │                  │
│ • Auth       │  │ • Join / leave   │
│ • Rooms      │  │ • Shape sync     │
│ • Profile    │  │ • Presence       │
│ • Invites    │  │                  │
│ • Chat/load  │  │                  │
└──────┬───────┘  └────────┬─────────┘
       │                   │
       └─────────┬─────────┘
                 ▼
        ┌────────────────┐
        │  PostgreSQL    │
        │  Prisma (@repo/db)
        │                │
        │ User · Room    │
        │ RoomUser · Chat│
        └────────────────┘
```

### How it fits together

1. **Frontend** talks to the HTTP API for auth, boards, collaborators, and loading drawing history.
2. **WebSocket backend** handles live room membership, shape broadcasts, and online users.
3. **Both backends** share the same Postgres database through `@repo/db` (Prisma).
4. **Invite emails** are sent from a Next.js API route (`/api/invite/[userId]`) using Nodemailer; join links are verified by the HTTP backend.

### Drawing sync (short path)

1. Client joins a room over WebSocket with a JWT.
2. On stroke end, the shape is sent as a `chat` message (JSON).
3. `ws-backend` persists it as a `Chat` row and broadcasts to peers in the room.
4. On open/reload, `GET /chats/:roomId` hydrates the canvas from stored shapes.

## Monorepo Structure

### Apps

| App | Role | Port |
| --- | ---- | ---- |
| `excalidraw-frontend` | Next.js UI + invite email route | `3000` |
| `http-backend` | REST API (auth, rooms, profile, chats) | `3001` |
| `ws-backend` | Real-time collaboration & presence | `8080` |

### Packages

| Package | Role |
| ------- | ---- |
| `@repo/common` | Shared Zod schemas and utilities |
| `@repo/db` | Prisma schema and database client |
| `@repo/ui` | Shared React components |
| `@repo/eslint-config` | Shared ESLint config |
| `@repo/typescript-config` | Shared TypeScript config |

## Data Model

- **User** — email, password, name, optional avatar/bio
- **Room** — whiteboard board (unique slug, admin)
- **RoomUser** — collaboration membership with role (`admin` \| `editor` \| `viewer`)
- **Chat** — persisted drawing messages (shape JSON per stroke)

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

2. Start Postgres (and optionally the full stack) with Docker:

```sh
pnpm docker:up
# or: docker compose up -d
```

3. Generate the Prisma client and apply migrations:

```sh
pnpm db:generate
pnpm db:migrate
```

4. Run all apps in development:

```sh
pnpm dev
```

### Useful scripts

| Script | Description |
| ------ | ----------- |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint the monorepo |
| `pnpm format` | Format with Prettier |
| `pnpm check-types` | Type-check across the workspace |
| `pnpm docker:up` | Start Docker Compose services |

### Default local ports

| Service | URL |
| ------- | --- |
| Frontend | http://localhost:3000 |
| HTTP API | http://localhost:3001 |
| WebSocket | ws://localhost:8080 |
| Postgres | localhost:5432 |
