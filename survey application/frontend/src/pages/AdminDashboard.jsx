import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [responses, setResponses] = useState([]);

  const fetchData = async () => {
    const qRes = await axios.get("/admin/questions");
    const rRes = await axios.get("/admin/responses");
    setQuestions(qRes.data);
    setResponses(rRes.data);
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    await axios.post("/admin/add", {
      questionText: text,
      options: [option1, option2],
    });
    setText("");
    setOption1("");
    setOption2("");
    fetchData();
  };

  const deleteQuestion = async (id) => {
    await axios.delete(`/admin/delete/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <form onSubmit={addQuestion} className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add Question</h2>
        <input
          type="text"
          placeholder="Question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Option 1"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Option 2"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Add
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Questions</h2>
      {questions.map((q) => (
        <div key={q._id} className="bg-white p-3 rounded mb-2 shadow">
          <p>{q.questionText}</p>
          <button
            onClick={() => deleteQuestion(q._id)}
            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-8 mb-2">User Responses</h2>
      {responses.map((r) => (
        <div key={r._id} className="bg-white p-3 rounded mb-2 shadow">
          <p>
            <strong>User:</strong> {r.user?.email}
          </p>
          <p>
            <strong>Answers:</strong>
          </p>
          <ul>
            {r.answers.map((a) => (
              <li key={a._id}>{a.answer}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
