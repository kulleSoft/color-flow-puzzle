import { CalendarDays, Check, Lock, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { getDailyLevel, loadDaily, todayKey } from "@/lib/daily";

export default function Daily() {
  const navigate = useNavigate();
  const today = new Date();
  const todayDay = today.getDate();
  const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const daily = loadDaily();
  const todaysKey = todayKey(today);
  const todaysStars = daily.completed[todaysKey] ?? 0;
  const todaysLevel = getDailyLevel(todaysKey);
  const completedToday = todaysStars > 0;

  const dateKeyForDay = (day: number) => {
    const d = new Date(today.getFullYear(), today.getMonth(), day);
    return todayKey(d);
  };

  return (
    <PageShell title="DIÁRIO">
      <div className="menu-neon-frame p-5 mb-4 flex items-center gap-4">
        <div className="menu-neon-circle w-14 h-14 flex items-center justify-center">
          <CalendarDays className="neon-icon-cyan" size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="neon-text-cyan font-bold text-lg">Desafio de Hoje</p>
          <p className="text-white/70 text-sm capitalize">
            {today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <p className="text-white/60 text-xs mt-0.5">Nível especial #{todaysLevel}</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/diario/jogar")}
        className="menu-neon-frame-lg w-full py-4 px-6 flex items-center justify-center gap-4 mb-5"
      >
        <div className="menu-neon-circle w-12 h-12 flex items-center justify-center">
          {completedToday ? (
            <Check className="text-[hsl(145_65%_55%)]" size={24} strokeWidth={3} />
          ) : (
            <Play className="neon-icon-cyan ml-0.5" size={22} strokeWidth={2.5} fill="currentColor" />
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="neon-text-cyan text-xl font-bold tracking-wider">
            {completedToday ? "JOGAR DE NOVO" : "JOGAR DESAFIO"}
          </span>
          {completedToday && (
            <div className="flex gap-0.5 mt-0.5">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={
                    s <= todaysStars
                      ? "text-[hsl(45_100%_60%)] fill-[hsl(45_100%_60%)]"
                      : "text-white/20 fill-white/10"
                  }
                />
              ))}
            </div>
          )}
        </div>
      </motion.button>

      <p className="neon-text-cyan text-xs font-bold tracking-widest mb-2 opacity-80">
        ESTE MÊS
      </p>
      <div className="grid grid-cols-6 gap-2">
        {monthDays.map((d) => {
          const isToday = d === todayDay;
          const locked = d > todayDay;
          const stars = daily.completed[dateKeyForDay(d)] ?? 0;
          const completed = stars > 0;
          return (
            <div
              key={d}
              className={`aspect-square menu-neon-circle flex flex-col items-center justify-center text-sm font-bold ${
                isToday ? "ring-2 ring-[hsl(45_100%_60%)]" : ""
              } ${locked ? "opacity-40" : ""}`}
              title={completed ? `${stars}⭐` : ""}
            >
              {completed ? (
                <>
                  <Check className="text-[hsl(145_65%_55%)]" size={14} />
                  <span className="text-[9px] text-[hsl(45_100%_60%)] leading-none mt-0.5">
                    {"★".repeat(stars)}
                  </span>
                </>
              ) : locked ? (
                <Lock className="text-white/50" size={12} />
              ) : (
                <span className="neon-text-cyan">{d}</span>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
