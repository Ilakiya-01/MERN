import TaskList from "../components/TaskList";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const { data } = await axios.get("http://localhost:5001/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title) => {
    await axios.post(
      "http://localhost:5001/api/tasks",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };
  const updateTask = async (id, updates) => {
    await axios.put(`http://localhost:5001/api/tasks/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5001/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
      <TaskList
        tasks={tasks}
        onAdd={addTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
