import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    const res = await axios.get("/user/questions");
    setQuestions(res.data);
  };

  const handleChange = (qId, ans) => {
    setAnswers({ ...answers, [qId]: ans });
  };

  const handleSubmit = async () => {
    const formatted = {
      answers: Object.keys(answers).map((qId) => ({
        question: qId,
        answer: answers[qId],
      })),
    };
    await axios.post("/user/submit", formatted);
    navigate("/success");
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Survey</h1>
      {questions.map((q) => (
        <div key={q._id} className="bg-white p-4 rounded shadow mb-4">
          <p className="font-semibold">{q.questionText}</p>
          {q.options.map((opt, i) => (
            <label key={i} className="block mt-2">
              <input
                type="radio"
                name={q._id}
                value={opt}
                onChange={() => handleChange(q._id, opt)}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Submit Survey
      </button>
    </div>
  );
}
