import { Gift, Star, Trophy, Flame, Target, Crown } from "lucide-react";
import PageShell from "@/components/PageShell";
import { loadProgress, getTotalStars } from "@/lib/progress";

export default function Rewards() {
  const progress = loadProgress();
  const stars = getTotalStars(progress.stars);
  const completed = Object.values(progress.stars).filter((s) => s > 0).length;

  const achievements = [
    { icon: Star, name: "Primeiras Estrelas", desc: "Ganhe 5 estrelas", goal: 5, current: stars, color: "hsl(45 100% 60%)" },
    { icon: Trophy, name: "Veterano", desc: "Complete 10 níveis", goal: 10, current: completed, color: "hsl(190 100% 60%)" },
    { icon: Flame, name: "Em Chamas", desc: "Ganhe 30 estrelas", goal: 30, current: stars, color: "hsl(15 100% 60%)" },
    { icon: Target, name: "Atirador", desc: "Complete 20 níveis", goal: 20, current: completed, color: "hsl(320 100% 70%)" },
    { icon: Crown, name: "Mestre", desc: "Ganhe 90 estrelas", goal: 90, current: stars, color: "hsl(275 80% 70%)" },
  ];

  return (
    <PageShell title="PRÊMIOS">
      <div className="menu-neon-frame p-5 mb-4 flex items-center gap-4">
        <div className="menu-neon-circle w-14 h-14 flex items-center justify-center">
          <Gift className="neon-icon-cyan" size={26} />
        </div>
        <div>
          <p className="neon-text-cyan font-bold text-lg">Suas Conquistas</p>
          <p className="text-white/70 text-sm">{stars} estrelas · {completed} níveis</p>
        </div>
      </div>

      <div className="space-y-3">
        {achievements.map((a) => {
          const pct = Math.min(100, (a.current / a.goal) * 100);
          const done = a.current >= a.goal;
          return (
            <div key={a.name} className="menu-neon-frame p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${a.color}22`, boxShadow: `0 0 12px ${a.color}55` }}
              >
                <a.icon size={22} style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="neon-text-cyan font-bold text-sm">{a.name}</span>
                  <span className="text-white/60 text-xs">{Math.min(a.current, a.goal)}/{a.goal}</span>
                </div>
                <p className="text-white/60 text-xs mb-2">{a.desc}</p>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: done ? "hsl(145 65% 50%)" : a.color,
                      boxShadow: `0 0 8px ${done ? "hsl(145 65% 50%)" : a.color}`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
