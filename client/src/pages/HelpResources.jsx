import PropTypes from "prop-types";
import { Phone, Shield, Heart, ExternalLink, AlertTriangle } from "lucide-react";

/**
 * HelpResources (English UI + Israeli Content)
 * Text is in English, but phone numbers are for Israel (105, 100, ERAN).
 */
export default function HelpResources() {
  return (
    <section className="space-y-8 max-w-4xl mx-auto p-4">
      {/* Title */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Help & Support Center
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          If something feels unsafe, you are not alone. We are here with the tools and people who can help you.
        </p>
      </header>

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Emergency Card - Red emphasis */}
        <ResourceCard
          title="Immediate Help"
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          borderColor="border-red-100"
          bgColor="bg-red-50/50"
          items={[
            { label: "105 Hotline (Child Online Protection)", value: "105", type: "phone" },
            { label: "Israel Police", value: "100", type: "phone" },
            { label: "Sahar (Online Mental Support)", value: "https://sahar.org.il", type: "link" },
          ]}
        />

        {/* Reporting Card - Blue/Neutral */}
        <ResourceCard
          title="Report & Evidence"
          icon={<Shield className="w-6 h-6 text-blue-600" />}
          items={[
            { label: "Report to Instagram/TikTok", value: "https://www.instagram.com/support", type: "link" },
            { label: "Take screenshots as evidence", value: null, type: "text" },
            { label: "Block the abusive user", value: null, type: "text" },
          ]}
        />

        {/* Support Card - Green/Soft */}
        <ResourceCard
          title="Trusted People"
          icon={<Heart className="w-6 h-6 text-pink-600" />}
          items={[
            { label: "Parents or Family Member", value: null, type: "text" },
            { label: "School Counselor", value: null, type: "text" },
            { label: "ERAN (Emotional First Aid)", value: "1201", type: "phone" },
          ]}
        />
      </div>

      {/* Bottom reminder */}
      <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 shadow-sm">
        <div className="flex items-start gap-3">
            <div className="mt-1"><Shield className="w-5 h-5 text-blue-600" /></div>
            <div>
                <div className="text-lg font-bold text-blue-900">Important Reminder</div>
                <p className="mt-1 text-blue-800">
                Online extortion and scams rely on fear. Attackers try to make you act fast without thinking.
                <br/>
                <strong>You have the power:</strong> Pause, do not pay, and do not send more photos. Ask for help immediately.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Reusable Card Component
 * Handles phones, links, and plain text items.
 */
function ResourceCard({ title, items, icon, borderColor = "border-slate-200", bgColor = "bg-white" }) {
  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <div className="text-xl font-bold text-slate-800">{title}</div>
      </div>
      
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-700">
            {/* Logic to render different types of items */}
            {item.type === "phone" ? (
               <a href={`tel:${item.value}`} className="flex items-center gap-2 font-medium text-slate-900 hover:text-blue-600 underline decoration-slate-300 underline-offset-4">
                 <Phone size={16} /> {item.label}
               </a>
            ) : item.type === "link" ? (
                <a href={item.value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium text-slate-900 hover:text-blue-600 underline decoration-slate-300 underline-offset-4">
                  <ExternalLink size={16} /> {item.label}
                </a>
            ) : (
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 
                    {item.label}
                </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

ResourceCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element,
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