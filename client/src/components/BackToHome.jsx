import { Link } from "react-router-dom";

export default function BackToHome() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors duration-200 group mb-6"
    >
      <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
      Back to Home
    </Link>
  );
}