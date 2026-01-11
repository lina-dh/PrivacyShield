import BackToHome from "../components/BackToHome";
import helpIcon from "../assets/help.png";

const resourceCategories = [
  {
    title: "Emergency Contacts",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#ef4444" />
        <path
          d="M12 8 L12 12 L16 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="6" r="1" fill="white" />
      </svg>
    ),
    gradient: "from-red-400 to-pink-500",
    items: [
      { label: "Child Online Protection Bureau", value: "105", type: "phone" },
      {
        label: "Israel National Cyber Directorate",
        value:
          "https://www.gov.il/en/departments/child_online_protection_bureau/govil-landing-page",
        type: "link",
      },
      { label: "Police", value: "100", type: "phone" },
    ],
  },
  {
    title: "Reporting Platforms",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L22 8.5 L12 15 L2 8.5 Z" fill="#3b82f6" />
        <circle cx="12" cy="12" r="2" fill="white" />
        <path d="M8 16 L16 16 L14 20 L10 20 Z" fill="#3b82f6" />
      </svg>
    ),
    gradient: "from-blue-400 to-purple-500",
    items: [
      {
        label: "Report to Instagram",
        value: "https://help.instagram.com/contact/723586364339719",
        type: "link",
      },
      {
        label: "Report to TikTok",
        value: "https://www.tiktok.com/safety/report-a-problem",
        type: "link",
      },
      {
        label: "Report to Snapchat",
        value: "https://support.snapchat.com/report-safety-concern",
        type: "link",
      },
    ],
  },
  {
    title: "Mental Health Support",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21.35 L10.55 20.03 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 C9.24 3 10.91 3.81 12 5.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 C22 12.28 18.6 15.36 13.45 20.04 L12 21.35 Z"
          fill="#10b981"
        />
      </svg>
    ),
    gradient: "from-green-400 to-teal-500",
    items: [
      { label: "Eran - Emotional Support", value: "1201", type: "phone" },
      { label: "Sahar - Crisis Hotline", value: "*6555", type: "phone" },
      { label: "Elem Youth Helpline", value: "*8884", type: "phone" },
    ],
  },
  {
    title: "Trusted Adults",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="4" fill="#a855f7" />
        <path d="M3 21 C3 16 6 14 9 14 C12 14 15 16 15 21" fill="#a855f7" />
        <circle cx="17" cy="9" r="3" fill="#a855f7" />
        <path d="M13 21 C13 18 15 17 17 17 C19 17 21 18 21 21" fill="#a855f7" />
      </svg>
    ),
    gradient: "from-purple-400 to-indigo-500",
    items: [
      {
        label: "Parents or Guardians",
        value: "Talk to them about what happened",
        type: "text",
      },
      {
        label: "School Counselor",
        value: "They can provide support and guidance",
        type: "text",
      },
      {
        label: "Trusted Teacher",
        value: "Someone you feel comfortable talking to",
        type: "text",
      },
    ],
  },
];

export default function HelpResources() {
  return (
    <div className="space-y-8">
      <BackToHome />

      <div className="text-center space-y-4">
        <div className="mx-auto w-fit rounded-3xl bg-white/50 backdrop-blur-md p-4 shadow-lg border border-white/40">
          <img
            src={helpIcon}
            alt="Help Resources"
            className="w-52 md:w-64 h-auto object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight pb-2 gradient-text">
          Help &amp; Resources
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          If something feels unsafe, you&apos;re not alone. Here are trusted
          contacts and resources to help you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resourceCategories.map((category, index) => (
          <div
            key={index}
            className="bubble-card p-6 hover:scale-[1.01] transition-transform duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient}`}
              >
                {category.svg}
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {category.title}
              </h3>
            </div>

            <div className="space-y-3">
              {category.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {item.type === "phone" ? (
                    <a
                      href={`tel:${item.value}`}
                      className="flex items-start gap-3 text-slate-800 hover:text-purple-600 transition-colors flex-1"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="mt-1"
                        fill="#10b981"
                      >
                        <path d="M3 1 C2 1 1 2 1 3 L1 13 C1 14 2 15 3 15 L13 15 C14 15 15 14 15 13 L15 3 C15 2 14 1 13 1 Z" />
                        <circle cx="8" cy="8" r="2" fill="white" />
                      </svg>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-slate-600">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  ) : item.type === "link" ? (
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-slate-800 hover:text-purple-600 transition-colors flex-1"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="mt-1"
                        fill="#3b82f6"
                      >
                        <path
                          d="M6 10 L2 6 L6 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M10 2 L14 6 L10 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <rect
                          x="4"
                          y="5"
                          width="8"
                          height="6"
                          rx="1"
                          fill="currentColor"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-slate-600">
                          Click to visit
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 flex-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="mt-1"
                        fill="#a855f7"
                      >
                        <rect
                          x="2"
                          y="4"
                          width="12"
                          height="8"
                          rx="2"
                          fill="currentColor"
                        />
                        <path
                          d="M2 6 L8 9 L14 6"
                          stroke="white"
                          strokeWidth="1"
                          fill="none"
                        />
                      </svg>
                      <div>
                        <div className="font-medium text-slate-800">
                          {item.label}
                        </div>
                        <div className="text-sm text-slate-600">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bubble-card p-6 border-l-4 border-yellow-400">
        <div className="flex items-start gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 L22 20 L2 20 Z" fill="#f59e0b" />
            <circle cx="12" cy="17" r="1.5" fill="white" />
            <rect x="11" y="9" width="2" height="6" fill="white" rx="1" />
          </svg>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Important Reminder
            </h3>
            <p className="text-slate-700 mb-3">
              Scammers often try to create panic and pressure you to act
              quickly. Remember:
            </p>
            <ul className="space-y-1 text-slate-600">
              <li>
                • Take your time - legitimate organizations won&apos;t rush you
              </li>
              <li>
                • Verify independently - contact companies through official
                channels
              </li>
              <li>
                • Trust your instincts - if something feels wrong, it probably
                is
              </li>
              <li>
                • Ask for help - there&apos;s no shame in getting a second
                opinion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
