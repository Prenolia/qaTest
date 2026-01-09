/**
 * QA Testbed API Server
 * Main entry point
 *
 * Architecture:
 * - Controllers: Handle HTTP requests/responses with validation
 * - Services: Single-action business logic
 * - Repositories: Data access layer
 * - Models: Data type definitions
 */

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

import { config } from './config';
import {
  healthController,
  userController,
  formController,
  simulationController,
} from './controllers';

/**
 * Create and configure the Elysia application
 */
function createApp() {
  const app = new Elysia()
    // Enable CORS for frontend communication
    .use(cors())

    // Mount controllers
    .use(healthController)
    .use(userController)
    .use(formController)
    .use(simulationController)

    // Root endpoint - API documentation
    .get('/', () => ({
      status: 'ok',
      message: 'QA Testbed API is running',
      version: config.api.version,
      timestamp: new Date().toISOString(),
      endpoints: {
        users: '/api/users',
        validate: '/api/validate',
        slow: '/api/slow',
        unreliable: '/api/unreliable',
        error: '/api/error',
        delay: '/api/delay?ms=<time>',
      },
    }));

  return app;
}

/**
 * Start the server
 */
function startServer() {
  const app = createApp();

  app.listen(config.server.port);

  printStartupBanner();

  return app;
}

/**
 * Print startup banner with endpoint information
 */
function printStartupBanner() {
  const { port } = config.server;
  const baseUrl = `http://localhost:${port}`;

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                     QA Testbed API Server                        ║
║                     Version ${config.api.version}                                ║
╠══════════════════════════════════════════════════════════════════╣
║  Server running at: ${baseUrl.padEnd(38)}      ║
╠══════════════════════════════════════════════════════════════════╣
║  Architecture:                                                   ║
║    Controllers → Services → Repositories → Models                ║
╠══════════════════════════════════════════════════════════════════╣
║  CRUD Operations:                                                ║
║    GET    /api/users          List all users                     ║
║    GET    /api/users/:id      Get single user                    ║
║    POST   /api/users          Create user                        ║
║    PUT    /api/users/:id      Update user                        ║
║    DELETE /api/users/:id      Delete user                        ║
║                                                                  ║
║  Test Endpoints:                                                 ║
║    GET  /api/slow             Random 2-5 second delay            ║
║    GET  /api/unreliable       50% chance of error                ║
║    GET  /api/error            Always returns error               ║
║    GET  /api/delay?ms=<time>  Configurable delay                 ║
║    POST /api/validate         Form validation                    ║
║                                                                  ║
║  Utility:                                                        ║
║    GET  /api/health           Health check                       ║
║    POST /api/reset            Reset data                         ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

// Start the server
startServer();

// Export for testing
export { createApp };
