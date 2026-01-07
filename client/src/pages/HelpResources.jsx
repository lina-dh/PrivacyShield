import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * HelpResources
 * - Updated to match the new UI design with glass cards
 * - Keeps the functional links for phone numbers and websites
 */
export default function HelpResources() {
  return (
    <div className="relative">
      <section className="space-y-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700 btn-animate"
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-700">
            Help Resources
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Trusted contacts & emergency info.
          </p>
        </header>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <ResourceCard
            title="Immediate Help"
            borderColor="border-red-100"
            bgColor="bg-red-50/50"
            items={[
              { label: "SafeLine: *1202", value: "1202", type: "phone" },
              { label: "Cyber Help: 105", value: "105", type: "phone" },
              { label: "Israel Police", value: "100", type: "phone" },
            ]}
          />

          <ResourceCard
            title="Report & Evidence"
            items={[
              {
                label: "Report to Instagram",
                value: "https://www.instagram.com/support",
                type: "link",
              },
              { label: "Take screenshots as evidence", type: "text" },
              { label: "Block the abusive user", type: "text" },
            ]}
          />

          <ResourceCard
            title="Trusted People"
            items={[
              { label: "Parent / guardian", type: "text" },
              { label: "Teacher / counselor", type: "text" },
              { label: "ERAN: 1201", value: "1201", type: "phone" },
            ]}
          />
        </div>

        {/* Bottom reminder */}
        <div className="glass-card p-6">
          <div className="text-lg font-semibold text-slate-700">
            Important Reminder
          </div>
          <p className="mt-2 text-slate-700">
            Scams often try to create panic. If you feel pressured, pause and
            ask for help. <strong>You have the power:</strong> Don`t pay, don`t
            send photos, ask for help immediately.
          </p>
        </div>
      </section>

      {/* AI Robot button */}
      <Link to="/protect" className="ai-fab" title="Ask AI for help">
        <span className="ai-fab__robot">🤖</span>
        <span className="ai-fab__text">Ask AI</span>
      </Link>
    </div>
  );
}

/**
 * Resource card with functional links
 */
function ResourceCard({
  title,
  items,
  borderColor = "border-slate-200",
  bgColor = "bg-white",
}) {
  return (
    <div className={`glass-card p-6 btn-animate ${borderColor} ${bgColor}`}>
      <div className="text-xl font-semibold text-slate-700">{title}</div>
      <ul className="mt-4 space-y-2 text-slate-700">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            {item.type === "phone" ? (
              <a
                href={`tel:${item.value}`}
                className="font-medium text-slate-900 hover:text-blue-600 underline decoration-slate-300 underline-offset-4"
              >
                📞 {item.label}
              </a>
            ) : item.type === "link" ? (
              <a
                href={item.value}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 hover:text-blue-600 underline decoration-slate-300 underline-offset-4"
              >
                🔗 {item.label}
              </a>
            ) : (
              <span>• {item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

ResourceCard.propTypes = {
  title: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  bgColor: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      type: PropTypes.oneOf(["phone", "link", "text"]).isRequired,
    })
  ).isRequired,
};
