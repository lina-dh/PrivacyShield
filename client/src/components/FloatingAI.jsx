import { Link } from "react-router-dom";

const FloatingAI = () => {
  return (
    <Link
      to="/consult"
      className="floating-ai robot-wave flex items-center gap-2 px-4 py-3 rounded-full"
    >
      <span className="text-xl">🤖</span>
      <span className="text-white font-medium text-sm">Consult AI</span>
    </Link>
  );
};

export default FloatingAI;
