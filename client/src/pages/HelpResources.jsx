import PropTypes from "prop-types";

/**
 * HelpResources
 * - Static informational page.
 * - For demo: put placeholder resources.
 * - Later: replace with real local numbers/links for Israel (or your target region).
 */
export default function HelpResources() {
  return (
    <section className="space-y-8">
      {/* Title */}
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Help Resources
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          If something feels unsafe, get support quickly.
        </p>
      </header>

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <ResourceCard
          title="Emergency / Support"
          items={[
            "SafeLine — (placeholder)",
            "Cyber helpline — (placeholder)",
            "Emergency services — (placeholder)",
          ]}
        />

        <ResourceCard
          title="Reporting"
          items={[
            "Report harmful content in the app",
            "Report impersonation / scams",
            "Keep screenshots as evidence",
          ]}
        />

        <ResourceCard
          title="Trusted People"
          items={[
            "Parent / guardian",
            "Teacher / counselor",
            "A friend’s parent",
          ]}
        />
      </div>

      {/* Bottom reminder */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Reminder</div>
        <p className="mt-2 text-slate-700">
          Scams often try to create panic. If you feel pressured, pause and ask
          for help.
        </p>
      </div>
    </section>
  );
}

/**
 * Small reusable card.
 * - Future changes: add clickable links instead of plain text.
 */
function ResourceCard({ title, items }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xl font-semibold">{title}</div>
      <ul className="mt-4 space-y-2 text-slate-700">
        {items.map((x, i) => (
          <li key={i}>• {x}</li>
        ))}
      </ul>
    </div>
  );
}

ResourceCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};
