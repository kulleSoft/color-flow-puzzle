import { CalendarDays, Check, Lock } from "lucide-react";
import PageShell from "@/components/PageShell";

const today = new Date();
const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

export default function Daily() {
  return (
    <PageShell title="DIÁRIO">
      <div className="menu-neon-frame p-5 mb-4 flex items-center gap-4">
        <div className="menu-neon-circle w-14 h-14 flex items-center justify-center">
          <CalendarDays className="neon-icon-cyan" size={26} />
        </div>
        <div>
          <p className="neon-text-cyan font-bold text-lg">Desafio de Hoje</p>
          <p className="text-white/70 text-sm">
            {today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {monthDays.map((d) => {
          const completed = d < today.getDate();
          const isToday = d === today.getDate();
          const locked = d > today.getDate();
          return (
            <div
              key={d}
              className={`aspect-square menu-neon-circle flex items-center justify-center text-sm font-bold ${
                isToday ? "ring-2 ring-[hsl(45_100%_60%)]" : ""
              } ${locked ? "opacity-40" : ""}`}
            >
              {completed ? (
                <Check className="text-[hsl(145_65%_55%)]" size={18} />
              ) : locked ? (
                <Lock className="text-white/50" size={14} />
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
