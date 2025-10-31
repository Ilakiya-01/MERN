# Project Management Dashboard

This is a simple project management dashboard (Express backend + static frontend) that supports creating tasks, updating status (Pending, InProgress, Completed), filtering, and deleting tasks.

Features

- View all tasks with details
- Add tasks (title, description, priority, due date, assignee)
- Update status (Pending, InProgress, Completed)
- Delete tasks
- Filter tasks by status
- Responsive static frontend
- RESTful API with file-based persistence (tasks.json)

Quick start

1. Install dependencies

   npm install

2. Start the server

   npm start

3. Open the dashboard

   Visit http://localhost:4000 in your browser

Development

- Use `npm run dev` to run with nodemon.

API

- GET /api/tasks?status=All|Pending|InProgress|Completed - list tasks
- POST /api/tasks - create task (json body: title, description, priority, dueDate, assignee)
- PUT /api/tasks/:id - update task (json body with fields to update, e.g. {status: "Completed"})
- DELETE /api/tasks/:id - delete task

Persistence
Tasks are stored in `tasks.json` in the project root. This is a simple file-based store for experiments. For production, swap in MongoDB or another database.

GitHub integration

1. Initialize a git repo (if not already):

   git init
   git add .
   git commit -m "Initial project management dashboard"

2. Push to GitHub:

   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main

Next steps / improvements

- Add authentication and user accounts
- Migrate persistence to MongoDB (MERN true stack)
- Add task editing UI
- Add unit tests and CI
