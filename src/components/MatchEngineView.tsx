import React, { useState, useRef, useEffect } from "react";
import { CharacterProfile, ActiveMatch, MatchTurnLog, InMatchChatMessage } from "../types";
import { TacticalPitch } from "./TacticalPitch";
import { LineupModal } from "./LineupModal";
import { MatchGoalCelebration } from "./MatchGoalCelebration";
import { MatchIncidentModal, IncidentData } from "./MatchIncidentModal";
import { InMatchChatPanel } from "./InMatchChatPanel";
import { getMatchLineups } from "../data/lineups";
import {
  Clock,
  Send,
  Zap,
  Award,
  Flame,
  AlertCircle,
  ArrowLeft,
  Users,
  MessageSquare,
  Sparkles,
  User,
  Shield,
  Swords,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "../utils/audio";

interface Props {
  match: ActiveMatch;
  character: CharacterProfile;
  onUpdateMatch: (updatedMatch: ActiveMatch) => void;
  onFinishMatch: (match: ActiveMatch, earnedExp: number) => void;
  onExit: () => void;
}

export const MatchEngineView: React.FC<Props> = ({
  match,
  character,
  onUpdateMatch,
  onFinishMatch,
  onExit,
}) => {
  const [playerAction, setPlayerAction] = useState("");
  const [isLoadingTurn, setIsLoadingTurn] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<"narration" | "chat">("narration");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [celebratingGoal, setCelebratingGoal] = useState<{
    scorer: string;
    assistant?: string;
    team: "playerTeam" | "opponentTeam";
    teamName?: string;
  } | null>(null);
  const [activeIncident, setActiveIncident] = useState<IncidentData | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeRightTab === "narration") {
      scrollToBottom();
    }
  }, [match.logs, activeRightTab]);

  // Turn submission
  const handleActionSubmit = async (e?: React.FormEvent, directAction?: string) => {
    if (e) e.preventDefault();
    const actionToSend = directAction !== undefined ? directAction : playerAction;
    if (isLoadingTurn || match.isFinished) return;

    setIsLoadingTurn(true);
    setActionFeedback(actionToSend === "." ? "Observando leitura tática de jogo..." : actionToSend);
    sounds.playClick();

    try {
      const response = await fetch("/api/match/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchInfo: {
            teamA: match.playerTeam,
            teamB: match.opponentTeam,
            playerTeam: match.playerTeam,
            opponentTeam: match.opponentTeam,
            keyOpponents: match.keyOpponents,
            stage: match.stage,
          },
          character,
          playerAction: actionToSend.trim() || ".",
          currentMinute: match.currentMinute,
          currentScore: {
            teamA: match.score.playerTeam,
            teamB: match.score.opponentTeam,
          },
          matchLog: match.logs,
          pitchState: match.pitchState,
        }),
      });

      const data = await response.json();

      let newScore = { ...match.score };
      let newPlayerStats = { ...match.playerStatsInMatch };

      // High-precision goal attribution
      if (data.goalScored) {
        const { playerLineup, opponentLineup } = getMatchLineups(
          match.playerTeam,
          match.opponentTeam,
          character
        );

        const scorerLower = (data.goalScored.scorer || "").toLowerCase();
        const playerNameLower = (character.name || "").toLowerCase();
        const goalTeam = (data.goalScored.team || "").toLowerCase();
        const goalTeamName = (data.goalScored.teamName || "").toLowerCase();
        const pTeamLower = match.playerTeam.toLowerCase();
        const oTeamLower = match.opponentTeam.toLowerCase();

        let isPlayerTeamGoal = false;

        // 1. Protagonist check
        if (
          scorerLower.includes(playerNameLower) ||
          playerNameLower.includes(scorerLower) ||
          scorerLower.includes("você") ||
          scorerLower.includes("voce")
        ) {
          isPlayerTeamGoal = true;
          newPlayerStats.goals += 1;
        }
        // 2. Teammate roster check
        else if (
          playerLineup.startingXI.some((p) => {
            const n = p.name.toLowerCase();
            return scorerLower.includes(n) || n.includes(scorerLower);
          })
        ) {
          isPlayerTeamGoal = true;
        }
        // 3. Opponent roster check
        else if (
          opponentLineup.startingXI.some((p) => {
            const n = p.name.toLowerCase();
            return scorerLower.includes(n) || n.includes(scorerLower);
          })
        ) {
          isPlayerTeamGoal = false;
        }
        // 4. Explicit team attribute check
        else if (
          goalTeam === "playerteam" ||
          goalTeam === "teama" ||
          goalTeam.includes(pTeamLower) ||
          goalTeamName.includes(pTeamLower)
        ) {
          isPlayerTeamGoal = true;
        } else if (
          goalTeam === "opponentteam" ||
          goalTeam === "teamb" ||
          goalTeam.includes(oTeamLower) ||
          goalTeamName.includes(oTeamLower)
        ) {
          isPlayerTeamGoal = false;
        } else {
          // Default to playerTeam if protagonist had offensive action
          isPlayerTeamGoal = true;
        }

        if (isPlayerTeamGoal) {
          newScore.playerTeam += 1;
          sounds.playGoalCelebration();
          sounds.playEgoImpact();
        } else {
          newScore.opponentTeam += 1;
          sounds.playOpponentGoalAlert();
        }

        setCelebratingGoal({
          scorer: data.goalScored.scorer,
          assistant: data.goalScored.assistant,
          team: isPlayerTeamGoal ? "playerTeam" : "opponentTeam",
          teamName: isPlayerTeamGoal ? match.playerTeam : match.opponentTeam,
        });
      }

      // Check Foul / Cards Incident
      if (data.foulDetail) {
        sounds.playFoulWhistle();
        const pName = (character.name || "").toLowerCase();
        const victimLower = (data.foulDetail.victim || "").toLowerCase();
        const committerLower = (data.foulDetail.committedBy || "").toLowerCase();

        if (victimLower.includes(pName) || pName.includes(victimLower)) {
          newPlayerStats.foulsSuffered = (newPlayerStats.foulsSuffered || 0) + 1;
        }
        if (committerLower.includes(pName) || pName.includes(committerLower)) {
          newPlayerStats.foulsCommitted = (newPlayerStats.foulsCommitted || 0) + 1;
          if (data.foulDetail.card === "yellow") {
            newPlayerStats.yellowCards = (newPlayerStats.yellowCards || 0) + 1;
          } else if (data.foulDetail.card === "red") {
            newPlayerStats.redCards = (newPlayerStats.redCards || 0) + 1;
          }
        }

        setActiveIncident({
          type:
            data.foulDetail.card === "red"
              ? "red_card"
              : data.foulDetail.card === "yellow"
              ? "yellow_card"
              : data.foulDetail.isPenalty
              ? "penalty"
              : "foul",
          title: data.foulDetail.isPenalty
            ? "PÊNALTI MARCADO!"
            : data.foulDetail.card === "red"
            ? "EXPULSÃO DIRETA!"
            : data.foulDetail.card === "yellow"
            ? "CARTÃO AMARELO!"
            : "FALTA APITADA PELO ÁRBITRO",
          subtitle: data.foulDetail.card === "red"
            ? `Cartão Vermelho para ${data.foulDetail.committedBy}`
            : data.foulDetail.card === "yellow"
            ? `Amarelo para ${data.foulDetail.committedBy}`
            : `Falta de ${data.foulDetail.committedBy}`,
          committedBy: data.foulDetail.committedBy,
          victim: data.foulDetail.victim,
          description: data.foulDetail.description || "Entrada dura na dividida de bola.",
          card: data.foulDetail.card,
          isPenalty: data.foulDetail.isPenalty,
        });
      } else if (data.clashDetail) {
        // Check Ego Clash / Brawl
        sounds.playClash();
        setActiveIncident({
          type: "clash",
          title: "CHOQUE DE EGOS & BRIGA!",
          subtitle: `${data.clashDetail.protagonist} vs ${data.clashDetail.rival}`,
          committedBy: data.clashDetail.protagonist,
          victim: data.clashDetail.rival,
          description: data.clashDetail.clashReason || "Encarada peito a peito e ofensas ríspidas no gramado.",
        });
      }

      // Check player stats delta
      if (data.playerMatchPerformance?.ratingDelta) {
        newPlayerStats.rating = Math.min(
          10,
          Math.max(4.0, Number((newPlayerStats.rating + data.playerMatchPerformance.ratingDelta).toFixed(1)))
        );
      }
      newPlayerStats.currentStamina = Math.max(15, newPlayerStats.currentStamina - (actionToSend === "." ? 2 : 4));

      const newLog: MatchTurnLog = {
        minute: match.currentMinute,
        narrative: data.minuteNarrative || `⏱️ ${match.currentMinute}' Lance em disputa.`,
        playerAction: actionToSend.trim() || ".",
        actionResult: data.actionResult || "neutral",
        eventBadge: data.eventBadge,
        goalScored: data.goalScored,
        foulDetail: data.foulDetail,
        clashDetail: data.clashDetail,
        speakerComment: data.commentaryReaction,
      };

      const updatedMatch: ActiveMatch = {
        ...match,
        currentMinute: data.nextMinute || match.currentMinute + 5,
        score: newScore,
        pitchState: data.pitchState || match.pitchState,
        logs: [...match.logs, newLog],
        isFinished: Boolean(data.isMatchFinished || match.currentMinute >= 88),
        matchTension: data.matchTension || match.matchTension || "fierce",
        playerStatsInMatch: newPlayerStats,
      };

      onUpdateMatch(updatedMatch);
      setPlayerAction("");

      if (updatedMatch.isFinished) {
        sounds.playWhistle();
      }
    } catch (err) {
      console.error("Failed to run match turn:", err);
    } finally {
      setIsLoadingTurn(false);
      setTimeout(() => setActionFeedback(null), 2500);
    }
  };

  // In-match chat handler
  const handleSendInMatchChat = async (messageText: string) => {
    if (!messageText.trim() || isLoadingChat) return;
    setIsLoadingChat(true);

    const userMsg: InMatchChatMessage = {
      id: "msg_" + Date.now() + "_u",
      minute: match.currentMinute,
      sender: `${character.name} (Você)`,
      role: "player",
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentChat = match.inMatchChat || [];
    const updatedChatWithUser = [...currentChat, userMsg];

    onUpdateMatch({
      ...match,
      inMatchChat: updatedChatWithUser,
    });

    try {
      const res = await fetch("/api/match/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchInfo: {
            teamA: match.playerTeam,
            teamB: match.opponentTeam,
            playerTeam: match.playerTeam,
            opponentTeam: match.opponentTeam,
            keyOpponents: match.keyOpponents,
            stage: match.stage,
          },
          character,
          message: messageText.trim(),
          currentMinute: match.currentMinute,
          pitchState: match.pitchState,
          score: match.score,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        sounds.playClick();
        const aiMsg: InMatchChatMessage = {
          id: "msg_" + Date.now() + "_ai",
          minute: match.currentMinute,
          sender: data.reply.sender || "Isagi Yoichi",
          role: data.reply.role || "teammate",
          content: data.reply.content || "Entendido! Vamos nos movimentar!",
          tacticalEffect: data.reply.tacticalEffect,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        onUpdateMatch({
          ...match,
          inMatchChat: [...updatedChatWithUser, aiMsg],
        });
      }
    } catch (err) {
      console.warn("Failed to fetch match chat:", err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleFinishMatchClick = () => {
    const totalExp =
      60 +
      match.playerStatsInMatch.goals * 40 +
      (match.score.playerTeam > match.score.opponentTeam ? 50 : 20);
    onFinishMatch(match, totalExp);
  };

  // Player-Locked state calculations
  const playerNameClean = (character.name || "").toLowerCase();
  const ballPossessorClean = (match.pitchState?.ballPossessor || "").toLowerCase();
  const isPlayerWithBall =
    ballPossessorClean.includes(playerNameClean) ||
    playerNameClean.includes(ballPossessorClean) ||
    ballPossessorClean.includes("você") ||
    ballPossessorClean.includes("voce") ||
    ballPossessorClean.includes("seu jogador");

  const isPlayerTeamAttacking =
    match.pitchState?.attackingTeam === "playerTeam" ||
    (match.pitchState?.attackingTeam &&
      match.pitchState.attackingTeam.toLowerCase().includes(match.playerTeam.toLowerCase())) ||
    isPlayerWithBall ||
    match.pitchState?.zone === "attack" ||
    match.pitchState?.zone === "box";

  const getContextualSuggestions = () => {
    if (isPlayerWithBall) {
      return [
        { label: `Finalizar no gol com minha arma (${character.mainWeapon})`, badge: "⚡ Arma Letal" },
        { label: "Driblar o rival no mano a mano 1v1 humilhando a marcação", badge: "🌪️ Drible 1v1" },
        { label: "Proteger com o corpo e cavar falta perigosa na entrada da área", badge: "🛡️ Cavar Falta" },
        { label: "Desmarcar em finta de corpo brusca no ponto cego do zagueiro", badge: "🚀 Finta & Corte" },
        { label: "Tocar rápido e disparar em velocidade no espaço livre", badge: "🎯 Tabela & Corrida" },
        { label: ".", badge: "⏱️ Segurar Posse" },
      ];
    }
    if (isPlayerTeamAttacking) {
      return [
        { label: "Explodir em desmarque violento atacando o ponto cego da zaga", badge: "⚡ Desmarque Feroz" },
        { label: "Puxar a marcação dupla na marra para abrir a defesa rival", badge: "🔀 Puxar Dobra" },
        { label: "Gritar pedindo a bola com olhar assassino de artilheiro", badge: "🙋‍♂️ Pedir Passe" },
        { label: "Aproximar em velocidade para tabela fulminante na grande área", badge: "📐 Triangulação" },
        { label: "Disputar a sobra no corpo a corpo pesado com o zagueiro", badge: "💥 Disputa Física" },
        { label: ".", badge: "⏱️ Observar Lance" },
      ];
    }
    // Opponent attacking / Defending
    return [
      { label: "Falta tática dura para matar o contra-ataque antes da área", badge: "🛑 Falta Tática" },
      { label: "Tranco forte de ombro no mano a mano desestabilizando o rival", badge: "💪 Tranco Físico" },
      { label: "Entrar de carrinho firme na bola sem medo da dividida", badge: "💥 Carrinho Firme" },
      { label: "Encarar o rival olho no olho após a dividida (Choque de Egos)", badge: "⚔️ Choque / Briga" },
      { label: "Antecipar a linha de passe e puxar o contra-golpe mortal", badge: "👁️ Interceptação" },
      { label: ".", badge: "⏱️ Guardar Posição" },
    ];
  };

  const getPlaceholderText = () => {
    if (isPlayerWithBall) {
      return `Você está com a bola! Descreva o que VOCÊ fará (chutar com sua arma, driblar, tocar)...`;
    }
    if (isPlayerTeamAttacking) {
      return `Seu time ataca (${match.pitchState?.ballPossessor || "companheiro"} tem a bola). Como VOCÊ se movimenta ou pede o passe?`;
    }
    return `Adversário com a bola (${match.pitchState?.ballPossessor || "rival"}). Qual a SUA ação defensiva individual?`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Bar / Scoreboard */}
      <header className="bg-zinc-900/95 border-b border-zinc-800 p-3 sm:p-4 sticky top-0 z-30 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pausar / Menu</span>
          </button>

          {/* Match Score Display */}
          <div className="flex items-center gap-3 sm:gap-6 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 shadow-md">
            <div className="text-right">
              <div className="text-xs sm:text-sm font-bold text-cyan-400 truncate max-w-[100px] sm:max-w-[150px]">
                {match.playerTeam}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">SEU TIME</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 font-['Chakra_Petch'] font-black text-2xl sm:text-3xl text-white">
                <motion.span
                  key={`scoreA_${match.score.playerTeam}`}
                  initial={{ scale: 1.4, color: "#22d3ee" }}
                  animate={{ scale: 1, color: "#22d3ee" }}
                  transition={{ duration: 0.4 }}
                >
                  {match.score.playerTeam}
                </motion.span>
                <span className="text-zinc-600">:</span>
                <motion.span
                  key={`scoreB_${match.score.opponentTeam}`}
                  initial={{ scale: 1.4, color: "#f43f5e" }}
                  animate={{ scale: 1, color: "#f43f5e" }}
                  transition={{ duration: 0.4 }}
                >
                  {match.score.opponentTeam}
                </motion.span>
              </div>

              {/* Match Rivalry & Difficulty Indicator */}
              <div className="mt-0.5 flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-orange-500/40 bg-orange-950/70 text-orange-300">
                <Swords className="w-2.5 h-2.5 text-orange-400 animate-pulse" />
                <span>RIVALIDADE MÁXIMA</span>
              </div>
            </div>

            <div className="text-left">
              <div className="text-xs sm:text-sm font-bold text-rose-400 truncate max-w-[100px] sm:max-w-[150px]">
                {match.opponentTeam}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">ADVERSÁRIO</div>
            </div>
          </div>

          {/* Right Controls: Lineup, Chat Toggle & Clock */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowLineupModal(true);
              }}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-zinc-950 bg-cyan-950/80 hover:bg-cyan-400 border border-cyan-500/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition shadow-md shadow-cyan-950/50"
              title="Ver Escalação e Prancheta Tática Completa"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Escalação</span>
            </button>

            {/* Clock */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-950 border border-zinc-800 px-2.5 sm:px-3 py-1.5 rounded-lg text-amber-400 font-mono text-xs sm:text-sm font-bold">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              <span>⏱️ {match.currentMinute}&apos;</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full flex-1 p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Tactical Pitch + Match HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <TacticalPitch
            pitchState={match.pitchState}
            playerName={character.name}
            playerTeam={match.playerTeam}
            opponentTeam={match.opponentTeam}
            onOpenLineup={() => {
              sounds.playClick();
              setShowLineupModal(true);
            }}
          />

          {/* Player Match Card with Ego Flow aura */}
          <div
            className={`bg-zinc-900 border rounded-xl p-4 transition-all duration-500 relative overflow-hidden ${
              match.playerStatsInMatch.rating >= 7.5
                ? "border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50"
                : "border-zinc-800"
            }`}
          >
            {match.playerStatsInMatch.rating >= 7.5 && (
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 animate-pulse" />
            )}

            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                  <span>ATACANTE TITULAR</span>
                  {match.playerStatsInMatch.rating >= 7.5 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40">
                      FLOW ATIVADO 🔥
                    </span>
                  )}
                </div>
                <div className="text-base font-bold text-white font-['Chakra_Petch']">
                  {character.name}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-zinc-400">Nota: </span>
                <span
                  className={`text-lg font-black font-['Chakra_Petch'] ${
                    match.playerStatsInMatch.rating >= 7.5
                      ? "text-emerald-400"
                      : match.playerStatsInMatch.rating >= 6.0
                      ? "text-cyan-400"
                      : "text-amber-400"
                  }`}
                >
                  {match.playerStatsInMatch.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Stamina Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-400">Resistência / Fôlego:</span>
                <span className="text-cyan-400 font-bold">{match.playerStatsInMatch.currentStamina}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${match.playerStatsInMatch.currentStamina}%` }}
                />
              </div>
            </div>

            {/* In-match stats */}
            <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-zinc-800/80">
              <div className="bg-zinc-950 p-2 rounded">
                <div className="text-xl font-bold font-['Chakra_Petch'] text-cyan-400">
                  {match.playerStatsInMatch.goals}
                </div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Gols</div>
              </div>
              <div className="bg-zinc-950 p-2 rounded">
                <div className="text-xl font-bold font-['Chakra_Petch'] text-emerald-400">
                  {match.playerStatsInMatch.assists}
                </div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Assistências</div>
              </div>
              <div className="bg-zinc-950 p-2 rounded">
                <div className="text-xl font-bold font-['Chakra_Petch'] text-amber-400">
                  #{character.currentRanking}
                </div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Ranking</div>
              </div>
            </div>

            {/* Disciplinary & Physical Combat Stats */}
            <div className="grid grid-cols-3 gap-2 text-center mt-2">
              <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800/60">
                <div className="text-sm font-bold font-['Chakra_Petch'] text-amber-300">
                  {match.playerStatsInMatch.foulsSuffered || 0}
                </div>
                <div className="text-[9px] text-zinc-400 font-mono">Faltas Sofridas</div>
              </div>
              <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800/60">
                <div className="text-sm font-bold font-['Chakra_Petch'] text-rose-400">
                  {match.playerStatsInMatch.foulsCommitted || 0}
                </div>
                <div className="text-[9px] text-zinc-400 font-mono">Faltas Feitas</div>
              </div>
              <div className="bg-zinc-950/80 p-1.5 rounded border border-zinc-800/60 flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-3.5 bg-amber-400 rounded-sm inline-block shadow-sm" />
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {match.playerStatsInMatch.yellowCards || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-3.5 bg-rose-600 rounded-sm inline-block shadow-sm" />
                  <span className="text-xs font-bold text-rose-500 font-mono">
                    {match.playerStatsInMatch.redCards || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Weapon Reminder */}
            <div className="mt-3 p-2.5 bg-zinc-950/80 border border-cyan-500/30 rounded-lg text-xs">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5 font-mono mb-0.5">
                <Zap className="w-3.5 h-3.5" /> SUA ARMA:
              </div>
              <div className="text-zinc-300 italic">{character.mainWeapon}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Narration & In-Match Chat (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-[640px]">
          {/* Top Tab Bar: Narration vs In-Match Chat */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/90 px-3 pt-2 gap-2 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveRightTab("narration");
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition border-t border-l border-r ${
                activeRightTab === "narration"
                  ? "bg-zinc-900 border-zinc-800 text-cyan-300 shadow-sm"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Lances & Narração (⏱️ {match.currentMinute}&apos;)</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveRightTab("chat");
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition border-t border-l border-r relative ${
                activeRightTab === "chat"
                  ? "bg-zinc-900 border-zinc-800 text-cyan-300 shadow-sm"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chat no Meio do Jogo</span>
              {match.inMatchChat && match.inMatchChat.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500 text-zinc-950 font-black">
                  {match.inMatchChat.length}
                </span>
              )}
            </button>
          </div>

          {/* Action Feedback Banner */}
          <AnimatePresence>
            {actionFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-cyan-950/90 border-b border-cyan-500/30 px-3 py-1.5 text-xs text-cyan-300 font-mono flex items-center gap-2 overflow-hidden"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="truncate">Executando no campo: &ldquo;{actionFeedback}&rdquo;</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab 1: Narration Stream */}
          {activeRightTab === "narration" ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
                {match.logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-4 shadow-sm"
                  >
                    {/* Minute & Result Badge */}
                    <div className="flex items-center justify-between text-xs font-mono mb-2 pb-2 border-b border-zinc-800">
                      <span className="font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                        ⏱️ {log.minute}&apos; DE JOGO
                      </span>
                      {log.actionResult === "success" && (
                        <span className="text-emerald-400 font-bold">✓ JOGADA BEM-SUCEDIDA</span>
                      )}
                      {log.actionResult === "failed" && (
                        <span className="text-rose-400 font-bold">✗ DEFESA / MARCAÇÃO ADAPTADA</span>
                      )}
                    </div>

                    {/* Player Action Quote */}
                    {log.playerAction && log.playerAction !== "." && (
                      <div className="text-xs text-zinc-400 mb-2 pl-2 border-l-2 border-cyan-400 italic">
                        Sua Ação: &ldquo;{log.playerAction}&rdquo;
                      </div>
                    )}
                    {log.playerAction === "." && (
                      <div className="text-[11px] text-zinc-500 mb-2 pl-2 border-l-2 border-zinc-700 italic">
                        (Você observou o lance sem intervir ativamente)
                      </div>
                    )}

                    {/* Narrative text */}
                    <div className="text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
                      {log.narrative}
                    </div>

                    {/* Goal announcement card inside log if any */}
                    {log.goalScored && (
                      <div
                        className={`mt-3 p-3 rounded-lg flex items-center gap-3 border ${
                          log.goalScored.team === "playerTeam"
                            ? "bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-transparent border-cyan-400/70"
                            : "bg-gradient-to-r from-rose-950/80 via-amber-950/60 to-transparent border-rose-500/70"
                        }`}
                      >
                        <div className="text-2xl animate-bounce">
                          {log.goalScored.team === "playerTeam" ? "⚽" : "🚨"}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-black font-['Chakra_Petch'] uppercase tracking-wider ${
                              log.goalScored.team === "playerTeam" ? "text-cyan-300" : "text-rose-400"
                            }`}
                          >
                            {log.goalScored.team === "playerTeam"
                              ? "GOL DO SEU TIME!"
                              : "GOL DO TIME RIVAL!"}
                          </div>
                          <div className="text-sm font-bold text-white font-['Chakra_Petch']">
                            {log.goalScored.scorer}
                            {log.goalScored.teamName && (
                              <span className="text-xs text-zinc-400 font-mono font-normal ml-1">
                                ({log.goalScored.teamName})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Foul & Disciplinary card inside log */}
                    {log.foulDetail && (
                      <div
                        className={`mt-3 p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
                          log.foulDetail.card === "red"
                            ? "bg-rose-950/40 border-rose-600/70 text-rose-300"
                            : log.foulDetail.card === "yellow"
                            ? "bg-amber-950/40 border-amber-500/70 text-amber-200"
                            : "bg-zinc-900 border-zinc-700/80 text-zinc-300"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {log.foulDetail.card === "red" ? (
                            <span className="w-3.5 h-5 bg-rose-600 rounded-sm inline-block shadow-md border border-white" />
                          ) : log.foulDetail.card === "yellow" ? (
                            <span className="w-3.5 h-5 bg-amber-400 rounded-sm inline-block shadow-md border border-white" />
                          ) : (
                            <span className="text-base">🛑</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-mono font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <span>
                              {log.foulDetail.card === "red"
                                ? "🟥 EXPULSÃO / CARTÃO VERMELHO"
                                : log.foulDetail.card === "yellow"
                                ? "🟨 CARTÃO AMARELO"
                                : log.foulDetail.isPenalty
                                ? "⚠️ PÊNALTI MARCADO PELO ÁRBITRO!"
                                : "🛑 FALTA APITADA"}
                            </span>
                          </div>
                          <div className="font-semibold text-white mt-0.5">
                            {log.foulDetail.committedBy} cometeu falta dura em {log.foulDetail.victim}
                          </div>
                          {log.foulDetail.description && (
                            <div className="text-[11px] text-zinc-400 italic mt-0.5">
                              {log.foulDetail.description}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ego Clash / Brawl Card inside log */}
                    {log.clashDetail && (
                      <div className="mt-3 p-3 rounded-lg border border-orange-500/60 bg-gradient-to-r from-orange-950/50 via-zinc-900 to-transparent flex items-start gap-2.5 text-xs text-orange-200">
                        <Swords className="w-5 h-5 text-orange-400 shrink-0 mt-0.5 animate-pulse" />
                        <div className="flex-1">
                          <div className="font-mono font-bold text-[11px] uppercase text-orange-400 tracking-wider">
                            ⚔️ CHOQUE DE EGOS & CONFUSÃO EM CAMPO!
                          </div>
                          <div className="font-bold text-white font-['Chakra_Petch'] mt-0.5">
                            {log.clashDetail.protagonist} vs {log.clashDetail.rival}
                          </div>
                          <div className="text-[11px] text-zinc-300 italic mt-0.5">
                            {log.clashDetail.clashReason}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Speaker Comment */}
                    {log.speakerComment && (
                      <div className="mt-3 p-2.5 rounded bg-zinc-900 border border-cyan-500/20 text-xs">
                        <span className="text-cyan-300 font-bold font-mono">
                          {log.speakerComment.speaker}:
                        </span>{" "}
                        <span className="text-zinc-300 italic">
                          &ldquo;{log.speakerComment.quote}&rdquo;
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoadingTurn && (
                  <div className="bg-zinc-950 border border-cyan-500/40 rounded-xl p-4 flex items-center gap-3 text-cyan-400 text-xs font-mono animate-pulse">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    Os 22 egoístas em campo se chocam... A IA está narrando a jogada...
                  </div>
                )}

                <div ref={logEndRef} />
              </div>

              {/* Action Input Section */}
              <div className="p-3 sm:p-4 bg-zinc-950 border-t border-zinc-800 shrink-0">
                {match.isFinished ? (
                  <div className="text-center py-3 bg-zinc-900 border border-cyan-500/40 rounded-xl p-4">
                    <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h3 className="text-lg font-black font-['Chakra_Petch'] text-white uppercase">
                      FIM DE PARTIDA! (90&apos;)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Placar Final: {match.playerTeam} {match.score.playerTeam} x{" "}
                      {match.score.opponentTeam} {match.opponentTeam}
                    </p>
                    <button
                      onClick={handleFinishMatchClick}
                      className="mt-4 px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black font-['Chakra_Petch'] uppercase tracking-wider text-sm transition"
                    >
                      Receber Avaliação de Ego & EXP
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Player-Locked Be-A-Pro Banner */}
                    <div
                      className={`p-2.5 rounded-xl border mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                        isPlayerWithBall
                          ? "bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-zinc-950 border-amber-400/80 shadow-md shadow-amber-500/10"
                          : isPlayerTeamAttacking
                          ? "bg-cyan-950/40 border-cyan-500/40"
                          : "bg-rose-950/40 border-rose-500/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-['Chakra_Petch'] shadow-sm shrink-0 ${
                            isPlayerWithBall
                              ? "bg-amber-400 text-zinc-950 animate-bounce"
                              : "bg-cyan-400 text-zinc-950"
                          }`}
                        >
                          {isPlayerWithBall ? "⚽" : "👤"}
                        </div>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                            <span className="text-zinc-400">MODO PLAYER-LOCKED:</span>
                            <span className="text-white font-bold">{character.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 font-mono flex items-center gap-1">
                              <span>CAMISA {character.jerseyNumber || (character.currentRanking > 11 ? character.currentRanking : [10, 9, 11, 7, 8, 4, 5, 6, 2, 3, 1][character.currentRanking - 1] || character.currentRanking)}</span>
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono">
                              {character.position}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium mt-0.5">
                            {isPlayerWithBall ? (
                              <span className="text-amber-300 font-bold flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                VOCÊ ESTÁ COM A BOLA! Chute com sua arma ({character.mainWeapon}), drible ou passe.
                              </span>
                            ) : isPlayerTeamAttacking ? (
                              <span className="text-cyan-300">
                                🏃 Sem a bola ({match.pitchState?.ballPossessor || "companheiro"} conduz). Desmarque-se no espaço ou peça o passe.
                              </span>
                            ) : (
                              <span className="text-rose-300">
                                🛡️ Sem a bola (Adversário ataca). Pressione o portador, dê o bote ou feche as linhas.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-800 self-start sm:self-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Outros 21 Atletas: IA Autônoma</span>
                      </div>
                    </div>

                    {/* Contextual Suggestions Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      <span className="text-[10px] font-mono text-zinc-400 self-center mr-0.5 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" /> Ações do Seu Jogador:
                      </span>
                      {getContextualSuggestions().map((sug, i) => (
                        <button
                          type="button"
                          key={i}
                          disabled={isLoadingTurn}
                          onClick={() => handleActionSubmit(undefined, sug.label)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                            sug.label === "."
                              ? "bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white"
                              : isPlayerWithBall
                              ? "bg-amber-950/30 border-amber-500/40 text-amber-200 hover:border-amber-400 hover:bg-amber-950/60"
                              : "bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-cyan-500 hover:text-cyan-300"
                          }`}
                        >
                          <span className="text-[9px] font-mono px-1 rounded bg-zinc-950/80 text-zinc-400 border border-zinc-800">
                            {sug.badge}
                          </span>
                          <span className="truncate max-w-[200px] sm:max-w-none">
                            {sug.label === "." ? "Apenas Observar (.)" : sug.label}
                          </span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setActiveRightTab("chat")}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 transition flex items-center gap-1 ml-auto"
                        title="Gritar em campo com companheiros e rivais"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat de Campo</span>
                      </button>
                    </div>

                    {/* Free Input Form */}
                    <form onSubmit={(e) => handleActionSubmit(e)} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={playerAction}
                          onChange={(e) => setPlayerAction(e.target.value)}
                          placeholder={getPlaceholderText()}
                          disabled={isLoadingTurn}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-3 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoadingTurn}
                        className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black font-['Chakra_Petch'] text-sm uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-cyan-400/20"
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Executar</span>
                      </button>
                    </form>

                    <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-400 mt-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>
                          Você controla exclusivamente <strong className="text-zinc-200">{character.name}</strong>. Seus companheiros e rivais jogam com egos próprios.
                        </span>
                      </div>
                      <span className="hidden sm:inline text-zinc-500 text-[10px]">
                        Dica: Digite &quot;.&quot; para passar o minuto sem intervir
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Tab 2: In-Match Real-Time Chat */
            <div className="flex-1 overflow-hidden p-2">
              <InMatchChatPanel
                messages={match.inMatchChat || []}
                character={character}
                playerTeam={match.playerTeam}
                opponentTeam={match.opponentTeam}
                currentMinute={match.currentMinute}
                pitchState={match.pitchState}
                currentScore={match.score}
                onSendMessage={handleSendInMatchChat}
                isLoading={isLoadingChat}
              />
            </div>
          )}
        </div>
      </main>

      {/* Goal Celebration Explosion Overlay */}
      {celebratingGoal && (
        <MatchGoalCelebration
          goal={celebratingGoal}
          playerTeam={match.playerTeam}
          opponentTeam={match.opponentTeam}
          currentScore={match.score}
          onClose={() => setCelebratingGoal(null)}
        />
      )}

      {/* Foul, Card, and Ego Clash Incident Modal */}
      {activeIncident && (
        <MatchIncidentModal
          incident={activeIncident}
          onClose={() => setActiveIncident(null)}
        />
      )}

      {/* Escalação & Prancheta Tática Modal */}
      {showLineupModal && (
        <LineupModal
          match={match}
          character={character}
          onClose={() => setShowLineupModal(false)}
        />
      )}
    </div>
  );
};
