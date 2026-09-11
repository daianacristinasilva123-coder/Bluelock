import React, { useState } from "react";
import { CharacterProfile } from "../types";
import {
  RotateCcw,
  Sparkles,
  Download,
  AlertTriangle,
  X,
  Flame,
  ArrowRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "../utils/audio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterProfile;
  onFullReset: () => void;
  onRespecStats: () => void;
  onExportBackup: () => void;
}

export const ResetEgoistModal: React.FC<Props> = ({
  isOpen,
  onClose,
  character,
  onFullReset,
  onRespecStats,
  onExportBackup,
}) => {
  const [selectedMode, setSelectedMode] = useState<"choose" | "full_confirm" | "respec_confirm">("choose");
  const [hasDownloadedBackup, setHasDownloadedBackup] = useState(false);

  if (!isOpen) return null;

  const handleDownloadAndMark = () => {
    onExportBackup();
    setHasDownloadedBackup(true);
    sounds.playClick();
  };

  const handleConfirmFullReset = () => {
    sounds.playEgoImpact();
    onFullReset();
    onClose();
  };

  const handleConfirmRespec = () => {
    sounds.playClick();
    onRespecStats();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 font-sans select-none animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-zinc-100 relative overflow-hidden">
        {/* Glowing Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-400" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono uppercase tracking-wider font-bold">
              <RotateCcw className="w-3.5 h-3.5" />
              SISTEMA DE DESCARTE & REINÍCIO • BLUE LOCK
            </div>
            <h3 className="text-xl font-black font-['Chakra_Petch'] text-white uppercase mt-0.5">
              Reajustar Seu Egoísta
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ego Quote */}
        <div className="my-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 italic">
          <span className="text-cyan-400 font-bold font-mono not-italic mr-1">Jinpachi Ego:</span>
          &ldquo;Aquele que tem medo de destruir o próprio talento nunca alcançará a verdadeira evolução. Se seu ego atual fracassou, renasça das cinzas.&rdquo;
        </div>

        {/* MODE 1: CHOOSE OPTIONS */}
        {selectedMode === "choose" && (
          <div className="space-y-3">
            {/* Option A: Full Reset (Create New Egoist) */}
            <div
              onClick={() => setSelectedMode("full_confirm")}
              className="p-4 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 border border-rose-900/50 hover:border-rose-500/80 cursor-pointer transition group shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-400 font-black font-['Chakra_Petch'] text-base uppercase">
                    <Flame className="w-4 h-4 text-rose-500 group-hover:animate-pulse" />
                    Criar Novo Egoísta do Zero (Reinício Total)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Descarta a campanha atual de <strong className="text-white">{character.name}</strong> e abre a tela completa de criação para um novo atacante (novo nome, arma, altura, posição e prólogo).
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-rose-500/50 group-hover:text-rose-400 group-hover:translate-x-1 transition shrink-0 mt-1" />
              </div>
            </div>

            {/* Option B: Respec Stats (Keep character, reallocate all points) */}
            <div
              onClick={() => setSelectedMode("respec_confirm")}
              className="p-4 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 border border-cyan-900/50 hover:border-cyan-500/80 cursor-pointer transition group shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-black font-['Chakra_Petch'] text-base uppercase">
                    <Zap className="w-4 h-4 text-cyan-400 group-hover:animate-bounce" />
                    Redefinir Atributos & Especialidade (Respec)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Mantém sua história, vínculos e partidas, mas devolve todos os pontos de atributos para você redistribuir livremente (Velocidade, Finalização, Drible, etc.).
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-cyan-500/50 group-hover:text-cyan-400 group-hover:translate-x-1 transition shrink-0 mt-1" />
              </div>
            </div>

            {/* Quick Backup Notice */}
            <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Quer salvar uma cópia antes?</span>
              <button
                type="button"
                onClick={handleDownloadAndMark}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 underline underline-offset-2 transition"
              >
                <Download className="w-3.5 h-3.5" />
                {hasDownloadedBackup ? "Backup Baixado ✓" : "Baixar Backup (.json)"}
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: CONFIRM FULL RESET */}
        {selectedMode === "full_confirm" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold font-['Chakra_Petch'] text-sm text-rose-300 uppercase">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                Atenção: Ação Definitiva de Reinício
              </div>
              <p>
                Você está prestes a descartar <strong className="text-white font-bold">{character.name}</strong> (Rank #{character.currentRanking}). Todas as mensagens da história, progresso de fases e vínculos serão reiniciados para dar lugar ao seu novo atacante.
              </p>
            </div>

            {/* Backup suggestion */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="text-zinc-400">
                {hasDownloadedBackup ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Backup de segurança já salvo no seu aparelho!
                  </span>
                ) : (
                  <span>Recomendamos baixar um backup antes de prosseguir.</span>
                )}
              </div>
              {!hasDownloadedBackup && (
                <button
                  type="button"
                  onClick={handleDownloadAndMark}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-mono font-bold flex items-center gap-1 text-[11px] transition"
                >
                  <Download className="w-3 h-3" /> Baixar
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedMode("choose")}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmFullReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black font-['Chakra_Petch'] text-xs uppercase tracking-wider transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <Flame className="w-4 h-4" />
                Confirmar & Criar Novo Atacante
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: CONFIRM RESPEC */}
        {selectedMode === "respec_confirm" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/80 text-cyan-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold font-['Chakra_Petch'] text-sm text-cyan-300 uppercase">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                Reespecialização de Atributos (Respec)
              </div>
              <p>
                Os atributos de <strong className="text-white font-bold">{character.name}</strong> serão redefinidos para os valores base (50 pontos cada) e todos os pontos excedentes mais os pontos acumulados serão devolvidos como <strong>Pontos de Evolução</strong> para você redistribuir.
              </p>
              <p className="text-zinc-400 text-[11px]">
                * Seu histórico de diálogos, partidas e ranking serão 100% preservados.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedMode("choose")}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmRespec}
                className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black font-['Chakra_Petch'] text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-400/30 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                Redistribuir Meus Pontos Agora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
