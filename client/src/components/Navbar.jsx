import { NavLink } from "react-router-dom";
import logoIcon from "../assets/logo.png";

const TABS = [
  {
    to: "/",
    label: "Home",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1 L15 6 L15 14 C15 14.5 14.5 15 14 15 L10 15 L10 10 L6 10 L6 15 L2 15 C1.5 15 1 14.5 1 14 L1 6 Z" />
      </svg>
    ),
  },
  {
    to: "/protect",
    label: "StaySafe",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1 L13 3 L13 9 C13 11 11 13 8 13 C5 13 3 11 3 9 L3 3 Z" />
        <circle cx="8" cy="8" r="2" fill="white" />
      </svg>
    ),
  },
  {
    to: "/consult",
    label: "Consult AI",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="6" r="4" />
        <rect x="4" y="10" width="8" height="4" rx="2" />
        <circle cx="6" cy="12" r="0.5" fill="white" />
        <circle cx="10" cy="12" r="0.5" fill="white" />
      </svg>
    ),
  },
  {
    to: "/warnings",
    label: "Warning Signs",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1 L15 13 L1 13 Z" />
        <circle cx="8" cy="11" r="1" fill="white" />
        <rect x="7" y="6" width="2" height="3" fill="white" rx="1" />
      </svg>
    ),
  },
  {
    to: "/resources",
    label: "Help",
    svg: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="3" y="2" width="10" height="12" rx="1" />
        <circle cx="8" cy="6" r="1.5" fill="white" />
        <rect x="6" y="9" width="4" height="1" fill="white" rx="0.5" />
        <rect x="6" y="11" width="3" height="1" fill="white" rx="0.5" />
      </svg>
    ),
  },
];

export default function Navbar() {
  return (
    <header className="bubble-card mx-4 mt-4 mb-6">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* App name / logo area */}
        <NavLink
          to="/"
          className="font-bold text-xl gradient-text flex items-center gap-3"
        >
          <img src={logoIcon} alt="Privacy Shield" className="w-8 h-8" />
          Privacy Shield
        </NavLink>

        {/* Tabs */}
        <nav className="hidden md:flex gap-1">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-pink-400 to-purple-500 text-white shadow-lg"
                    : "text-slate-700 hover:bg-white/30 hover:text-purple-600"
                }`
              }
            >
              <span className="icon-wiggle">{t.svg}</span>
              <span className="font-medium text-sm">{t.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-slate-700 hover:text-purple-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="4" width="16" height="2" rx="1" />
              <rect x="2" y="9" width="16" height="2" rx="1" />
              <rect x="2" y="14" width="16" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
