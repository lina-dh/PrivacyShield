import { Link } from "react-router-dom";
import staySafeIcon from "../assets/staysafe.png";
import consultIcon from "../assets/consult.png";
import warningsIcon from "../assets/warnings.png";
import helpIcon from "../assets/help.png";

const cards = [
  {
    to: "/protect",
    title: "StaySafe Scanner",
    description: "Scan suspicious messages and links for threats",
    image: staySafeIcon,
  },
  {
    to: "/consult",
    title: "Consult AI",
    description: "Chat with our AI for personalized safety advice",
    image: consultIcon,
  },
  {
    to: "/warnings",
    title: "Warning Signs",
    description: "Learn to recognize phishing and scam patterns",
    image: warningsIcon,
  },
  {
    to: "/resources",
    title: "Help & Resources",
    description: "Emergency contacts and support information",
    image: helpIcon,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-3 lg:space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight pb-2 gradient-text">
          Privacy Shield
        </h1>
        <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
          Your AI-powered companion for digital safety. Scan messages, get
          advice, and learn to protect yourself online.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-4">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="group block">
            <div className="bubble-card p-4 sm:p-6 h-full cursor-pointer relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1 z-10 relative pr-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
                    {card.description}
                  </p>
                  <div className="flex items-center gap-2 text-purple-500 group-hover:text-purple-600 transition-colors">
                    <span className="font-medium text-sm">Get Started</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </div>
                <div className="absolute right-2 sm:right-4 top-0 bottom-0 flex items-center">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain opacity-90"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bubble-card p-6 sm:p-8 mx-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Why Digital Safety Matters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="mx-auto mb-2"
              >
                <rect
                  x="8"
                  y="16"
                  width="32"
                  height="24"
                  rx="4"
                  fill="#3b82f6"
                  opacity="0.2"
                />
                <rect x="12" y="20" width="24" height="16" fill="#3b82f6" />
                <rect x="16" y="24" width="4" height="8" fill="white" />
                <rect x="20" y="26" width="4" height="6" fill="white" />
                <rect x="24" y="28" width="4" height="4" fill="white" />
                <rect x="28" y="24" width="4" height="8" fill="white" />
              </svg>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                95%
              </div>
              <div className="text-slate-600 text-sm sm:text-base">
                of cyber attacks start with phishing
              </div>
            </div>
            <div className="text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="mx-auto mb-2"
              >
                <circle cx="24" cy="24" r="16" fill="#f472b6" opacity="0.2" />
                <circle cx="24" cy="24" r="12" fill="#f472b6" />
                <circle cx="24" cy="20" r="3" fill="white" />
                <rect x="21" y="26" width="6" height="4" fill="white" rx="2" />
              </svg>
              <div className="text-xl sm:text-2xl font-bold text-pink-500">
                156M
              </div>
              <div className="text-slate-600 text-sm sm:text-base">
                phishing emails sent daily
              </div>
            </div>
            <div className="text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="mx-auto mb-2"
              >
                <circle cx="24" cy="24" r="16" fill="#a855f7" opacity="0.2" />
                <path
                  d="M24 12 L32 20 L28 20 L28 28 L20 28 L20 20 L16 20 Z"
                  fill="#a855f7"
                />
                <circle cx="24" cy="32" r="2" fill="#a855f7" />
              </svg>
              <div className="text-xl sm:text-2xl font-bold text-blue-500">
                30 sec
              </div>
              <div className="text-slate-600 text-sm sm:text-base">
                average time to scan a message
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
