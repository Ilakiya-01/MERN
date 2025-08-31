export default function Skills({ skills }) {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-purple-100">
      <h2 className="text-4xl font-semibold mb-4">Skills</h2>
      <div className="flex gap-4 flex-wrap">
        {skills.map((skill, i) => (
          <span key={i} className="px-4 py-2 bg-white rounded shadow">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
