import React, { useState } from "react";
import { CharacterProfile, ActiveMatch, LineupPlayer, TeamLineup } from "../types";
import { getMatchLineups } from "../data/lineups";
import { Users, X, Shield, Swords, Zap, Award, Sparkles, ChevronRight, User } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  match: ActiveMatch;
  character: CharacterProfile;
  onClose: () => void;
}

export const LineupModal: React.FC<Props> = ({ match, character, onClose }) => {
  const { playerLineup, opponentLineup } = getMatchLineups(
    match.playerTeam,
    match.opponentTeam,
    character
  );

  const [activeTab, setActiveTab] = useState<"player" | "opponent" | "both">("player");
  const [selectedPlayer, setSelectedPlayer] = useState<LineupPlayer | null>(
    playerLineup.startingXI.find((p) => p.isUserPlayer) || playerLineup.startingXI[0]
  );

  const currentTeam = activeTab === "opponent" ? opponentLineup : playerLineup;

  const handleSelectPlayer = (player: LineupPlayer) => {
    sounds.playClick();
    setSelectedPlayer(player);
  };

  const calculateAverageOvr = (lineup: TeamLineup) => {
    if (!lineup.startingXI.length) return 80;
    const sum = lineup.startingXI.reduce((acc, p) => acc + p.ovr, 0);
    return Math.round(sum / lineup.startingXI.length);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-zinc-950 border border-zinc-700/80 rounded-2xl max-w-5xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>Prancheta Tática Oficial</span>
                <span className="text-zinc-600">•</span>
                <span className="text-amber-400 font-bold">⏱️ {match.currentMinute}&apos; de Jogo</span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-['Chakra_Petch'] text-white tracking-wide uppercase">
                ESCALAÇÃO DAS EQUIPES • BLUE LOCK
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Score pill */}
            <div className="hidden sm:flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg text-xs font-mono">
              <span className="text-cyan-400 font-bold">{match.playerTeam}</span>
              <span className="text-white font-bold">{match.score.playerTeam} : {match.score.opponentTeam}</span>
              <span className="text-rose-400 font-bold">{match.opponentTeam}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Fechar escalação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Team Selector Tabs */}
        <div className="bg-zinc-900/60 border-b border-zinc-800 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActiveTab("player");
                setSelectedPlayer(playerLineup.startingXI.find((p) => p.isUserPlayer) || playerLineup.startingXI[0]);
                sounds.playClick();
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-['Chakra_Petch'] flex items-center gap-1.5 transition ${
                activeTab === "player"
                  ? "bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{playerLineup.teamName} (SEU TIME)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("opponent");
                setSelectedPlayer(opponentLineup.startingXI[0]);
                sounds.playClick();
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-['Chakra_Petch'] flex items-center gap-1.5 transition ${
                activeTab === "opponent"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{opponentLineup.teamName} (ADVERSÁRIO)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("both");
                sounds.playClick();
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-['Chakra_Petch'] flex items-center gap-1.5 transition ${
                activeTab === "both"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comparar Ambos em Campo</span>
            </button>
          </div>

          {/* Quick Info */}
          {activeTab !== "both" && (
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <div>
                Formação: <span className="text-white font-bold">{currentTeam.formation}</span>
              </div>
              <div className="hidden md:inline text-zinc-600">•</div>
              <div className="hidden md:inline">
                Treinador: <span className="text-cyan-300 font-bold">{currentTeam.coach}</span>
              </div>
              <div className="text-zinc-600">•</div>
              <div>
                Média OVR:{" "}
                <span className="text-amber-400 font-bold">
                  {calculateAverageOvr(currentTeam)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Tactical Overview Banner */}
          {activeTab !== "both" && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Filosofia & Diretriz Tática
                </div>
                <div className="text-sm font-bold text-zinc-100 mt-0.5 font-['Chakra_Petch']">
                  {currentTeam.tacticalStyle}
                </div>
              </div>
              <div className="text-xs text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                Supervisor: <span className="text-zinc-200 font-bold">{currentTeam.coach}</span>
              </div>
            </div>
          )}

          {/* Main Grid: Pitch on Left/Top, Roster & Selected Player on Right/Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* TACTICAL PITCH (7 cols) */}
            <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DISPOSIÇÃO TÁTICA NO GRAMADO</span>
                </div>
                <span className="text-[11px] text-zinc-500">Clique num jogador para ver os dados</span>
              </div>

              {/* 2D Realistic Blue Lock Pitch */}
              <div className="relative w-full aspect-[3/4] max-w-[420px] bg-gradient-to-b from-blue-950/80 via-zinc-900 to-blue-950/80 border-2 border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl select-none">
                {/* Grass Stripes Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,#000,#000_20px,#fff_20px,#fff_40px)] pointer-events-none" />

                {/* Pitch Outer Line */}
                <div className="absolute inset-2 border border-cyan-500/30 rounded pointer-events-none" />

                {/* Halfway Line */}
                <div className="absolute top-1/2 left-2 right-2 h-px bg-cyan-500/40" />

                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-cyan-500/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400" />

                {/* Top Penalty Box (Adversário) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-l border-r border-cyan-500/30">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-7 border-b border-l border-r border-cyan-500/30" />
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-16 h-8 rounded-b-full border-b border-cyan-500/20" />
                  <div className="text-[9px] font-mono text-rose-400/70 text-center pt-1">
                    GOL ADVERSÁRIO
                  </div>
                </div>

                {/* Bottom Penalty Box (Seu Time) */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-l border-r border-cyan-500/30">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-7 border-t border-l border-r border-cyan-500/30" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-8 rounded-t-full border-t border-cyan-500/20" />
                  <div className="text-[9px] font-mono text-cyan-400/70 text-center absolute bottom-1 w-full">
                    GOL SEU TIME
                  </div>
                </div>

                {/* SINGLE TEAM MODE: Render player team or opponent team */}
                {activeTab !== "both" &&
                  currentTeam.startingXI.map((player) => {
                    const isSelected = selectedPlayer?.id === player.id;
                    const isUser = player.isUserPlayer;

                    return (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => handleSelectPlayer(player)}
                        style={{
                          left: `${player.coords.x}%`,
                          top: `${player.coords.y}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none transition-transform ${
                          isSelected ? "scale-125 z-30" : "hover:scale-110 z-20"
                        }`}
                      >
                        {/* Glowing ring for user player */}
                        {isUser && (
                          <div className="absolute -inset-2 rounded-full border border-cyan-400/80 animate-ping opacity-75 pointer-events-none" />
                        )}

                        {/* Jersey / Circle Pin */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex flex-col items-center justify-center font-black font-['Chakra_Petch'] text-[11px] sm:text-xs shadow-lg transition-all ${
                            isUser
                              ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-zinc-950 ring-2 ring-cyan-300 ring-offset-2 ring-offset-zinc-950 font-black shadow-cyan-500/50"
                              : isSelected
                              ? "bg-amber-400 text-zinc-950 ring-2 ring-amber-300 ring-offset-1 ring-offset-zinc-950"
                              : activeTab === "player"
                              ? "bg-zinc-800 text-cyan-300 border border-cyan-500/60 hover:bg-cyan-950"
                              : "bg-zinc-800 text-rose-300 border border-rose-500/60 hover:bg-rose-950"
                          }`}
                        >
                          <span>{player.number}</span>
                        </div>

                        {/* Position Badge & Name below */}
                        <div className="mt-1 flex flex-col items-center pointer-events-none">
                          <span
                            className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                              isUser
                                ? "bg-cyan-400 text-zinc-950 font-black"
                                : "bg-zinc-950/90 text-zinc-300 border border-zinc-800"
                            }`}
                          >
                            {player.position}
                          </span>
                          <span className="text-[10px] font-semibold text-white truncate max-w-[70px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                            {isUser ? "VOCÊ" : player.name.split(" ")[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                {/* BOTH TEAMS MODE (Compare side-by-side on the field) */}
                {activeTab === "both" && (
                  <>
                    {/* Render Player Team (Bottom Half: y between 50% and 92%) */}
                    {playerLineup.startingXI.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => handleSelectPlayer(player)}
                        style={{
                          left: `${player.coords.x}%`,
                          top: `${player.coords.y}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                          selectedPlayer?.id === player.id ? "scale-125 z-30" : "hover:scale-110"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black font-['Chakra_Petch'] text-[10px] shadow ${
                            player.isUserPlayer
                              ? "bg-cyan-400 text-zinc-950 ring-2 ring-cyan-200"
                              : "bg-cyan-950 border border-cyan-400 text-cyan-300"
                          }`}
                        >
                          {player.number}
                        </div>
                        <div className="text-[9px] text-cyan-200 font-bold text-center truncate max-w-[55px]">
                          {player.isUserPlayer ? "VOCÊ" : player.name.split(" ")[0]}
                        </div>
                      </button>
                    ))}

                    {/* Render Opponent Team (Top Half: y between 10% and 48%) */}
                    {opponentLineup.startingXI.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => handleSelectPlayer(player)}
                        style={{
                          left: `${player.coords.x}%`,
                          top: `${player.coords.y}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                          selectedPlayer?.id === player.id ? "scale-125 z-30" : "hover:scale-110"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center font-black font-['Chakra_Petch'] text-[10px] shadow bg-rose-950 border border-rose-400 text-rose-300">
                          {player.number}
                        </div>
                        <div className="text-[9px] text-rose-200 font-bold text-center truncate max-w-[55px]">
                          {player.name.split(" ")[0]}
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* ROSTER & SELECTED PLAYER DETAILS (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col">
              {/* Selected Player Card Details */}
              {selectedPlayer && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
                  {selectedPlayer.isUserPlayer && (
                    <div className="absolute top-0 right-0 bg-cyan-500 text-zinc-950 font-black text-[10px] px-3 py-1 font-['Chakra_Petch'] rounded-bl-lg uppercase tracking-wider">
                      SEU PERSONAGEM
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black font-['Chakra_Petch'] text-xl shrink-0 ${
                        selectedPlayer.isUserPlayer
                          ? "bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/30"
                          : "bg-zinc-800 text-white border border-zinc-700"
                      }`}
                    >
                      #{selectedPlayer.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-950 text-cyan-400 border border-zinc-800">
                          {selectedPlayer.position}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          OVR:{" "}
                          <strong className="text-amber-400 text-sm">
                            {selectedPlayer.ovr}
                          </strong>
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white font-['Chakra_Petch'] truncate mt-0.5">
                        {selectedPlayer.name}
                      </h3>
                      {selectedPlayer.roleNote && (
                        <p className="text-xs text-zinc-400 italic">
                          {selectedPlayer.roleNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Weapon Info */}
                  <div className="mt-3.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold mb-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      ARMA PRINCIPAL / HABILIDADE:
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-200 font-medium">
                      {selectedPlayer.weapon}
                    </div>
                  </div>
                </div>
              )}

              {/* Starting XI List */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex-1 flex flex-col">
                <div className="text-xs font-mono text-zinc-400 font-bold uppercase mb-2 flex items-center justify-between">
                  <span>11 Titulares ({currentTeam.teamName})</span>
                  <span className="text-zinc-500 text-[10px]">{currentTeam.startingXI.length} Jogadores</span>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-56 pr-1 font-sans">
                  {currentTeam.startingXI.map((player) => {
                    const isSelected = selectedPlayer?.id === player.id;
                    const isUser = player.isUserPlayer;

                    return (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => handleSelectPlayer(player)}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between gap-2 text-xs transition ${
                          isSelected
                            ? "bg-zinc-800 border border-amber-400/60 shadow-sm"
                            : isUser
                            ? "bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-950/70"
                            : "bg-zinc-950/70 border border-zinc-800/80 hover:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                              isUser
                                ? "bg-cyan-500 text-zinc-950 font-black"
                                : "bg-zinc-800 text-zinc-300"
                            }`}
                          >
                            {player.number}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400 uppercase w-7 shrink-0">
                            {player.position}
                          </span>
                          <span className="font-medium text-zinc-200 truncate">
                            {player.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-amber-400 text-[11px]">
                            {player.ovr}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bench Substitutes */}
                {currentTeam.bench.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-400 font-bold uppercase mb-1.5">
                      Banco de Reservas ({currentTeam.bench.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentTeam.bench.map((benchPlayer, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-[11px] text-zinc-300 flex items-center gap-1.5"
                        >
                          <span className="text-zinc-500 font-mono">#{benchPlayer.number}</span>
                          <span className="font-medium">{benchPlayer.name}</span>
                          <span className="text-[9px] font-mono text-cyan-400">({benchPlayer.position})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-3 sm:p-4 flex items-center justify-between">
          <div className="text-xs font-mono text-zinc-400">
            Dica: No Blue Lock, analisar as armas e fraquezas de cada peça do tabuleiro é a chave para a sobrevivência.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold font-['Chakra_Petch'] uppercase tracking-wider transition"
          >
            Voltar à Partida
          </button>
        </div>
      </div>
    </div>
  );
};
