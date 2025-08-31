import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

function App() {
  // Hardcoded data instead of fetching from backend
  const data = {
    home: {
      name: "Elakkiya Sudha",
      title: "Frontend Developer",
      subtitle: "React.js & Tailwind Enthusiast",
    },
    about:
      "I am a passionate frontend developer with experiences in building responsive web application using React.js and Tailwind CSS.",
    skills: ["React.js", "Tailwind CSS", "JavaScript", "HTML"],
    projects: [
      {
        name: "Portfolio Website",
        description:
          "A dynamic portfolio website built with React.js and Tailwind CSS.",
        link: "https://portfolio-example.com",
      },
      {
        name: "Task Manager App",
        description:
          "A full-stack task management app with Node.js and MongoDB.",
        link: "https://taskmanager-example.com",
      },
      {
        name: "Chatbot",
        description: "AI Chatbot using GPT",
        link: "https://github.com/mychatbot",
      },
    ],
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 via-white to-blue-50 text-gray-800">
      <Home data={data} />
      <About data={data} />
      <Projects data={data} />
      <Skills skills={data.skills} />
      <Contact />
    </div>
  );
}

export default App;
