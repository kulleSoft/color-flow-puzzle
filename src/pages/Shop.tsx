import { ShoppingCart, Coins, ShieldOff, Check } from "lucide-react";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import { toast } from "sonner";
import {
  loadCoins,
  loadInventory,
  spendCoins,
  addCoins,
  addItems,
  isNoAds,
  activateNoAds,
  noAdsExpiry,
  type ItemId,
} from "@/lib/economy";

interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
  apply: () => void;
}

export default function Shop() {
  const [coins, setCoins] = useState(() => loadCoins());
  const [inv, setInv] = useState(() => loadInventory());
  const [noAds, setNoAds] = useState(() => isNoAds());

  const refresh = () => {
    setCoins(loadCoins());
    setInv(loadInventory());
    setNoAds(isNoAds());
  };

  const buy = (item: ShopItem) => {
    if (!spendCoins(item.price)) {
      toast.error("Moedas insuficientes 🙁", {
        description: "Complete níveis para ganhar mais moedas.",
      });
      return;
    }
    item.apply();
    refresh();
    toast.success(`${item.name} adquirido!`, { description: item.desc });
  };

  const grantDailyBonus = () => {
    const KEY = "water-sort-daily-bonus";
    const today = new Date().toDateString();
    if (localStorage.getItem(KEY) === today) {
      toast.info("Bônus diário já coletado hoje 🎁");
      return;
    }
    addCoins(50);
    localStorage.setItem(KEY, today);
    refresh();
    toast.success("+50 moedas! 🪙", { description: "Volte amanhã para mais." });
  };

  const items: ShopItem[] = [
    { id: "hint", name: "Pacote de Dicas", desc: "+5 dicas", price: 100, icon: "💡", apply: () => addItems("hint" as ItemId, 5) },
    { id: "extraTube", name: "Tubo Extra", desc: "+1 tubo", price: 150, icon: "🧪", apply: () => addItems("extraTube", 1) },
    { id: "undo", name: "Desfazer +", desc: "+10 desfazeres", price: 80, icon: "↩️", apply: () => addItems("undo", 10) },
    { id: "skip", name: "Pular Nível", desc: "+1 pulo", price: 250, icon: "⏭️", apply: () => addItems("skip", 1) },
    { id: "mega", name: "Pacote Mega", desc: "Tudo incluso", price: 600, icon: "🎁", apply: () => {
      addItems("hint", 10);
      addItems("extraTube", 3);
      addItems("undo", 20);
      addItems("skip", 2);
    } },
    { id: "noads", name: "Sem Anúncios", desc: "7 dias", price: 400, icon: "🚫", apply: () => activateNoAds(7) },
  ];

  const expiry = noAdsExpiry();

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
          <span className="text-[hsl(45_100%_70%)] font-bold">{coins}</span>
        </div>
      </div>

      {/* Inventory snapshot */}
      <div className="menu-neon-frame p-3 mb-4 grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Dicas", value: inv.hint, icon: "💡" },
          { label: "Tubos", value: inv.extraTube, icon: "🧪" },
          { label: "Desfazer", value: inv.undo, icon: "↩️" },
          { label: "Pulos", value: inv.skip, icon: "⏭️" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="text-xl">{s.icon}</span>
            <span className="neon-text-cyan font-bold text-sm">{s.value}</span>
            <span className="text-white/50 text-[10px]">{s.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={grantDailyBonus}
        className="menu-neon-frame w-full p-3 mb-4 flex items-center justify-center gap-2"
      >
        <Coins className="text-[hsl(45_100%_60%)]" size={18} />
        <span className="neon-text-cyan font-bold text-sm">COLETAR BÔNUS DIÁRIO (+50)</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => {
          const owned = it.id === "noads" && noAds;
          return (
            <button
              key={it.id}
              onClick={() => (owned ? toast.info("Já está ativo ✨") : buy(it))}
              className={`menu-neon-frame p-4 flex flex-col items-center gap-2 text-center transition-opacity ${
                coins < it.price && !owned ? "opacity-60" : ""
              }`}
            >
              <span className="text-4xl">{it.icon}</span>
              <span className="neon-text-cyan font-bold text-sm">{it.name}</span>
              <span className="text-white/60 text-xs">{it.desc}</span>
              {owned ? (
                <div className="flex items-center gap-1 mt-1 px-2.5 py-1 rounded-full bg-[hsl(145_65%_30%)]/40 border border-[hsl(145_65%_55%)]/50">
                  <Check className="text-[hsl(145_65%_55%)]" size={12} />
                  <span className="text-[hsl(145_65%_70%)] font-bold text-xs">ATIVO</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1 px-2.5 py-1 rounded-full bg-black/30">
                  <Coins className="text-[hsl(45_100%_60%)]" size={14} />
                  <span className="text-[hsl(45_100%_70%)] font-bold text-xs">{it.price}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {expiry && (
        <div className="mt-4 menu-neon-frame p-3 flex items-center gap-2 justify-center">
          <ShieldOff className="text-[hsl(145_65%_55%)]" size={16} />
          <span className="text-white/70 text-xs">
            Sem anúncios até {new Date(expiry).toLocaleDateString("pt-BR")}
          </span>
        </div>
      )}
    </PageShell>
  );
}
