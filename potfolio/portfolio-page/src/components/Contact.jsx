export default function Contact() {
  return (
    <section id="contact" className="p-10 bg-white">
      <h2 className="text-3xl font-bold mb-5 text-purple-700">Contact Me</h2>
      <form className="flex flex-col gap-4 max-w-md mx-auto">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          name="message"
          placeholder="Message"
          rows={5}
          className="p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
        >
          Send
        </button>
      </form>
    </section>
  );
}
