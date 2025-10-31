export default function About({ data }) {
  return (
    <section id="about" className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-700">
        About Me
      </h2>
      <p className="text-gray-700 leading-relaxed text-center">{data.about}</p>
    </section>
  );
}
