# QA Testbed

A comprehensive testing environment for QA candidates, featuring a React frontend and a Bun + Elysia backend.

## Overview

This testbed provides a realistic application environment for testing various QA scenarios including:
- UI testing (forms, tables, navigation)
- API testing (CRUD operations, error handling, performance)
- Error state testing
- Loading state testing
- Form validation (client and server-side)

## Project Structure

```
qaTest/
├── backend/          # Bun + Elysia API server (primary)
│   ├── src/
│   │   └── index.ts  # Main API server
│   └── package.json
├── backend-node/     # Node.js + Express API server (alternative)
│   ├── src/
│   │   └── index.js  # Main API server
│   └── package.json
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── pages/    # Application pages
│   │   ├── App.jsx   # Main app component
│   │   └── main.jsx  # Entry point
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (for backend)
- Node.js v16+ or Bun (for frontend)

### Running the Backend

**Option 1: Bun + Elysia (Primary)**
```bash
cd backend
bun install
bun run dev
```

**Option 2: Node.js + Express (Alternative)**
```bash
cd backend-node
npm install
npm run dev
```

Backend will run on `http://localhost:3001`

### Running the Frontend

```bash
cd frontend
npm install  # or: bun install
npm run dev  # or: bun run dev
```

Frontend will run on `http://localhost:3000`

## Features

### Backend API

The backend provides several endpoints for testing:

**CRUD Operations:**
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Test Endpoints:**
- `GET /api/slow` - Random 2-5 second delay
- `GET /api/unreliable` - 50% chance of error
- `GET /api/error` - Always returns error
- `GET /api/delay?ms=<time>` - Configurable delay
- `POST /api/validate` - Form validation

### Frontend Pages

1. **Home** - Overview and documentation
2. **Users Table** - CRUD operations with data table
3. **Forms** - Client and server-side validation
4. **Loading/Errors** - Various loading and error state scenarios

## Testing Scenarios

This testbed is designed to test:

- ✅ Routing and navigation
- ✅ Form handling and validation
- ✅ Table display and CRUD operations
- ✅ Loading states
- ✅ Error states and error handling
- ✅ API integration
- ✅ Client-side validation
- ✅ Server-side validation
- ✅ Responsive UI patterns

## Documentation

See individual README files in each directory:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
