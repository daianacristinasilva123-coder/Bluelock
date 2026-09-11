import { CharacterProfile, TransferOffer } from "../types";

export interface NELClubDefinition {
  id: string;
  name: string;
  league: string;
  country: string;
  flagEmoji: string;
  masterStriker: string;
  masterQuote: string;
  keyPlayers: string[];
  philosophy: string;
  primaryColor: string;
  badgeColor: string;
  favoredStats: string[];
  idealWeapons: string[];
  description: string;
}

export const NEL_CLUBS: NELClubDefinition[] = [
  {
    id: "bastard_munchen",
    name: "Bastard München",
    league: "Bundesliga",
    country: "Alemanha",
    flagEmoji: "🇩🇪",
    masterStriker: "Noel Noa",
    masterQuote: "O futebol é uma equação lógica. Não jogue com sentimentos, jogue com números e eficiência absoluta.",
    keyPlayers: ["Michael Kaiser", "Alexis Ness", "Yo Hiori", "Rensuke Kunigami", "Isagi Yoichi"],
    philosophy: "Racionalidade Lógica, Eficiência Métrica e Letalidade Cirúrgica",
    primaryColor: "#dc2626",
    badgeColor: "bg-red-950 border-red-600 text-red-300",
    favoredStats: ["finishing", "iq", "vision"],
    idealWeapons: ["Chute Direto", "Metavisão", "Finalização", "Leitura de Jogo", "Ambidesteridade"],
    description: "O maior clube da Alemanha, liderado pelo atacante número 1 do mundo, Noel Noa. Busca atacantes cerebrais e ultra-eficientes que consigam produzir números incontestáveis.",
  },
  {
    id: "pxg",
    name: "Paris X Gen (P.X.G)",
    league: "Ligue 1",
    country: "França",
    flagEmoji: "🇫🇷",
    masterStriker: "Julian Loki",
    masterQuote: "A juventude e a velocidade não esperam ninguém. Se você tem o talento bruto, nós temos o dinheiro para colocá-lo no topo do mundo.",
    keyPlayers: ["Itoshi Rin", "Ryusei Shidou", "Charles Chevalier", "Tabito Karasu", "Nijiro Nanase"],
    philosophy: "Velocidade Hiper-Sônica, Talento Jovem Bruto e Investimento Milionário",
    primaryColor: "#1e3a8a",
    badgeColor: "bg-blue-950 border-blue-600 text-blue-300",
    favoredStats: ["speed", "finishing", "dribble"],
    idealWeapons: ["Velocidade", "Aceleração", "Curva", "Instinto", "Explosão"],
    description: "O colosso financeiro da França sob comando do jovem prodígio Julian Loki. Atraem os maiores talentos brutos do planeta com ofertas salariais recordes.",
  },
  {
    id: "manshine_city",
    name: "Manshine City",
    league: "Premier League",
    country: "Inglaterra",
    flagEmoji: "🇬🇧",
    masterStriker: "Chris Prince",
    masterQuote: "O corpo humano é a máquina suprema. Descubra sua arma biológica única e torne seu físico incomparável!",
    keyPlayers: ["Seishiro Nagi", "Reo Mikage", "Hyoma Chigiri", "Agi"],
    philosophy: "Revolução Fisiológica, Potência Muscular e Ritmo Alucinante da Premier League",
    primaryColor: "#0284c7",
    badgeColor: "bg-sky-950 border-sky-500 text-sky-300",
    favoredStats: ["speed", "strength", "stamina"],
    idealWeapons: ["Velocidade Relâmpago", "Trap Aéreo", "Potência Física", "Aceleração", "Resistência"],
    description: "A potência inglesa dirigida pelo carismático Chris Prince. O foco do clube é o desenvolvimento da anatomia ideal do jogador para dominar o futebol mais veloz do mundo.",
  },
  {
    id: "ubers",
    name: "Ubers",
    league: "Serie A",
    country: "Itália",
    flagEmoji: "🇮🇹",
    masterStriker: "Marc Snuffy",
    masterQuote: "O futebol é uma profissão. Se você seguir a estratégia esquematizada como uma engrenagem precisa, a vitória é garantida.",
    keyPlayers: ["Barou Shoei", "Oliver Aiku", "Ikki Niko", "Jyubei Aryu", "Don Lorenzo"],
    philosophy: "Tática Militar Esquematizada, Defesa de Elite e Contra-Golpes Clínicos",
    primaryColor: "#52525b",
    badgeColor: "bg-zinc-900 border-zinc-600 text-zinc-300",
    favoredStats: ["strength", "iq", "stamina", "vision"],
    idealWeapons: ["Força Física", "Chop Dribble", "Marcação", "Posicionamento", "Cabeceio"],
    description: "A muralha tática italiana de Marc Snuffy. O clube valoriza jogadores disciplinados que respeitam o plano de jogo e se tornam armas letais nos pontos fracos do adversário.",
  },
  {
    id: "fc_barcha",
    name: "F.C. Barcha",
    league: "La Liga",
    country: "Espanha",
    flagEmoji: "🇪🇸",
    masterStriker: "Lavinho",
    masterQuote: "Não siga regras tediosas! Deixe o monstro interior dançar e expresse quem você é através do drible e da alegria!",
    keyPlayers: ["Meguru Bachira", "Eita Otoya", "Ignacio Lara"],
    philosophy: "Liberdade Criativa, Ginga, Drible Individualista e Improvisação Artística",
    primaryColor: "#b91c1c",
    badgeColor: "bg-amber-950 border-amber-600 text-amber-300",
    favoredStats: ["dribble", "ballControl", "speed"],
    idealWeapons: ["Drible", "Ginga", "Elastic Dribble", "Controle de Bola", "Finta"],
    description: "A meca da criatividade espanhola sob o comando do 'Dançarino' Lavinho. Procuram jogadores mágicos com controle de bola excepcional e capacidade de inventar gols do nada.",
  },
  {
    id: "real_madrid",
    name: "Real Madrid (Royale)",
    league: "La Liga",
    country: "Espanha",
    flagEmoji: "🇪🇸",
    masterStriker: "Leonardo Luna",
    masterQuote: "No maior clube da história, a mediocridade é proibida. Aqui só sobrevivem os verdadeiros reis da Europa.",
    keyPlayers: ["Sae Itoshi", "Leonardo Luna"],
    philosophy: "Realeza Mundial, Glória Galáctica e Prestígio Soberano",
    primaryColor: "#eab308",
    badgeColor: "bg-yellow-950 border-yellow-500 text-yellow-300",
    favoredStats: ["finishing", "vision", "iq", "dribble"],
    idealWeapons: ["Passe de Classe Mundial", "Trivela", "Faro de Gol", "Precisão"],
    description: "Os Reis da Europa. Apenas os jogadores com aura incontestável de craque mundial recebem propostas da diretoria merengue.",
  },
];

// Leaderboard canônico da Neo Egoist League
export interface NELBidLeaderboardEntry {
  rank: number;
  playerName: string;
  club: string;
  countryFlag: string;
  bidYen: number;
  bidFormatted: string;
  weapon: string;
  isProtagonist?: boolean;
}

export const CANONICAL_NEL_LEADERBOARD: NELBidLeaderboardEntry[] = [
  { rank: 1, playerName: "Michael Kaiser", club: "Real Madrid / Bastard", countryFlag: "🇩🇪", bidYen: 320000000, bidFormatted: "¥320.000.000", weapon: "Kaiser Impact" },
  { rank: 2, playerName: "Itoshi Rin", club: "Paris X Gen", countryFlag: "🇫🇷", bidYen: 198000000, bidFormatted: "¥198.000.000", weapon: "Marionetista & Berserk" },
  { rank: 3, playerName: "Barou Shoei", club: "Ubers", countryFlag: "🇮🇹", bidYen: 150000000, bidFormatted: "¥150.000.000", weapon: "Predator Eye & Chop Dribble" },
  { rank: 4, playerName: "Isagi Yoichi", club: "Bastard München", countryFlag: "🇩🇪", bidYen: 150000000, bidFormatted: "¥150.000.000", weapon: "Metavisão & Direct Shot Canhoto" },
  { rank: 5, playerName: "Ryusei Shidou", club: "Paris X Gen", countryFlag: "🇫🇷", bidYen: 100000000, bidFormatted: "¥100.000.000", weapon: "Gol Acrobático Extremo" },
  { rank: 6, playerName: "Seishiro Nagi", club: "Manshine City", countryFlag: "🇬🇧", bidYen: 88000000, bidFormatted: "¥88.000.000", weapon: "Domínio de Gravidade Zero" },
  { rank: 7, playerName: "Meguru Bachira", club: "F.C. Barcha", countryFlag: "🇪🇸", bidYen: 79000000, bidFormatted: "¥79.000.000", weapon: "Monstro Driblador" },
  { rank: 8, playerName: "Oliver Aiku", club: "Ubers", countryFlag: "🇮🇹", bidYen: 60000000, bidFormatted: "¥60.000.000", weapon: "Muralha & Visão Total" },
  { rank: 9, playerName: "Hyoma Chigiri", club: "Manshine City", countryFlag: "🇬🇧", bidYen: 55000000, bidFormatted: "¥55.000.000", weapon: "44-Panther Snipe (Velocidade)" },
  { rank: 10, playerName: "Rensuke Kunigami", club: "Bastard München", countryFlag: "🇩🇪", bidYen: 50000000, bidFormatted: "¥50.000.000", weapon: "Canhoto Brutal de Longa Distância" },
  { rank: 11, playerName: "Reo Mikage", club: "Manshine City", countryFlag: "🇬🇧", bidYen: 40000000, bidFormatted: "¥40.000.000", weapon: "Camaleão Metaview (Cópia)" },
  { rank: 12, playerName: "Ikki Niko", club: "Ubers", countryFlag: "🇮🇹", bidYen: 30000000, bidFormatted: "¥30.000.000", weapon: "Metavisão Defensiva" },
];

// Gera as propostas de transferência calculadas dinamicamente com base no perfil do jogador
export function generateClubTransferOffers(
  character: CharacterProfile,
  recentGoals = 0,
  recentRating = 7.5
): TransferOffer[] {
  const stats = character.stats;
  const weaponLower = (character.mainWeapon || "").toLowerCase();
  const playstyleLower = (character.playstyle || "").toLowerCase();
  const position = character.position;

  // Calcula afinidade com cada clube
  const offers: TransferOffer[] = NEL_CLUBS.map((club) => {
    let score = 50; // base score

    // Avalia atributos favorecidos pelo clube
    club.favoredStats.forEach((st) => {
      const val = (stats as any)[st] || 50;
      if (val >= 85) score += 14;
      else if (val >= 75) score += 9;
      else if (val >= 65) score += 4;
      else if (val < 55) score -= 5;
    });

    // Avalia arma e estilo de jogo
    club.idealWeapons.forEach((w) => {
      const wLower = w.toLowerCase();
      if (weaponLower.includes(wLower) || playstyleLower.includes(wLower)) {
        score += 15;
      }
    });

    // Bônus por posição compatível
    if (club.id === "bastard_munchen" && (position.includes("CF") || position.includes("ST") || position.includes("CAM"))) {
      score += 8;
    }
    if (club.id === "pxg" && (position.includes("LW") || position.includes("RW") || position.includes("CF"))) {
      score += 8;
    }
    if (club.id === "manshine_city" && (position.includes("ST") || position.includes("W") || position.includes("LM"))) {
      score += 8;
    }
    if (club.id === "ubers" && (position.includes("CB") || position.includes("DMF") || position.includes("CF"))) {
      score += 8;
    }
    if (club.id === "fc_barcha" && (position.includes("CAM") || position.includes("LW") || position.includes("RW"))) {
      score += 8;
    }

    // Bônus por nível e estatísticas gerais
    score += Math.min(20, Math.floor(character.level * 2));
    score += Math.min(15, Math.floor(recentGoals * 4));

    // Clamp score 0 - 100
    const interestScore = Math.max(35, Math.min(99, Math.round(score)));

    let interestLevel: "Muito Alto" | "Alto" | "Médio" | "Baixo" = "Baixo";
    if (interestScore >= 85) interestLevel = "Muito Alto";
    else if (interestScore >= 70) interestLevel = "Alto";
    else if (interestScore >= 55) interestLevel = "Médio";

    // Cálculo do valor do lance em Yen (¥)
    // Base de 25M a 280M de ienes
    const baseBidMultiplier = interestScore / 100;
    const levelBonus = character.level * 8000000;
    const goalsBonus = recentGoals * 15000000;
    const rawBid = Math.round(30000000 + baseBidMultiplier * 140000000 + levelBonus + goalsBonus);
    // Arredondar para o milhão mais próximo
    const bidYen = Math.round(rawBid / 1000000) * 1000000;
    const weeklySalaryYen = Math.round(bidYen / 52);
    const signingBonusYen = Math.round(bidYen * 0.15);
    const contractYears = interestScore > 85 ? 4 : interestScore > 65 ? 3 : 2;

    // Função prometida
    let promisedRole = "Atacante de Rotação Titular";
    if (interestScore >= 88) {
      promisedRole = `Centroavante Titular Absoluto (${club.philosophy.split(",")[0]})`;
    } else if (interestScore >= 75) {
      promisedRole = `Peça Ofensiva Central / Camisa 9`;
    } else if (interestScore >= 60) {
      promisedRole = "Ponta Infiltrador / Coringa Ofensivo";
    }

    // Parecer do scout / Master Striker
    let interestReason = "";
    if (club.id === "bastard_munchen") {
      interestReason = `Noel Noa analisou suas estatísticas: "Sua arma (${character.mainWeapon}) produz eficiência letal imediata. No Bastard, você jogará dentro do nosso sistema de dados objetivos e disputará a artilharia da Europa."`;
    } else if (club.id === "pxg") {
      interestReason = `Julian Loki e a comissão técnica do P.X.G avaliam: "Sua explosão e instinto ofensivo são perfeitos para o nosso futebol de velocidade pura. Preparamos um contrato milionário com garantia de vitrine mundial."`;
    } else if (club.id === "manshine_city") {
      interestReason = `Chris Prince declarou: "Seu potencial físico é extraordinário! Com o meu treinamento no Manshine City, vamos moldar sua musculatura e aceleração para atropelar os zagueiros da Premier League."`;
    } else if (club.id === "ubers") {
      interestReason = `Marc Snuffy e o centro tático do Ubers relatam: "Você possui a inteligência e o combate físico que nosso esquema exige. No Ubers, você será uma engrenagem que decide jogos em contra-ataques cirúrgicos."`;
    } else if (club.id === "fc_barcha") {
      interestReason = `Lavinho ficou encantado: "Esse garoto tem fome e ousadia com a bola no pé! No Barcha ele terá total liberdade para driblar, criar caos na área e fazer o público aplaudir de pé!"`;
    } else {
      interestReason = `O departamento de futebol do Real Madrid colocou seu nome no radar dos Galácticos: "O prestígio do Santiago Bernabéu exige egoístas que decidam partidas sob pressão máxima."`;
    }

    const isCurrentClub = character.currentClub === club.name;

    return {
      id: `offer_${club.id}_${Date.now()}`,
      clubName: club.name,
      league: `${club.league} (${club.country})`,
      country: club.country,
      flagEmoji: club.flagEmoji,
      masterStriker: club.masterStriker,
      keyRivalsOrAllies: club.keyPlayers,
      philosophy: club.philosophy,
      interestScore,
      interestLevel,
      interestReason,
      bidYen,
      weeklySalaryYen,
      signingBonusYen,
      contractYears,
      promisedRole,
      tacticalFitNotes: `Clube que busca jogadores com foco em ${club.favoredStats.join(", ")}.`,
      badgeColor: club.badgeColor,
      accentColor: club.primaryColor,
      status: isCurrentClub ? "accepted" : "pending",
      receivedDate: "Neo Egoist League - Janela de Lances Aberta",
    };
  });

  // Ordenar por interesse decrescente (os times com MAIS interesse em você ficam no topo!)
  offers.sort((a, b) => b.interestScore - a.interestScore);

  return offers;
}
