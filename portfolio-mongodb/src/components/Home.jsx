export default function Home({ homeData }) {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-400 to-pink-400 text-white">
      <h1 className="text-5xl font-bold mb-4">{homeData?.name}</h1>
      <p className="text-2xl">{homeData?.title}</p>
      <p className="text-xl">{homeData?.subtitle}</p>
    </section>
  );
}
