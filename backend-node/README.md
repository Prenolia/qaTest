# Node.js Alternative Backend

This is an alternative Node.js + Express implementation of the backend for environments where Bun is not available. The primary backend uses Bun + Elysia (see `../backend`), but this version provides the same functionality using Node.js.

## Prerequisites

- Node.js v16+

## Installation

```bash
cd backend-node
npm install
```

## Running the Server

```bash
# Development mode (with auto-reload on Node 18+)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

This backend provides the same endpoints as the Bun backend:

### Standard CRUD Endpoints

- `GET /` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Test Endpoints (for QA scenarios)

- `GET /api/slow` - Returns after a random 2-5 second delay
- `GET /api/unreliable` - Randomly succeeds or fails (50% chance each)
- `GET /api/error` - Always returns an error response
- `GET /api/delay?ms=<milliseconds>` - Configurable delay (max 10 seconds)
- `POST /api/validate` - Form validation endpoint (expects: name, email, age)

See the [main backend README](../backend/README.md) for example requests.
