import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function PortfolioPage({ user, handleLogout }) {
  const data = {
    home: {
      name: "Elakkiya Sudha",
      title: "Frontend Developer",
      subtitle: "React.js & Tailwind",
    },
    about: "Passionate frontend developer.",
    skills: ["React.js", "Tailwind", "JavaScript", "HTML"],
    projects: [
      { name: "Portfolio Website", description: "My portfolio", link: "#" },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <Home data={data} />
      <About data={data} />
      <Projects data={data} />
      <Skills skills={data.skills} />
      <Contact />
    </div>
  );
}
