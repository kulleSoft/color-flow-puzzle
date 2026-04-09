import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, Trash2 } from "lucide-react";
import { type Settings } from "@/lib/progress";

interface SettingsScreenProps {
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export default function SettingsScreen({ settings, onUpdateSettings, onResetProgress, onBack }: SettingsScreenProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="min-h-screen game-gradient-bg flex flex-col items-center p-4 select-none">
      {/* Header */}
      <div className="w-full max-w-md flex items-center gap-3 pt-2 pb-6">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md space-y-4"
      >
        {/* Sound Toggle */}
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? (
              <Volume2 size={22} className="text-primary" />
            ) : (
              <VolumeX size={22} className="text-muted-foreground" />
            )}
            <div>
              <p className="font-semibold text-foreground">Sons</p>
              <p className="text-sm text-muted-foreground">Efeitos sonoros do jogo</p>
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-7 rounded-full transition-all relative ${
              settings.soundEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <motion.div
              animate={{ x: settings.soundEnabled ? 20 : 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-foreground"
            />
          </button>
        </div>

        {/* Reset Progress */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 size={22} className="text-destructive" />
            <div>
              <p className="font-semibold text-foreground">Resetar Progresso</p>
              <p className="text-sm text-muted-foreground">Apagar todas as estrelas e níveis</p>
            </div>
          </div>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 rounded-xl bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-all"
            >
              Resetar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold hover:brightness-110 transition-all"
              >
                Confirmar
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold hover:text-foreground transition-all"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
