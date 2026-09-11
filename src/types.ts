export interface PlayerStats {
  speed: number;       // Velocidade
  strength: number;    // Força
  finishing: number;   // Finalização
  dribble: number;     // Drible
  ballControl: number; // Controle de bola / Domínio
  vision: number;      // Visão de jogo
  iq: number;          // Inteligência / Tática
  stamina: number;     // Resistência
}

export interface CharacterProfile {
  id: string;
  name: string;
  nickname: string;
  age: number;
  nationality: string;
  height: number;
  position: string;
  dominantFoot: string;
  appearance: string;
  personality: string;
  backstory: string;
  playstyle: string;
  mainWeapon: string;
  relationshipWithCanon: string;
  canonTargetCharacter?: string;
  stats: PlayerStats;
  level: number;
  exp: number;
  expToNextLevel: number;
  statPointsAvailable: number;
  trainingsAvailable?: number;
  unlockedWeapons: string[];
  currentRanking: number;
  highestRanking: number;
  isEliminated?: boolean;
  eliminationReason?: string;
  jerseyNumber?: number;
  currentBidYen?: number;
  currentClub?: string;
  transferOffers?: TransferOffer[];
  careerStats?: {
    goals: number;
    assists: number;
    matchesPlayed: number;
    averageRating: number;
  };
}

export interface TransferOffer {
  id: string;
  clubName: string;
  league: string;
  country: string;
  flagEmoji: string;
  masterStriker: string;
  keyRivalsOrAllies: string[];
  philosophy: string;
  interestScore: number; // 0-100% de interesse no jogador
  interestLevel: "Muito Alto" | "Alto" | "Médio" | "Baixo";
  interestReason: string;
  bidYen: number; // Salário anual oferecido em Ienes (¥)
  weeklySalaryYen: number;
  signingBonusYen: number;
  contractYears: number;
  promisedRole: string;
  tacticalFitNotes: string;
  badgeColor: string;
  accentColor: string;
  status: "pending" | "accepted" | "rejected";
  receivedDate: string;
}

export interface CharacterMemory {
  id: string;
  characterName: string;
  event: string;
  timestamp: string;
  importance: "baixa" | "média" | "alta" | "decisiva";
}

export interface CharacterRelationship {
  characterName: string;
  role: string;
  avatarColor: string;
  trust: number;       // Confiança (0-100)
  respect: number;     // Respeito (0-100)
  rivalry: number;     // Rivalidade (0-100)
  chemistry: number;   // Sinergia / Química (0-100)
  status: string;      // ex: "Irmão", "Rival Direto", "Aliado Estratégico", "Morno"
  lastInteraction?: string;
}

export interface StoryChapter {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  opponents: string[];
  keyCharacters: string[];
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface PitchState {
  ballPossessor: string;
  attackingTeam?: "playerTeam" | "opponentTeam" | string;
  zone: "defense" | "midfield" | "attack" | "box";
  description: string;
  ballCoords?: { x: number; y: number }; // percentage 0-100
  playerCoords?: { x: number; y: number };
  dangerLevel?: "low" | "medium" | "high" | "critical";
}

export interface InMatchChatMessage {
  id: string;
  minute: number;
  sender: string;
  role: "player" | "teammate" | "rival" | "coach";
  avatarColor?: string;
  content: string;
  tacticalEffect?: string;
  timestamp: string;
}

export interface MatchTurnLog {
  minute: number;
  narrative: string;
  playerAction: string;
  actionResult: "success" | "partial" | "failed" | "neutral";
  eventBadge?: "goal" | "opponent_goal" | "foul" | "yellow_card" | "red_card" | "clash" | "save" | "rivalry" | "normal";
  goalScored?: {
    scorer: string;
    assistant?: string;
    team: "playerTeam" | "opponentTeam";
    teamName?: string;
  };
  foulDetail?: {
    committedBy: string;
    victim: string;
    card?: "yellow" | "red" | "none";
    isPenalty?: boolean;
    description?: string;
  };
  clashDetail?: {
    protagonist: string;
    rival: string;
    intensity: "heated" | "brawl" | "verbal";
    clashReason: string;
  };
  speakerComment?: {
    speaker: string;
    quote: string;
  };
}

export interface ActiveMatch {
  id: string;
  title: string;
  stage: string;
  playerTeam: string;
  opponentTeam: string;
  keyOpponents?: string[];
  currentMinute: number;
  score: {
    playerTeam: number;
    opponentTeam: number;
  };
  pitchState: PitchState;
  logs: MatchTurnLog[];
  inMatchChat?: InMatchChatMessage[];
  isFinished: boolean;
  matchTension?: "calm" | "tense" | "fierce" | "bloodbath";
  playerStatsInMatch: {
    goals: number;
    assists: number;
    shotsOnTarget: number;
    successfulDribbles: number;
    keyPasses: number;
    tackles: number;
    foulsCommitted?: number;
    foulsSuffered?: number;
    yellowCards?: number;
    redCards?: number;
    rating: number;
    currentStamina: number; // 0-100
  };
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  weapon: string;
  ovr: number;
  isUserPlayer?: boolean;
  avatarColor?: string;
  coords: { x: number; y: number }; // 0-100% position on pitch (x: left-right, y: top-bottom)
  roleNote?: string;
}

export interface TeamLineup {
  teamName: string;
  formation: string;
  tacticalStyle: string;
  coach: string;
  primaryColor: string;
  startingXI: LineupPlayer[];
  bench: { name: string; position: string; weapon: string; number: number }[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  senderName?: string;
  text: string;
  timestamp: string;
  scene?: string;
  speakers?: string[];
  expAwarded?: number;
  statNote?: string;
}
