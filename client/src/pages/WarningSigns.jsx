/**
 * WarningSigns
 * - Static educational page about phishing/scam signals.
 * - This page supports the Link Scanner feature (users learn patterns + can consult AI).
 */
export default function WarningSigns() {
  const signs = [
    { title: "Urgency", desc: "“Do it NOW” pressure or threats." },
    { title: "Too good to be true", desc: "Free prizes, gifts, money, etc." },
    { title: "Short/hidden links", desc: "Shorteners that hide destination." },
    {
      title: "Weird domain",
      desc: "Misspellings or extra words in the domain.",
    },
    {
      title: "Login verification",
      desc: "Asks you to sign in or verify codes.",
    },
    { title: "Personal info", desc: "Requests for phone/address/photos." },
  ];

  return (
    <section className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Warning Signs (Phishing & Scams)
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Most scams follow the same patterns.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {signs.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="text-xl font-semibold">{s.title}</div>
            <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Tip</div>
        <p className="mt-2 text-slate-700">
          If a message includes a link and you’re unsure, use{" "}
          <span className="font-medium">Consult AI</span> before clicking.
        </p>
      </div>
    </section>
  );
}
