import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

// In-memory data store for testing
let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Manager" },
  { id: 5, name: "Eve Anderson", email: "eve@example.com", role: "User" },
];

let nextUserId = 6;

const app = new Elysia()
  .use(cors())
  
  // Health check endpoint
  .get("/", () => ({
    status: "ok",
    message: "QA Testbed API is running",
    timestamp: new Date().toISOString(),
  }))

  // GET all users
  .get("/api/users", () => ({
    success: true,
    data: users,
  }))

  // GET single user
  .get("/api/users/:id", ({ params: { id } }) => {
    const user = users.find((u) => u.id === parseInt(id));
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }
    return {
      success: true,
      data: user,
    };
  })

  // POST create user
  .post("/api/users", async ({ body }) => {
    const newUser = {
      id: nextUserId++,
      ...(body as any),
    };
    users.push(newUser);
    return {
      success: true,
      data: newUser,
    };
  })

  // PUT update user
  .put("/api/users/:id", async ({ params: { id }, body }) => {
    const index = users.findIndex((u) => u.id === parseInt(id));
    if (index === -1) {
      return {
        success: false,
        error: "User not found",
      };
    }
    users[index] = { ...users[index], ...(body as any) };
    return {
      success: true,
      data: users[index],
    };
  })

  // DELETE user
  .delete("/api/users/:id", ({ params: { id } }) => {
    const index = users.findIndex((u) => u.id === parseInt(id));
    if (index === -1) {
      return {
        success: false,
        error: "User not found",
      };
    }
    users.splice(index, 1);
    return {
      success: true,
      message: "User deleted successfully",
    };
  })

  // Endpoint with simulated latency (2-5 seconds delay)
  .get("/api/slow", async () => {
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
    await new Promise((resolve) => setTimeout(resolve, delay));
    return {
      success: true,
      message: `Response delayed by ${delay}ms`,
      data: { delayed: delay },
    };
  })

  // Endpoint that randomly returns errors (50% chance)
  .get("/api/unreliable", () => {
    const shouldFail = Math.random() > 0.5;
    if (shouldFail) {
      return {
        success: false,
        error: "Random error occurred",
        code: "RANDOM_ERROR",
      };
    }
    return {
      success: true,
      message: "Request succeeded",
      data: { lucky: true },
    };
  })

  // Endpoint that always returns 500 error
  .get("/api/error", () => {
    return {
      success: false,
      error: "Internal server error simulation",
      code: "SIMULATED_ERROR",
      timestamp: new Date().toISOString(),
    };
  })

  // Endpoint with configurable delay via query parameter
  .get("/api/delay", async ({ query }) => {
    const delay = parseInt((query as any).ms || "1000");
    const maxDelay = Math.min(delay, 10000); // Cap at 10 seconds
    await new Promise((resolve) => setTimeout(resolve, maxDelay));
    return {
      success: true,
      message: `Delayed for ${maxDelay}ms`,
      delay: maxDelay,
    };
  })

  // Form validation endpoint
  .post("/api/validate", async ({ body }) => {
    const data = body as any;
    const errors: any = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Valid email is required";
    }
    if (!data.name || data.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (data.age && (data.age < 0 || data.age > 150)) {
      errors.age = "Age must be between 0 and 150";
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      message: "Validation passed",
      data,
    };
  })

  .listen(3001);

console.log(
  `🚀 QA Testbed API is running at http://${app.server?.hostname}:${app.server?.port}`
);
