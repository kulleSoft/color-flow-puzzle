import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import WaterSortGame from "@/components/WaterSortGame";
import { loadProgress, loadSettings, saveProgress, type Progress } from "@/lib/progress";
import { getDailyLevel, markDailyCompleted, todayKey } from "@/lib/daily";
import { getStars } from "@/lib/gameLogic";

export default function DailyGame() {
  const navigate = useNavigate();
  const settings = loadSettings();
  const dateKey = todayKey();
  const dailyLevel = getDailyLevel(dateKey);
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const handleUpdateProgress = useCallback(
    (p: Progress) => {
      // Detect completion of today's daily level and mark it.
      const earned = p.stars[dailyLevel];
      if (earned !== undefined) {
        markDailyCompleted(dateKey, earned);
      }
      setProgress(p);
      saveProgress(p);
    },
    [dailyLevel, dateKey],
  );

  return (
    <WaterSortGame
      initialLevel={dailyLevel}
      progress={progress}
      soundEnabled={settings.soundEnabled}
      onUpdateProgress={handleUpdateProgress}
      onBackToMenu={() => navigate("/diario")}
    />
  );
}
