import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

function App() {
  const [data, setData] = useState({});

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
      <Contact />
    </div>
  );
}

export default App;
