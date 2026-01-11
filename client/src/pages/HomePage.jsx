import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * HomePage
 * - Hub page: routes to the 4 sections
 * - Matches the collage layout: hero + 2x2 glass cards
 */
export default function HomePage() {
  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="glass-hero p-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Privecy Shield
        </h1>
        <h3 className="text-4xl font-semibold tracking-tight text-slate-900">
          Stay safe before you click
        </h3>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          One place to check suspicious messages and learn how to protect
          yourself online.
        </p>
      </div>

      {/* 2x2 cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <HomeTile
          title="Help Resources"
          desc="Trusted contacts and support information."
          to="/resources"
          art={<ArtLaptop />}
        />
        <HomeTile
          title="Warning Signs"
          desc="Learn how phishing and scams usually look."
          to="/warnings"
          art={<ArtEnvelope />}
        />
        <HomeTile
          title="Consult AI"
          desc="Essential tips for protecting yourself online."
          to="/consult"
          art={<ArtShield />}
        />
        <HomeTile
          title="Stay Safe Online"
          desc="Paste a message. We’ll scan links inside it."
          to="/protect"
          art={<ArtClipboard />}
        />
      </div>

      <Link to="/consult" className="ai-fab" aria-label="Open Consult AI">
        <span className="ai-fab__robot" aria-hidden="true">
          🤖
        </span>
        <span className="ai-fab__text">Consult AI</span>
      </Link>
    </section>
  );
}

/**
 * Reusable card
 * - art = tiny illustration (SVG)
 */
function HomeTile({ title, desc, to, art }) {
  return (
    <div className="glass-card p-6 btn-animate">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <p className="mt-2 text-sm text-slate-600">{desc}</p>

          <Link
            to={to}
            className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Open →
          </Link>
        </div>

        {/* Small illustration (subtle, not a huge icon) */}
        <div className="shrink-0 opacity-90">{art}</div>
      </div>
    </div>
  );
}

HomeTile.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  art: PropTypes.node,
};

HomeTile.defaultProps = {
  art: null,
};

/* ---- Tiny “cute cyber” SVG illustrations ---- */
/* Tip: if later you want different art, replace only these components */

function ArtLaptop() {
  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="8"
        width="44"
        height="28"
        rx="6"
        className="fill-white/70 stroke-slate-200"
      />
      <path
        d="M18 18h20"
        className="stroke-indigo-400"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 24h14"
        className="stroke-fuchsia-300"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 40h48"
        className="stroke-slate-200"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="46"
        cy="24"
        r="5"
        className="fill-indigo-100 stroke-indigo-300"
      />
      <path
        d="M46 22v4"
        className="stroke-indigo-500"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArtEnvelope() {
  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="10"
        width="44"
        height="28"
        rx="6"
        className="fill-white/70 stroke-slate-200"
      />
      <path
        d="M14 16l18 12 18-12"
        className="stroke-indigo-400"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 30l-6 6"
        className="stroke-slate-200"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M44 30l6 6"
        className="stroke-slate-200"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M44 16l6-4"
        className="stroke-fuchsia-300"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArtShield() {
  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 10c8 4 12 4 16 6v12c0 10-7 14-16 18-9-4-16-8-16-18V16c4-2 8-2 16-6z"
        className="fill-white/70 stroke-slate-200"
      />
      <path
        d="M32 18v18"
        className="stroke-indigo-400"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 26l6 6 6-6"
        className="stroke-fuchsia-300"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArtClipboard() {
  return (
    <svg
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="16"
        y="8"
        width="32"
        height="36"
        rx="6"
        className="fill-white/70 stroke-slate-200"
      />
      <rect
        x="24"
        y="6"
        width="16"
        height="8"
        rx="4"
        className="fill-indigo-100 stroke-indigo-300"
      />
      <path
        d="M22 20h20"
        className="stroke-indigo-400"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 26h16"
        className="stroke-fuchsia-300"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 32h12"
        className="stroke-slate-300"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
