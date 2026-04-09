import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MainMenu from "@/components/MainMenu";
import LevelSelect from "@/components/LevelSelect";
import SettingsScreen from "@/components/SettingsScreen";
import WaterSortGame from "@/components/WaterSortGame";
import {
  loadProgress,
  saveProgress,
  resetProgress,
  loadSettings,
  saveSettings,
  type Progress,
  type Settings,
} from "@/lib/progress";

type Screen = "menu" | "game" | "levels" | "settings";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [gameLevel, setGameLevel] = useState(() => progress.currentLevel);

  const handlePlay = useCallback(() => {
    setGameLevel(progress.currentLevel);
    setScreen("game");
  }, [progress.currentLevel]);

  const handleSelectLevel = useCallback((lvl: number) => {
    setGameLevel(lvl);
    setScreen("game");
  }, []);

  const handleUpdateSettings = useCallback((s: Settings) => {
    setSettings(s);
    saveSettings(s);
  }, []);

  const handleResetProgress = useCallback(() => {
    resetProgress();
    const fresh = loadProgress();
    setProgress(fresh);
  }, []);

  const handleUpdateProgress = useCallback((p: Progress) => {
    setProgress(p);
    saveProgress(p);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen + (screen === "game" ? `-${gameLevel}` : "")}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {screen === "menu" && (
          <MainMenu
            progress={progress}
            onPlay={handlePlay}
            onLevelSelect={() => setScreen("levels")}
            onSettings={() => setScreen("settings")}
          />
        )}
        {screen === "levels" && (
          <LevelSelect
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onBack={() => setScreen("menu")}
          />
        )}
        {screen === "settings" && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onBack={() => setScreen("menu")}
          />
        )}
        {screen === "game" && (
          <WaterSortGame
            initialLevel={gameLevel}
            progress={progress}
            soundEnabled={settings.soundEnabled}
            onUpdateProgress={handleUpdateProgress}
            onBackToMenu={() => setScreen("menu")}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
