import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for testing
let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Manager" },
  { id: 5, name: "Eve Anderson", email: "eve@example.com", role: "User" },
];

let nextUserId = 6;

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "QA Testbed API is running",
    timestamp: new Date().toISOString(),
  });
});

// GET all users
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    data: users,
  });
});

// GET single user
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.json({
      success: false,
      error: "User not found",
    });
  }
  res.json({
    success: true,
    data: user,
  });
});

// POST create user
app.post("/api/users", (req, res) => {
  const newUser = {
    id: nextUserId++,
    ...req.body,
  };
  users.push(newUser);
  res.json({
    success: true,
    data: newUser,
  });
});

// PUT update user
app.put("/api/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.json({
      success: false,
      error: "User not found",
    });
  }
  users[index] = { ...users[index], ...req.body };
  res.json({
    success: true,
    data: users[index],
  });
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.json({
      success: false,
      error: "User not found",
    });
  }
  users.splice(index, 1);
  res.json({
    success: true,
    message: "User deleted successfully",
  });
});

// Endpoint with simulated latency (2-5 seconds delay)
app.get("/api/slow", async (req, res) => {
  const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
  await new Promise((resolve) => setTimeout(resolve, delay));
  res.json({
    success: true,
    message: `Response delayed by ${delay}ms`,
    data: { delayed: delay },
  });
});

// Endpoint that randomly returns errors (50% chance)
app.get("/api/unreliable", (req, res) => {
  const shouldFail = Math.random() > 0.5;
  if (shouldFail) {
    return res.json({
      success: false,
      error: "Random error occurred",
      code: "RANDOM_ERROR",
    });
  }
  res.json({
    success: true,
    message: "Request succeeded",
    data: { lucky: true },
  });
});

// Endpoint that always returns 500 error
app.get("/api/error", (req, res) => {
  res.json({
    success: false,
    error: "Internal server error simulation",
    code: "SIMULATED_ERROR",
    timestamp: new Date().toISOString(),
  });
});

// Endpoint with configurable delay via query parameter
app.get("/api/delay", async (req, res) => {
  const delay = parseInt(req.query.ms || "1000");
  const maxDelay = Math.min(delay, 10000); // Cap at 10 seconds
  await new Promise((resolve) => setTimeout(resolve, maxDelay));
  res.json({
    success: true,
    message: `Delayed for ${maxDelay}ms`,
    delay: maxDelay,
  });
});

// Form validation endpoint
app.post("/api/validate", (req, res) => {
  const data = req.body;
  const errors = {};

  if (!data.email || !data.email.includes("@")) {
    errors.email = "Valid email is required";
  }
  if (!data.name || data.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (data.age && (data.age < 0 || data.age > 150)) {
    errors.age = "Age must be between 0 and 150";
  }

  if (Object.keys(errors).length > 0) {
    return res.json({
      success: false,
      errors,
    });
  }

  res.json({
    success: true,
    message: "Validation passed",
    data,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 QA Testbed API is running at http://localhost:${PORT}`);
});
