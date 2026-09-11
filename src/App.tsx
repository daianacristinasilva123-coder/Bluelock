import React, { useState, useEffect } from "react";
import {
  CharacterProfile,
  CharacterRelationship,
  CharacterMemory,
  StoryChapter,
  ActiveMatch,
  ChatMessage,
  PlayerStats,
  TransferOffer,
} from "./types";
import { CANONICAL_CHARACTERS, INITIAL_CHAPTERS, buildInitialRelationships } from "./data/canonicalCharacters";
import { TransferMarketView } from "./components/TransferMarketView";
import { generateClubTransferOffers } from "./data/transferClubs";
import { CharacterCreationView } from "./components/CharacterCreationView";
import { StoryChatView } from "./components/StoryChatView";
import { MatchEngineView } from "./components/MatchEngineView";
import { StoryProgressView } from "./components/StoryProgressView";
import { RelationshipsView } from "./components/RelationshipsView";
import { EgoistProfileView } from "./components/EgoistProfileView";
import { MemoryLogView } from "./components/MemoryLogView";
import { Training1v1Modal } from "./components/Training1v1Modal";
import { SaveManagerModal } from "./components/SaveManagerModal";
import { ResetEgoistModal } from "./components/ResetEgoistModal";
import {
  MessageSquare,
  Play,
  Flame,
  HeartHandshake,
  User,
  History,
  Settings,
  Swords,
  RotateCcw,
  Building2,
} from "lucide-react";
import { sounds } from "./utils/audio";

const STORAGE_KEYS = {
  CHARACTER: "bluelock_rpg_character_v2",
  RELATIONSHIPS: "bluelock_rpg_relationships_v2",
  MEMORIES: "bluelock_rpg_memories_v2",
  CHAPTERS: "bluelock_rpg_chapters_v2",
  MESSAGES: "bluelock_rpg_messages_v2",
  ACTIVE_MATCH: "bluelock_rpg_active_match_v2",
};

function sanitizeCharacterProfile(data: any): CharacterProfile | null {
  if (!data || typeof data !== "object" || !data.name) return null;
  return {
    id: data.id || "char_" + Date.now(),
    name: data.name || "Egoísta",
    nickname: data.nickname || "",
    age: Number(data.age) || 17,
    nationality: data.nationality || "Japão",
    height: Number(data.height) || 178,
    position: data.position || "Atacante (CA)",
    dominantFoot: data.dominantFoot || "Direito",
    appearance: data.appearance || "",
    personality: data.personality || "",
    backstory: data.backstory || "",
    playstyle: data.playstyle || "Egoísta Adaptativo",
    mainWeapon: data.mainWeapon || "Visão Espacial & Tiro Direto",
    relationshipWithCanon: data.relationshipWithCanon || "Nenhum",
    canonTargetCharacter: data.canonTargetCharacter || undefined,
    stats: {
      speed: Number(data.stats?.speed) || 70,
      strength: Number(data.stats?.strength) || 70,
      finishing: Number(data.stats?.finishing) || 70,
      dribble: Number(data.stats?.dribble) || 70,
      ballControl: Number(data.stats?.ballControl) || 70,
      vision: Number(data.stats?.vision) || 70,
      iq: Number(data.stats?.iq) || 70,
      stamina: Number(data.stats?.stamina) || 70,
    },
    level: Number(data.level) || 1,
    exp: Number(data.exp) || 0,
    expToNextLevel: Number(data.expToNextLevel) || 100,
    statPointsAvailable: Number(data.statPointsAvailable) || 0,
    trainingsAvailable: Number(data.trainingsAvailable) || 3,
    unlockedWeapons: Array.isArray(data.unlockedWeapons) ? data.unlockedWeapons : [data.mainWeapon || "Chute Direto"],
    currentRanking: Number(data.currentRanking) || 299,
    highestRanking: Number(data.highestRanking) || Number(data.currentRanking) || 299,
    isEliminated: Boolean(data.isEliminated),
    eliminationReason: data.eliminationReason || undefined,
    jerseyNumber: Number(data.jerseyNumber) || 11,
    currentBidYen: Number(data.currentBidYen) || 0,
    currentClub: data.currentClub || undefined,
    transferOffers: Array.isArray(data.transferOffers) ? data.transferOffers : [],
    careerStats: {
      goals: Number(data.careerStats?.goals) || 0,
      assists: Number(data.careerStats?.assists) || 0,
      matchesPlayed: Number(data.careerStats?.matchesPlayed) || 0,
      averageRating: Number(data.careerStats?.averageRating) || 6.5,
    },
  };
}

function sanitizeActiveMatch(data: any): ActiveMatch | null {
  if (!data || typeof data !== "object" || !data.id || !data.playerTeam) return null;
  return {
    id: data.id,
    title: data.title || "Partida Blue Lock",
    stage: data.stage || "Fase 1",
    playerTeam: data.playerTeam,
    opponentTeam: data.opponentTeam || "Time Rival",
    keyOpponents: Array.isArray(data.keyOpponents) ? data.keyOpponents : [],
    currentMinute: Number(data.currentMinute) || 0,
    score: {
      playerTeam: Number(data.score?.playerTeam) || 0,
      opponentTeam: Number(data.score?.opponentTeam) || 0,
    },
    pitchState: {
      ballPossessor: data.pitchState?.ballPossessor || "Disputa no Meio-Campo",
      attackingTeam: data.pitchState?.attackingTeam || "playerTeam",
      zone: data.pitchState?.zone || "midfield",
      description: data.pitchState?.description || "A bola rola no gramado sintético de Blue Lock.",
      ballCoords: data.pitchState?.ballCoords || { x: 50, y: 50 },
      playerCoords: data.pitchState?.playerCoords || { x: 50, y: 50 },
      dangerLevel: data.pitchState?.dangerLevel || "low",
    },
    logs: Array.isArray(data.logs) ? data.logs : [],
    inMatchChat: Array.isArray(data.inMatchChat) ? data.inMatchChat : [],
    isFinished: Boolean(data.isFinished),
    matchTension: data.matchTension || "tense",
    playerStatsInMatch: {
      goals: Number(data.playerStatsInMatch?.goals) || 0,
      assists: Number(data.playerStatsInMatch?.assists) || 0,
      shotsOnTarget: Number(data.playerStatsInMatch?.shotsOnTarget) || 0,
      successfulDribbles: Number(data.playerStatsInMatch?.successfulDribbles) || 0,
      keyPasses: Number(data.playerStatsInMatch?.keyPasses) || 0,
      tackles: Number(data.playerStatsInMatch?.tackles) || 0,
      foulsCommitted: Number(data.playerStatsInMatch?.foulsCommitted) || 0,
      foulsSuffered: Number(data.playerStatsInMatch?.foulsSuffered) || 0,
      yellowCards: Number(data.playerStatsInMatch?.yellowCards) || 0,
      redCards: Number(data.playerStatsInMatch?.redCards) || 0,
      rating: Number(data.playerStatsInMatch?.rating) || 6.5,
      currentStamina: Number(data.playerStatsInMatch?.currentStamina) || 100,
    },
  };
}

export default function App() {
  // Main State with defensive JSON parsing
  const [character, setCharacter] = useState<CharacterProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHARACTER);
      return saved ? sanitizeCharacterProfile(JSON.parse(saved)) : null;
    } catch (e) {
      console.warn("Could not load saved character:", e);
      return null;
    }
  });

  const [relationships, setRelationships] = useState<Record<string, CharacterRelationship>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RELATIONSHIPS);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [memories, setMemories] = useState<CharacterMemory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [chapters, setChapters] = useState<StoryChapter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10 && parsed[0]?.code?.startsWith("TIME_Z")) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_CHAPTERS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_MATCH);
      return saved ? sanitizeActiveMatch(JSON.parse(saved)) : null;
    } catch (e) {
      return null;
    }
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<
    "chat" | "match" | "progress" | "relationships" | "profile" | "memories" | "transfers"
  >("chat");
  const [trainingOpponent, setTrainingOpponent] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Loading flags
  const [isLoadingPrologue, setIsLoadingPrologue] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isEvaluatingEgo, setIsEvaluatingEgo] = useState(false);
  const [egoEvaluationMessage, setEgoEvaluationMessage] = useState<string | null>(null);

  // Persistence side-effects
  useEffect(() => {
    if (character) {
      localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(character));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CHARACTER);
    }
  }, [character]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RELATIONSHIPS, JSON.stringify(relationships));
  }, [relationships]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (activeMatch) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_MATCH, JSON.stringify(activeMatch));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_MATCH);
    }
  }, [activeMatch]);

  // Handle Character Creation
  const handleCharacterCreated = async (newChar: CharacterProfile) => {
    setIsLoadingPrologue(true);
    sounds.playEgoImpact();

    try {
      const initialRels = buildInitialRelationships(
        newChar.relationshipWithCanon,
        newChar.canonTargetCharacter || ""
      );

      const response = await fetch("/api/generate-character-prologue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character: newChar }),
      });

      const data = await response.json();
      const prologueText =
        data.prologueText ||
        data.fallback?.prologueText ||
        `Os portões metálicos subterrâneos de Blue Lock se fecham atrás de você com um silvo pressurizado. ${newChar.name} dá os primeiros passos no salão central sob o olhar de 300 atacantes famintos. Nos telões no teto, a silhueta de Jinpachi Ego surge anunciando o teste supremo.`;
      const initialReactions = data.initialReactions || data.fallback?.initialReactions || [];

      let formattedReactions = "";
      if (initialReactions.length > 0) {
        formattedReactions =
          "\n\n" +
          initialReactions
            .map((r: any) => `**${r.character}:** "${r.dialogue}"`)
            .join("\n\n");
      }

      const welcomeMessage: ChatMessage = {
        id: "msg_" + Date.now(),
        sender: "ai",
        text: prologueText + formattedReactions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        scene: data.startingScene || "Entrada no Blue Lock: Sala de Monitoramento",
      };

      // Store initial relationship memory
      const initialMem: CharacterMemory = {
        id: "mem_" + Date.now(),
        characterName: newChar.canonTargetCharacter || "Blue Lock",
        event: `Entrada oficial no Blue Lock. Vínculo: ${newChar.relationshipWithCanon}`,
        timestamp: "Dia 1",
        importance: "decisiva",
      };

      setCharacter(newChar);
      setRelationships(initialRels);
      setMemories([initialMem]);
      setMessages([welcomeMessage]);
      setActiveTab("chat");
    } catch (err) {
      console.warn("Fallback triggered on prologue creation:", err);
      const fallbackWelcome: ChatMessage = {
        id: "msg_" + Date.now(),
        sender: "ai",
        text: `Os portões metálicos subterrâneos de Blue Lock se fecham atrás de você com um silvo pressurizado. ${newChar.name} entra no complexo subterrâneo.\n\nNos telões gigantes, Jinpachi Ego surge ajustando os óculos: "Bem-vindos, 300 joias brutas e sem polimento. Apenas o egoísta supremo sobreviverá para levar o futebol do Japão ao topo do mundo."`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        scene: "Entrada no Blue Lock: Sala de Convocação",
      };
      setCharacter(newChar);
      setMessages([fallbackWelcome]);
      setActiveTab("chat");
    } finally {
      setIsLoadingPrologue(false);
    }
  };

  // Handle Sending Chat Message in Story Mode
  const handleSendChatMessage = async (text: string, scene: string) => {
    if (!character) return;
    setIsLoadingChat(true);

    const userMsg: ChatMessage = {
      id: "msg_user_" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      scene,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    try {
      const activeChap = chapters.find((c) => c.isUnlocked && !c.isCompleted) || chapters[0];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character,
          sceneContext: scene,
          playerInput: text,
          chatHistory: newMessages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "player" : "world",
            text: m.text,
          })),
          characterMemories: memories.slice(-8),
          characterRelationships: relationships,
          currentRanking: character.currentRanking,
          currentChapter: activeChap.title,
        }),
      });

      const data = await response.json();
      const aiReplyText =
        data.narrative ||
        data.fallback?.narrative ||
        "Os olhares no ambiente permanecem fixos em você. O clima de rivalidade no Blue Lock se intensifica a cada segundo.";

      const aiMsg: ChatMessage = {
        id: "msg_ai_" + Date.now(),
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        scene,
        speakers: data.speakers || ["Blue Lock"],
        expAwarded: data.expAwarded || 10,
        statNote: data.statProgressionNote,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Update relationships if returned
      if (data.updatedRelationships && Array.isArray(data.updatedRelationships)) {
        setRelationships((prev) => {
          const updated = { ...prev };
          data.updatedRelationships.forEach((u: any) => {
            if (updated[u.characterName]) {
              updated[u.characterName] = {
                ...updated[u.characterName],
                trust: Math.min(100, Math.max(0, updated[u.characterName].trust + (u.deltaTrust || 0))),
                respect: Math.min(100, Math.max(0, updated[u.characterName].respect + (u.deltaRespect || 0))),
                rivalry: Math.min(100, Math.max(0, updated[u.characterName].rivalry + (u.deltaRivalry || 0))),
                status: u.newStatus || updated[u.characterName].status,
                lastInteraction: u.reactionSummary || updated[u.characterName].lastInteraction,
              };
            }
          });
          return updated;
        });
      }

      // Add memory if returned
      if (data.newMemory && data.newMemory.characterName) {
        const newMem: CharacterMemory = {
          id: "mem_" + Date.now(),
          characterName: data.newMemory.characterName,
          event: data.newMemory.event,
          timestamp: "Recentemente",
          importance: "alta",
        };
        setMemories((prev) => [newMem, ...prev]);
      }

      // Award EXP
      if (data.expAwarded && data.expAwarded > 0) {
        addExpToCharacter(data.expAwarded);
      }
    } catch (err) {
      console.warn("Fallback triggered on chat message:", err);
      const fallbackChatMsg: ChatMessage = {
        id: "msg_ai_" + Date.now(),
        sender: "ai",
        text: "Os outros atacantes em Blue Lock encaram você com intensidade, absorvendo suas ações e recalculando suas estratégias no campo.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        scene,
        speakers: ["Blue Lock"],
        expAwarded: 10,
      };
      setMessages((prev) => [...prev, fallbackChatMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // EXP Progression
  const addExpToCharacter = (amount: number) => {
    if (!character) return;
    let newExp = character.exp + amount;
    let newLevel = character.level;
    let newExpToNext = character.expToNextLevel;
    let pointsBonus = character.statPointsAvailable;

    while (newExp >= newExpToNext) {
      newExp -= newExpToNext;
      newLevel += 1;
      newExpToNext = Math.round(newExpToNext * 1.35);
      pointsBonus += 3; // 3 stat points to allocate per level up!
      sounds.playGoalCelebration();
    }

    setCharacter((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        expToNextLevel: newExpToNext,
        statPointsAvailable: pointsBonus,
      };
    });
  };

  // Launch Match for Chapter
  const handleStartMatchForChapter = (chap: StoryChapter) => {
    if (!character) return;

    let pTeam = "Time Z";
    let oTeam = "Time V";

    if (chap.id === 1) {
      pTeam = "Time Z (Onigokko)";
      oTeam = "Bloco de Eliminação (Ryosuke Kira)";
    } else if (chap.id === 2) {
      pTeam = "Time Z";
      oTeam = "Time X (Barou Shoei)";
    } else if (chap.id === 3) {
      pTeam = "Time Z";
      oTeam = "Time Y (Ikki Niko & Okawa)";
    } else if (chap.id === 4) {
      pTeam = "Time Z";
      oTeam = "Time W (Gêmeos Wanima)";
    } else if (chap.id === 5) {
      pTeam = "Time Z";
      oTeam = "Time V (Nagi, Reo & Zantetsu)";
    } else if (chap.id === 6) {
      pTeam = "Trio Time Z";
      oTeam = "Top 3 (Itoshi Rin, Aryu, Tokimitsu)";
    } else if (chap.id === 7) {
      pTeam = "Dupla Isagi & Protagonista";
      oTeam = "Dupla Barou Shoei & Naruhaya";
    } else if (chap.id === 8) {
      pTeam = "Quarteto Isagi, Nagi, Barou & Protagonista";
      oTeam = "Quarteto Rin, Bachira, Aryu & Tokimitsu";
    } else if (chap.id === 9) {
      pTeam = "Blue Lock 11 Titular";
      oTeam = "Japão Sub-20 (Sae Itoshi & Aiku)";
    } else {
      pTeam = "Bastard München";
      oTeam = "Paris X Gen (P.X.G - Rin & Shidou)";
    }

    const newMatch: ActiveMatch = {
      id: "match_" + Date.now(),
      title: `${chap.title}: ${chap.subtitle}`,
      stage: chap.title,
      playerTeam: pTeam,
      opponentTeam: oTeam,
      keyOpponents: chap.opponents,
      currentMinute: 12,
      score: { playerTeam: 0, opponentTeam: 0 },
      pitchState: {
        ballPossessor: "Disputa no círculo central",
        attackingTeam: "playerTeam",
        zone: "midfield",
        description: "Início tenso com ambos os lados buscando dominar as linhas de passe.",
        dangerLevel: "medium",
      },
      inMatchChat: [
        {
          id: "init_chat_1",
          minute: 12,
          sender: "Jinpachi Ego",
          role: "coach",
          content: "Escutem bem, diamantes brutos. O ego de vocês será testado a cada segundo neste gramado. Quem não devorar o adversário será descartado.",
          tacticalEffect: "Foco Egoísta Ativado (+3 Moral)",
          timestamp: "12'",
        },
        {
          id: "init_chat_2",
          minute: 12,
          sender: pTeam.includes("Bastard") ? "Yo Hiori" : "Isagi Yoichi",
          role: "teammate",
          content: `${character.name}, vamos ficar atentos à movimentação da zaga deles! Qualquer brecha, eu te procuro no espaço vazio!`,
          tacticalEffect: "Sincronia Tática Inicial",
          timestamp: "12'",
        },
      ],
      logs: [
        {
          minute: 12,
          narrative: `⏱️ 12'\n\nO árbitro apita e o confronto começa! O ar vibra com o choque de egos. ${character.name} se posiciona como ${character.position}, atento a cada espaço vazio na zaga adversária.`,
          playerAction: ".",
          actionResult: "neutral",
        },
      ],
      isFinished: false,
      playerStatsInMatch: {
        goals: 0,
        assists: 0,
        shotsOnTarget: 0,
        successfulDribbles: 0,
        keyPasses: 0,
        tackles: 0,
        rating: 6.5,
        currentStamina: 100,
      },
    };

    setActiveMatch(newMatch);
    setActiveTab("match");
  };

  // Finish Match
  const handleFinishMatch = (match: ActiveMatch, earnedExp: number) => {
    if (!character) return;
    addExpToCharacter(earnedExp);

    setCharacter((prev) => {
      if (!prev) return null;
      
      const currentStats = prev.careerStats || { goals: 0, assists: 0, matchesPlayed: 0, averageRating: 0 };
      const newMatchesPlayed = currentStats.matchesPlayed + 1;
      const newAvgRating = ((currentStats.averageRating * currentStats.matchesPlayed) + match.playerStatsInMatch.rating) / newMatchesPlayed;
      
      const shouldEliminate = newMatchesPlayed >= 3 && newAvgRating < 5.2;

      return {
        ...prev,
        isEliminated: shouldEliminate,
        eliminationReason: shouldEliminate ? `Média de atuação de ${newAvgRating.toFixed(1)} após ${newMatchesPlayed} partidas está abaixo do padrão mínimo do Blue Lock (Rating < 5.2). Jinpachi Ego expulsou você por falta de impacto decisivo.` : prev.eliminationReason,
        careerStats: {
          goals: currentStats.goals + match.playerStatsInMatch.goals,
          assists: currentStats.assists + match.playerStatsInMatch.assists,
          matchesPlayed: newMatchesPlayed,
          averageRating: Number(newAvgRating.toFixed(1)),
        }
      };
    });

    // Record memory of match
    const won = match.score.playerTeam > match.score.opponentTeam;
    const matchMem: CharacterMemory = {
      id: "mem_match_" + Date.now(),
      characterName: match.opponentTeam,
      event: `Partida ${match.stage}: Placar ${match.score.playerTeam} x ${match.score.opponentTeam}. Gols marcados: ${match.playerStatsInMatch.goals}. Nota individual: ${match.playerStatsInMatch.rating}.`,
      timestamp: `Partida ⏱️ 90'`,
      importance: "decisiva",
    };
    setMemories((prev) => [matchMem, ...prev]);

    // Unlock next chapter if won or high rating
    if (won || match.playerStatsInMatch.rating >= 7.0) {
      setChapters((prev) => {
        const next = [...prev];
        const activeIdx = next.findIndex((c) => c.isUnlocked && !c.isCompleted);
        if (activeIdx !== -1) {
          next[activeIdx].isCompleted = true;
          if (activeIdx + 1 < next.length) {
            next[activeIdx + 1].isUnlocked = true;
          }
        }
        return next;
      });
    }

    // Add match summary to chat log
    const matchSummaryMsg: ChatMessage = {
      id: "msg_match_summary_" + Date.now(),
      sender: "system",
      text: `🏆 [RELATÓRIO DE PARTIDA]: ${match.playerTeam} ${match.score.playerTeam} x ${match.score.opponentTeam} ${match.opponentTeam}.\nSeus gols: ${match.playerStatsInMatch.goals} | Assistências: ${match.playerStatsInMatch.assists} | Nota: ${match.playerStatsInMatch.rating} | +${earnedExp} EXP.`,
      timestamp: "Fim de Jogo",
      expAwarded: earnedExp,
    };
    setMessages((prev) => [...prev, matchSummaryMsg]);

    setActiveMatch(null);
    setActiveTab("progress");
  };

  // Ego Ranking Evaluation
  const handleRequestEgoEvaluation = async () => {
    if (!character) return;
    setIsEvaluatingEgo(true);
    sounds.playEgoImpact();

    try {
      const response = await fetch("/api/evaluate-ranking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character,
          recentPerformances: memories.slice(0, 5),
          currentRanking: character.currentRanking,
        }),
      });

      const data = await response.json();
      setEgoEvaluationMessage(data.egoMonologue);

      if (data.newRanking && data.newRanking !== character.currentRanking) {
        setCharacter((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            currentRanking: data.newRanking,
            highestRanking: Math.min(prev.highestRanking, data.newRanking),
            jerseyNumber: data.newRanking > 11 ? data.newRanking : [10, 9, 11, 7, 8, 4, 5, 6, 2, 3, 1][data.newRanking - 1] || data.newRanking,
            currentBidYen: data.clubBid?.amountYen || prev.currentBidYen,
            currentClub: data.clubBid?.club || prev.currentClub,
          };
        });
      }
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setIsEvaluatingEgo(false);
    }
  };

  // Export / Import Save
  const handleExportSave = () => {
    const backup = {
      character,
      relationships,
      memories,
      chapters,
      messages,
      version: "2.0",
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bluelock_${character?.name.replace(/\s+/g, "_") || "egoist"}_save.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSave = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.character) setCharacter(parsed.character);
      if (parsed.relationships) setRelationships(parsed.relationships);
      if (parsed.memories) setMemories(parsed.memories);
      if (parsed.chapters) setChapters(parsed.chapters);
      if (parsed.messages) setMessages(parsed.messages);
      sounds.playEgoImpact();
    } catch (e) {
      alert("Arquivo de save inválido.");
    }
  };

  const handleFullReset = () => {
    localStorage.clear();
    setCharacter(null);
    setRelationships({});
    setMemories([]);
    setChapters(INITIAL_CHAPTERS);
    setMessages([]);
    setActiveMatch(null);
    setIsResetModalOpen(false);
  };

  const handleRespecStats = () => {
    if (!character) return;
    let refundedPoints = character.statPointsAvailable;
    const newStats: PlayerStats = { ...character.stats };

    (Object.keys(newStats) as (keyof PlayerStats)[]).forEach((key) => {
      const current = newStats[key];
      if (current > 50) {
        refundedPoints += current - 50;
        newStats[key] = 50;
      }
    });

    setCharacter({
      ...character,
      stats: newStats,
      statPointsAvailable: refundedPoints,
    });

    setActiveTab("profile");
    sounds.playEgoImpact();
  };

  // If character is eliminated, show Blue Lock Elimination Screen
  if (character?.isEliminated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-xl w-full bg-zinc-900/95 border-2 border-red-600/80 rounded-2xl p-8 shadow-2xl shadow-red-950/80 text-center backdrop-blur">
          <div className="inline-block px-6 py-2 rounded-lg bg-red-600 text-white font-black font-['Chakra_Petch'] tracking-widest text-xl uppercase mb-6 shadow-lg shadow-red-600/50 animate-pulse border border-red-400">
            ELIMINADO DO BLUE LOCK
          </div>

          <div className="w-20 h-20 mx-auto rounded-full bg-red-950/80 border-2 border-red-600 flex items-center justify-center text-3xl mb-4 shadow-inner">
            ❌
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-['Chakra_Petch'] tracking-wide text-white uppercase mb-2">
            FIM DE LINHA, ATACANTE
          </h1>

          <p className="text-sm font-mono text-zinc-400 mb-6">
            O projeto Blue Lock não tolera mediocridade nem falta de egoísmo letal.
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-left mb-6 text-sm text-zinc-300 font-mono leading-relaxed">
            <div className="text-red-400 font-bold mb-1 font-['Chakra_Petch'] uppercase tracking-wider flex items-center gap-2">
              <span>Jinpachi Ego:</span>
            </div>
            "{character.eliminationReason || "Sua atuação no campo foi patética. Você jogou como um coadjuvante sem fome de gol. No Blue Lock, quem não devora o adversário é devorado. Você está banido para sempre das instalações e do futebol japonês."}"
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                localStorage.clear();
                setCharacter(null);
                setRelationships({});
                setMemories([]);
                setChapters(INITIAL_CHAPTERS);
                setMessages([]);
                setActiveMatch(null);
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold font-['Chakra_Petch'] uppercase rounded-xl transition shadow-lg shadow-red-900/50 flex items-center justify-center gap-2"
            >
              Recomeçar Jornada (Novo Ego)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no character exists yet, show Character Creation Screen
  if (!character) {
    return (
      <CharacterCreationView
        onComplete={handleCharacterCreated}
        isLoadingPrologue={isLoadingPrologue}
      />
    );
  }

  const isNELUnlocked = chapters.some((c) => c.id === 9 && c.isCompleted);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none">
      {/* Top Main Navigation Bar */}
      <header className="bg-zinc-900/90 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14">
          {/* Brand */}
          <div
            onClick={() => {
              setActiveTab("chat");
              sounds.playClick();
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black font-['Chakra_Petch'] text-zinc-950 shadow-md shadow-cyan-500/30 text-sm">
              BL
            </div>
            <div>
              <div className="text-sm font-black font-['Chakra_Petch'] tracking-wider text-white">
                BLUE LOCK <span className="text-cyan-400">EGOIST PATH</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono hidden sm:block">
                Controle Exclusivo • IA Controla o Mundo
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider no-scrollbar">
            <button
              onClick={() => {
                setActiveTab("chat");
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === "chat"
                  ? "bg-cyan-400 text-zinc-950 shadow-sm shadow-cyan-400/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Diálogos</span>
            </button>

            <button
              onClick={() => {
                if (!activeMatch) {
                  const chap = chapters.find((c) => c.isUnlocked && !c.isCompleted) || chapters[0];
                  handleStartMatchForChapter(chap);
                } else {
                  setActiveTab("match");
                }
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition relative ${
                activeTab === "match"
                  ? "bg-cyan-400 text-zinc-950 shadow-sm shadow-cyan-400/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Partida</span>
              {activeMatch && !activeMatch.isFinished && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("progress");
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === "progress"
                  ? "bg-cyan-400 text-zinc-950 shadow-sm shadow-cyan-400/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden md:inline">8 Fases</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("relationships");
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === "relationships"
                  ? "bg-cyan-400 text-zinc-950 shadow-sm shadow-cyan-400/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Vínculos</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("profile");
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition relative ${
                activeTab === "profile"
                  ? "bg-cyan-400 text-zinc-950 shadow-sm shadow-cyan-400/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Egoísta</span>
              {character.statPointsAvailable > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse absolute top-1 right-1" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("memories");
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === "memories"
                  ? "bg-cyan-400 text-zinc-950 shadow-sm shadow-cyan-400/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Memória</span>
            </button>

            {isNELUnlocked && (
              <button
                onClick={() => {
                  setActiveTab("transfers");
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  activeTab === "transfers"
                    ? "bg-amber-400 text-zinc-950 shadow-sm shadow-amber-400/30"
                    : "text-amber-400/70 hover:text-amber-400 hover:bg-zinc-800"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Leilão NEL</span>
              </button>
            )}
          </nav>

          {/* Right Status / Settings */}
          <div className="flex items-center gap-2">
            {/* Rank Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg text-xs font-mono">
              <span className="text-zinc-500">RANK:</span>
              <span className="text-amber-400 font-bold">#{character.currentRanking}</span>
            </div>

            {/* Reset Egoist Quick Button */}
            <button
              onClick={() => {
                setIsResetModalOpen(true);
                sounds.playClick();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 transition shadow-sm"
              title="Reiniciar ou Reajustar Egoísta"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            <button
              onClick={() => {
                setIsSaveModalOpen(true);
                sounds.playClick();
              }}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Gerenciador de Save & Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* View Switcher */}
      <main className="flex-1">
        {activeTab === "chat" && (
          <StoryChatView
            character={character}
            messages={messages}
            memories={memories}
            relationships={relationships}
            currentChapter={chapters.find((c) => c.isUnlocked && !c.isCompleted)?.title || "Blue Lock"}
            onSendMessage={handleSendChatMessage}
            isLoading={isLoadingChat}
            onOpen1v1Training={(charName) => setTrainingOpponent(charName)}
          />
        )}

        {activeTab === "match" && activeMatch && (
          <MatchEngineView
            match={activeMatch}
            character={character}
            onUpdateMatch={(updated) => setActiveMatch(updated)}
            onFinishMatch={handleFinishMatch}
            onExit={() => setActiveTab("chat")}
          />
        )}

        {activeTab === "match" && !activeMatch && (
          <div className="max-w-md mx-auto my-20 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-4">
            <Flame className="w-10 h-10 text-cyan-400 mx-auto" />
            <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white">
              NENHUMA PARTIDA ATIVA NO MOMENTO
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Inicie um confronto oficial selecionando uma das 8 fases de Blue Lock ou converse no vestiário para preparar a estratégia.
            </p>
            <button
              onClick={() => {
                const chap = chapters.find((c) => c.isUnlocked && !c.isCompleted) || chapters[0];
                handleStartMatchForChapter(chap);
              }}
              className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold font-['Chakra_Petch'] uppercase tracking-wider text-sm transition"
            >
              Disputar Próxima Partida
            </button>
          </div>
        )}

        {activeTab === "progress" && (
          <StoryProgressView
            chapters={chapters}
            character={character}
            onStartMatchForChapter={handleStartMatchForChapter}
            onSelectStoryScene={(chapTitle) => {
              setActiveTab("chat");
            }}
            onOpenTransfers={isNELUnlocked ? () => setActiveTab("transfers") : undefined}
          />
        )}

        {activeTab === "relationships" && (
          <RelationshipsView
            character={character}
            relationships={relationships}
            memories={memories}
            onStartChatWith={(cName) => {
              setActiveTab("chat");
            }}
            onStart1v1Training={(cName) => {
              setTrainingOpponent(cName);
            }}
          />
        )}

        {activeTab === "profile" && (
          <EgoistProfileView
            character={character}
            onUpdateStats={(updatedStats, remainingPoints) => {
              setCharacter((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  stats: updatedStats,
                  statPointsAvailable: remainingPoints,
                };
              });
            }}
            onRequestEgoEvaluation={handleRequestEgoEvaluation}
            isEvaluating={isEvaluatingEgo}
            egoEvaluationMessage={egoEvaluationMessage}
            onRequestReset={() => setIsResetModalOpen(true)}
            onOpenTransfers={isNELUnlocked ? () => setActiveTab("transfers") : undefined}
          />
        )}

        {activeTab === "transfers" && (
          <TransferMarketView
            character={character}
            onAcceptTransferOffer={(offer) => {
              setCharacter((prev) => {
                if (!prev) return null;
                // Atualizar o array de ofertas, marcando esta como aceita e as outras como rejeitadas (opcional, pode só deletar)
                const updatedOffers = generateClubTransferOffers(prev, 0, 7.5).map(o => {
                  if (o.id === offer.id) return { ...o, status: "accepted" as const };
                  return { ...o, status: "rejected" as const };
                });

                return {
                  ...prev,
                  currentClub: offer.clubName,
                  currentBidYen: offer.bidYen,
                  transferOffers: updatedOffers,
                };
              });
            }}
            onRefreshOffers={() => {
              setCharacter((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  transferOffers: generateClubTransferOffers(prev, 0, 7.5),
                };
              });
            }}
          />
        )}

        {activeTab === "memories" && (
          <MemoryLogView
            character={character}
            memories={memories}
            onAddCustomMemory={(charName, eventText) => {
              const newMem: CharacterMemory = {
                id: "mem_custom_" + Date.now(),
                characterName: charName,
                event: eventText,
                timestamp: "Agora",
                importance: "alta",
              };
              setMemories((prev) => [newMem, ...prev]);
            }}
          />
        )}
      </main>

      {/* 1v1 Training Modal */}
      {trainingOpponent && (
        <Training1v1Modal
          character={character}
          initialOpponent={trainingOpponent}
          onClose={() => setTrainingOpponent(null)}
          onTrainingComplete={(expGained, statBonus) => {
            addExpToCharacter(expGained);
            if (statBonus && character) {
              setCharacter((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  stats: {
                    ...prev.stats,
                    [statBonus.stat]: Math.min(99, prev.stats[statBonus.stat] + statBonus.amount),
                  },
                };
              });
            }
          }}
        />
      )}

      {/* Save Manager Modal */}
      {isSaveModalOpen && (
        <SaveManagerModal
          onClose={() => setIsSaveModalOpen(false)}
          onExportSave={handleExportSave}
          onImportSave={handleImportSave}
          onRequestReset={() => setIsResetModalOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sounds.enabled = next;
          }}
        />
      )}

      {/* Reset & Rebirth Egoist Modal */}
      {isResetModalOpen && character && (
        <ResetEgoistModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          character={character}
          onFullReset={handleFullReset}
          onRespecStats={handleRespecStats}
          onExportBackup={handleExportSave}
        />
      )}
    </div>
  );
}
