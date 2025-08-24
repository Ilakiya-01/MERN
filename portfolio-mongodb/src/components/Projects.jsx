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
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
