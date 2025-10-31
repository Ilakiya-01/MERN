<<<<<<< HEAD
export default function About({ data }) {
  return (
    <section id="about" className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-700">
        About Me
      </h2>
      <p className="text-gray-700 leading-relaxed text-center">
        {data.about ||
          "A passionate developer with love for clean UI and modern web design."}
      </p>
=======
export default function About({ about, skills }) {
  return (
    <section className="p-10 bg-white">
      <h2 className="text-3xl font-bold mb-4">About Me</h2>
      <p className="mb-6">{about}</p>
      <h3 className="text-2xl font-semibold mb-2">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill, i) => (
          <span
            key={i}
            className="bg-purple-200 text-purple-800 px-3 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
>>>>>>> 2095dc6aefdade4f746c055b30f493856505867f
    </section>
  );
}
