<<<<<<< HEAD
export default function Projects({ data }) {
  const projects = data.projects || [
    {
      title: "Project One",
      description: "Awesome project description",
      link: "#",
    },
    { title: "Project Two", description: "Another cool project", link: "#" },
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-white">
      <h2 className="text-3xl font-semibold mb-10 text-center text-purple-700">
        My Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl shadow-lg hover:shadow-2xl transition bg-purple-50"
          >
            <h3 className="text-xl font-bold mb-2">{proj.name}</h3>
            <p className="text-gray-600 mb-4">{proj.description}</p>
            <a
              href={proj.link}
              className="text-purple-700 font-semibold hover:underline"
=======
export default function Projects({ projects }) {
  return (
    <section className="p-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-5">Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((p, i) => (
          <div
            key={i}
            className="p-5 shadow-lg rounded-lg hover:scale-105 transition"
          >
            <h3 className="font-semibold text-xl">{p.name}</h3>
            <p>{p.description}</p>
            <a
              href={p.link}
              target="_blank"
              className="text-blue-600 hover:underline"
>>>>>>> 2095dc6aefdade4f746c055b30f493856505867f
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
