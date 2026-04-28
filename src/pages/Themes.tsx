import { Check } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { THEMES, setActiveTheme, getActiveTheme } from "@/lib/themes";

export default function Themes() {
  const [selected, setSelected] = useState("neon");

  useEffect(() => {
    setSelected(getActiveTheme().id);
  }, []);

  const choose = (id: string) => {
    setSelected(id);
    setActiveTheme(id);
    toast.success(`Tema "${THEMES[id].name}" aplicado ao jogo`);
  };

  return (
    <PageShell title="TEMAS">
      <p className="text-center text-white/70 text-sm mb-4">
        O tema selecionado define as cores dos líquidos e o fundo da partida.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(THEMES).map((t) => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => choose(t.id)}
              className={`menu-neon-frame p-4 flex flex-col items-center gap-3 relative ${
                active ? "ring-2 ring-[hsl(190_100%_60%)]" : ""
              }`}
            >
              <div className="flex gap-1">
                {t.palette.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-12 rounded-md border border-white/20"
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
            </button>
          );
        })}
      </div>
    </PageShell>
  );
}
