import React from "react";
import { PitchState } from "../types";
import { Users, Flame, ShieldAlert, ArrowUp, ArrowDown, Sparkles } from "lucide-react";

interface Props {
  pitchState: PitchState;
  playerName: string;
  opponentTeam: string;
  playerTeam: string;
  onOpenLineup?: () => void;
}

export const TacticalPitch: React.FC<Props> = ({
  pitchState,
  playerName,
  opponentTeam,
  playerTeam,
  onOpenLineup,
}) => {
  const isPlayerWithBall =
    pitchState.ballPossessor.toLowerCase().includes(playerName.toLowerCase()) ||
    pitchState.ballPossessor.toLowerCase().includes("você") ||
    pitchState.ballPossessor.toLowerCase().includes("voce");

  const isPlayerTeamAttacking =
    pitchState.attackingTeam === "playerTeam" ||
    (pitchState.attackingTeam &&
      pitchState.attackingTeam.toLowerCase().includes(playerTeam.toLowerCase())) ||
    isPlayerWithBall ||
    pitchState.zone === "attack" ||
    pitchState.zone === "box";

  // Tactical coordinates
  let playerX = 50;
  let playerY = 65;
  let ballX = 50;
  let ballY = 50;

  if (pitchState.zone === "defense") {
    playerX = 48;
    playerY = 72;
    ballX = isPlayerWithBall ? 48 : 42;
    ballY = isPlayerWithBall ? 72 : 78;
  } else if (pitchState.zone === "midfield") {
    playerX = 50;
    playerY = 48;
    ballX = isPlayerWithBall ? 50 : 53;
    ballY = isPlayerWithBall ? 48 : 45;
  } else if (pitchState.zone === "attack") {
    playerX = 48;
    playerY = 26;
    ballX = isPlayerWithBall ? 48 : 55;
    ballY = isPlayerWithBall ? 26 : 24;
  } else if (pitchState.zone === "box") {
    playerX = 50;
    playerY = 16;
    ballX = isPlayerWithBall ? 50 : 48;
    ballY = isPlayerWithBall ? 16 : 14;
  }

  // If opponent is attacking with the ball in our defense:
  if (!isPlayerTeamAttacking && !isPlayerWithBall) {
    ballX = 48;
    ballY = 68; // in player defense/box
    playerX = 52;
    playerY = 58; // tracking back
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden p-3 shadow-inner">
      {/* Top Header: Possession & Attack Status */}
      <div className="flex flex-col gap-2 mb-2 px-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span className="text-zinc-200 font-bold tracking-wider">RADAR TÁTICO AO VIVO</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {pitchState.zone === "box"
                ? "Grande Área"
                : pitchState.zone === "attack"
                ? "Zona de Ataque"
                : pitchState.zone === "midfield"
                ? "Meio de Campo"
                : "Linha Defensiva"}
            </span>
            {onOpenLineup && (
              <button
                onClick={onOpenLineup}
                type="button"
                className="text-[11px] font-bold text-zinc-300 hover:text-cyan-300 bg-zinc-900 border border-zinc-700 hover:border-cyan-500/50 px-2.5 py-1 rounded flex items-center gap-1.5 transition shadow-sm"
                title="Abrir prancheta e ver escalação das duas equipes"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Escalação</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlighted Banner: QUEM ATACA E QUEM ESTÁ COM A BOLA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Who is attacking */}
          <div
            className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${
              isPlayerTeamAttacking
                ? "bg-cyan-950/50 border-cyan-500/50 text-cyan-300"
                : "bg-rose-950/50 border-rose-500/50 text-rose-300"
            }`}
          >
            {isPlayerTeamAttacking ? (
              <ArrowUp className="w-4 h-4 text-cyan-400 animate-bounce" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            )}
            <div className="truncate">
              <div className="text-[9px] font-mono uppercase tracking-wider opacity-80">
                Time no Ataque:
              </div>
              <div className="font-bold font-['Chakra_Petch'] truncate">
                {isPlayerTeamAttacking ? `${playerTeam} (Ofensiva)` : `${opponentTeam} (Ataque)`}
              </div>
            </div>
          </div>

          {/* Who has the ball */}
          <div
            className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${
              isPlayerWithBall
                ? "bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20"
                : "bg-zinc-900/90 border-zinc-700 text-zinc-200"
            }`}
          >
            <div className="text-base animate-bounce">⚽</div>
            <div className="truncate">
              <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                Com a Bola Agora:
              </div>
              <div className="font-bold truncate flex items-center gap-1 font-['Chakra_Petch']">
                {isPlayerWithBall ? (
                  <>
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> VOCÊ!
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono">({playerName})</span>
                  </>
                ) : (
                  <span className="text-white">{pitchState.ballPossessor}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Player-Locked Focus Badge */}
        <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-zinc-400">Foco do Jogador:</span>
            <span className="text-white font-bold">{playerName}</span>
          </div>
          <div>
            {isPlayerWithBall ? (
              <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
                ⚽ COM A BOLA
              </span>
            ) : isPlayerTeamAttacking ? (
              <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                🏃 DESMARQUE / SEM BOLA
              </span>
            ) : (
              <span className="text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                🛡️ PRESSÃO / MARCAÇÃO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2D Pitch Graphic */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-gradient-to-b from-blue-950/80 via-zinc-950 to-blue-950/80 rounded-xl border-2 border-cyan-500/40 overflow-hidden select-none shadow-2xl">
        {/* Holographic turf pattern / scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(6,182,212,0.08)_50%,transparent_51%)] bg-[length:100%_8px] pointer-events-none" />

        {/* Pitch Lines */}
        <div className="absolute inset-2 border border-cyan-500/30 pointer-events-none rounded" />

        {/* Halfway Line & Center Circle */}
        <div className="absolute top-1/2 left-2 right-2 h-px bg-cyan-500/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-cyan-500/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />

        {/* Attacking flow arrows holographic effect on turf */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
          {isPlayerTeamAttacking ? (
            <div className="flex flex-col items-center gap-3 animate-pulse text-cyan-400">
              <ArrowUp className="w-8 h-8" />
              <ArrowUp className="w-6 h-6" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-pulse text-rose-500">
              <ArrowDown className="w-8 h-8" />
              <ArrowDown className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Top Penalty Box (Opponent Goal) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-16 border-b border-l border-r border-cyan-500/40 bg-rose-950/10">
          <div className="text-[9px] font-mono text-rose-400/90 text-center pt-0.5 font-bold">
            GOL: {opponentTeam}
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-7 border-b border-l border-r border-cyan-500/30" />
        </div>

        {/* Bottom Penalty Box (Player Team Goal) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-16 border-t border-l border-r border-cyan-500/40 bg-cyan-950/10">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-7 border-t border-l border-r border-cyan-500/30" />
          <div className="text-[9px] font-mono text-cyan-400/90 text-center absolute bottom-0.5 w-full font-bold">
            GOL: {playerTeam}
          </div>
        </div>

        {/* Opponent Tokens */}
        <div className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700">
          <div className="w-5 h-5 rounded-full bg-rose-600 border border-rose-300 flex items-center justify-center text-[9px] font-bold text-white shadow-md shadow-rose-500/50">
            ADV
          </div>
        </div>
        <div className="absolute top-[24%] left-[68%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700">
          <div className="w-5 h-5 rounded-full bg-rose-600 border border-rose-300 flex items-center justify-center text-[9px] font-bold text-white shadow-md shadow-rose-500/50">
            ADV
          </div>
        </div>
        <div className="absolute top-[42%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700">
          <div className="w-5 h-5 rounded-full bg-rose-600 border border-rose-300 flex items-center justify-center text-[9px] font-bold text-white shadow-md shadow-rose-500/50">
            ADV
          </div>
        </div>

        {/* Teammate Tokens */}
        <div className="absolute top-[52%] left-[36%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700">
          <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center text-[9px] font-bold text-white shadow-md shadow-blue-500/50">
            TM
          </div>
        </div>
        <div className="absolute top-[36%] left-[24%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700">
          <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center text-[9px] font-bold text-white shadow-md shadow-blue-500/50">
            TM
          </div>
        </div>

        {/* Player Token */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all duration-700 ease-out"
          style={{ top: `${playerY}%`, left: `${playerX}%` }}
        >
          <div className="relative">
            {isPlayerWithBall && (
              <span className="absolute -inset-2 rounded-full bg-amber-400/60 animate-ping" />
            )}
            <span className="absolute -inset-1 rounded-full bg-cyan-400 animate-pulse opacity-80" />
            <div
              className={`relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg transition-transform ${
                isPlayerWithBall
                  ? "bg-gradient-to-tr from-cyan-400 to-amber-300 text-zinc-950 border-2 border-white scale-110 shadow-cyan-400"
                  : "bg-cyan-400 text-zinc-950 border-2 border-white shadow-cyan-400/80"
              }`}
            >
              VOCÊ
            </div>
          </div>
          <span className="mt-1 text-[9px] font-bold text-cyan-300 font-mono tracking-tighter bg-zinc-950/90 px-1.5 py-0.5 rounded border border-cyan-500/40 shadow">
            {playerName.split(" ")[0]}
          </span>
        </div>

        {/* Ball Token with Trail & Glowing Ring */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 ease-out"
          style={{ top: `${ballY}%`, left: `${ballX}%` }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-2 rounded-full bg-white/40 animate-ping" />
            <div className="relative w-5 h-5 rounded-full bg-white border-2 border-zinc-950 shadow-xl shadow-white flex items-center justify-center text-[10px] animate-spin select-none">
              ⚽
            </div>
            {/* Pulsing label over ball */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-950/90 text-white text-[8px] font-mono px-1 rounded border border-zinc-700 pointer-events-none">
              BOLA
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Tactical Caption */}
      <div className="mt-2 text-xs text-zinc-300 bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between">
        <div className="truncate flex-1">
          <span className="text-zinc-500 font-mono mr-1.5">Lance Atual:</span>
          <span className="text-zinc-200 italic text-[11px]">{pitchState.description}</span>
        </div>
        {isPlayerWithBall && (
          <span className="shrink-0 ml-2 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold animate-pulse flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Sua Vez de Brilhar!
          </span>
        )}
      </div>
    </div>
  );
};
