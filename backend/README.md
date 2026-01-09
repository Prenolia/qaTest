# QA Testbed Backend

A simple Bun + Elysia backend API for QA testing purposes.

## Prerequisites

- [Bun](https://bun.sh) installed

## Installation

```bash
cd backend
bun install
```

## Running the Server

```bash
# Development mode (with auto-reload)
bun run dev

# Production mode
bun run start
```

The server will run on `http://localhost:3001`

## API Endpoints

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

## Example Requests

```bash
# Get all users
curl http://localhost:3001/api/users

# Create a user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"User"}'

# Test slow endpoint
curl http://localhost:3001/api/slow

# Test unreliable endpoint
curl http://localhost:3001/api/unreliable

# Test configurable delay
curl http://localhost:3001/api/delay?ms=3000
```
