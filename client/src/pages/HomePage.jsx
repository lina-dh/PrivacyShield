import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * HomePage
 * - This is the "hub" page from your requirements.
 * - It links to:
 *   Help Resources (info)
 *   Warning Signs (info)
 *   Stay Safe (info + tiny Q&A)
 *   Consult AI (chat + URL scanning)
 */
export default function HomePage() {
  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold tracking-tight">
          Stay safe before you click
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          One place to check suspicious messages and learn how to protect
          yourself online.
        </p>
      </div>

      {/* Navigation tiles */}
      <div className="grid gap-6 md:grid-cols-2">
        <HomeTile
          title="Help Resources"
          desc="Trusted contacts and support information."
          to="/resources"
        />
        <HomeTile
          title="Warning Signs"
          desc="Learn how phishing and scams usually look."
          to="/warnings"
        />
        <HomeTile
          title="Stay Safe"
          desc="Practical steps to protect your accounts."
          to="/protect"
        />
        <HomeTile
          title="Consult AI"
          desc="Paste a message. We’ll scan links inside it."
          to="/consult"
        />
      </div>
    </section>
  );
}

/**
 * A small reusable tile component for HomePage.
 * - If later you want icons or different colors, do it here.
 */
function HomeTile({ title, desc, to }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>

      <Link
        to={to}
        className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Open →
      </Link>
    </div>
  );
}

HomeTile.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
