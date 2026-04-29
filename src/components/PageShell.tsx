import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gameBg from "@/assets/game-bg.jpg";

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

export default function PageShell({ title, children }: PageShellProps) {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 select-none relative"
      style={{
        backgroundImage: `url(${gameBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-lg flex items-center gap-3 pt-2 pb-6 relative z-10">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/")}
          className="neon-icon-btn w-12 h-12 rounded-2xl flex items-center justify-center text-[hsl(190_100%_70%)]"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </motion.button>
        <h1 className="neon-text-cyan text-2xl font-bold tracking-wider">{title}</h1>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
