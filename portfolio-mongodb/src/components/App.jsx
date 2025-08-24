export default function About({ about }) {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-green-100">
      <h2 className="text-4xl font-semibold mb-4">About Me</h2>
      <p className="max-w-xl text-center">{about}</p>
    </section>
  );
}
