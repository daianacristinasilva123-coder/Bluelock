import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Sparkles, X, Trophy } from "lucide-react";

interface GoalData {
  scorer: string;
  assistant?: string;
  team: "playerTeam" | "opponentTeam";
  teamName?: string;
}

interface Props {
  goal: GoalData | null;
  playerTeam: string;
  opponentTeam: string;
  currentScore: { playerTeam: number; opponentTeam: number };
  onClose: () => void;
}

export const MatchGoalCelebration: React.FC<Props> = ({
  goal,
  playerTeam,
  opponentTeam,
  currentScore,
  onClose,
}) => {
  useEffect(() => {
    if (!goal) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [goal, onClose]);

  if (!goal) return null;

  const isPlayerTeam = goal.team === "playerTeam";
  const scoringTeamName = goal.teamName || (isPlayerTeam ? playerTeam : opponentTeam);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Glowing background burst */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute w-96 h-96 rounded-full filter blur-3xl pointer-events-none ${
            isPlayerTeam ? "bg-cyan-500" : "bg-rose-600"
          }`}
        />

        {/* Speed lines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -30 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`relative max-w-lg w-full rounded-2xl p-6 sm:p-8 text-center border-2 shadow-2xl overflow-hidden ${
            isPlayerTeam
              ? "bg-zinc-950/95 border-cyan-400 shadow-cyan-500/40"
              : "bg-zinc-950/95 border-rose-500 shadow-rose-500/40"
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-900 border border-zinc-700 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame
              className={`w-7 h-7 animate-bounce ${
                isPlayerTeam ? "text-cyan-400" : "text-rose-500"
              }`}
            />
            <span
              className={`text-xs font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                isPlayerTeam
                  ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/50"
                  : "bg-rose-950/80 text-rose-300 border-rose-500/50"
              }`}
            >
              BLUE LOCK IMPACT • GOAL!
            </span>
            <Sparkles
              className={`w-7 h-7 animate-bounce ${
                isPlayerTeam ? "text-cyan-400" : "text-rose-500"
              }`}
            />
          </div>

          {/* Huge GOAL title */}
          <motion.h1
            initial={{ scale: 0.5, letterSpacing: "-0.05em" }}
            animate={{ scale: [1, 1.08, 1], letterSpacing: "0.08em" }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`text-5xl sm:text-6xl font-black font-['Chakra_Petch'] italic uppercase drop-shadow-md my-2 ${
              isPlayerTeam
                ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-white to-amber-500"
            }`}
          >
            GOOOOOOL!
          </motion.h1>

          {/* Team that scored banner */}
          <div className="my-3">
            <div
              className={`inline-block px-4 py-1.5 rounded-lg text-sm sm:text-base font-black font-['Chakra_Petch'] uppercase tracking-wider ${
                isPlayerTeam
                  ? "bg-cyan-500 text-zinc-950 shadow-lg shadow-cyan-400/50"
                  : "bg-rose-600 text-white shadow-lg shadow-rose-600/50"
              }`}
            >
              GOL DO {scoringTeamName}!
            </div>
          </div>

          {/* Scorer details */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 my-4">
            <div className="text-xs text-zinc-400 font-mono uppercase mb-1">
              ⚽ Autor do Gol
            </div>
            <div className="text-2xl font-black text-white font-['Chakra_Petch']">
              {goal.scorer}
            </div>
            {goal.assistant && (
              <div className="text-xs text-zinc-300 font-mono mt-1">
                👟 Assistência: <span className="text-cyan-300 font-bold">{goal.assistant}</span>
              </div>
            )}
          </div>

          {/* Scoreboard recap */}
          <div className="flex items-center justify-center gap-4 bg-zinc-950 py-2.5 px-6 rounded-xl border border-zinc-800 font-['Chakra_Petch']">
            <div className="text-right flex-1">
              <div className="text-xs font-bold text-cyan-400 truncate">{playerTeam}</div>
              <div className="text-2xl font-black text-white">{currentScore.playerTeam}</div>
            </div>
            <div className="text-zinc-600 font-black text-xl">X</div>
            <div className="text-left flex-1">
              <div className="text-xs font-bold text-rose-400 truncate">{opponentTeam}</div>
              <div className="text-2xl font-black text-white">{currentScore.opponentTeam}</div>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase font-bold tracking-wider transition"
          >
            Continuar Partida
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
