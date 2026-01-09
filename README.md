# QA Testbed

A comprehensive testing environment for QA scenarios, featuring a React 19 + TypeScript frontend and a Bun + Elysia backend.

## Overview

This testbed provides a realistic application environment for testing various QA scenarios including:
- UI testing (forms, tables, navigation, video player)
- API testing (CRUD operations, error handling, performance)
- Error state testing (500 errors, unreliable endpoints)
- Loading state testing (slow responses, configurable delays)
- Form validation (client and server-side with React Hook Form + Zod)

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 7 for build tooling
- Tailwind CSS v4 for styling
- Shadcn UI components
- React Router for navigation
- TanStack Query (React Query) for data fetching
- TanStack Table for data tables
- React Hook Form + Zod for form validation
- react-player for video integration

### Backend
- Bun runtime
- Elysia framework
- TypeScript
- In-memory data store
- Architecture: Controllers → Services → Repositories → Models

## Project Structure

```
qaTest/
├── backend/                    # Bun + Elysia API server
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── models/            # Data type definitions
│   │   ├── types/             # Common types
│   │   ├── utils/             # Helper functions
│   │   └── index.ts           # Main server (port 3001)
│   └── package.json
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # UI components (Shadcn)
│   │   ├── hooks/             # React Query hooks
│   │   ├── lib/               # Utilities and API client
│   │   ├── pages/             # Application pages
│   │   ├── types/             # TypeScript declarations
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0+ (recommended for both frontend and backend)
- Node.js v18+ (alternative for frontend)

### 1. Start the Backend

```bash
cd backend
bun install
bun run dev
```

Backend will run on `http://localhost:3001`

### 2. Start the Frontend

```bash
cd frontend
bun install
bun run dev
```

Frontend will run on `http://localhost:5173`

### 3. Visit the Application

- Frontend: http://localhost:5173
- Backend Health: http://localhost:3001/api/health

## Frontend Pages

### 1. Home (`/`)
- Navigation hub with links to all pages
- Backend status indicator (online/offline)
- API endpoints overview
- Quick start guide

### 2. Users Table (`/users`)
- Full CRUD operations with TanStack Query
- Features:
  - Search filter (debounced)
  - Sort by name, email, or date
  - Status filter (active, inactive, pending)
  - Role filter (User, Manager, Admin)
  - Pagination with page size selector
  - Create/Edit/Delete dialogs
  - View user details
  - Reset data button
  - Loading skeletons
  - Empty state

### 3. Video Player (`/video`)
- Video player using react-player
- Features:
  - Custom URL input
  - Sample videos (YouTube and MP4)
  - Play/Pause controls
  - Volume slider with mute
  - Progress bar with seeking
  - Skip forward/back buttons
  - Ready/Playing status indicators

### 4. Form Validation (`/form`)
- React Hook Form + Zod validation
- Fields:
  - Name (required, min 2 chars)
  - Email (required, valid format)
  - Role (required, select: User/Manager/Admin)
- Real-time inline validation
- Server-side validation via `/api/validate`
- Success/error toast notifications

### 5. Loading & Errors (`/status`)
- Simulation testing buttons:
  - Slow endpoint (random 2-5s delay)
  - Unreliable endpoint (50% error rate)
  - Error endpoint (always 500)
  - Configurable delay (custom ms)
- Response time display
- Request history log

## Backend API Endpoints

Base URL: `http://localhost:3001`

### Health & Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with version |
| POST | `/api/reset` | Reset data to initial state |

### Users CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (paginated, searchable, sortable) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Users Query Parameters
- `page` - Page number (default: 1)
- `pageSize` - Users per page (default: 10)
- `search` - Search by name or email
- `sortBy` - Sort field: `name` | `email` | `updatedAt`
- `sortDir` - Sort direction: `asc` | `desc`
- `status` - Filter: `active` | `inactive` | `pending`
- `role` - Filter: `User` | `Manager` | `Admin`

### User Model
```typescript
{
  id: string
  name: string
  email: string
  role: 'User' | 'Manager' | 'Admin'
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
}
```

### Form Validation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/validate` | Validate form `{ name, email, role }` |

### Test Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slow` | Random 2-5 second delay |
| GET | `/api/unreliable` | 50% chance of error |
| GET | `/api/error` | Always returns 500 error |
| GET | `/api/delay?ms=N` | Configurable delay (ms) |

## Testing Scenarios

### What QA Should Test

#### Navigation & Routing
- [ ] All routes accessible via navigation
- [ ] Browser back/forward works correctly
- [ ] Page refresh maintains state
- [ ] Direct URL access works

#### Users Table
- [ ] Users load on page visit
- [ ] Search filters results in real-time
- [ ] Sort toggles work (name, email, date)
- [ ] Status filter works
- [ ] Role filter works
- [ ] Pagination works
- [ ] Create new user works
- [ ] Edit user works
- [ ] Delete user with confirmation works
- [ ] View user details works
- [ ] Reset data restores initial users
- [ ] Empty state shows when no results
- [ ] Loading skeleton during fetch
- [ ] Error state when backend is offline

#### Video Player
- [ ] YouTube URL plays correctly
- [ ] Direct MP4 URL plays correctly
- [ ] Play/pause controls work
- [ ] Volume and mute work
- [ ] Seeking via progress bar works
- [ ] Skip forward/back buttons work
- [ ] Invalid URL shows error state

#### Form Validation
- [ ] Invalid name shows error (< 2 chars)
- [ ] Invalid email shows error
- [ ] Missing role shows error
- [ ] Valid form submits successfully
- [ ] Server validation errors display
- [ ] Success toast appears
- [ ] Reset clears all fields

#### Loading & Errors Page
- [ ] Slow endpoint delays 2-5 seconds
- [ ] Unreliable endpoint is ~50/50 success/failure
- [ ] Error endpoint always returns 500
- [ ] Configurable delay respects input value
- [ ] Progress bar shows during slow requests
- [ ] Request history logs correctly

## Environment Variables

### Frontend (`.env.local`)
```bash
VITE_API_URL=http://localhost:3001
```

## Development

### Frontend Commands
```bash
bun run dev      # Start dev server
bun run build    # Build for production
bun run preview  # Preview production build
bun run lint     # Run ESLint
```

### Backend Commands
```bash
bun run dev      # Start with watch mode
bun run start    # Start production
```

## Architecture Notes

- Frontend uses TanStack Query for server state management
- All API calls go through centralized `lib/api.ts` with request ID tracing
- Shadcn UI components are in `components/ui/`
- Forms use React Hook Form with Zod schema validation
- Backend follows clean architecture: Controllers → Services → Repositories
- Backend uses in-memory store (resets on restart)
- Use `POST /api/reset` to restore initial data with 12 sample users
