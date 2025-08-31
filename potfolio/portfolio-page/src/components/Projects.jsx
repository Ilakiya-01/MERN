export default function Projects({ data }) {
  const projects = data.projects;

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
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
