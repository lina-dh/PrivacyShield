import { NavLink } from "react-router-dom";

/**
 * Navbar Tabs (top navigation)
 * - Rename / reorder here anytime
 */
const TABS = [
  { to: "/", label: "Home" },
  { to: "/resources", label: "Help Resources" },
  { to: "/warnings", label: "Warning Signs" },
  { to: "/protect", label: "Stay Safe" },
  { to: "/consult", label: "Consult AI" },
];

export default function Navbar() {
  return (
    <header className="bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink
          to="/"
          className="font-semibold text-lg tracking-tight text-slate-900"
        >
          BeSafe
        </NavLink>

        <nav className="flex flex-wrap gap-2 text-sm">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                [
                  "px-3 py-2 rounded-md transition btn-animate",
                  "hover:bg-slate-100/80",
                  isActive
                    ? "bg-slate-100/90 text-slate-900 font-medium"
                    : "text-slate-600",
                ].join(" ")
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
