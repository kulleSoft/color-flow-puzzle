import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, Trash2, RotateCcw, Music2, Vibrate, Info } from "lucide-react";
import { type Settings } from "@/lib/progress";
import gameBg from "@/assets/game-bg.png";

interface SettingsScreenProps {
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export default function SettingsScreen({ settings, onUpdateSettings, onResetProgress, onBack }: SettingsScreenProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const ToggleRow = ({
    icon: Icon,
    title,
    subtitle,
    enabled,
    onToggle,
  }: {
    icon: typeof Volume2;
    title: string;
    subtitle: string;
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <div className="menu-neon-frame px-4 py-3.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="menu-neon-circle w-11 h-11 flex items-center justify-center shrink-0">
          <Icon className="neon-icon-cyan" size={20} strokeWidth={2.3} />
        </div>
        <div className="min-w-0">
          <p className="neon-text-cyan font-bold text-sm tracking-wide truncate">{title}</p>
          <p className="text-[11px] text-[hsl(190_60%_75%/0.7)] truncate">{subtitle}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onToggle}
        className={`relative w-14 h-7 rounded-full border-2 transition-all shrink-0 ${
          enabled
            ? "border-[hsl(45_100%_60%)] bg-[hsl(45_100%_55%/0.25)]"
            : "border-[hsl(190_100%_60%/0.4)] bg-[hsl(260_60%_10%)]"
        }`}
        style={{
          boxShadow: enabled
            ? "0 0 10px hsl(45 100% 55% / 0.7), inset 0 0 8px hsl(45 100% 55% / 0.25)"
            : "inset 0 0 8px rgba(0,0,0,0.6)",
        }}
      >
        <motion.div
          animate={{ x: enabled ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
          style={{
            background: enabled
              ? "radial-gradient(circle at 30% 30%, hsl(45 100% 75%), hsl(40 90% 50%))"
              : "radial-gradient(circle at 30% 30%, hsl(190 100% 75%), hsl(190 80% 40%))",
            boxShadow: enabled
              ? "0 0 8px hsl(45 100% 60%), 0 2px 4px rgba(0,0,0,0.5)"
              : "0 0 6px hsl(190 100% 60% / 0.6), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        />
      </motion.button>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 select-none relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, hsl(260 50% 12% / 0.55) 0%, hsl(280 55% 18% / 0.65) 60%, hsl(320 50% 22% / 0.75) 100%), url(${gameBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="w-full max-w-md flex items-center gap-3 pt-2 pb-5 relative z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="neon-icon-btn w-12 h-12 rounded-2xl flex items-center justify-center text-[hsl(190_100%_70%)]"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </motion.button>
        <h1 className="neon-text-cyan text-2xl font-bold tracking-wider">CONFIGURAÇÕES</h1>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="w-full max-w-md flex flex-col gap-4 relative z-10"
      >
        {/* Section: Áudio */}
        <div className="space-y-2.5">
          <p className="neon-text-cyan text-xs font-bold tracking-[0.2em] pl-1 opacity-80">ÁUDIO</p>
          <ToggleRow
            icon={settings.soundEnabled ? Volume2 : VolumeX}
            title="EFEITOS SONOROS"
            subtitle="Sons das jogadas e vitórias"
            enabled={settings.soundEnabled}
            onToggle={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
          />
        </div>

        {/* Section: Sobre */}
        <div className="space-y-2.5">
          <p className="neon-text-cyan text-xs font-bold tracking-[0.2em] pl-1 opacity-80">SOBRE</p>
          <div className="menu-neon-frame px-4 py-3.5 flex items-center gap-3">
            <div className="menu-neon-circle w-11 h-11 flex items-center justify-center shrink-0">
              <Info className="neon-icon-cyan" size={20} strokeWidth={2.3} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="neon-text-cyan font-bold text-sm tracking-wide">WATER SORT PUZZLE</p>
              <p className="text-[11px] text-[hsl(190_60%_75%/0.7)]">Versão 1.0.0</p>
            </div>
          </div>
        </div>

        {/* Section: Dados */}
        <div className="space-y-2.5">
          <p className="neon-text-cyan text-xs font-bold tracking-[0.2em] pl-1 opacity-80">DADOS</p>
          <div
            className="menu-neon-frame px-4 py-4"
            style={{
              backgroundImage:
                "linear-gradient(180deg, hsl(0 60% 18%) 0%, hsl(0 70% 10%) 100%)",
              borderColor: "hsl(0 90% 65%)",
              boxShadow:
                "0 0 12px hsl(0 90% 60% / 0.6), 0 0 24px hsl(0 90% 60% / 0.3), inset 0 0 14px hsl(0 90% 60% / 0.15), 0 6px 16px rgba(0,0,0,0.55)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2"
                style={{
                  borderColor: "hsl(0 90% 65%)",
                  background: "linear-gradient(180deg, hsl(0 60% 14%), hsl(0 70% 6%))",
                  boxShadow: "0 0 10px hsl(0 90% 60% / 0.6), inset 0 0 8px hsl(0 90% 60% / 0.2)",
                }}
              >
                <Trash2
                  size={20}
                  strokeWidth={2.3}
                  style={{
                    color: "hsl(0 100% 75%)",
                    filter: "drop-shadow(0 0 4px hsl(0 100% 60% / 0.9))",
                  }}
                />
              </div>
              <div className="min-w-0">
                <p
                  className="font-bold text-sm tracking-wide"
                  style={{
                    color: "hsl(0 100% 80%)",
                    textShadow: "0 0 6px hsl(0 100% 60% / 0.8)",
                  }}
                >
                  RESETAR PROGRESSO
                </p>
                <p className="text-[11px] text-[hsl(0_60%_85%/0.7)]">Apaga níveis, estrelas e moedas</p>
              </div>
            </div>

            {!confirmReset ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(180deg, hsl(0 70% 28%), hsl(0 80% 16%))",
                  border: "2px solid hsl(0 90% 65%)",
                  color: "hsl(0 100% 88%)",
                  textShadow: "0 0 6px hsl(0 100% 60% / 0.7)",
                  boxShadow: "0 0 10px hsl(0 90% 60% / 0.5), inset 0 1px 2px rgba(255,255,255,0.15)",
                }}
              >
                <RotateCcw size={16} strokeWidth={2.5} />
                RESETAR
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm tracking-wider"
                  style={{
                    background: "linear-gradient(180deg, hsl(0 80% 50%), hsl(0 85% 35%))",
                    border: "2px solid hsl(0 100% 75%)",
                    color: "hsl(0 0% 100%)",
                    textShadow: "0 0 6px hsl(0 100% 50%)",
                    boxShadow: "0 0 14px hsl(0 90% 60% / 0.8), inset 0 1px 2px rgba(255,255,255,0.25)",
                  }}
                >
                  CONFIRMAR
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm tracking-wider neon-text-cyan"
                  style={{
                    background: "linear-gradient(180deg, hsl(265 75% 14%), hsl(265 80% 8%))",
                    border: "2px solid hsl(190 100% 60%)",
                    boxShadow: "0 0 10px hsl(190 100% 60% / 0.5), inset 0 1px 2px rgba(255,255,255,0.1)",
                  }}
                >
                  CANCELAR
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
