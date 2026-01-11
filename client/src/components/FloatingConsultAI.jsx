import { Link } from "react-router-dom";

export default function FloatingConsultAI() {
  return (
    <Link
      to="/consult"
      className="fixed bottom-6 right-6 z-50 group"
      title="Consult AI"
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
        <span className="text-xl group-hover:animate-bounce">🤖</span>
        <span className="font-semibold text-sm hidden sm:block">Consult AI</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
    </Link>
  );
}