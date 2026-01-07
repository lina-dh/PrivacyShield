import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * HelpResources
 * - Static page (no backend)
 * - Layout matches your screenshot: 3 columns + bottom note
 */
export default function HelpResources() {
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
            Help Resources
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            If you feel unsafe or unsure, you’re not alone.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <InfoCard
            title="Emergency & Support"
            items={[
              "SafeLine — *1202",
              "Cyber Help — 105",
              "Local emergency services",
            ]}
          />
          <InfoCard
            title="Reporting"
            items={[
              "Online Safety Center",
              "Cybercrime reporting website",
              "Report scams / impersonation",
            ]}
          />
          <InfoCard
            title="Trusted Adults"
            items={[
              "Talk to a parent, teacher, or counselor",
              "Don’t stay alone with fear",
              "If it feels urgent: ask for help now",
            ]}
          />
        </div>

        <div className="glass-card p-6">
          <div className="text-lg font-semibold text-slate-900">
            Quick reminder
          </div>
          <p className="mt-2 text-slate-600">
            If you’re unsure or feeling unsafe, pause and reach out to a trusted
            adult. You don’t need to handle it alone 💗
          </p>
        </div>
      </section>

      {/* Floating robot button -> Consult AI */}
      <ConsultFab />
    </div>
  );
}

function InfoCard({ title, items }) {
  return (
    <div className="glass-card p-6">
      <div className="text-xl font-semibold text-slate-900">{title}</div>
      <ul className="mt-4 space-y-2 text-slate-700">
        {items.map((x, i) => (
          <li key={i}>• {x}</li>
        ))}
      </ul>
    </div>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/** Floating button component reused across pages */
function ConsultFab() {
  return (
    <Link to="/consult" className="ai-fab" aria-label="Open Consult AI">
      <span className="ai-fab__robot" aria-hidden="true">
        🤖
      </span>
      <span className="ai-fab__text">Consult AI</span>
    </Link>
  );
}
