import { ShoppingCart, Coins } from "lucide-react";
import PageShell from "@/components/PageShell";
import { toast } from "sonner";

const items = [
  { id: 1, name: "Pacote de Dicas", desc: "5 dicas extras", price: 100, icon: "💡" },
  { id: 2, name: "Tubo Extra", desc: "1 tubo adicional", price: 150, icon: "🧪" },
  { id: 3, name: "Desfazer +", desc: "10 desfazeres", price: 80, icon: "↩️" },
  { id: 4, name: "Pular Nível", desc: "Pula o nível atual", price: 250, icon: "⏭️" },
  { id: 5, name: "Pacote Mega", desc: "Tudo incluso", price: 600, icon: "🎁" },
  { id: 6, name: "Sem Anúncios", desc: "Por 7 dias", price: 400, icon: "🚫" },
];

export default function Shop() {
  return (
    <PageShell title="LOJA">
      <div className="menu-neon-frame p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="menu-neon-circle w-12 h-12 flex items-center justify-center">
            <ShoppingCart className="neon-icon-cyan" size={22} />
          </div>
          <span className="neon-text-cyan font-bold">Itens disponíveis</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 border border-[hsl(45_100%_60%)]/40">
          <Coins className="text-[hsl(45_100%_60%)]" size={18} />
          <span className="text-[hsl(45_100%_70%)] font-bold">0</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => toast.error("Moedas insuficientes")}
            className="menu-neon-frame p-4 flex flex-col items-center gap-2 text-center"
          >
            <span className="text-4xl">{it.icon}</span>
            <span className="neon-text-cyan font-bold text-sm">{it.name}</span>
            <span className="text-white/60 text-xs">{it.desc}</span>
            <div className="flex items-center gap-1 mt-1 px-2.5 py-1 rounded-full bg-black/30">
              <Coins className="text-[hsl(45_100%_60%)]" size={14} />
              <span className="text-[hsl(45_100%_70%)] font-bold text-xs">{it.price}</span>
            </div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}
