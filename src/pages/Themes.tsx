import { Check, Lock } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const themes = [
  { id: "neon", name: "Neon", colors: ["#00f0ff", "#ff00aa", "#ffea00"], unlocked: true },
  { id: "ocean", name: "Oceano", colors: ["#0077be", "#00a8cc", "#7fdbda"], unlocked: true },
  { id: "sunset", name: "Pôr do Sol", colors: ["#ff6b6b", "#ffa500", "#ffd700"], unlocked: true },
  { id: "forest", name: "Floresta", colors: ["#2d6a4f", "#74c69d", "#b7e4c7"], unlocked: false },
  { id: "candy", name: "Doce", colors: ["#ff85a1", "#ffb3c6", "#ffc8dd"], unlocked: false },
  { id: "galaxy", name: "Galáxia", colors: ["#1a0033", "#7209b7", "#f72585"], unlocked: false },
];

export default function Themes() {
  const [selected, setSelected] = useState("neon");

  useEffect(() => {
    const s = localStorage.getItem("selected-theme");
    if (s) setSelected(s);
  }, []);

  const choose = (t: typeof themes[number]) => {
    if (!t.unlocked) {
      toast.error("Tema bloqueado");
      return;
    }
    setSelected(t.id);
    localStorage.setItem("selected-theme", t.id);
    toast.success(`Tema "${t.name}" selecionado`);
  };

  return (
    <PageShell title="TEMAS">
      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => choose(t)}
              className={`menu-neon-frame p-4 flex flex-col items-center gap-3 relative ${
                active ? "ring-2 ring-[hsl(190_100%_60%)]" : ""
              } ${!t.unlocked ? "opacity-60" : ""}`}
            >
              <div className="flex gap-1.5">
                {t.colors.map((c) => (
                  <div
                    key={c}
                    className="w-8 h-12 rounded-md border border-white/20"
                    style={{ background: c, boxShadow: `0 0 10px ${c}` }}
                  />
                ))}
              </div>
              <span className="neon-text-cyan font-bold text-sm">{t.name}</span>
              {active && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[hsl(145_65%_50%)] flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
              {!t.unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock size={16} className="text-white/70" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </PageShell>
  );
}
