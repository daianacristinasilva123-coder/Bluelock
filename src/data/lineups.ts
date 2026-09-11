import { CharacterProfile, TeamLineup, LineupPlayer } from "../types";

// Helper to calculate overall rating for user player
export function calculatePlayerOvr(character: CharacterProfile): number {
  const stats = character.stats;
  const avg =
    (stats.speed +
      stats.strength +
      stats.finishing +
      stats.dribble +
      stats.ballControl +
      stats.vision +
      stats.iq +
      stats.stamina) /
    8;
  return Math.min(99, Math.max(50, Math.round(avg)));
}

// Generate match lineups based on playerTeam and opponentTeam
export function getMatchLineups(
  playerTeamName: string,
  opponentTeamName: string,
  character: CharacterProfile
): { playerLineup: TeamLineup; opponentLineup: TeamLineup } {
  const userOvr = calculatePlayerOvr(character);

  // Default player pin for the user
  const userPlayerPin: LineupPlayer = {
    id: "user_player",
    name: `${character.name} (VOCÊ)`,
    number: 9,
    position: character.position || "ST",
    weapon: character.mainWeapon,
    ovr: userOvr,
    isUserPlayer: true,
    avatarColor: "cyan",
    coords: { x: 50, y: 76 },
    roleNote: "Protagonista / Atacante de Impacto",
  };

  const pLower = playerTeamName.toLowerCase();
  const oLower = opponentTeamName.toLowerCase();

  // Helper builder for Canonical Anime Team Z
  const createCanonicalTeamZ = (customName?: string): TeamLineup => ({
    teamName: customName || "Time Z (Prédio 5)",
    formation: "4-3-3",
    tacticalStyle: "Operação 'Próximo Eu' & Choque de Egos",
    coach: "Jinpachi Ego",
    primaryColor: "cyan",
    startingXI: [
      {
        id: "z_gk",
        name: "Gin Gagamaru",
        number: 1,
        position: "GK",
        weapon: "Reflexos Felinos & Defesa de Escorpião",
        ovr: 78,
        coords: { x: 50, y: 92 },
        roleNote: "Goleiro Improvisado e Acrobático",
      },
      {
        id: "z_lb",
        name: "Hyoma Chigiri",
        number: 4,
        position: "LB",
        weapon: "Velocidade Relâmpago 44.88 km/h",
        ovr: 83,
        coords: { x: 18, y: 80 },
        roleNote: "A Pantera Rubra em Arrancada",
      },
      {
        id: "z_cb1",
        name: "Wataru Kuon",
        number: 3,
        position: "CB",
        weapon: "Salto Vertical & Cabeceio Aéreo",
        ovr: 74,
        coords: { x: 38, y: 82 },
        roleNote: "Estrategista de Bola Aérea",
      },
      {
        id: "z_cb2",
        name: "Okuhito Iemon",
        number: 6,
        position: "CB",
        weapon: "Comunicação Defensiva & Liderança",
        ovr: 71,
        coords: { x: 62, y: 82 },
        roleNote: "Voz do Vestiário",
      },
      {
        id: "z_rb",
        name: "Yudai Imamura",
        number: 7,
        position: "RB",
        weapon: "Agilidade Curta & Velocidade Lateral",
        ovr: 72,
        coords: { x: 82, y: 80 },
        roleNote: "Apoio de Linha de Fundo",
      },
      {
        id: "z_dmf",
        name: "Jingo Raichi",
        number: 10,
        position: "DMF",
        weapon: "Marcação Sexy Incessante & Duelo Físico",
        ovr: 77,
        coords: { x: 50, y: 64 },
        roleNote: "Cão de Guarda Implacável",
      },
      {
        id: "z_cmf1",
        name: "Meguru Bachira",
        number: 8,
        position: "CMF",
        weapon: "Drible do Monstro & Passes Criativos",
        ovr: 84,
        coords: { x: 28, y: 52 },
        roleNote: "Criador Imprevisível",
      },
      {
        id: "z_cam",
        name: "Isagi Yoichi",
        number: 11,
        position: "CAM",
        weapon: "Olfato de Gol, Metavisão & Chute Direto",
        ovr: 82,
        coords: { x: 72, y: 52 },
        roleNote: "Cérebro Ofensivo & Adaptação",
      },
      {
        id: "z_lw",
        name: "Rensuke Kunigami",
        number: 9,
        position: "LW",
        weapon: "Míssil de Canhota a 28 Metros",
        ovr: 82,
        coords: { x: 22, y: 32 },
        roleNote: "O Super-Herói da Bomba Canhota",
      },
      {
        id: "z_user",
        ...userPlayerPin,
        number: 13,
        coords: { x: 50, y: 28 },
      },
      {
        id: "z_rw",
        name: "Gurimu Igarashi",
        number: 12,
        position: "RW",
        weapon: "Malícia / Cavar Falta Tática Fake",
        ovr: 69,
        coords: { x: 78, y: 32 },
        roleNote: "Malandragem do Monge",
      },
    ],
    bench: [
      { name: "Asahi Naruhaya", position: "ST", weapon: "Infiltração no Ponto Cego", number: 5 },
    ],
  });

  // =========================================================================
  // 1. CAPÍTULO 1: TESTE DO ONIGOKKO (Quarto 300 / Eliminação de Ryosuke Kira)
  // =========================================================================
  if (oLower.includes("onigokko") || oLower.includes("eliminação") || oLower.includes("kira") || (pLower.includes("time z") && oLower.includes("bloco"))) {
    const playerLineup: TeamLineup = {
      teamName: "Time Z (Aliança de Sobrevivência)",
      formation: "Sala 300 (136 Segundos)",
      tacticalStyle: "Fuga do Toque & Troca de Passes no Desespero",
      coach: "Jinpachi Ego",
      primaryColor: "cyan",
      startingXI: [
        {
          id: "oni_isagi",
          name: "Isagi Yoichi",
          number: 11,
          position: "CAM",
          weapon: "Visão Periférica sob Pânico",
          ovr: 78,
          coords: { x: 30, y: 65 },
          roleNote: "Despertando o Instinto",
        },
        {
          id: "oni_bachira",
          name: "Meguru Bachira",
          number: 8,
          position: "ST",
          weapon: "Drible Brincalhão com a Bola do Pega-Pega",
          ovr: 83,
          coords: { x: 50, y: 45 },
          roleNote: "O Monstro Acordado",
        },
        {
          id: "oni_user",
          ...userPlayerPin,
          coords: { x: 70, y: 65 },
        },
      ],
      bench: [
        { name: "Kunigami Rensuke", position: "FW", weapon: "Físico e Postura Firme", number: 9 },
        { name: "Hyoma Chigiri", position: "FW", weapon: "Observação Silenciosa", number: 4 },
        { name: "Jingo Raichi", position: "FW", weapon: "Raiva e Gritos Furiosos", number: 10 },
      ],
    };

    const opponentLineup: TeamLineup = {
      teamName: "Alvo da Sala 300 (Ryosuke Kira)",
      formation: "Defesa sob Pânico",
      tacticalStyle: "Fuga Desesperada & Preservação da Carreira",
      coach: "Jinpachi Ego",
      primaryColor: "rose",
      startingXI: [
        {
          id: "oni_kira",
          name: "Ryosuke Kira",
          number: 1,
          position: "ST",
          weapon: "A Joia Nacional / Domínio Refinado",
          ovr: 82,
          coords: { x: 50, y: 70 },
          roleNote: "Alvo Principal do Relógio",
        },
        {
          id: "oni_igaguri",
          name: "Gurimu Igarashi",
          number: 12,
          position: "MF",
          weapon: "Pânico Puro & Fuga aos Prantos",
          ovr: 66,
          coords: { x: 30, y: 35 },
          roleNote: "Com a Bola no Início",
        },
        {
          id: "oni_kuon",
          name: "Wataru Kuon",
          number: 3,
          position: "DF",
          weapon: "Tentativa de Apaziguar o Grupo",
          ovr: 72,
          coords: { x: 70, y: 35 },
        },
      ],
      bench: [],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 2. CAPÍTULO 2: TIME Z vs TIME X (O Despertar do Rei Barou Shouei)
  // =========================================================================
  if (oLower.includes("time x") || oLower.includes("barou")) {
    const playerLineup = createCanonicalTeamZ("Time Z (vs Time X)");

    const opponentLineup: TeamLineup = {
      teamName: "Time X (Liderado pelo Rei Barou)",
      formation: "4-3-3",
      tacticalStyle: "Monarquia Absoluta & Chutes Devastadores",
      coach: "Jinpachi Ego",
      primaryColor: "rose",
      startingXI: [
        {
          id: "x_gk",
          name: "Goleiro Time X",
          number: 1,
          position: "GK",
          weapon: "Defesa Tradicional",
          ovr: 72,
          coords: { x: 50, y: 10 },
        },
        {
          id: "x_cb1",
          name: "Haidara",
          number: 4,
          position: "CB",
          weapon: "Força Física & Bloqueio",
          ovr: 74,
          coords: { x: 38, y: 22 },
        },
        {
          id: "x_cb2",
          name: "Zagueiro X-2",
          number: 3,
          position: "CB",
          weapon: "Corte Rasteiro",
          ovr: 71,
          coords: { x: 62, y: 22 },
        },
        {
          id: "x_lb",
          name: "Lateral X-Esq",
          number: 2,
          position: "LB",
          weapon: "Apoio ao Barou",
          ovr: 70,
          coords: { x: 18, y: 24 },
        },
        {
          id: "x_rb",
          name: "Lateral X-Dir",
          number: 5,
          position: "RB",
          weapon: "Marcação",
          ovr: 70,
          coords: { x: 82, y: 24 },
        },
        {
          id: "x_dmf",
          name: "Servo da Meia X",
          number: 6,
          position: "DMF",
          weapon: "Passe Rápido para o Rei",
          ovr: 73,
          coords: { x: 50, y: 38 },
        },
        {
          id: "x_cmf1",
          name: "Meia Central X",
          number: 8,
          position: "CMF",
          weapon: "Distribuição",
          ovr: 72,
          coords: { x: 30, y: 48 },
        },
        {
          id: "x_cmf2",
          name: "Meia Armador X",
          number: 7,
          position: "CMF",
          weapon: "Alimentar o Ataque",
          ovr: 72,
          coords: { x: 70, y: 48 },
        },
        {
          id: "x_lw",
          name: "Ponta Suporte X",
          number: 11,
          position: "LW",
          weapon: "Abertura de Espaço",
          ovr: 74,
          coords: { x: 22, y: 68 },
        },
        {
          id: "x_barou",
          name: "Barou Shoei",
          number: 10,
          position: "ST",
          weapon: "Chop Dribble, Físico Brutal & Chute a 29m",
          ovr: 88,
          coords: { x: 50, y: 72 },
          roleNote: "O Rei dos Vilões",
        },
        {
          id: "x_rw",
          name: "Ponta Direita X",
          number: 9,
          position: "RW",
          weapon: "Passe Cruzado",
          ovr: 73,
          coords: { x: 78, y: 68 },
        },
      ],
      bench: [{ name: "Reserva Time X", position: "FW", weapon: "Velocidade", number: 12 }],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 3. CAPÍTULO 3: TIME Z vs TIME Y (A Estratégia de Niko & Okawa)
  // =========================================================================
  if (oLower.includes("time y") || oLower.includes("niko") || oLower.includes("okawa")) {
    const playerLineup = createCanonicalTeamZ("Time Z (vs Time Y)");

    const opponentLineup: TeamLineup = {
      teamName: "Time Y (Retranca & Contra-Ataque)",
      formation: "5-4-1 Retranca de Ferro",
      tacticalStyle: "Linha Baixa & Passe Longo no Ponto Cego",
      coach: "Jinpachi Ego",
      primaryColor: "indigo",
      startingXI: [
        {
          id: "y_gk",
          name: "Goleiro Time Y",
          number: 1,
          position: "GK",
          weapon: "Defesa Segura",
          ovr: 75,
          coords: { x: 50, y: 10 },
        },
        {
          id: "y_cb1",
          name: "Zagueiro Y-1",
          number: 2,
          position: "CB",
          weapon: "Trava de Carrinho",
          ovr: 76,
          coords: { x: 30, y: 22 },
        },
        {
          id: "y_niko",
          name: "Ikki Niko",
          number: 9,
          position: "CB",
          weapon: "Visão Espacial Analítica & Desarme no Ponto Cego",
          ovr: 84,
          coords: { x: 50, y: 24 },
          roleNote: "O Estrategista das Sombras",
        },
        {
          id: "y_cb2",
          name: "Zagueiro Y-2",
          number: 4,
          position: "CB",
          weapon: "Bloqueio Aéreo",
          ovr: 75,
          coords: { x: 70, y: 22 },
        },
        {
          id: "y_lb",
          name: "Lateral Y-Esq",
          number: 3,
          position: "LB",
          weapon: "Fechamento de Linha",
          ovr: 73,
          coords: { x: 16, y: 25 },
        },
        {
          id: "y_rb",
          name: "Lateral Y-Dir",
          number: 5,
          position: "RB",
          weapon: "Cobertura Rápida",
          ovr: 73,
          coords: { x: 84, y: 25 },
        },
        {
          id: "y_dmf1",
          name: "Volante Y-1",
          number: 6,
          position: "DMF",
          weapon: "Pressão de Meio",
          ovr: 74,
          coords: { x: 38, y: 40 },
        },
        {
          id: "y_dmf2",
          name: "Volante Y-2",
          number: 7,
          position: "DMF",
          weapon: "Rebatida",
          ovr: 74,
          coords: { x: 62, y: 40 },
        },
        {
          id: "y_lm",
          name: "Meia Esquerda Y",
          number: 8,
          position: "LM",
          weapon: "Aceleração em Contra-Ataque",
          ovr: 75,
          coords: { x: 22, y: 52 },
        },
        {
          id: "y_rm",
          name: "Meia Direita Y",
          number: 10,
          position: "RM",
          weapon: "Passe em Profundidade",
          ovr: 76,
          coords: { x: 78, y: 52 },
        },
        {
          id: "y_okawa",
          name: "Hibiki Okawa",
          number: 11,
          position: "ST",
          weapon: "Artilheiro de Kumamoto & Finalização Rápida",
          ovr: 83,
          coords: { x: 50, y: 74 },
          roleNote: "Arma Letal do Contra-Golpe",
        },
      ],
      bench: [{ name: "Reserva Time Y", position: "DF", weapon: "Físico", number: 13 }],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 4. CAPÍTULO 4: TIME Z vs TIME W (Gêmeos Wanima & Traição de Kuon)
  // =========================================================================
  if (oLower.includes("time w") || oLower.includes("wanima")) {
    const playerLineup = createCanonicalTeamZ("Time Z (vs Time W)");

    const opponentLineup: TeamLineup = {
      teamName: "Time W (Gêmeos Wanima & Aliança Traiçoeira)",
      formation: "4-4-2 Telepático",
      tacticalStyle: "Sincronia Suja & Exploração do Joelho de Chigiri",
      coach: "Jinpachi Ego",
      primaryColor: "lime",
      startingXI: [
        {
          id: "w_gk",
          name: "Goleiro Time W",
          number: 1,
          position: "GK",
          weapon: "Reflexos",
          ovr: 74,
          coords: { x: 50, y: 10 },
        },
        {
          id: "w_lb",
          name: "Lateral W-1",
          number: 2,
          position: "LB",
          weapon: "Marcação Rígida",
          ovr: 72,
          coords: { x: 18, y: 22 },
        },
        {
          id: "w_cb1",
          name: "Zagueiro W-1",
          number: 3,
          position: "CB",
          weapon: "Corte Físico",
          ovr: 73,
          coords: { x: 38, y: 24 },
        },
        {
          id: "w_cb2",
          name: "Zagueiro W-2",
          number: 4,
          position: "CB",
          weapon: "Combate Aéreo",
          ovr: 73,
          coords: { x: 62, y: 24 },
        },
        {
          id: "w_rb",
          name: "Lateral W-2",
          number: 5,
          position: "RB",
          weapon: "Pressão",
          ovr: 72,
          coords: { x: 82, y: 22 },
        },
        {
          id: "w_dmf",
          name: "Volante Time W",
          number: 6,
          position: "DMF",
          weapon: "Desarme Sujo",
          ovr: 75,
          coords: { x: 50, y: 38 },
        },
        {
          id: "w_lm",
          name: "Meia Esquerda W",
          number: 7,
          position: "LM",
          weapon: "Tabela Rápida",
          ovr: 76,
          coords: { x: 25, y: 50 },
        },
        {
          id: "w_rm",
          name: "Meia Direita W",
          number: 8,
          position: "RM",
          weapon: "Cruzamento no Ponto Fraco",
          ovr: 76,
          coords: { x: 75, y: 50 },
        },
        {
          id: "w_keisuke",
          name: "Keisuke Wanima",
          number: 9,
          position: "ST",
          weapon: "Sincronia Telepática de Gêmeos & Jogo Psicológico",
          ovr: 84,
          coords: { x: 35, y: 72 },
          roleNote: "Gêmeo Provocador",
        },
        {
          id: "w_junichi",
          name: "Junichi Wanima",
          number: 10,
          position: "ST",
          weapon: "Olhar Assassino & Finalização em Dobradinha",
          ovr: 84,
          coords: { x: 65, y: 72 },
          roleNote: "Gêmeo da Finalização",
        },
        {
          id: "w_kuon_traitor",
          name: "Wataru Kuon (Aliado Secreto)",
          number: 11,
          position: "CAM",
          weapon: "Venda de Táticas Secretas do Time Z",
          ovr: 74,
          coords: { x: 50, y: 58 },
          roleNote: "O Traidor em Campo",
        },
      ],
      bench: [{ name: "Reserva Time W", position: "FW", weapon: "Agilidade", number: 12 }],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 5. CAPÍTULO 5: TIME Z vs TIME V (Seishiro Nagi, Mikage Reo & Zantetsu)
  // =========================================================================
  if (oLower.includes("time v") || oLower.includes("zantetsu") || (pLower.includes("time z") && oLower.includes("nagi"))) {
    const playerLineup = createCanonicalTeamZ("Time Z (Batalha Final Prédio 5)");

    const opponentLineup: TeamLineup = {
      teamName: "Time V (Os Invictos do Prédio 5)",
      formation: "4-3-3 Ofensivo Moderno",
      tacticalStyle: "Aceleração Relâmpago & Domínio de Gravidade Zero",
      coach: "Jinpachi Ego",
      primaryColor: "purple",
      startingXI: [
        {
          id: "v_gk",
          name: "Goleiro Time V",
          number: 1,
          position: "GK",
          weapon: "Defesa Sob Pressão",
          ovr: 76,
          coords: { x: 50, y: 10 },
        },
        {
          id: "v_cb1",
          name: "Zagueiro V-1",
          number: 2,
          position: "CB",
          weapon: "Força de Bloqueio",
          ovr: 76,
          coords: { x: 38, y: 22 },
        },
        {
          id: "v_cb2",
          name: "Zagueiro V-2",
          number: 3,
          position: "CB",
          weapon: "Corte Aéreo",
          ovr: 75,
          coords: { x: 62, y: 22 },
        },
        {
          id: "v_lb",
          name: "Lateral V-Esq",
          number: 4,
          position: "LB",
          weapon: "Velocidade de Retorno",
          ovr: 74,
          coords: { x: 18, y: 24 },
        },
        {
          id: "v_rb",
          name: "Lateral V-Dir",
          number: 5,
          position: "RB",
          weapon: "Apoio ao Zantetsu",
          ovr: 74,
          coords: { x: 82, y: 24 },
        },
        {
          id: "v_dmf",
          name: "Volante Central V",
          number: 6,
          position: "DMF",
          weapon: "Combate Físico",
          ovr: 76,
          coords: { x: 50, y: 38 },
        },
        {
          id: "v_reo",
          name: "Mikage Reo",
          number: 9,
          position: "CAM",
          weapon: "O Camaleão / Cópia 99% & Passes Perfeitos",
          ovr: 87,
          coords: { x: 50, y: 52 },
          roleNote: "O Maestro do Time V",
        },
        {
          id: "v_zantetsu",
          name: "Tsurugi Zantetsu",
          number: 10,
          position: "RW",
          weapon: "Aceleração Explosiva nos Primeiros Passos & Chute Canhoto",
          ovr: 85,
          coords: { x: 78, y: 68 },
          roleNote: "A Ponta Bala",
        },
        {
          id: "v_nagi",
          name: "Nagi Seishiro",
          number: 11,
          position: "ST",
          weapon: "Domínio Absoluto / Black Hole Trap sem Gravidade",
          ovr: 90,
          coords: { x: 50, y: 72 },
          roleNote: "O Gênio Preguiçoso em Despertar",
        },
        {
          id: "v_lw",
          name: "Ponta Esquerda V",
          number: 7,
          position: "LW",
          weapon: "Infiltração Rápida",
          ovr: 77,
          coords: { x: 22, y: 68 },
        },
        {
          id: "v_cmf",
          name: "Meia Apoio V",
          number: 8,
          position: "CMF",
          weapon: "Transição Rápida",
          ovr: 76,
          coords: { x: 32, y: 48 },
        },
      ],
      bench: [{ name: "Reserva Time V", position: "FW", weapon: "Agilidade", number: 14 }],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 6. CAPÍTULO 6: SEGUNDA SELEÇÃO - DUELO 3v3 CONTRA O TOP 3 (Itoshi Rin)
  // =========================================================================
  if (oLower.includes("top 3") || (pLower.includes("trio") && oLower.includes("rin"))) {
    const playerLineup: TeamLineup = {
      teamName: "Trio do Time Z (Desafio ao Top 3)",
      formation: "3v3 Dinâmico",
      tacticalStyle: "Triangulação Rápida & Chute Direto",
      coach: "Jinpachi Ego",
      primaryColor: "cyan",
      startingXI: [
        {
          id: "t_isagi",
          name: "Isagi Yoichi",
          number: 11,
          position: "CAM",
          weapon: "Metavisão Inicial & Chute Direto",
          ovr: 85,
          coords: { x: 28, y: 62 },
          roleNote: "Leitor de Espaço",
        },
        {
          id: "t_bachira",
          name: "Meguru Bachira",
          number: 8,
          position: "CMF",
          weapon: "Drible de Quebra de Ritmo & Passe do Monstro",
          ovr: 86,
          coords: { x: 72, y: 62 },
          roleNote: "O Driblador Nato",
        },
        {
          id: "t_user",
          ...userPlayerPin,
          coords: { x: 50, y: 36 },
        },
      ],
      bench: [],
    };

    const opponentLineup: TeamLineup = {
      teamName: "Top 3 de Blue Lock (Itoshi Rin, Aryu, Tokimitsu)",
      formation: "3v3 Imperial",
      tacticalStyle: "Destruição Perfeita, Glamour Aéreo & Força Ilimitada",
      coach: "Jinpachi Ego",
      primaryColor: "emerald",
      startingXI: [
        {
          id: "rin_lead",
          name: "Itoshi Rin",
          number: 1,
          position: "ST",
          weapon: "Tiro Curvo Perfeito & Marionetista do Campo",
          ovr: 94,
          coords: { x: 50, y: 65 },
          roleNote: "Número 1 Absoluto de Blue Lock",
        },
        {
          id: "aryu_glam",
          name: "Jyubei Aryu",
          number: 2,
          position: "CB",
          weapon: "Glamour / Alcance e Salto Aéreo Imenso",
          ovr: 86,
          coords: { x: 26, y: 40 },
          roleNote: "Muralha Aérea",
        },
        {
          id: "toki_muscle",
          name: "Aoshi Tokimitsu",
          number: 3,
          position: "DMF",
          weapon: "Músculos Inquebráveis & Pânico Físico Ilimitado",
          ovr: 85,
          coords: { x: 74, y: 40 },
          roleNote: "Motor Inesgotável",
        },
      ],
      bench: [],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 7. CAPÍTULO 7: SEGUNDA SELEÇÃO - DUELO 2v2 / 3v3 (Barou Shoei & Naruhaya)
  // =========================================================================
  if (oLower.includes("naruhaya") || (oLower.includes("dupla barou") || (pLower.includes("dupla") && oLower.includes("barou")))) {
    const playerLineup: TeamLineup = {
      teamName: "Dupla Isagi & Protagonista (2v2 da Sobrevivência)",
      formation: "2v2 no Limite do Abismo",
      tacticalStyle: "Metavisão, Devoração do Ponto Cego & Chute Rápido",
      coach: "Jinpachi Ego",
      primaryColor: "cyan",
      startingXI: [
        {
          id: "d_isagi",
          name: "Isagi Yoichi",
          number: 11,
          position: "CAM",
          weapon: "Metavisão Adaptativa & Chute Direto",
          ovr: 86,
          coords: { x: 35, y: 55 },
          roleNote: "Devorador Tático",
        },
        {
          id: "d_user",
          ...userPlayerPin,
          coords: { x: 65, y: 55 },
        },
      ],
      bench: [],
    };

    const opponentLineup: TeamLineup = {
      teamName: "Dupla Barou Shoei & Asahi Naruhaya",
      formation: "2v2 do Desespero",
      tacticalStyle: "Chop Dribble do Rei & Infiltração nas Costas",
      coach: "Jinpachi Ego",
      primaryColor: "red",
      startingXI: [
        {
          id: "d_barou",
          name: "Barou Shoei",
          number: 10,
          position: "ST",
          weapon: "O Rei dos Vilões / Chute Curvo a 29m & Raiva",
          ovr: 89,
          coords: { x: 60, y: 55 },
          roleNote: "O Rei Solitário",
        },
        {
          id: "d_naruhaya",
          name: "Asahi Naruhaya",
          number: 5,
          position: "ST",
          weapon: "Infiltração Relâmpago no Ponto Cego",
          ovr: 79,
          coords: { x: 30, y: 55 },
          roleNote: "Luta pelos Irmãos Menores",
        },
      ],
      bench: [],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 8. CAPÍTULO 8: SEGUNDA SELEÇÃO - A REVANCHE DO 4v4
  // =========================================================================
  if (oLower.includes("quarteto") || (oLower.includes("rin") && oLower.includes("bachira")) || pLower.includes("quarteto")) {
    const playerLineup: TeamLineup = {
      teamName: "Time Isagi, Nagi, Barou & Protagonista (4v4)",
      formation: "4v4 Batalha pelo Topo",
      tacticalStyle: "Egos Conflitantes, Trap Mágico & Devoração Mútua",
      coach: "Jinpachi Ego",
      primaryColor: "cyan",
      startingXI: [
        {
          id: "q_isagi",
          name: "Isagi Yoichi",
          number: 11,
          position: "CAM",
          weapon: "Metavisão Completa & Lendo o Ponto Cego",
          ovr: 88,
          coords: { x: 30, y: 65 },
          roleNote: "O Maestro do Caos",
        },
        {
          id: "q_nagi",
          name: "Nagi Seishiro",
          number: 7,
          position: "ST",
          weapon: "Black Hole Trap Giratório de Dois Estágios",
          ovr: 91,
          coords: { x: 70, y: 65 },
          roleNote: "O Gênio Desperto",
        },
        {
          id: "q_barou",
          name: "Barou Shoei",
          number: 13,
          position: "ST",
          weapon: "O Vilão das Sombras / Chop Dribble Implacável",
          ovr: 90,
          coords: { x: 25, y: 35 },
          roleNote: "O Rei que Caça Isagi",
        },
        {
          id: "q_user",
          ...userPlayerPin,
          coords: { x: 75, y: 35 },
        },
      ],
      bench: [
        { name: "Hyoma Chigiri", position: "FW", weapon: "Arrancada a 44.88 km/h", number: 4 },
      ],
    };

    const opponentLineup: TeamLineup = {
      teamName: "Time Rin, Bachira, Aryu & Tokimitsu",
      formation: "4v4 Imperial",
      tacticalStyle: "Marionetismo de Rin & Dança Livre do Monstro",
      coach: "Jinpachi Ego",
      primaryColor: "emerald",
      startingXI: [
        {
          id: "q_rin",
          name: "Itoshi Rin",
          number: 1,
          position: "ST",
          weapon: "Marionetista Absoluto & Curva Fatal na Bochecha da Rede",
          ovr: 95,
          coords: { x: 50, y: 70 },
          roleNote: "Líder e Monstro Supremo",
        },
        {
          id: "q_bachira",
          name: "Meguru Bachira",
          number: 8,
          position: "CMF",
          weapon: "Monstro Livre / Drible da Própria Imaginação",
          ovr: 89,
          coords: { x: 50, y: 48 },
          roleNote: "Futebol Solto e Sem Correntes",
        },
        {
          id: "q_aryu",
          name: "Jyubei Aryu",
          number: 2,
          position: "CB",
          weapon: "Alcance Aéreo Glamuroso",
          ovr: 87,
          coords: { x: 25, y: 30 },
        },
        {
          id: "q_toki",
          name: "Aoshi Tokimitsu",
          number: 3,
          position: "DMF",
          weapon: "Arrancada Muscular & Resistência Ilimitada",
          ovr: 86,
          coords: { x: 75, y: 30 },
        },
      ],
      bench: [],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 9. CAPÍTULO 9: BLUE LOCK 11 vs JAPÃO SUB-20
  // =========================================================================
  if (pLower.includes("blue lock 11") || oLower.includes("sub-20") || oLower.includes("sae") || oLower.includes("aiku")) {
    const playerLineup: TeamLineup = {
      teamName: "Blue Lock 11 (Titular)",
      formation: "4-3-3 Ultra-Ofensivo",
      tacticalStyle: "Caos Egoísta & Sobreposição Total",
      coach: "Jinpachi Ego",
      primaryColor: "cyan",
      startingXI: [
        {
          id: "bl11_gk",
          name: "Gin Gagamaru",
          number: 1,
          position: "GK",
          weapon: "Reflexos Sobre-Humanos de Escorpião",
          ovr: 86,
          coords: { x: 50, y: 92 },
          roleNote: "Goleiro Titular",
        },
        {
          id: "bl11_lb",
          name: "Hyoma Chigiri",
          number: 4,
          position: "LB",
          weapon: "Arrancada Pantera 44.88 km/h",
          ovr: 88,
          coords: { x: 18, y: 78 },
          roleNote: "Lateral Ofensivo",
        },
        {
          id: "bl11_cb1",
          name: "Jyubei Aryu",
          number: 2,
          position: "CB",
          weapon: "Alcance Aéreo Máximo & Glamour",
          ovr: 86,
          coords: { x: 38, y: 82 },
        },
        {
          id: "bl11_cb2",
          name: "Ikki Niko",
          number: 3,
          position: "CB",
          weapon: "Visão Espacial & Desarme Antecipado",
          ovr: 85,
          coords: { x: 62, y: 82 },
          roleNote: "Torre Tática",
        },
        {
          id: "bl11_rb",
          name: "Kenyu Yukimiya",
          number: 5,
          position: "RB",
          weapon: "Drible Rígido 1v1 & Giro Street",
          ovr: 87,
          coords: { x: 82, y: 78 },
        },
        {
          id: "bl11_dmf",
          name: "Tabito Karasu",
          number: 6,
          position: "DMF",
          weapon: "Fechamento de Linhas & Cérebro do Corvo",
          ovr: 88,
          coords: { x: 50, y: 64 },
          roleNote: "Capitão do Meio-Campo",
        },
        {
          id: "bl11_cmf",
          name: "Meguru Bachira",
          number: 8,
          position: "CMF",
          weapon: "Drible Ginga do Monstro & Cruzamento Teleguiado",
          ovr: 89,
          coords: { x: 30, y: 52 },
        },
        {
          id: "bl11_cam",
          name: "Isagi Yoichi",
          number: 11,
          position: "CAM",
          weapon: "Faro de Gols & Metavisão Espacial",
          ovr: 90,
          coords: { x: 70, y: 52 },
          roleNote: "Coração Tático",
        },
        {
          id: "bl11_lw",
          name: "Nagi Seishiro",
          number: 7,
          position: "LW",
          weapon: "Super Trap Giratório de 2 Estágios",
          ovr: 92,
          coords: { x: 22, y: 32 },
        },
        {
          id: "bl11_user",
          ...userPlayerPin,
          number: 9,
          coords: { x: 50, y: 26 },
        },
        {
          id: "bl11_rw",
          name: "Itoshi Rin",
          number: 10,
          position: "RW",
          weapon: "Chute Trivela Fatal & Controle Total",
          ovr: 95,
          coords: { x: 78, y: 32 },
          roleNote: "Ás da Seleção",
        },
      ],
      bench: [
        { name: "Shouei Barou", position: "ST", weapon: "Rei Vilão & Chute Curvo Letal", number: 13 },
        { name: "Reo Mikage", position: "MF", weapon: "Camaleão / Cópia 99%", number: 14 },
        { name: "Hiori Yo", position: "MF", weapon: "Passes Curvos com Reflexo Metaview", number: 16 },
      ],
    };

    const opponentLineup: TeamLineup = {
      teamName: "Japão Sub-20",
      formation: "4-1-4-1 Defesa de Ferro",
      tacticalStyle: "Contra-Ataque Rápido via Sae Itoshi",
      coach: "Comissão Técnica JFU",
      primaryColor: "indigo",
      startingXI: [
        {
          id: "u20_gk",
          name: "Gen Fukaku",
          number: 1,
          position: "GK",
          weapon: "Envergadura Nacional",
          ovr: 81,
          coords: { x: 50, y: 10 },
        },
        {
          id: "u20_lb",
          name: "Kento Chou",
          number: 5,
          position: "LB",
          weapon: "Altura 2 metros & Bloqueio Aéreo",
          ovr: 81,
          coords: { x: 18, y: 22 },
        },
        {
          id: "u20_cb1",
          name: "Oliver Aiku",
          number: 2,
          position: "CB",
          weapon: "Total Defense Metavision & Serpente da Área",
          ovr: 91,
          coords: { x: 38, y: 24 },
          roleNote: "Capitão & Zagueiro Imbatível",
        },
        {
          id: "u20_cb2",
          name: "Kazuma Niou",
          number: 4,
          position: "CB",
          weapon: "Força de Pressão Greco-Romana",
          ovr: 83,
          coords: { x: 62, y: 24 },
        },
        {
          id: "u20_rb",
          name: "Teppei Neru",
          number: 3,
          position: "RB",
          weapon: "Sprint Veloz e Desarme de Carrinho",
          ovr: 82,
          coords: { x: 82, y: 22 },
        },
        {
          id: "u20_dmf",
          name: "Teru Kitsunezuka",
          number: 6,
          position: "DMF",
          weapon: "Interceptação Tática",
          ovr: 80,
          coords: { x: 50, y: 38 },
        },
        {
          id: "u20_sae",
          name: "Sae Itoshi",
          number: 10,
          position: "CAM",
          weapon: "Gênio Mundial dos Passes / Visão Cirúrgica",
          ovr: 97,
          coords: { x: 50, y: 52 },
          roleNote: "Novo Geração 11 Mundial (Real Madrid)",
        },
        {
          id: "u20_lm",
          name: "Haruhiko Yuda",
          number: 7,
          position: "LM",
          weapon: "Velocidade de Linha de Fundo",
          ovr: 80,
          coords: { x: 22, y: 50 },
        },
        {
          id: "u20_rm",
          name: "Itsuki Wakatsuki",
          number: 8,
          position: "RM",
          weapon: "Cruzamentos Rápidos",
          ovr: 79,
          coords: { x: 78, y: 50 },
        },
        {
          id: "u20_cf",
          name: "Shuto Sendo",
          number: 9,
          position: "ST",
          weapon: "Finalização Oportunista do Japão",
          ovr: 82,
          coords: { x: 50, y: 72 },
        },
        {
          id: "u20_shidou",
          name: "Ryusei Shidou",
          number: 11,
          position: "ST",
          weapon: "Gol Impossível de Qualquer Ângulo / Modo Demônio",
          ovr: 94,
          coords: { x: 65, y: 72 },
          roleNote: "Arma Secreta de Sae",
        },
      ],
      bench: [{ name: "Koki Motoyama", position: "FW", weapon: "Pivô", number: 18 }],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // 10. CAPÍTULO 10: NEO EGOIST LEAGUE (Bastard München vs P.X.G)
  // =========================================================================
  if (pLower.includes("bastard") || oLower.includes("p.x.g") || oLower.includes("kaiser")) {
    const playerLineup: TeamLineup = {
      teamName: "Bastard München (Alemanha)",
      formation: "4-2-2-2 Racionalismo Puro",
      tacticalStyle: "Eficiência Lógica e Kaiser Impact",
      coach: "Noel Noa (Melhor do Mundo)",
      primaryColor: "rose",
      startingXI: [
        {
          id: "bm_gk",
          name: "Gin Gagamaru",
          number: 1,
          position: "GK",
          weapon: "Muralha Felina de Blue Lock",
          ovr: 88,
          coords: { x: 50, y: 92 },
        },
        {
          id: "bm_lb",
          name: "Kenyu Yukimiya",
          number: 5,
          position: "LB",
          weapon: "Drible de Espada da Paz & Corte",
          ovr: 88,
          coords: { x: 18, y: 80 },
        },
        {
          id: "bm_cb1",
          name: "Benedikt Grim",
          number: 4,
          position: "CB",
          weapon: "Bloqueio Físico Alemão",
          ovr: 84,
          coords: { x: 38, y: 82 },
        },
        {
          id: "bm_cb2",
          name: "Erik Gesner",
          number: 3,
          position: "CB",
          weapon: "Linha de Impedimento Cirúrgica",
          ovr: 83,
          coords: { x: 62, y: 82 },
        },
        {
          id: "bm_rb",
          name: "Ranze Kurona",
          number: 16,
          position: "RB",
          weapon: "Tabelas Rápidas e Órbita de Apoio",
          ovr: 85,
          coords: { x: 82, y: 80 },
          roleNote: "Planeta Satélite",
        },
        {
          id: "bm_dmf1",
          name: "Yo Hiori",
          number: 23,
          position: "DMF",
          weapon: "Metavisão Compartilhada & Passe Impossível",
          ovr: 90,
          coords: { x: 35, y: 64 },
          roleNote: "Maestro dos Passes",
        },
        {
          id: "bm_dmf2",
          name: "Jingo Raichi",
          number: 22,
          position: "DMF",
          weapon: "Duelo 1v1 Físico / Trava de Zaga",
          ovr: 85,
          coords: { x: 65, y: 64 },
        },
        {
          id: "bm_amf1",
          name: "Alexis Ness",
          number: 8,
          position: "AMF",
          weapon: "Magia dos Tornozelos Flexíveis",
          ovr: 90,
          coords: { x: 26, y: 48 },
          roleNote: "Fiel Escudeiro de Kaiser",
        },
        {
          id: "bm_amf2",
          name: "Isagi Yoichi",
          number: 11,
          position: "AMF",
          weapon: "Metavisão Total / Chute com os Dois Pés",
          ovr: 92,
          coords: { x: 74, y: 48 },
          roleNote: "O Novo Egoísta Central",
        },
        {
          id: "bm_kaiser",
          name: "Michael Kaiser",
          number: 10,
          position: "ST",
          weapon: "Kaiser Impact - O Chute Mais Veloz do Planeta",
          ovr: 97,
          coords: { x: 30, y: 26 },
          roleNote: "Craque da Nova Geração 11",
        },
        {
          id: "bm_user",
          ...userPlayerPin,
          number: 9,
          coords: { x: 70, y: 26 },
        },
      ],
      bench: [
        { name: "Rensuke Kunigami", position: "ST", weapon: "Cyborg Heroico do Wild Card", number: 50 },
        { name: "Noel Noa", position: "ST", weapon: "Melhor do Mundo / Máquina Perfeita", number: 9 },
      ],
    };

    const opponentLineup: TeamLineup = {
      teamName: "Paris X Gen (P.X.G - França)",
      formation: "4-3-3 Híbrido",
      tacticalStyle: "Velocidade da Luz e Destruição Dupla",
      coach: "Julian Loki (Deus da Velocidade)",
      primaryColor: "indigo",
      startingXI: [
        {
          id: "pxg_gk",
          name: "Goleiro P.X.G",
          number: 1,
          position: "GK",
          weapon: "Posicionamento Rápido",
          ovr: 83,
          coords: { x: 50, y: 10 },
        },
        {
          id: "pxg_lb",
          name: "Lateral Francês",
          number: 3,
          position: "LB",
          weapon: "Marcação Pressing",
          ovr: 83,
          coords: { x: 18, y: 22 },
        },
        {
          id: "pxg_cb1",
          name: "Zagueiro P.X.G 1",
          number: 4,
          position: "CB",
          weapon: "Desarme Limpo",
          ovr: 84,
          coords: { x: 38, y: 24 },
        },
        {
          id: "pxg_cb2",
          name: "Zagueiro P.X.G 2",
          number: 5,
          position: "CB",
          weapon: "Físico e Bola Alta",
          ovr: 83,
          coords: { x: 62, y: 24 },
        },
        {
          id: "pxg_rb",
          name: "Tsurugi Zantetsu",
          number: 11,
          position: "RB",
          weapon: "Arrancada Rápida e Fôlego",
          ovr: 86,
          coords: { x: 82, y: 22 },
        },
        {
          id: "pxg_dmf",
          name: "Tabito Karasu",
          number: 6,
          position: "DMF",
          weapon: "Braço de Ferro e Leitura de Ponto Fraco",
          ovr: 88,
          coords: { x: 50, y: 38 },
        },
        {
          id: "pxg_charles",
          name: "Charles Chevalier",
          number: 25,
          position: "CAM",
          weapon: "Passes Contrariando a Lógica / Visão Espontânea",
          ovr: 91,
          coords: { x: 50, y: 52 },
          roleNote: "Prodígio Indomável de 15 Anos",
        },
        {
          id: "pxg_cmf",
          name: "Nijiro Nanase",
          number: 7,
          position: "CMF",
          weapon: "Passe Ambivalente & Suporte ao Rin",
          ovr: 83,
          coords: { x: 28, y: 48 },
        },
        {
          id: "pxg_rin",
          name: "Itoshi Rin",
          number: 10,
          position: "LW",
          weapon: "Modo Berserk / Destruição Feia do Adversário",
          ovr: 96,
          coords: { x: 22, y: 72 },
          roleNote: "Ás Letal de P.X.G",
        },
        {
          id: "pxg_shidou",
          name: "Ryusei Shidou",
          number: 9,
          position: "ST",
          weapon: "Extinção Biológica / Gols Impossíveis na Área",
          ovr: 95,
          coords: { x: 78, y: 72 },
          roleNote: "Monstro Indomável",
        },
        {
          id: "pxg_loki",
          name: "Julian Loki",
          number: 17,
          position: "RW",
          weapon: "Velocidade Divina da Luz",
          ovr: 99,
          coords: { x: 50, y: 68 },
          roleNote: "Master Striker Francês",
        },
      ],
      bench: [{ name: "P.X.G Reserva 1", position: "MF", weapon: "Agilidade", number: 18 }],
    };

    return { playerLineup, opponentLineup };
  }

  // =========================================================================
  // FALLBACK GENÉRICO: TIME Z COM ELENCO DO ANIME
  // =========================================================================
  const fallbackPlayerLineup = createCanonicalTeamZ(playerTeamName);
  const fallbackOpponentLineup: TeamLineup = {
    teamName: opponentTeamName,
    formation: "4-3-3",
    tacticalStyle: "Contra-Ataque Rápido & Pressão Alta",
    coach: "Jinpachi Ego",
    primaryColor: "rose",
    startingXI: [
      {
        id: "gen_o_gk",
        name: "Goleiro Rival",
        number: 1,
        position: "GK",
        weapon: "Reflexos Rápidos",
        ovr: 80,
        coords: { x: 50, y: 10 },
      },
      {
        id: "gen_o_lb",
        name: "Lateral Esquerdo",
        number: 3,
        position: "LB",
        weapon: "Marcação Serrada",
        ovr: 81,
        coords: { x: 18, y: 22 },
      },
      {
        id: "gen_o_cb1",
        name: "Zagueiro Central 1",
        number: 4,
        position: "CB",
        weapon: "Força Física",
        ovr: 82,
        coords: { x: 38, y: 24 },
      },
      {
        id: "gen_o_cb2",
        name: "Zagueiro Central 2",
        number: 5,
        position: "CB",
        weapon: "Corte de Passes",
        ovr: 82,
        coords: { x: 62, y: 24 },
      },
      {
        id: "gen_o_rb",
        name: "Lateral Direito",
        number: 2,
        position: "RB",
        weapon: "Aceleração Lateral",
        ovr: 81,
        coords: { x: 82, y: 22 },
      },
      {
        id: "gen_o_dmf",
        name: "Volante Protetor",
        number: 6,
        position: "DMF",
        weapon: "Combate Central",
        ovr: 83,
        coords: { x: 50, y: 38 },
      },
      {
        id: "gen_o_cmf1",
        name: "Meia Armador",
        number: 8,
        position: "CMF",
        weapon: "Visão de Linha",
        ovr: 84,
        coords: { x: 32, y: 48 },
      },
      {
        id: "gen_o_cmf2",
        name: "Meia Ofensivo",
        number: 10,
        position: "CAM",
        weapon: "Passe em Profundidade",
        ovr: 85,
        coords: { x: 68, y: 48 },
      },
      {
        id: "gen_o_lw",
        name: "Ponta Esquerda",
        number: 7,
        position: "LW",
        weapon: "Drible Rápido",
        ovr: 84,
        coords: { x: 22, y: 70 },
      },
      {
        id: "gen_o_st",
        name: "Centroavante Artilheiro",
        number: 9,
        position: "ST",
        weapon: "Chute Mortal na Área",
        ovr: 87,
        coords: { x: 50, y: 72 },
        roleNote: "Artilheiro Rival",
      },
      {
        id: "gen_o_rw",
        name: "Ponta Direita",
        number: 11,
        position: "RW",
        weapon: "Infiltração em Velocidade",
        ovr: 85,
        coords: { x: 78, y: 70 },
      },
    ],
    bench: [
      { name: "Reserva Ofensivo", position: "FW", weapon: "Agilidade", number: 19 },
    ],
  };

  return { playerLineup: fallbackPlayerLineup, opponentLineup: fallbackOpponentLineup };
}
