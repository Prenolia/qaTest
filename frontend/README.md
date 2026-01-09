# QA Testbed Frontend

A React-based frontend for testing various UI patterns and API interactions.

## Prerequisites

- Node.js (v16 or higher) or Bun

## Installation

```bash
cd frontend
npm install
# or
bun install
```

## Running the Application

```bash
# Development mode
npm run dev
# or
bun run dev
```

The application will run on `http://localhost:3000`

## Building for Production

```bash
npm run build
# or
bun run build
```

## Features

### Pages

1. **Home** - Overview and documentation
2. **Users Table** - Data table with CRUD operations
   - View all users
   - Add new users
   - Edit existing users
   - Delete users
   - Demonstrates table UI patterns and state management

3. **Forms** - Form validation testing
   - Client-side validation
   - Server-side validation
   - Real-time error feedback
   - Form reset functionality

4. **Loading/Errors** - Various loading and error states
   - Slow response simulation (2-5 seconds)
   - Unreliable endpoint (50% error rate)
   - Always-error endpoint
   - Custom delay configuration

## Technology Stack

- React 18
- React Router for navigation
- Vite for build tooling
- Vanilla CSS for styling
