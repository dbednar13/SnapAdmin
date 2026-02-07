# SnapAdmin

Web based UI for SnapRaid. Inspired and influenced heavily by [Elucidate](https://github.com/Smurf-IV/Elucidate). If you wish for an application to manage your SnapRaid installation I recommend checking them out.

## Project Structure

This is a PNPM monorepo containing two packages:

- **backend** - TypeScript Express web server (port 3000)
- **webapp** - Vite + React + TypeScript frontend (port 5173)

## Prerequisites

- Node.js 18+
- PNPM 8+

## Installation

Install all dependencies from the root:

```bash
pnpm install
```

## Development

Run both packages in development mode:

```bash
pnpm dev
```

Or run them individually:

```bash
# Backend only
pnpm backend:dev

# Webapp only
pnpm webapp:dev
```

## Building

Build all packages:

```bash
pnpm build
```

Or build individually:

```bash
# Backend only
pnpm backend:build

# Webapp only
pnpm webapp:build
```

## Package Details

### Backend (`packages/backend`)

- Express server with TypeScript
- Runs on http://localhost:3000
- API endpoints:
  - `GET /` - Welcome message
  - `GET /api/health` - Health check

### Webapp (`packages/webapp`)

- Vite + React + TypeScript
- Runs on http://localhost:5173
- Hot module replacement enabled
