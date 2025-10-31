# 🔄 Git Integration Guide

## Overview

This Project Management Dashboard includes **full Git integration** that automatically tracks every change you make to your tasks.

## Key Features

### 1. Automatic Version Control ✅

Every action creates a Git commit automatically:

| Action        | Git Commit Message                             |
| ------------- | ---------------------------------------------- |
| Add New Task  | `Added task: [Task Title]`                     |
| Change Status | `Changed task "[Title]" status: [Old] → [New]` |
| Edit Task     | `Updated task: [Task Title]`                   |
| Delete Task   | `Deleted task: [Task Title]`                   |

### 2. Real-Time Status Display 📊

**Header Badge Shows:**

- Current branch name (e.g., "main")
- Status indicator:
  - ✓ Green = All changes committed
  - ⚠ Yellow = Uncommitted changes

### 3. Commit History Viewer 📜

**Click "View History" button to see:**

- Last 20 commits
- Commit hash (shortened)
- Full commit message
- Author name
- Date and time

## How to Use

### Initial Setup

The Git repository is **automatically initialized** when you first start the server.

### Daily Usage

Just use the dashboard normally! Git commits happen automatically:

1. **Add a task** → Automatically committed
2. **Change status** → Automatically committed
3. **Edit task details** → Automatically committed
4. **Delete a task** → Automatically committed

### View Your History

1. Look at the top of the dashboard
2. Click the **"📜 View History"** button
3. Browse all your commits with timestamps

### Push to GitHub (Optional)

To share with your team or backup online:

```bash
cd "d:\MERN-lab\project management"

# Create GitHub repository first, then:
git remote add origin https://github.com/yourusername/project-management.git
git branch -M main
git push -u origin main
```

## Benefits

### ✅ Full Audit Trail

- See who changed what and when
- Track every task modification
- Review history of status changes

### ✅ Easy Rollback

- Made a mistake? Git can restore previous versions
- View the complete evolution of your project

### ✅ Team Collaboration

- Push to GitHub for team access
- Everyone's changes are tracked
- Clear accountability

### ✅ Zero Manual Work

- No need to remember Git commands
- Everything happens automatically
- Focus on managing tasks, not version control

## Technical Details

### Repository Location

```
d:\MERN-lab\project management\.git
```

### Tracked Files

- `tasks.json` - All your task data
- Commits automatically after each change

### Git Commands (Behind the Scenes)

```bash
git init                    # On first run
git add tasks.json         # Before each commit
git commit -m "message"    # After each change
```

## Troubleshooting

### "Git not initialized" message

- The system will auto-initialize on first task change
- Refresh the page to see updated status

### Can't see commit history

- Make at least one task change first
- History appears after first commit

### Want to configure Git user

```bash
cd "d:\MERN-lab\project management"
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## API Endpoints

### Get Git Status

```
GET http://localhost:4000/api/git/status
```

**Response:**

```json
{
  "initialized": true,
  "branch": "main",
  "modified": [],
  "created": [],
  "deleted": [],
  "isClean": true
}
```

### Get Commit History

```
GET http://localhost:4000/api/git/history?limit=20
```

**Response:**

```json
[
  {
    "hash": "a1b2c3d",
    "message": "Added task: Setup Database",
    "date": "2025-10-31T10:30:00Z",
    "author": "Your Name"
  }
]
```

## Best Practices

### ✅ Do This

- Use descriptive task titles (they appear in commits)
- Regularly push to GitHub for backup
- Review history to track progress

### ❌ Avoid This

- Don't manually edit tasks.json (use the UI)
- Don't delete .git folder
- Don't force push without understanding consequences

## Summary

Git integration provides **automatic version control** for your project management dashboard. Every task change is safely tracked, giving you a complete audit trail without any manual work!

**Just use the dashboard normally - Git handles the rest!** 🚀
