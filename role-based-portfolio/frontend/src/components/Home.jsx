export default function Home({ data }) {
  const home = data.home;

  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-r from-purple-100 to-pink-100">
      <h1 className="text-5xl font-bold mb-4 text-purple-700">
        Hi, I'm {home.name}
      </h1>
      <p className="text-xl text-gray-600 mb-6">{home.title}</p>
      <p className="text-lg text-gray-500 mb-6">{home.subtitle}</p>
      <a
        href="#projects"
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition"
      >
        See My Work
      </a>
    </section>
  );
}
