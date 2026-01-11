import BackToHome from "../components/BackToHome";
import warningsIcon from "../assets/warnings.png";

const warningSigns = [
  {
    title: "Urgency Tactics",
    description:
      "&quot;Act now or lose access!&quot; - Scammers create false urgency",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" fill="#f59e0b" />
        <path
          d="M16 8 L16 16 L22 22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="6" r="1" fill="white" />
      </svg>
    ),
    examples: [
      "Limited time offer",
      "Account will be closed",
      "Immediate action required",
    ],
  },
  {
    title: "Too Good to Be True",
    description: "Free money, prizes, or unrealistic offers",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="10" width="20" height="16" rx="2" fill="#f472b6" />
        <path d="M16 6 L20 10 L12 10 Z" fill="#f472b6" />
        <circle cx="16" cy="18" r="3" fill="white" />
        <rect x="14" y="22" width="4" height="2" fill="white" rx="1" />
      </svg>
    ),
    examples: [
      "You&apos;ve won $1000!",
      "Free iPhone",
      "Get rich quick schemes",
    ],
  },
  {
    title: "Suspicious Links",
    description: "Shortened URLs or misspelled domains",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M12 20 L8 16 L12 12"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M20 12 L24 16 L20 20"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="10" y="14" width="12" height="4" rx="2" fill="#3b82f6" />
      </svg>
    ),
    examples: ["gooogle.com", "paypaI.com (with capital i)"],
  },
  {
    title: "Unknown Senders",
    description: "Messages from unfamiliar or suspicious accounts",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="12" r="6" fill="#6b7280" />
        <path d="M8 26 C8 20 11 18 16 18 C21 18 24 20 24 26" fill="#6b7280" />
        <circle cx="22" cy="10" r="3" fill="#ef4444" />
        <path
          d="M20 10 L24 10 M22 8 L22 12"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    examples: [
      "New social media accounts",
      "Random phone numbers",
      "Fake company emails",
    ],
  },
  {
    title: "Personal Info Requests",
    description: "Asking for passwords, codes, or sensitive data",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="8" y="14" width="16" height="12" rx="2" fill="#10b981" />
        <circle cx="16" cy="20" r="2" fill="white" />
        <rect x="14" y="22" width="4" height="2" fill="white" rx="1" />
        <path
          d="M12 14 L12 10 C12 7 14 6 16 6 C18 6 20 7 20 10 L20 14"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
    examples: [
      "Send verification code",
      "Confirm your password",
      "Share your SSN",
    ],
  },
  {
    title: "Poor Grammar/Spelling",
    description: "Legitimate companies rarely have obvious errors",
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="6" width="20" height="20" rx="2" fill="#a855f7" />
        <path
          d="M10 12 L14 12 M10 16 L18 16 M10 20 L16 20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="22" cy="10" r="3" fill="#ef4444" />
        <path
          d="M20 10 L24 10 M22 8 L22 12"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    examples: ["Misspelled words", "Wrong grammar", "Odd phrasing"],
  },
];

export default function WarningSigns() {
  return (
    <div className="space-y-8">
      <BackToHome />

      <div className="text-center space-y-4">
        <div className="mx-auto w-fit rounded-3xl bg-white/50 backdrop-blur-md p-4 shadow-lg border border-white/40">
          <img
            src={warningsIcon}
            alt="Warning Signs"
            className="w-52 md:w-64 h-auto object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight pb-2 gradient-text">
          Phishing &amp; Scam Warning Signs
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          Learn to recognize these common patterns used by scammers and protect
          yourself online.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warningSigns.map((sign, index) => (
          <div
            key={index}
            className="bubble-card p-6 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="text-center mb-4">
              <div className="mb-3 icon-wiggle flex justify-center">
                {sign.svg}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {sign.title}
              </h3>
              <p className="text-slate-600 text-sm">{sign.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-purple-600">
                Common Examples:
              </h4>
              <ul className="space-y-1">
                {sign.examples.map((example, i) => (
                  <li
                    key={i}
                    className="text-slate-600 text-sm flex items-start gap-2"
                  >
                    <span className="text-red-500 mt-1">•</span>
                    <span>`{example}`</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bubble-card p-6 border-l-4 border-blue-400">
        <div className="flex items-start gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#3b82f6" />
            <path
              d="M12 8 L12 12 L16 16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Pro Tip</h3>
            <p className="text-slate-700">
              When in doubt, don`t click! Use our StaySafe scanner to check
              suspicious messages, or ask our AI assistant for advice. It`s
              always better to be safe than sorry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
