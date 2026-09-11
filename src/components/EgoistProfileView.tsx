import React, { useState } from "react";
import { CharacterProfile, PlayerStats } from "../types";
import { Award, Zap, Flame, Target, TrendingUp, ShieldCheck, Plus, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  character: CharacterProfile;
  onUpdateStats: (updatedStats: PlayerStats, remainingPoints: number) => void;
  onRequestEgoEvaluation: () => Promise<void>;
  isEvaluating: boolean;
  egoEvaluationMessage: string | null;
  onRequestReset?: () => void;
  onOpenTransfers?: () => void;
}

const STAT_CONFIG: { key: keyof PlayerStats; label: string; desc: string }[] = [
  { key: "speed", label: "Velocidade", desc: "Aceleração, arranque e capacidade de superar a linha defensiva." },
  { key: "strength", label: "Força Física", desc: "Proteção de bola de costas para a zaga e combate corpo a corpo." },
  { key: "finishing", label: "Finalização", desc: "Precisão, curva, potência e letalidade no chute a gol." },
  { key: "dribble", label: "Drible", desc: "Agilidade, quebra de ritmo, fintas no 1v1 e controle em espaço curto." },
  { key: "ballControl", label: "Controle de Bola", desc: "Trap aéreo, domínio instantâneo e amortecimento de lançamentos." },
  { key: "vision", label: "Visão de Jogo", desc: "Consciência periférica do campo e antecipação de linhas de passe." },
  { key: "iq", label: "Inteligência Tática", desc: "Leitura de jogo, exploração de pontos cegos e timing de infiltração." },
  { key: "stamina", label: "Resistência", desc: "Fôlego para manter o ritmo explosivo até os acréscimos dos 90 minutos." },
];

export const EgoistProfileView: React.FC<Props> = ({
  character,
  onUpdateStats,
  onRequestEgoEvaluation,
  isEvaluating,
  egoEvaluationMessage,
  onRequestReset,
  onOpenTransfers,
}) => {
  const [localStats, setLocalStats] = useState<PlayerStats>({ ...character.stats });
  const [availablePoints, setAvailablePoints] = useState<number>(character.statPointsAvailable);

  const overallAverage = Math.round(
    (Object.values(localStats) as number[]).reduce((a, b) => a + b, 0) / 8
  );

  const handleIncrementStat = (key: keyof PlayerStats) => {
    if (availablePoints <= 0) return;
    sounds.playClick();
    const updated = {
      ...localStats,
      [key]: Math.min(99, localStats[key] + 1),
    };
    const newRemaining = availablePoints - 1;
    setLocalStats(updated);
    setAvailablePoints(newRemaining);
    onUpdateStats(updated, newRemaining);
  };

  const WEAPON_EVOLUTIONS = [
    { name: "Metavisão (Spatial Metaview)", req: "Visão 80+ e QI 80+", desc: "Coleta constante de informações com a cabeça erguida antes de a bola chegar." },
    { name: "Chute Direto (Direct Shot)", req: "Finalização 78+", desc: "Finalizar sem dominar a bola para anular a reação do goleiro." },
    { name: "Predator Eye (Olho do Predador)", req: "Finalização 82+ e Visão 75+", desc: "Focar exclusivamente no ponto cego do goleiro no momento do chute." },
    { name: "Estado de Fluxo (Flow State)", req: "Gols Decisivos", desc: "Imersão total no desafio onde tempo e espaço parecem desacelerar." },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 text-zinc-100 font-sans space-y-6">
      {/* Top Banner: Identity & Overall Rating */}
      <div className="bg-gradient-to-r from-zinc-900 via-blue-950/40 to-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
              Ficha do Atacante • Blue Lock Project
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-['Chakra_Petch'] text-white">
              {character.name}
            </h1>
            <div className="text-zinc-400 text-xs sm:text-sm mt-1 flex flex-wrap items-center gap-2">
              <span className="text-cyan-300 font-semibold">{character.position}</span>
              <span>•</span>
              <span>{character.nationality}</span>
              <span>•</span>
              <span>{character.height} cm</span>
              <span>•</span>
              <span>Pé {character.dominantFoot}</span>
              {character.nickname && (
                <>
                  <span>•</span>
                  <span className="italic text-amber-300">&ldquo;{character.nickname}&rdquo;</span>
                </>
              )}
            </div>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-300 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vínculo: {character.relationshipWithCanon}</span>
            </div>
          </div>

          {/* Big Overall Number */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0 bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-xl flex-wrap">
            <div className="text-center">
              <div className="text-xs font-mono text-zinc-500 uppercase">Geral</div>
              <div className="text-3xl sm:text-4xl font-black font-['Chakra_Petch'] text-cyan-400">
                {overallAverage}
              </div>
            </div>

            <div className="w-px h-12 bg-zinc-800 hidden sm:block" />

            <div className="text-center">
              <div className="text-xs font-mono text-zinc-500 uppercase">Rank</div>
              <div className="text-3xl sm:text-4xl font-black font-['Chakra_Petch'] text-amber-400">
                #{character.currentRanking}
              </div>
            </div>
            
            <div className="w-px h-12 bg-zinc-800 hidden sm:block" />

            <div className="text-center">
              <div className="text-xs font-mono text-zinc-500 uppercase">Camisa</div>
              <div className="text-3xl sm:text-4xl font-black font-['Chakra_Petch'] text-white">
                {character.jerseyNumber || (character.currentRanking > 11 ? character.currentRanking : [10, 9, 11, 7, 8, 4, 5, 6, 2, 3, 1][character.currentRanking - 1] || character.currentRanking)}
              </div>
            </div>
          </div>
        </div>

        {/* Neo Egoist League Club & Bid Banner */}
        {onOpenTransfers && (
          <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                ¥
              </div>
              <div>
                <div className="text-zinc-400 font-mono text-[10px] uppercase">
                  Contrato & Leilão • Liga Neo Egoísta:
                </div>
                <div className="font-bold text-white font-['Chakra_Petch'] text-sm">
                  {character.currentClub ? (
                    <span className="text-emerald-300">Contratado pelo {character.currentClub}</span>
                  ) : (
                    <span className="text-amber-300">Sem Clube Definido (Propostas Abertas)</span>
                  )}
                  {character.currentBidYen ? (
                    <span className="text-amber-400 ml-2 font-mono">
                      (¥{character.currentBidYen.toLocaleString()} / ano)
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenTransfers();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold font-['Chakra_Petch'] uppercase text-xs transition shadow flex items-center justify-center gap-1.5 self-start sm:self-center"
            >
              <span>Ver Mercado & Transferências</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Level, Exp & Points Allocation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono text-zinc-400">PROGRESSO DE EVOLUÇÃO</div>
            <div className="text-lg font-bold font-['Chakra_Petch'] text-white">
              Nível {character.level} Egoísta
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-mono">
              <span className="text-zinc-400">Treinos 1v1 Restantes: </span>
              <span className="text-emerald-400 font-bold text-base">{character.trainingsAvailable || 0}</span>
              <div className="text-[10px] text-zinc-500">+3 treinos ganhos por partida jogada</div>
            </div>
          </div>
        </div>

        {/* EXP Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>EXP para Nível {character.level + 1}</span>
            <span>
              {character.exp} / {character.expToNextLevel} EXP
            </span>
          </div>
          <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (character.exp / character.expToNextLevel) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Attributes Grid with Upgrades */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-['Chakra_Petch'] text-base font-bold text-white uppercase">
            <Target className="w-5 h-5 text-emerald-400" />
            Matriz de Atributos & Evolução Física
          </div>
          {availablePoints > 0 && (
            <span className="text-xs text-cyan-400 font-mono font-bold animate-pulse">
              Clique em [+] para investir pontos!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {STAT_CONFIG.map(({ key, label, desc }) => {
            const val = localStats[key];
            return (
              <div
                key={key}
                className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/90 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white font-mono">{label}</span>
                    <span className="text-base font-black font-['Chakra_Petch'] text-emerald-400">
                      {val}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800 mb-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-cyan-400 transition-all duration-300"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">{desc}</p>
                </div>

                {availablePoints > 0 && (
                  <button
                    onClick={() => handleIncrementStat(key)}
                    className="w-8 h-8 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 flex items-center justify-center font-bold text-base transition shadow shrink-0"
                    title={`Aumentar ${label}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Weapon & Evolutions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800 font-['Chakra_Petch'] text-base font-bold text-white uppercase">
          <Zap className="w-5 h-5 text-amber-400" />
          Armas Principais & Árvore de Despertar
        </div>

        <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-500/40">
          <div className="text-xs font-mono text-amber-400 uppercase font-bold">Arma Original do Protagonista:</div>
          <div className="text-lg font-bold font-['Chakra_Petch'] text-white mt-1">
            {character.mainWeapon}
          </div>
          <div className="text-xs text-zinc-300 mt-1">
            Estilo de Jogo: <strong className="text-cyan-300">{character.playstyle}</strong>
          </div>
        </div>

        {/* Evolutions Catalog */}
        <div className="mt-5 space-y-3">
          <div className="text-xs font-mono text-zinc-400 uppercase">Evoluções Possíveis no Blue Lock:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WEAPON_EVOLUTIONS.map((weap) => (
              <div
                key={weap.name}
                className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-cyan-300 font-['Chakra_Petch'] text-sm">
                    {weap.name}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Requisito: {weap.req}</div>
                  <p className="text-zinc-400 mt-1 text-[11px] leading-relaxed">{weap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation by Jinpachi Ego */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase">SISTEMA CENTRAL DE SELEÇÃO</div>
            <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white">
              Avaliação de Desempenho por Jinpachi Ego
            </h3>
          </div>

          <button
            onClick={onRequestEgoEvaluation}
            disabled={isEvaluating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black font-['Chakra_Petch'] text-xs uppercase tracking-wider transition disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            {isEvaluating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Ego Está Calculando Seu Valor...
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                Recalcular Meu Ranking & Proposta
              </>
            )}
          </button>
        </div>

        {egoEvaluationMessage && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 text-sm">
            <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
              JINPACHI EGO (TRANSMISSÃO DIRETA):
            </div>
            <p className="text-zinc-200 italic leading-relaxed whitespace-pre-line">
              &ldquo;{egoEvaluationMessage}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Reset & Rebirth Zone */}
      {onRequestReset && (
        <div className="bg-gradient-to-r from-zinc-900 via-rose-950/20 to-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-rose-400 uppercase flex items-center gap-1.5 font-bold">
              <RotateCcw className="w-3.5 h-3.5" /> REINÍCIO OU REDEFINIÇÃO DE TALENTOS
            </div>
            <h3 className="text-base font-bold font-['Chakra_Petch'] text-white mt-0.5">
              Deseja Reiniciar Seu Egoísta ou Redefinir Atributos?
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Crie um novo protagonista com outra arma, posição e personalidade, ou redistribua todos os pontos acumulados mantendo seu progresso.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onRequestReset();
            }}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-900/60 border border-zinc-700 hover:border-rose-500/60 text-rose-300 font-black font-['Chakra_Petch'] text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            Reiniciar / Reajustar Egoísta
          </button>
        </div>
      )}
    </div>
  );
};
