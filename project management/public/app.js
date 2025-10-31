const apiBase = "/api/tasks";

async function fetchTasks(status = "All") {
  const url =
    status && status !== "All" ? `${apiBase}?status=${status}` : apiBase;
  const res = await fetch(url);
  return res.json();
}

function renderTasks(tasks) {
  const container = document.getElementById("tasks");
  container.innerHTML = "";
  if (!tasks.length) {
    container.innerHTML = "<p>No tasks yet.</p>";
    return;
  }
  tasks.forEach((t) => {
    const el = document.createElement("div");
    el.className = "task-card";
    el.innerHTML = `
      <h3>${escapeHtml(t.title)}</h3>
      <div class="meta">${
        t.assignee ? "Assignee: " + escapeHtml(t.assignee) + " • " : ""
      }${t.dueDate ? "Due: " + escapeHtml(t.dueDate) : ""}</div>
      <div>${escapeHtml(t.description || "")}</div>
      <div style="margin-top:8px" class="actions">
        <div class="status-badge status-${t.status}">${t.status}</div>
        <button data-id="${
          t.id
        }" class="set-status" data-status="Pending">Set Pending</button>
        <button data-id="${
          t.id
        }" class="set-status" data-status="InProgress">Set InProgress</button>
        <button data-id="${
          t.id
        }" class="set-status" data-status="Completed">Set Completed</button>
        <button data-id="${t.id}" class="delete">Delete</button>
      </div>
    `;
    container.appendChild(el);
  });
}

function escapeHtml(s) {
  if (!s) return "";
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}

async function refresh() {
  const status = document.getElementById("statusFilter").value;
  const tasks = await fetchTasks(status);
  renderTasks(tasks);
}

document.addEventListener("click", async (e) => {
  if (e.target.matches(".set-status")) {
    const id = e.target.dataset.id;
    const status = e.target.dataset.status;
    await fetch(`${apiBase}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }
  if (e.target.matches(".delete")) {
    const id = e.target.dataset.id;
    if (!confirm("Delete this task?")) return;
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    refresh();
  }
});

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    priority: form.priority.value,
    dueDate: form.dueDate.value || null,
    assignee: form.assignee.value.trim() || "",
  };
  if (!data.title) return alert("Title required");
  const res = await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status === 201) {
    form.reset();
    refresh();
  } else {
    const err = await res.json();
    alert(err.error || "Failed to add");
  }
});

document.getElementById("refreshBtn").addEventListener("click", refresh);
document.getElementById("statusFilter").addEventListener("change", refresh);

(function init() {
  refresh();
})();
