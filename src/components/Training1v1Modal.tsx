import React, { useState } from "react";
import { CharacterProfile, PlayerStats } from "../types";
import { CANONICAL_CHARACTERS } from "../data/canonicalCharacters";
import { Swords, X, Zap, Award, Send, Flame, Sparkles } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  character: CharacterProfile;
  initialOpponent: string;
  onClose: () => void;
  onTrainingComplete: (expGained: number, statBonus?: { stat: keyof PlayerStats; amount: number }) => void;
}

const TRAINING_TYPES = [
  { id: "duel_1v1", name: "Duelo 1v1 com Posse de Bola", desc: "Tente superar o rival no drible ou roubar a bola no combate físico." },
  { id: "finishing_drill", name: "Disputa de Finalização na Área", desc: "Quem acerta o chute mais rápido e indefensável." },
  { id: "trap_drill", name: "Treino de Domínio & Primeiro Toque", desc: "Receba lançamentos difíceis sob pressão do rival." },
  { id: "vision_drill", name: "Leitura Espacial & Metavisão", desc: "Preveja o movimento e bloqueie as opções de passe." },
];

export const Training1v1Modal: React.FC<Props> = ({
  character,
  initialOpponent,
  onClose,
  onTrainingComplete,
}) => {
  const [opponent, setOpponent] = useState(initialOpponent || "Itoshi Rin");
  const [trainingType, setTrainingType] = useState(TRAINING_TYPES[0].name);
  const [playerAction, setPlayerAction] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const opponentInfo = CANONICAL_CHARACTERS[opponent] || CANONICAL_CHARACTERS["Itoshi Rin"];

  const handleExecuteTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerAction.trim() || isSimulating) return;

    setIsSimulating(true);
    sounds.playClick();

    try {
      const response = await fetch("/api/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character,
          opponentName: opponent,
          trainingType,
          playerAction: playerAction.trim(),
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        sounds.playGoalCelebration();
      } else {
        sounds.playEgoImpact();
      }

      onTrainingComplete(data.expGained || 20, data.attributeBonus);
    } catch (err) {
      console.error("Training failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl my-auto text-zinc-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-['Chakra_Petch'] text-lg">
            <Swords className="w-5 h-5" />
            DUELO DE TREINAMENTO 1v1 • BLUE LOCK
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rival and Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Escolha o Rival / Parceiro:</label>
            <select
              value={opponent}
              onChange={(e) => {
                setOpponent(e.target.value);
                setResult(null);
                sounds.playClick();
              }}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
            >
              {Object.keys(CANONICAL_CHARACTERS).map((cName) => (
                <option key={cName} value={cName}>
                  {cName} ({CANONICAL_CHARACTERS[cName].role})
                </option>
              ))}
            </select>
            <div className="mt-1.5 text-xs text-zinc-400 italic">
              Arma do Rival: {opponentInfo?.weapon}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Tipo de Treinamento:</label>
            <select
              value={trainingType}
              onChange={(e) => {
                setTrainingType(e.target.value);
                setResult(null);
                sounds.playClick();
              }}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400"
            >
              {TRAINING_TYPES.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="mt-1.5 text-xs text-zinc-400">
              {TRAINING_TYPES.find((t) => t.name === trainingType)?.desc}
            </div>
          </div>
        </div>

        {/* Rival Intro Quote */}
        <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
          <div>
            <span className="font-bold text-cyan-300">{opponent}:</span>{" "}
            <span className="italic text-zinc-300">&ldquo;{opponentInfo?.quote}&rdquo;</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleExecuteTraining} className="mt-5 space-y-3">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              Descreva sua ação e técnica no confronto contra {opponent}:
            </label>
            <textarea
              rows={3}
              value={playerAction}
              onChange={(e) => setPlayerAction(e.target.value)}
              placeholder={`Ex: Utilizo minha arma (${character.mainWeapon}) para fintar para a esquerda em velocidade, protegendo a bola com o ombro antes de chutar no ponto cego.`}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 self-center">Ações Rápidas:</span>
            {[
              `Usar arma: ${character.mainWeapon}`,
              "Acelerar no limite e cortar para dentro",
              "Proteger o corpo e girar no pivô",
              "Antecipar o movimento lendo seu ponto cego",
            ].map((p, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setPlayerAction(p)}
                className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSimulating}
            className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black font-['Chakra_Petch'] text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Disputando o Lance com {opponent}...
              </>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                Executar Duelo 1v1
              </>
            )}
          </button>
        </form>

        {/* Training Result Box */}
        {result && (
          <div className="mt-5 p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 text-sm animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono">
              <span className={`font-bold ${result.success ? "text-emerald-400" : "text-amber-400"}`}>
                {result.success ? "✓ LANCE BEM-SUCEDIDO" : "✗ SUPERADO PELO RIVAL"}
              </span>
              <span className="text-cyan-400 font-bold">+{result.expGained} EXP</span>
            </div>

            <p className="text-zinc-200 mt-2 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {result.narrative}
            </p>

            {result.opponentQuote && (
              <div className="mt-3 p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs italic text-cyan-300">
                <strong>{opponent}:</strong> &ldquo;{result.opponentQuote}&rdquo;
              </div>
            )}

            {result.attributeBonus && (
              <div className="mt-2 text-xs font-mono text-emerald-400 font-bold">
                ★ Bônus de Atributo ganho: +{result.attributeBonus.amount} em {result.attributeBonus.stat}!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
