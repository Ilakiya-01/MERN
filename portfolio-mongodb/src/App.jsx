import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home";
import About from "./components/About";
<<<<<<< HEAD
import Skills from "./components/Skills";
import Projects from "./components/Projects";

=======
import Projects from "./components/Projects";
>>>>>>> 2095dc6aefdade4f746c055b30f493856505867f
import Contact from "./components/Contact";

function App() {
  const [data, setData] = useState({});
<<<<<<< HEAD
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/portfolio")
      .then((res) => {
        console.log("Raw API response:", res.data);
        const doc = Array.isArray(res.data) ? res.data[0] : res.data;
        console.log("Unwrapped document:", doc);
        setData(doc || {});
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="bg-gradient-to-b from-purple-50 via-white to-blue-50 text-gray-800">
      <Home data={data} />
      <About data={data} />
      <Projects data={data} />
      <Skills skills={data.skills || []} />

=======

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/portfolio")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Home homeData={data.home} />
      <About about={data.about} skills={data.skills} />
      <Projects projects={data.projects} />
>>>>>>> 2095dc6aefdade4f746c055b30f493856505867f
      <Contact />
    </div>
  );
}

export default App;
