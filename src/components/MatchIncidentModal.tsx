import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Flame, X, Swords, AlertTriangle } from "lucide-react";

export interface IncidentData {
  type: "foul" | "yellow_card" | "red_card" | "clash" | "save" | "penalty";
  title: string;
  subtitle: string;
  committedBy?: string;
  victim?: string;
  description: string;
  card?: "yellow" | "red" | "none";
  isPenalty?: boolean;
}

interface Props {
  incident: IncidentData | null;
  onClose: () => void;
}

export const MatchIncidentModal: React.FC<Props> = ({ incident, onClose }) => {
  useEffect(() => {
    if (!incident) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [incident, onClose]);

  if (!incident) return null;

  const isCard = incident.type === "yellow_card" || incident.type === "red_card" || incident.card === "yellow" || incident.card === "red";
  const isRed = incident.type === "red_card" || incident.card === "red";
  const isClash = incident.type === "clash";
  const isPenalty = incident.type === "penalty" || incident.isPenalty;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`relative max-w-md w-full rounded-2xl p-6 text-center border-2 shadow-2xl overflow-hidden ${
            isRed
              ? "bg-zinc-950/95 border-rose-600 shadow-rose-600/50"
              : isCard
              ? "bg-zinc-950/95 border-amber-400 shadow-amber-400/50"
              : isClash
              ? "bg-zinc-950/95 border-orange-500 shadow-orange-500/50"
              : isPenalty
              ? "bg-zinc-950/95 border-purple-500 shadow-purple-500/50"
              : "bg-zinc-950/95 border-cyan-500 shadow-cyan-500/50"
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-900 border border-zinc-700 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Badge Icon */}
          <div className="flex items-center justify-center mb-3">
            {isRed ? (
              <div className="w-12 h-16 bg-rose-600 rounded-md border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-xs font-mono animate-bounce">
                EXPULSÃO
              </div>
            ) : isCard ? (
              <div className="w-12 h-16 bg-amber-400 rounded-md border-2 border-white shadow-lg flex items-center justify-center text-zinc-950 font-black text-xs font-mono animate-bounce">
                CARTÃO
              </div>
            ) : isClash ? (
              <div className="p-3 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/50 animate-pulse">
                <Swords className="w-8 h-8" />
              </div>
            ) : isPenalty ? (
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/50 animate-bounce">
                <AlertTriangle className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-3 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Category Tag */}
          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase mb-2 border border-zinc-700 bg-zinc-900 text-zinc-300">
            {incident.title}
          </div>

          {/* Subtitle / Main Alert */}
          <h2 className={`text-xl sm:text-2xl font-black font-['Chakra_Petch'] uppercase italic my-1 ${
            isRed ? "text-rose-500" : isCard ? "text-amber-400" : isClash ? "text-orange-400" : "text-white"
          }`}>
            {incident.subtitle}
          </h2>

          {/* Detail card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 my-3 text-xs text-zinc-200 leading-relaxed font-sans text-left">
            {incident.committedBy && incident.victim && (
              <div className="flex items-center justify-between font-mono text-[11px] pb-2 mb-2 border-b border-zinc-800 text-zinc-400">
                <span>Infrator: <strong className="text-white">{incident.committedBy}</strong></span>
                <span>Vítima: <strong className="text-cyan-300">{incident.victim}</strong></span>
              </div>
            )}
            <p className="italic text-zinc-300">&ldquo;{incident.description}&rdquo;</p>
          </div>

          {/* Bottom dismiss note */}
          <button
            onClick={onClose}
            type="button"
            className="w-full py-2 rounded-lg font-mono font-bold text-xs uppercase bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            Continuar Partida
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
