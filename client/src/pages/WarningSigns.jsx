import { Link } from "react-router-dom";

/**
 * WarningSigns
 * - Static educational page
 * - Clean grid like the mock
 */
export default function WarningSigns() {
  const signs = [
    { title: "Urgency", desc: "*Act now or lose access" },
    { title: "Too good to be true", desc: "Free gifts, money, prizes" },
    { title: "Strange links", desc: "Shortened or misspelled URLs" },
    { title: "Unknown sender", desc: "New or suspicious account" },
  ];

  return (
    <div className="relative">
      <section className="space-y-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700 btn-animate"
        >
          ← Back to Home
        </Link>

        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Phishing Warning Signs
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            How to spot risky messages & links.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {signs.map((s, idx) => (
            <div key={idx} className="glass-card p-6">
              <div className="text-xl font-semibold text-slate-900">
                {s.title}
              </div>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              AI Advice Chat
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Ask a question or paste a message — we’ll scan links safely.
            </p>
          </div>

          <Link
            to="/consult"
            className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 btn-animate"
          >
            Open →
          </Link>
        </div>
      </section>

      <Link to="/consult" className="ai-fab" aria-label="Open Consult AI">
        <span className="ai-fab__robot" aria-hidden="true">
          🤖
        </span>
        <span className="ai-fab__text">Consult AI</span>
      </Link>
    </div>
  );
}
