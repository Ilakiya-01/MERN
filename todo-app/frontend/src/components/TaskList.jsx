import { useState } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onAdd, onUpdate, onDelete }) {
  const [newTask, setNewTask] = useState("");

  const handleAdd = () => {
    if (newTask.trim() === "") return;
    onAdd(newTask);
    setNewTask("");
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one above 👆</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
