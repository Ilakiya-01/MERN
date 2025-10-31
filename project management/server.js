const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "tasks.json");

async function readTasks() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

// REST API
// GET /api/tasks?status=Pending|InProgress|Completed
app.get("/api/tasks", async (req, res) => {
  const status = req.query.status; // optional
  const tasks = await readTasks();
  if (status && status !== "All") {
    return res.json(tasks.filter((t) => t.status === status));
  }
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const { title, description, priority, dueDate, assignee } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  const tasks = await readTasks();
  const newTask = {
    id: uuidv4(),
    title,
    description: description || "",
    priority: priority || "Medium",
    dueDate: dueDate || null,
    assignee: assignee || "",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "task not found" });
  const updated = { ...tasks[idx], ...updates };
  tasks[idx] = updated;
  await writeTasks(tasks);
  res.json(updated);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const tasks = await readTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length)
    return res.status(404).json({ error: "task not found" });
  await writeTasks(filtered);
  res.status(204).end();
});

// Serve frontend
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
