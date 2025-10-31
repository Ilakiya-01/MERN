import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function PortfolioPage({ user, handleLogout }) {
  const [data, setData] = useState(null);
  const [editSection, setEditSection] = useState(null); // which section is being edited
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/portfolio");
        setData(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const { data: updated } = await axios.put(
        "http://localhost:5000/api/portfolio",
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setData(updated);
      setEditSection(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!data) return <p>Loading...</p>;

  const isAdmin = user.role === "admin";

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl">
          Welcome {user.email} ({user.role})
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* HOME SECTION */}
      <section className="mb-6">
        {isAdmin && (
          <button
            onClick={() =>
              setEditSection(editSection === "home" ? null : "home")
            }
            className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
          >
            {editSection === "home" ? "Cancel" : "Edit Home"}
          </button>
        )}
        {editSection === "home" ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={formData.home.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  home: { ...formData.home, name: e.target.value },
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={formData.home.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  home: { ...formData.home, title: e.target.value },
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={formData.home.subtitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  home: { ...formData.home, subtitle: e.target.value },
                })
              }
              className="border p-2 rounded"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Save Home
            </button>
          </div>
        ) : (
          <Home data={data} />
        )}
      </section>

      {/* ABOUT SECTION */}
      <section className="mb-6">
        {isAdmin && (
          <button
            onClick={() =>
              setEditSection(editSection === "about" ? null : "about")
            }
            className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
          >
            {editSection === "about" ? "Cancel" : "Edit About"}
          </button>
        )}
        {editSection === "about" ? (
          <div>
            <textarea
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="w-full border p-2"
              rows={5}
            />
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Save About
            </button>
          </div>
        ) : (
          <About data={data} />
        )}
      </section>

      {/* SKILLS SECTION */}
      <section className="mb-6">
        {isAdmin && (
          <button
            onClick={() =>
              setEditSection(editSection === "skills" ? null : "skills")
            }
            className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
          >
            {editSection === "skills" ? "Cancel" : "Edit Skills"}
          </button>
        )}
        {editSection === "skills" ? (
          <div className="flex flex-col gap-2">
            {formData.skills.map((skill, idx) => (
              <input
                key={idx}
                type="text"
                value={skill}
                onChange={(e) => {
                  const newSkills = [...formData.skills];
                  newSkills[idx] = e.target.value;
                  setFormData({ ...formData, skills: newSkills });
                }}
                className="border p-2 rounded"
              />
            ))}
            <button
              onClick={() =>
                setFormData({ ...formData, skills: [...formData.skills, ""] })
              }
              className="bg-purple-500 text-white px-3 py-1 rounded"
            >
              Add Skill
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Save Skills
            </button>
          </div>
        ) : (
          <Skills skills={data.skills} />
        )}
      </section>

      {/* PROJECTS SECTION */}
      <section className="mb-6">
        {isAdmin && (
          <button
            onClick={() =>
              setEditSection(editSection === "projects" ? null : "projects")
            }
            className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
          >
            {editSection === "projects" ? "Cancel" : "Edit Projects"}
          </button>
        )}
        {editSection === "projects" ? (
          <div className="flex flex-col gap-2">
            {formData.projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-2 border p-2 rounded">
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[idx].name = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={proj.description}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[idx].description = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={proj.link}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[idx].link = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="border p-2 rounded"
                />
              </div>
            ))}
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  projects: [
                    ...formData.projects,
                    { name: "", description: "", link: "" },
                  ],
                })
              }
              className="bg-purple-500 text-white px-3 py-1 rounded"
            >
              Add Project
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Save Projects
            </button>
          </div>
        ) : (
          <Projects data={data} />
        )}
      </section>

      {/* CONTACT */}
      <Contact />
    </div>
  );
}
