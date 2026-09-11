import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Supported models with automatic failover in case of 503 high demand or quota limits
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];

async function generateContentWithFallback(options: {
  contents: any;
  config?: any;
}): Promise<string> {
  const ai = getAiClient();
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini API] Model "${model}" failed: ${err?.message || err}. Attempting fallback model...`);
      // Brief pause for 503 / 429 recovery
      if (err?.message?.includes("503") || err?.message?.includes("429") || err?.status === 503) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  }

  throw lastError || new Error("All candidate Gemini models failed to respond.");
}

function safeParseJson(rawText: string, fallbackObj: any): any {
  if (!rawText) return fallbackObj;
  try {
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("Failed to parse JSON output, applying fallback:", err);
    return fallbackObj;
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Alias for character generation typo /api/generat-charact
app.post("/api/generat-charact", async (req, res) => {
  req.url = "/api/generate-character-prologue";
  return app._router.handle(req, res);
});

app.get("/api/generat-charact", async (req, res) => {
  res.json({ status: "ok", message: "Use POST for character generation" });
});

// Favicon handlers to prevent 404
app.get("/api/favicon", (req, res) => {
  res.status(204).send();
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).send();
});

// Character prologue generator
app.post("/api/generate-character-prologue", async (req, res) => {
  const { character } = req.body;
  if (!character) {
    return res.status(400).json({ error: "Character data is required" });
  }

  const isNagi = character.relationshipWithCanon?.toLowerCase().includes("nagi");
  const isRin = character.relationshipWithCanon?.toLowerCase().includes("rin");
  const isBachira = character.relationshipWithCanon?.toLowerCase().includes("bachira");

  const defaultFallback = {
    prologueText: `Os portões metálicos do centro de treinamento de Blue Lock se fecham atrás de você com um silvo de alta pressão. O ar subterrâneo é denso, impregnado pelo aroma de grama sintética e ambição voraz.\n\n${character.name} avança pelo corredor iluminado por luzes azuis frias até alcançar o salão central. Trezentos dos melhores atacantes sub-18 do Japão se entreolham com olhares selvagens.\n\nDe repente, os telões suspensos no teto ganham vida. A silhueta esguia e os olhos esbugalhados de Jinpachi Ego encaram a multidão enquanto ele segura uma tigela fumegante de yakisoba.`,
    initialReactions: isNagi
      ? [
          {
            character: "Nagi Seishiro",
            dialogue: `Você realmente veio para o Blue Lock...? Que saco... agora vou ter que me esforçar de verdade pra você não passar vergonha.`,
          },
          {
            character: "Mikage Reo",
            dialogue: `Espera um segundo, Nagi... esse é o seu irmão?! Não sabia que o talento era de família. Vamos ver se você tem o mesmo brilho.`,
          },
          {
            character: "Jinpachi Ego",
            dialogue: `Bem-vindos, pedras brutas e sem talento. Das 300 jóias não lapidadas aqui reunidas, apenas o egoísta supremo sobreviverá para levar o Japão à Copa do Mundo.`,
          },
        ]
      : isRin
      ? [
          {
            character: "Itoshi Rin",
            dialogue: `Mais um obstáculo morno entrando no meu campo de visão. Se você tentar ficar entre mim e meu objetivo, vou te destruir sem piedade.`,
          },
          {
            character: "Jinpachi Ego",
            dialogue: `Bem-vindos ao necrotério do futebol coletivo tradicional. Sejam os atacantes mais egoístas do planeta ou apodreçam na mediocridade.`,
          },
        ]
      : isBachira
      ? [
          {
            character: "Bachira Meguru",
            dialogue: `Ei, ei! O monstro dentro de mim acabou de acordar olhando pra você! Quer dançar comigo no campo?`,
          },
          {
            character: "Jinpachi Ego",
            dialogue: `Bem-vindos, diamantes não polidos. Esqueçam o bom-mocismo. O futebol nasceu para atacantes que só pensam nos seus próprios gols.`,
          },
        ]
      : [
          {
            character: "Jinpachi Ego",
            dialogue: `Bem-vindos, diamantes não polidos. Das 300 jóias aqui reunidas, 299 terão suas carreiras destruídas. Apenas o egoísta supremo sairá daqui.`,
          },
          {
            character: "Isagi Yoichi",
            dialogue: `Trezentos atacantes... e apenas uma vaga de titular pro melhor do mundo?! O que é esse lugar?!`,
          },
        ],
    startingRanking: 299,
    startingScene: "Entrada no Blue Lock: Convocação Inicial & Teste Onigokko",
  };

  try {
    const prompt = `
Você é o mestre narrador de um RPG ambientado no anime/mangá BLUE LOCK.
Um novo egoísta acabou de ser convocado por Jinpachi Ego.

DADOS DO JOGADOR:
- Nome: ${character.name}
- Apelido: ${character.nickname || "Nenhum"}
- Idade: ${character.age} anos
- Nacionalidade: ${character.nationality}
- Altura: ${character.height} cm
- Posição: ${character.position}
- Pé Dominante: ${character.dominantFoot}
- Estilo de Jogo: ${character.playstyle}
- Arma Principal: ${character.mainWeapon}
- Personalidade descrita: ${character.personality}
- História de fundo: ${character.backstory}
- Relação com personagem existente: ${character.relationshipWithCanon || "Nenhuma relação prévia"}

REGRA DE OURO SUPREMA:
O jogador controla SOMENTE o próprio personagem.
A IA controla TODOS os outros personagens (Ego, Isagi, Nagi, Bachira, etc.) e o ambiente.
Você NUNCA deve narrar os pensamentos, emoções internas, falas ou decisões do jogador!
NÃO escreva: "Você sentiu um frio na barriga", "Você sorriu", "Você decidiu...".
Descreva apenas o que os outros fazem, o que Ego fala na tela gigante, ou como o parente/amigo canônico reage ao ver o jogador entrar na sala!

SE ELE TEM UMA RELAÇÃO CANÔNICA (ex: irmão do Nagi, amigo do Bachira, rival do Rin):
Essa pessoa DEVE notar e reagir imediatamente de acordo com sua personalidade original de Blue Lock!

Gere uma introdução cinematográfica emocionante (em Português do Brasil) para o início da jornada no Blue Lock, terminando no momento em que as portas se fecham e Ego começa seu discurso ou o teste do pega-pega (Onigokko) está prestes a começar.

Retorne JSON no formato:
{
  "prologueText": "texto narrativo imersivo aqui...",
  "initialReactions": [
    { "character": "Nome", "dialogue": "fala do personagem reagindo ao jogador" }
  ],
  "startingRanking": 299,
  "startingScene": "Entrada no Blue Lock: Sala do Time Z"
}
`;

    const raw = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseJson(raw, defaultFallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Using high-fidelity fallback for prologue:", error?.message || error);
    return res.json(defaultFallback);
  }
});

// Chat & Story Scene interaction
app.post("/api/chat", async (req, res) => {
  const {
    character,
    sceneContext,
    playerInput,
    chatHistory,
    characterMemories,
    characterRelationships,
    currentRanking,
    currentChapter,
  } = req.body;

  // Build contextual dynamic fallback in case API spikes
  const inputLower = (playerInput || "").toLowerCase();
  let defaultSpeaker = "Blue Lock";
  let defaultDialogue = `Os olhares no vestiário se voltam intensamente para você. O clima ferve de tensão e choque de egos.\n\n**Isagi Yoichi:** "O que você acabou de dizer faz sentido na teoria... Mas me diz uma coisa: como você pretende se posicionar no campo quando a defesa dobrar em cima de nós dois?"`;

  if (inputLower.includes("nagi")) {
    defaultSpeaker = "Nagi Seishiro";
    defaultDialogue = `**Nagi Seishiro:** *(boceja preguiçosamente e ajeita o celular nos dedos)* "Ah... que saco, por que você se preocupa tanto com essas coisas complicadas? Se formos pro campo agora, você promete colocar a bola certinho no meu pé ou vai me fazer gastar energia correndo à toa?"`;
  } else if (inputLower.includes("rin")) {
    defaultSpeaker = "Itoshi Rin";
    defaultDialogue = `**Itoshi Rin:** *(olhar gélido e intimidador, perfurando sua presença)* "Você fala demais pra alguém com um futebol tão morno e previsível. Me responde de uma vez: você acha mesmo que tem capacidade de ser a minha marionete no ataque ou prefere ser destruído como adubo pro meu ego?"`;
  } else if (inputLower.includes("isagi")) {
    defaultSpeaker = "Isagi Yoichi";
    defaultDialogue = `**Isagi Yoichi:** *(olhos brilhando com peças de quebra-cabeça na mente)* "Eu li a sua intenção! Se usarmos essa movimentação, podemos desmontar a linha de trás deles em dois toques. Mas e aí, você consegue enxergar o ponto cego do zagueiro na mesma fração de segundo que eu?"`;
  } else if (inputLower.includes("ego")) {
    defaultSpeaker = "Jinpachi Ego";
    defaultDialogue = `**Jinpachi Ego:** *(surge na tela gigante mastigando yakisoba instantâneo com um sorriso sádico)* "Exatamente o tipo de insolência que eu adoro ver num egoísta não lapidado. Mas deixe de conversa fiada, seu diamante bruto: quando o tempo estiver acabando e você estiver cercado por três marcadores, você vai passar covardemente ou vai chutar para o gol com sede de sangue?"`;
  } else if (inputLower.includes("kaiser")) {
    defaultSpeaker = "Michael Kaiser";
    defaultDialogue = `**Michael Kaiser:** *(sorriso teatral com a tatuagem de rosa brilhando no pescoço)* "Haha, que gracinha! Uma pedrinha insignificante do Japão tentando latir no meu reino. Me diz, palhaço: você quer ser o servo que me serve a bola de bandeja ou prefere ser esmagado pelo meu Kaiser Impact diante de todo o planeta?"`;
  } else if (inputLower.includes("barou")) {
    defaultSpeaker = "Barou Shoei";
    defaultDialogue = `**Barou Shoei:** *(avança com passos pesados, encarando de cima para baixo)* "Cala a boca, seu lixo comum! O único rei absoluto deste gramado sou eu! Você vai se mover pra abrir espaço pro meu gol ou quer que eu te atropele no meio do caminho?!"`;
  } else if (inputLower.includes("bachira")) {
    defaultSpeaker = "Meguru Bachira";
    defaultDialogue = `**Meguru Bachira:** *(dá risadinhas hiperativas e faz embaixadinhas acrobáticas)* "Yoo-hoo! O meu monstro interior ficou super empolgado com você! Vamos dançar juntos nesse gramado ou você vai amarelar e ficar só assistindo?"`;
  } else if (playerInput === ".") {
    defaultDialogue = `Você permanece em silêncio absoluto, sustentando o olhar de todos com frieza.\n\n**Isagi Yoichi:** *(se aproxima ajustando as chuteiras)* "Esse seu silêncio diz muito... Você já está calculando como vai devorar o próximo adversário, não está?"`;
  }

  const defaultFallback = {
    narrative: defaultDialogue,
    speakers: [defaultSpeaker === "Blue Lock" ? "Isagi Yoichi" : defaultSpeaker],
    updatedRelationships: [
      {
        characterName: defaultSpeaker === "Blue Lock" ? "Isagi Yoichi" : defaultSpeaker,
        deltaTrust: 2,
        deltaRespect: 2,
        deltaRivalry: 2,
        newStatus: "Competidor Atento",
        reactionSummary: "Ficou instigado e fez uma pergunta desafiadora",
      },
    ],
    newMemory: {
      characterName: defaultSpeaker === "Blue Lock" ? "Isagi Yoichi" : defaultSpeaker,
      event: `Pergunta e confronto de egos no ${sceneContext || "Centro de Blue Lock"}: "${playerInput}"`,
    },
    expAwarded: 15,
    statProgressionNote: "Ganho de compostura, presença e foco mental (+15 EXP)",
  };

  try {
    const systemInstruction = `
Você é o motor de IA e narrador imersivo do RPG oficial de BLUE LOCK.
Você controla TODO O MUNDO, todos os personagens secundários, treinadores (Ego, Noa, Snuffy, Chris, Lavinho), jogadores (Isagi, Nagi, Rin, Bachira, Chigiri, Kunigami, Shidou, Kaiser, Sae, Barou, Reo, etc.) e os acontecimentos.

### REGRA PRINCIPAL E ABSOLUTA (REGRA DE OURO):
1. O jogador controla SOMENTE o próprio personagem (${character?.name}).
2. Você NUNCA, SOB HIPÓTESE ALGUMA, deve controlar o personagem do jogador.
   - NUNCA invente falas do jogador.
   - NUNCA descreva sentimentos, pensamentos, emoções, expressões faciais ou decisões do jogador (Exemplo proibido: "Você sorriu com desdém", "Você sentiu a pressão", "Você pensou em passar a bola").
   - Apenas reaja ao que o jogador DISSE ou FEZ no "playerInput".
3. Se o jogador escreveu apenas "." ou nada, significa que ele permaneceu em silêncio ou observando. Avance a cena fazendo os outros personagens e Ego agirem por conta própria, SEM inventar ações para o jogador!

### DIÁLOGO HIPER DINÂMICO E REGRA DA PERGUNTA OBRIGATÓRIA:
- Torne a conversa eletrizante, ágil, cheia de presença física (gestos, olhares cortantes, postura agressiva, embaixadinhas, telas acesas de Ego).
- **MANDATÓRIO: CADA PERSONAGEM QUE FALAR DEVE SEMPRE TERMINAR SUA INTERVENÇÃO COM UMA PERGUNTA DIRETA, DESAFIADORA OU INSTIGANTE PARA O JOGADOR (${character?.name})!**
- A pergunta deve exigir que o jogador tome uma decisão rápida, declare sua tática, defenda seu ego ou aceite um desafio/duelo 1v1.
- NUNCA termine com monólogos fechados ou declarações passivas; sempre passe a bola pro jogador responder com uma pergunta afiada!

### PERSONALIDADES CANÔNICAS FIÉIS:
- Nagi Seishiro: Preguiçoso ("mendokusai"), gênio apático do domínio, faz perguntas arrastadas mas curiosas sobre praticidade ("Por que você se esforça tanto? Vai me dar o passe no pé ou não?").
- Itoshi Rin: Frio, cirúrgico, intimidador, fala cortante ("morno", "você me dá nojo"), questiona a capacidade do jogador de acompanhar sua destruição estética.
- Isagi Yoichi: Curioso, analítico, feroz durante o futebol ("peças de quebra-cabeça", "adaptação"), questiona o jogador sobre visão de jogo, pontos cegos e fórmulas de gol.
- Bachira Meguru: Brincalhão, excêntrico, chama para dançar com o monstro, pergunta se o jogador aguenta o ritmo do drible ou se tem medo.
- Michael Kaiser: Arrogante imperial, teatral, chama os outros de palhaços/plebeus, pergunta se o jogador quer ser servo ou se prefere ser esmagado pelo Kaiser Impact.
- Ryusei Shidou: Caótico, violento, poético sobre explosões físicas e gols de bicicleta, pergunta se a alma do jogador explode em campo.
- Barou Shoei: O Rei egoísta e agressivo, exige submissão ou pergunta se o jogador tem coragem de cruzar o caminho do Rei.
- Jinpachi Ego: Frio, sarcástico, voraz, prega o egoísmo puro, faz perguntas filosóficas e brutais sobre fome de gol e descarte dos medíocres.
- Noel Noa: Científico, racional, frio, pede números exatos, porcentagens de sucesso e lógica pura.

Retorne SEMPRE um JSON válido com a seguinte estrutura:
{
  "narrative": "Texto narrativo dinâmico descrevendo ações, ambiente e diálogos com os personagens em negrito e suas falas terminando com uma PERGUNTA DIRETA ao jogador",
  "speakers": ["Nagi", "Isagi"],
  "updatedRelationships": [
    {
      "characterName": "Nagi Seishiro",
      "deltaTrust": 2,
      "deltaRespect": 3,
      "deltaRivalry": 1,
      "newStatus": "Competidor Instigado",
      "reactionSummary": "Lançou um desafio e quer ver a resposta"
    }
  ],
  "newMemory": {
    "characterName": "Nome do personagem",
    "event": "Resumo do desafio/pergunta memorizada"
  },
  "expAwarded": 15,
  "statProgressionNote": "Opcional: nota sobre evolução"
}
`;

    const userPrompt = `
DADOS DO PERSONAGEM DO JOGADOR:
- Nome: ${character?.name} (${character?.nickname || ""})
- Posição: ${character?.position} | Estilo: ${character?.playstyle}
- Arma Principal: ${character?.mainWeapon}
- Vínculo Canônico Inicial: ${character?.relationshipWithCanon || "Nenhum"}
- Ranking Atual no Blue Lock: #${currentRanking || 299}
- Fase/Capítulo Atual: ${currentChapter || "Fase 1: Entrada no Blue Lock"}

CENÁRIO / CONTEXTO DA CENA:
${sceneContext || "Centro de Treinamento de Blue Lock"}

MEMÓRIAS RECENTES DOS PERSONAGENS:
${JSON.stringify(characterMemories?.slice(-5) || [])}

RELACIONAMENTOS ATUAIS:
${JSON.stringify(characterRelationships || {})}

HISTÓRICO RECENTE DE DIÁLOGOS:
${JSON.stringify(chatHistory?.slice(-6) || [])}

AÇÃO OU FALA DO JOGADOR AGORA:
"${playerInput}"

LEMBRE-SE DA REGRA DE OURO: NÃO CONTROLE O JOGADOR. Responda apenas com os outros personagens reagindo ao que ele fez/falou.
`;

    const raw = await generateContentWithFallback({
      contents: [
        { role: "user", parts: [{ text: systemInstruction + "\n\n" + userPrompt }] },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseJson(raw, defaultFallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Using high-fidelity fallback for chat:", error?.message || error);
    return res.json(defaultFallback);
  }
});

// Dynamic Blue Lock Match Engine Fallback Generator with High Difficulty, Rival Goals, Fouls, Desmarques and Brawls
function generateDynamicMatchTurnFallback(
  matchInfo: any,
  character: any,
  playerAction: string,
  minute: number,
  score: { teamA: number; teamB: number },
  pitchState: any,
  matchLog: any[]
) {
  const nextMin = Math.min(90, minute + 5);
  const pTeam = String(matchInfo?.playerTeam || "Time Z").toLowerCase();
  const oTeam = String(matchInfo?.opponentTeam || "Time Rival").toLowerCase();
  const actionLower = (playerAction || "").toLowerCase();
  const pName = character?.name || "Você";
  const pWeapon = character?.mainWeapon || "Técnica";

  // Identify Rival Star & Defensive Pillars
  let rivalStar = "Artilheiro Rival";
  let rivalWeapon = "Arrancada e Chute Preciso";
  let rivalDefender = "Zagueiro Central";

  if (oTeam.includes("time x") || oTeam.includes("barou")) {
    rivalStar = "Barou Shoei";
    rivalWeapon = "Chop Dribble & Chute a 29 Metros";
    rivalDefender = "Haidara";
  } else if (oTeam.includes("time y") || oTeam.includes("niko") || oTeam.includes("okawa")) {
    rivalStar = "Hibiki Okawa";
    rivalWeapon = "Finalização Rápida no Ponto Cego";
    rivalDefender = "Ikki Niko";
  } else if (oTeam.includes("time w") || oTeam.includes("wanima")) {
    rivalStar = "Keisuke Wanima";
    rivalWeapon = "Sincronia Telepática & Jogo Sujo";
    rivalDefender = "Junichi Wanima";
  } else if (oTeam.includes("time v") || oTeam.includes("nagi") || oTeam.includes("zantetsu") || oTeam.includes("reo")) {
    rivalStar = minute < 50 ? "Tsurugi Zantetsu" : "Seishiro Nagi";
    rivalWeapon = minute < 50 ? "Arrancada Bala em Linha Reta" : "Black Hole Trap de Gravidade Zero";
    rivalDefender = "Mikage Reo";
  } else if (oTeam.includes("top 3") || (oTeam.includes("rin") && !oTeam.includes("pxg"))) {
    rivalStar = "Itoshi Rin";
    rivalWeapon = "Curva Cirúrgica no Ângulo Inalcançável";
    rivalDefender = "Jyubei Aryu";
  } else if (oTeam.includes("sub-20") || oTeam.includes("sae") || oTeam.includes("aiku")) {
    rivalStar = minute > 45 ? "Ryusei Shidou" : "Sae Itoshi";
    rivalWeapon = minute > 45 ? "Bicicleta Acrobática no Ponto Cego" : "Passes Teleguiados de Precisão Mundial";
    rivalDefender = "Oliver Aiku";
  } else if (oTeam.includes("p.x.g") || oTeam.includes("loki") || oTeam.includes("kaiser")) {
    rivalStar = minute > 60 ? "Julian Loki" : "Itoshi Rin";
    rivalWeapon = minute > 60 ? "Velocidade Divina da Luz" : "Modo Berserk Destruidor";
    rivalDefender = "Tabito Karasu";
  }

  let eventBadge: "normal" | "goal" | "opponent_goal" | "foul" | "yellow_card" | "red_card" | "clash" | "save" | "rivalry" = "normal";
  let goalScored: any = null;
  let foulDetail: any = null;
  let clashDetail: any = null;
  let actionResult: "success" | "partial" | "failed" | "neutral" = "partial";
  let matchTension = "fierce";
  let ratingDelta = 0.1;
  let expEarned = 15;
  let statUsed = "vision";
  let narrative = "";

  // 1. Check for Foul / Tackle Action
  if (
    actionLower.includes("carrinho") ||
    actionLower.includes("falta") ||
    actionLower.includes("tranco") ||
    actionLower.includes("parar") ||
    actionLower.includes("derrubar") ||
    actionLower.includes("matar")
  ) {
    const isRed = Math.random() < 0.1;
    const isYellow = !isRed && Math.random() < 0.55;
    const card = isRed ? "red" : isYellow ? "yellow" : "none";
    eventBadge = isRed ? "red_card" : isYellow ? "yellow_card" : "foul";
    foulDetail = {
      committedBy: pName,
      victim: rivalStar,
      card,
      isPenalty: Math.random() < 0.2 && minute > 50,
      description: `${pName} entrou com dividida de sola e corpo para estancar o avanço em velocidade de ${rivalStar}! O impacto ressoa seco no gramado.`,
    };
    actionResult = "partial";
    statUsed = "strength";
    narrative = `⏱️ ${minute}'\n\n🛑 O apito do árbitro corta o ar de Blue Lock com violência!\n\n${pName} se atira de carrinho firme, travando as pernas de ${rivalStar} que vinha em arrancada devastadora. ${rivalStar} rola no gramado sintético com o rosto em fúria. O juiz corre com a mão no bolso!\n\n${
      card === "yellow"
        ? `🟨 CARTÃO AMARELO para ${pName}! A arquibancada holográfica vibra com o nível de tensão física no limite!`
        : card === "red"
        ? `🟥 CARTÃO VERMELHO DIRETO! O árbitro considera a entrada excessivamente perigosa!`
        : `Falta perigosa assinalada! Os jogadores do ${matchInfo?.opponentTeam || "time rival"} cercam a arbitragem aos gritos!`
    }`;
  }
  // 2. Check for Brawl / Clash / Provocation Action
  else if (
    actionLower.includes("encarar") ||
    actionLower.includes("briga") ||
    actionLower.includes("peitar") ||
    actionLower.includes("provocar") ||
    actionLower.includes("olho no olho") ||
    actionLower.includes("choque")
  ) {
    eventBadge = "clash";
    clashDetail = {
      protagonist: pName,
      rival: rivalStar,
      intensity: "heated",
      clashReason: `Encarada ríspida peito a peito após disputa corpo a corpo com ${rivalStar}.`,
    };
    actionResult = "partial";
    statUsed = "iq";
    narrative = `⏱️ ${minute}'\n\n⚔️ CLIMA QUENTE NO GRAMADO! CHOQUE DE EGOS!\n\nApós o choque seco de corpos, ${pName} não recua um milímetro e encara ${rivalStar} colado no rosto! As auras de predador dos dois egoístas faíscam como relâmpagos visíveis.\n\n"${rivalStar}" rosna entre os dentes: "Quem você pensa que é, seu verme medíocre? Vou te devorar vivo neste campo!"\n\nCompanheiros de equipe e o árbitro correm desesperados para apartar os dois antes que vire agressão física descarada!`;
  }
  // 3. Check for Player Finishing / Shooting Action
  else if (
    actionLower.includes("finalizar") ||
    actionLower.includes("chutar") ||
    actionLower.includes("chute") ||
    actionLower.includes("gol") ||
    actionLower.includes("bomba") ||
    actionLower.includes("bater")
  ) {
    statUsed = "finishing";
    const roll = Math.random();
    if (roll < 0.45) {
      // GOAL for player!
      eventBadge = "goal";
      goalScored = {
        scorer: pName,
        assistant: pTeam.includes("bastard") ? "Yo Hiori" : "Isagi Yoichi",
        team: "playerTeam",
        teamName: matchInfo?.playerTeam || "Time Z",
      };
      actionResult = "success";
      ratingDelta = 0.6;
      expEarned = 40;
      narrative = `⏱️ ${minute}'\n\n⚽ GOOOOOL ESPETACULAR DE ${pName.toUpperCase()}!\n\nRecebendo a bola no espaço milimétrico, ${pName} arma o disparo sem hesitar! Canalizando todo o seu ego e sua arma fatal (${pWeapon}), a bola sai como um míssil teleguiado rasgando o ar!\n\nO goleiro rival salta desesperado, mas a bola estufa a bochecha superior da rede! Um gol de puro impacto egoísta que explode o placar!`;
    } else {
      // Saved by rival GK / blocked
      eventBadge = "save";
      actionResult = "partial";
      ratingDelta = 0.2;
      narrative = `⏱️ ${minute}'\n\n🧤 DEFESAÇA DO GOLEIRO ADVERSÁRIO!\n\n${pName} desfere um tiro venenoso buscando o ângulo com sua arma (${pWeapon})! O chute leva veneno puro, mas ${rivalDefender} desvia de raspão de cabeça e o arqueiro adversário se estica todo espalmando para escanteio com a ponta dos dedos! Quase o gol!`;
    }
  }
  // 4. Check for Dribble / Desmarque
  else if (actionLower.includes("driblar") || actionLower.includes("desmarcar") || actionLower.includes("finta") || actionLower.includes("ponto cego")) {
    statUsed = "dribble";
    actionResult = "success";
    ratingDelta = 0.3;
    expEarned = 25;
    narrative = `⏱️ ${minute}'\n\n⚡ DESMARQUE RELÂMPAGO NO PONTO CEGO!\n\n${pName} simula o deslocamento para a esquerda e explode em arrancada seca para o lado cego de ${rivalDefender}! A finta de corpo desequilibra o marcador completamente, abrindo um corredor limpo de progressão em direção à grande área rival!`;
  }
  // 5. Normal / Opponent Counter-Attack (High Difficulty: Rival Attacks & Scores!)
  else {
    const rivalChance = Math.random();
    if (rivalChance < 0.35 && minute >= 25) {
      // RIVAL SCORES A GOAL!
      eventBadge = "opponent_goal";
      goalScored = {
        scorer: rivalStar,
        team: "opponentTeam",
        teamName: matchInfo?.opponentTeam || "Time Rival",
      };
      actionResult = "failed";
      matchTension = "bloodbath";
      narrative = `⏱️ ${minute}'\n\n🚨 GOL DO TIME RIVAL! ${rivalStar.toUpperCase()} NÃO PERDOA!\n\nO ${matchInfo?.opponentTeam || "time adversário"} recupera a posse e arma um contra-ataque relâmpago implacável! ${rivalStar} se desmarca nas costas da nossa linha de zaga com movimentação de predador e recebe o passe em velocidade.\n\nCom sua arma destruidora (${rivalWeapon}), ${rivalStar} dispara um chute indefensável no ângulo! A bola beija a trave e entra! O time rival vibra com arrogância extrema!`;
    } else if (rivalChance < 0.65) {
      // Rival attacks but defense saves (Gagamaru acrobatic save!)
      eventBadge = "save";
      actionResult = "neutral";
      narrative = `⏱️ ${minute}'\n\n🧤 DEFESA SALVADORA DO TIME Z!\n\n${rivalStar} desmarca com violência e dispara uma bomba rasante à queima-roupa! Gin Gagamaru se atira em mergulho acrobático de escorpião e espalma com o calcanhar no puro reflexo instintivo! Jingo Raichi berra afastando o perigo de cabeça na sequência!`;
    } else {
      actionResult = "partial";
      narrative = `⏱️ ${minute}'\n\nA disputa no meio de campo é brutal! Carrinhos, trancos e puxões de camisa acontecem a cada palmo de grama. ${pName} se movimenta com atenção máxima lendo os espaços vazios enquanto os outros 21 jogadores colidem com fúria.`;
    }
  }

  const nextScore = { ...score };
  if (goalScored) {
    if (goalScored.team === "playerTeam") {
      nextScore.teamA += 1;
    } else {
      nextScore.teamB += 1;
    }
  }

  return {
    minuteNarrative: narrative,
    nextMinute: nextMin,
    isMatchFinished: minute >= 88,
    score: nextScore,
    eventBadge,
    goalScored,
    foulDetail,
    clashDetail,
    matchTension,
    pitchState: {
      ballPossessor: goalScored ? "Centro do Campo (Reinicio)" : (eventBadge === "goal" ? pName : (eventBadge === "opponent_goal" ? rivalStar : "Disputa Aberta")),
      attackingTeam: eventBadge === "opponent_goal" ? "opponentTeam" : "playerTeam",
      zone: minute > 65 ? "attack" : "midfield",
      description: eventBadge === "opponent_goal" ? `O ${matchInfo?.opponentTeam} impõe pressão feroz após o gol de ${rivalStar}.` : "Batalha acirrada pela dominância territorial.",
      dangerLevel: eventBadge === "opponent_goal" || eventBadge === "goal" ? "critical" : "high",
    },
    actionResult,
    commentaryReaction: {
      speaker: "Jinpachi Ego",
      quote: eventBadge === "opponent_goal"
        ? "Estão vendo isso, seus medíocres? Se não devorarem o rival, ele mastigará seus ossos na primeira falha."
        : eventBadge === "goal"
        ? "Exatamente. O gol não é um milagre, é a consequência matemática da imposição do seu ego."
        : "O campo não tem piedade de quem hesita.",
    },
    playerMatchPerformance: {
      ratingDelta,
      expEarned,
      statUsed,
    },
  };
}

// Real-time minute-by-minute match engine
app.post("/api/match/turn", async (req, res) => {
  const {
    matchInfo,
    character,
    playerAction,
    currentMinute,
    currentScore,
    matchLog,
    pitchState,
  } = req.body;

  const minute = currentMinute || 15;
  const score = currentScore || { teamA: 0, teamB: 0 };
  const nextMin = Math.min(90, minute + 5);

  const defaultFallback = generateDynamicMatchTurnFallback(
    matchInfo,
    character,
    playerAction,
    minute,
    score,
    pitchState,
    matchLog || []
  );

  try {
    const prompt = `
Você é o motor de simulação e narrador oficial de uma PARTIDA DE FUTEBOL no universo de BLUE LOCK.
As partidas são narradas minuto a minuto com alta tensão dramática, tática e choque de egos!

INFORMAÇÕES DA PARTIDA:
- Confronto: ${matchInfo.teamA} vs ${matchInfo.teamB}
- Time do Jogador: ${matchInfo.playerTeam}
- Time Adversário: ${matchInfo.opponentTeam}
- Placar Atual: ${matchInfo.playerTeam} ${score.teamA} x ${score.teamB} ${matchInfo.opponentTeam}
- Minuto da Partida: ⏱️ ${minute}'
- Fase: ${matchInfo.stage}
- Contexto Tático Atual: ${pitchState?.description || "Posse de bola em disputa no meio de campo."}
- Quem está com a bola: ${pitchState?.ballPossessor || "Disputa aberta"}
- Time que estava atacando: ${pitchState?.attackingTeam || "playerTeam"}

JOGADOR (PROTAGONISTA):
- Nome: ${character.name}
- Posição: ${character.position}
- Arma Principal: ${character.mainWeapon}
- Atributos do Jogador (0-100): ${JSON.stringify(character.stats)}

AÇÃO DO JOGADOR NESTE MINUTO:
"${playerAction}"

ÚLTIMOS MINUTOS DA PARTIDA:
${JSON.stringify(matchLog?.slice(-3) || [])}

### REGRA FUNDAMENTAL: CONTROLE EXCLUSIVO DO PROTAGONISTA (PLAYER-LOCKED / MODO UM JOGADOR):
1. O usuário humano controla EXCLUSIVAMENTE E APENAS o seu próprio jogador (${character.name}).
2. O usuário NÃO comanda o time inteiro, NÃO é o técnico e NÃO controla os outros 21 atletas no gramado.
3. Os outros 21 jogadores (tanto os companheiros de time quanto os adversários: Isagi, Bachira, Nagi, Rin, Kaiser, Barou, Chigiri, etc.) são agentes autônomos movidos por seus próprios egos e estilo de jogo canônico.
4. Se a ação do jogador tentar forçar a decisão de outro atleta (ex: "faço o Isagi tocar pra mim e o Nagi chutar"), interprete isso estritamente como uma tentativa do protagonista no campo: "${character.name} gesticula e grita pedindo o passe para Isagi...". Caberá aos companheiros decidirem se passam ou arriscam a jogada sozinhos com base em seus egos!
5. Perspectiva narrativa estritamente individual:
   - A narração DEVE ser focada no ponto de vista de ${character.name}: o que ele vê, seu cansaço físico, como os zagueiros o marcam, a linha de corrida que ele abre e a velocidade com que a bola chega (ou não) até ele.
   - NUNCA invente falas ou sentimentos inventados para o jogador. Apenas relate suas ações e o impacto no jogo.
6. Lógica de Posse de Bola Individual:
   - Se ${character.name} estiver com a bola (pitchState.ballPossessor contém seu nome ou "você"): a ação dele define o destino imediato da bola (chute ao gol, drible 1v1, passe cavado, condução rápida ou proteção com o corpo).
   - Se ${character.name} NÃO estiver com a bola: a ação dele é de movimentação sem-bola (desmarque, infiltração no espaço vazio, puxar marcação, pedir passe) ou de pressão defensiva (dar o bote, fechar linha de passe, recompor). Os outros atletas tocam a bola e decidem entre si se passam para ele ou não!

### REGRA FUNDAMENTAL: ALTA DIFICULDADE, RIVALIDADE IMPLACÁVEL, FALTAS, GOLS DO TIME RIVAL E BRIGAS:
1. DIFICULDADE ELEVADA & INTELIGÊNCIA ARTIFICIAL ADVERSÁRIA DINÂMICA:
   - A partida NÃO é um passeio. O adversário é mortal, veloz e implacável!
   - Astros Rivais em Campo: ${matchInfo.keyOpponents?.join(', ') || "Time Padrão"}
   - ADAPTE a dificuldade e as ações adversárias com base nos astros presentes:
     * Exija descrições táticas quase perfeitas do usuário para superar esses rivais.
     * Force os adversários a realizarem marcações individuais asfixiantes, desarmes agressivos, carrinhos para matar contra-ataques e transições velozes.
     * Se "Barou" estiver em campo, ele cometerá roubadas de bola agressivas e chutará de longa distância.
     * Se "Rin" estiver em campo, ele antecipará jogadas, interceptando passes e organizando contra-ataques mortais.
     * Se "Nagi" estiver, fará domínios impossíveis; se "Aiku", fará marcação dupla inteligente.
     * Se "Sae" ou "Kaiser" estiverem, usarão passes e chutes de nível mundial que são quase indefensáveis sem predição do usuário.
   - Erros do jogador (como tentar driblar 3 marcadores sozinho ou passes óbvios) SÃO PUNIDOS IMEDIATAMENTE com roubadas de bola cruéis e contra-ataques ferozes!

2. TIME RIVAL FAZENDO GOLS:
   - O time adversário DEVE finalizar e MARCAR GOLS com frequência realista (~30% a 40% das chances de perigo em contra-ataques)!
   - Estrelas rivais (ex: Michael Kaiser com Kaiser Impact, Itoshi Rin com chutes com efeito cirúrgico, Barou com finalizações selvagens, Nagi com domínios impossíveis, Shidou com voleios acrobáticos) DEVEM balançar as redes!
   - Quando o time rival fizer gol:
     - Preencha: "goalScored": { "scorer": "Nome do artilheiro rival", "team": "opponentTeam", "teamName": "${matchInfo.opponentTeam}" }
     - Defina: "eventBadge": "opponent_goal"

3. FALTAS, ENTRADAS VIOLENTAS E CARTÕES:
   - O futebol em Blue Lock é de contato físico brutal e desleal no limite das regras!
   - Divididas pesadas, carrinhos por trás para parar arrancadas, puxões de camisa descarados ou trancos fortes de ombro DEVEM gerar faltas com apito agudo do árbitro!
   - Pode haver falta perigosa na entrada da área, pênalti e CARTÕES AMARELOS ou VERMELHOS!
   - Retorne o objeto "foulDetail":
     {
       "committedBy": "Nome de quem fez a falta",
       "victim": "Nome de quem sofreu a falta",
       "card": "none" | "yellow" | "red",
       "isPenalty": false,
       "description": "Descrição rápida da entrada dura"
     }
   - Defina "eventBadge": "foul" ou "yellow_card" ou "red_card".

4. BRIGAS, EMPURRÕES E CHOQUE DE EGOS (CLIMA QUENTE NO GRAMADO):
   - Discussões ríspidas, empurrões peito a peito, encaradas coladas com auras de predador, provocações venenosas ("Vou te devorar, lixo!", "Saia da minha frente, você é só um obstáculo!") e companheiros/árbitro correndo para apartar a confusão!
   - Retorne o objeto "clashDetail":
     {
       "protagonist": "${character.name}",
       "rival": "Nome do rival (ex: Kaiser, Rin, Barou, Raichi, Ness)",
       "intensity": "heated" | "brawl" | "verbal",
       "clashReason": "Motivo da treta (dividida dura, provocação, pisão)"
     }
   - Defina "eventBadge": "clash" ou "rivalry".

5. DESMARCAÇÕES AGRESSIVAS E BATALHA SEM BOLA:
   - Atacantes adversários se movimentam o tempo todo no ponto cego dos zagueiros, exigindo atenção dobrada.
   - O protagonista precisa lutar contra a marcação corpo a corpo para receber o passe em velocidade.

### REGRA ABSOLUTA DE ATRIBUIÇÃO DE GOLS (CRUCIAL):
- Se houver GOL, você DEVE indicar com precisão quem marcou e o time:
  - Se quem marcou foi ${character.name} ou qualquer companheiro do time ${matchInfo.playerTeam}: defina "team": "playerTeam" e "teamName": "${matchInfo.playerTeam}", com "eventBadge": "goal".
  - Se quem marcou foi um adversário do ${matchInfo.opponentTeam}: defina "team": "opponentTeam" e "teamName": "${matchInfo.opponentTeam}", com "eventBadge": "opponent_goal".
- NÃO INVERTA OS TIMES!

### QUEM ATACA E QUEM ESTÁ COM A BOLA:
- No campo "pitchState.ballPossessor": coloque o nome exato do jogador que terminou com a bola no pé (ex: "${character.name}", "Isagi Yoichi", "Bachira Meguru", "Michael Kaiser", "Itoshi Rin", etc.).
- No campo "pitchState.attackingTeam": defina estritamente "playerTeam" se o time de ${character.name} está atacando, ou "opponentTeam" se o time rival está atacando.
- No campo "pitchState.zone": "defense", "midfield", "attack" ou "box".
- No campo "pitchState.dangerLevel": "low", "medium", "high" ou "critical".

Retorne JSON no seguinte formato:
{
  "minuteNarrative": "⏱️ ${minute}'\\n\\n[Narração visceral e dramática: disputa física, desarme, falta, briga/choque de egos ou finalização espetacular]",
  "nextMinute": ${nextMin},
  "isMatchFinished": ${minute >= 88},
  "eventBadge": "normal", // "goal", "opponent_goal", "foul", "yellow_card", "red_card", "clash", "save", "rivalry", "normal"
  "goalScored": null, // ou { "scorer": "Nome", "team": "playerTeam" | "opponentTeam", "teamName": "Nome do Time" }
  "foulDetail": null, // ou { "committedBy": "Nome", "victim": "Nome", "card": "none"|"yellow"|"red", "isPenalty": false, "description": "Carrinho por trás" }
  "clashDetail": null, // ou { "protagonist": "${character.name}", "rival": "Rival", "intensity": "heated"|"brawl"|"verbal", "clashReason": "Encarada após dividida" }
  "matchTension": "fierce", // "calm", "tense", "fierce", "bloodbath"
  "pitchState": {
    "ballPossessor": "Nome do jogador com a bola",
    "attackingTeam": "playerTeam",
    "zone": "attack",
    "description": "Breve resumo da nova situação tática em campo",
    "dangerLevel": "high"
  },
  "actionResult": "partial",
  "commentaryReaction": {
    "speaker": "Jinpachi Ego",
    "quote": "Frase de impacto afiada sobre o lance"
  },
  "playerMatchPerformance": {
    "ratingDelta": 0.1,
    "expEarned": 15,
    "statUsed": "dribble"
  }
}
`;

    const raw = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseJson(raw, defaultFallback);

    // Normalização rigorosa de goalScored para garantir time 100% correto
    if (parsed.goalScored) {
      const scorer = String(parsed.goalScored.scorer || "").toLowerCase();
      const playerName = String(character?.name || "").toLowerCase();
      const pTeam = String(matchInfo.playerTeam || "").toLowerCase();
      const oTeam = String(matchInfo.opponentTeam || "").toLowerCase();
      const teamVal = String(parsed.goalScored.team || "").toLowerCase();
      const teamNameVal = String(parsed.goalScored.teamName || "").toLowerCase();

      if (scorer.includes(playerName) || playerName.includes(scorer)) {
        parsed.goalScored.team = "playerTeam";
        parsed.goalScored.teamName = matchInfo.playerTeam;
      } else if (
        teamVal === "playerteam" ||
        teamVal === "teama" ||
        teamVal.includes(pTeam) ||
        teamNameVal.includes(pTeam)
      ) {
        parsed.goalScored.team = "playerTeam";
        parsed.goalScored.teamName = matchInfo.playerTeam;
      } else if (
        teamVal === "opponentteam" ||
        teamVal === "teamb" ||
        teamVal.includes(oTeam) ||
        teamNameVal.includes(oTeam)
      ) {
        parsed.goalScored.team = "opponentTeam";
        parsed.goalScored.teamName = matchInfo.opponentTeam;
      } else {
        // Default to playerTeam if scorer is in narrative as protagonist ally
        parsed.goalScored.team = "playerTeam";
        parsed.goalScored.teamName = matchInfo.playerTeam;
      }
    }

    // Normalização de pitchState
    if (parsed.pitchState) {
      if (
        parsed.pitchState.attackingTeam !== "playerTeam" &&
        parsed.pitchState.attackingTeam !== "opponentTeam"
      ) {
        const attStr = String(parsed.pitchState.attackingTeam || "").toLowerCase();
        if (attStr.includes(String(matchInfo.opponentTeam).toLowerCase())) {
          parsed.pitchState.attackingTeam = "opponentTeam";
        } else {
          parsed.pitchState.attackingTeam = "playerTeam";
        }
      }
    }

    return res.json(parsed);
  } catch (error: any) {
    console.warn("Using high-fidelity fallback for match turn:", error?.message || error);
    return res.json(defaultFallback);
  }
});

// In-match real-time chat & tactical callouts
app.post("/api/match/chat", async (req, res) => {
  const { matchInfo, character, message, currentMinute, pitchState, score } = req.body;

  // Canonical fallback generator
  const getFallbackReply = (msg: string) => {
    const m = msg.toLowerCase();
    const pTeam = (matchInfo?.playerTeam || "").toLowerCase();

    if (m.includes("passe") || m.includes("toca") || m.includes("bola")) {
      return {
        sender: "Isagi Yoichi",
        role: "teammate",
        content: "Beleza! Corre no ponto cego do zagueiro que eu enfio ela rasgando! Mas me diz: você vai chutar de primeira ou cortar pro meio?",
        tacticalEffect: "+Química Tática (Passe em Profundidade)",
      };
    }
    if (m.includes("tabela") || m.includes("1-2") || m.includes("comigo")) {
      return {
        sender: "Meguru Bachira",
        role: "teammate",
        content: "Haha! Bora dançar! Toca aqui e se infiltra que o monstro devolve de letra! Tá pronto pra acelerar no ritmo do drible?",
        tacticalEffect: "+Triangulação Explosiva",
      };
    }
    if (m.includes("kaiser") || m.includes("palhaço")) {
      return {
        sender: "Michael Kaiser",
        role: "rival",
        content: "Poupe seu fôlego, verme. Meu Kaiser Impact já decidiu o destino desta partida. Você realmente acha que um palhaço do seu nível pode me ofuscar?",
        tacticalEffect: "Provocação: Rival Pressionado",
      };
    }
    if (m.includes("rin") || m.includes("sae") || m.includes("destruir")) {
      return {
        sender: "Itoshi Rin",
        role: "rival",
        content: "Morno. Você é apenas mais um obstáculo insignificante no meu caminho. Por que você ainda insiste em correr se o seu destino é ser devorado?",
        tacticalEffect: "Fúria: Intensidade Alta",
      };
    }
    if (m.includes("barou") || m.includes("rei")) {
      return {
        sender: "Barou Shoei",
        role: "rival",
        content: "Passar a bola? Eu não preciso de servos medíocres! O único rei neste gramado sou eu! Vai sair da minha frente ou quer ser atropelado agora mesmo?",
        tacticalEffect: "Aura do Rei Vilão Ativada",
      };
    }
    if (m.includes("chigiri") || m.includes("velocidade") || m.includes("corre")) {
      return {
        sender: "Hyoma Chigiri",
        role: "teammate",
        content: "Solta no espaço vazio! Ninguém neste campo alcança meus 44 km/h! Consegue cruzar na segunda trave quando eu chegar na linha de fundo?",
        tacticalEffect: "+Corrida da Pantera Rubra",
      };
    }
    if (m.includes("kunigami") || m.includes("herói") || m.includes("chuta")) {
      return {
        sender: "Rensuke Kunigami",
        role: "teammate",
        content: "Abre o corredor que eu vou soltar o míssil de canhota! Você segura a sobra se o goleiro der rebote?",
        tacticalEffect: "+Impacto de Chute a Média Distância",
      };
    }
    if (m.includes("gagamaru") || m.includes("goleiro") || m.includes("pega")) {
      return {
        sender: "Gin Gagamaru",
        role: "teammate",
        content: "Gaaah! Defesa de escorpião ativada no reflexo! Já recuperei a bola, quem é que vai disparar no contra-ataque agora?",
        tacticalEffect: "+Reflexos Acrobáticos",
      };
    }
    if (m.includes("nagi") || m.includes("preguiça")) {
      return {
        sender: "Seishiro Nagi",
        role: "teammate",
        content: "Que saco... Mas se você mandar a bola no alto, eu mato no peito com gravidade zero. Você consegue colocar com efeito na minha direção?",
        tacticalEffect: "+Domínio de Gravidade Zero",
      };
    }
    if (m.includes("shidou") || m.includes("explosão")) {
      return {
        sender: "Ryusei Shidou",
        role: "rival",
        content: "Isso! Vamos explodir tudo! O gol é o orgasmo supremo da existência! Sua alma tá pronta pra queimar nesse duelo ou vai virar cinzas?",
        tacticalEffect: "Caos Total no Gramado",
      };
    }

    if (pTeam.includes("bastard")) {
      return {
        sender: "Yo Hiori",
        role: "teammate",
        content: "Tô vendo a sua linha de corrida perfeitamente pela Metavisão. Se eu soltar com curva cortando os zagueiros, você chega de primeira?",
        tacticalEffect: "+Sincronia de Metavisão",
      };
    }

    return {
      sender: "Isagi Yoichi",
      role: "teammate",
      content: "Entendido! Vamos impor nosso ritmo e devorar os espaços deles! Qual é a jogada: você atrai a marcação ou finaliza direto?",
      tacticalEffect: "+Moral da Equipe",
    };
  };

  try {
    const prompt = `
Você é a IA de diálogos e gritos de campo em tempo real durante uma partida oficial de BLUE LOCK.
O jogador ${character.name} gritou ou falou algo para companheiros/rivais no meio do jogo.

DADOS DA PARTIDA:
- Confronto: ${matchInfo.playerTeam} x ${matchInfo.opponentTeam}
- Placar: ${score?.playerTeam || 0} x ${score?.opponentTeam || 0}
- Minuto: ⏱️ ${currentMinute || 30}'
- Quem tem a bola agora: ${pitchState?.ballPossessor || "Disputa"}
- Time no Ataque: ${pitchState?.attackingTeam === "opponentTeam" ? matchInfo.opponentTeam : matchInfo.playerTeam}

JOGADOR:
- Nome: ${character.name} (${character.position})
- Mensagem ou Grito do Jogador: "${message}"

Escolha o personagem MAIS APROPRIADO para responder (pode ser um companheiro de time como Isagi, Bachira, Chigiri, Nagi, Raichi, Kurona, Hiori, ou um rival como Rin, Kaiser, Barou, Shidou, ou até Jinpachi Ego da cabine).
A resposta deve ser CURTA, INTENSA, DINÂMICA e **MANDATORIAMENTE TERMINAR COM UMA PERGUNTA DIRETA / TÁTICA / PROVOCADORA** para o jogador responder no calor da partida.

Retorne JSON no seguinte formato:
{
  "reply": {
    "sender": "Nome do Personagem",
    "role": "teammate", // "teammate", "rival" ou "coach"
    "content": "Frase de resposta falada no gramado terminando SEMPRE com uma pergunta instigante ao jogador",
    "tacticalEffect": "+Química Tática / Efeito"
  }
}
`;

    const raw = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseJson(raw, { reply: getFallbackReply(message) });
    return res.json(parsed);
  } catch (error) {
    return res.json({ reply: getFallbackReply(message) });
  }
});

// 1v1 and Training session engine
app.post("/api/train", async (req, res) => {
  const { character, opponentName, trainingType, playerAction } = req.body;
  const opp = opponentName || "Itoshi Rin";

  const defaultFallback = {
    narrative: `Você entra no gramado sintético isolado contra ${opp} para disputar o ${trainingType || "Duelo 1v1"}. ${opp} ajusta a postura e parte para o confronto com intensidade impiedosa. A bola divide o espaço em frações de segundo, exigindo o limite dos seus reflexos e fôlego.`,
    opponentQuote: `Ainda está morno. Se esse for todo o seu ego, você será engolido na próxima seleção.`,
    success: true,
    expGained: 25,
    attributeBonus: {
      stat: "speed",
      amount: 1,
    },
    relationshipShift: {
      respectDelta: 2,
      rivalryDelta: 2,
      reaction: `${opp} registrou sua persistência e velocidade no treino.`,
    },
  };

  try {
    const prompt = `
Você é o motor de treino e simulação 1v1 de BLUE LOCK.
O jogador está realizando um treinamento com ${opp}.
Tipo de treino: ${trainingType}.

JOGADOR:
- Nome: ${character.name}
- Arma Principal: ${character.mainWeapon}
- Atributos relevantes: ${JSON.stringify(character.stats)}

OPONENTE:
- Nome: ${opp}
(Atue rigorosamente na personalidade de ${opp}, por exemplo Rin será impiedoso e frio, Nagi se cansará fácil mas fará lances geniais, Bachira trará fintas imprevisíveis).

AÇÃO DO JOGADOR NO TREINO:
"${playerAction}"

REGRA DE OURO: NÃO invente pensamentos, sentimentos ou falas para o jogador.

Avalie o confronto, determine o vencedor do lance e o ganho de experiência.

Retorne JSON:
{
  "narrative": "Narração detalhada e cinematográfica do duelo 1v1 ou treino...",
  "opponentQuote": "Fala de ${opp} após o lance",
  "success": true,
  "expGained": 25,
  "attributeBonus": {
    "stat": "finishing",
    "amount": 1
  },
  "relationshipShift": {
    "respectDelta": 2,
    "rivalryDelta": 1,
    "reaction": "Comentário breve sobre como a relação evoluiu"
  }
}
`;

    const raw = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseJson(raw, defaultFallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Using high-fidelity fallback for training:", error?.message || error);
    return res.json(defaultFallback);
  }
});

// Ranking evaluation by Ego
app.post("/api/evaluate-ranking", async (req, res) => {
  const { character, recentPerformances, currentRanking } = req.body;
  const curr = currentRanking || 299;
  const newRank = Math.max(1, curr - 6);

  const defaultFallback = {
    egoMonologue: `Olhe para si mesmo no espelho holográfico, número ${curr}. Você ainda é um diamante bruto coberto de cascalho. Mas nos últimos testes você mostrou uma fagulha de fome real. Eu odeio atacantes que se acomodam. Suba para o ranking #${newRank}. Se quiser ser o Top 1 do mundo, continue devorando os rivais sem hesitar.`,
    newRanking: newRank,
    rankingDelta: -6,
    clubBid: {
      club: "Bastard München",
      amountYen: 15000000,
      formatted: "¥ 15.000.000",
    },
    unlockedWeapons: [],
  };

  try {
    const prompt = `
Você é Jinpachi Ego, diretor do projeto Blue Lock.
Avalie o desempenho recente do atacante ${character.name} (Ranking atual: #${curr}).
Estatísticas e feitos recentes:
${JSON.stringify(recentPerformances || [])}
Arma: ${character.mainWeapon}
Estilo: ${character.playstyle}

Na sua voz cínica, direta, filosófica e obcecada pelo egoísmo puro:
1. Dê um feedback contundente sobre o que ele mostrou até agora.
2. Determine a nova posição no ranking (lembre-se: ranking vai de 1 a 300, sendo 1 o topo absoluto!).
3. Se estiver na Neo Egoist League, calcule também a proposta em Ienes (¥) de clubes europeus (Real Madrid, Bastard München, Manshine City, Ubers, etc.).

Retorne JSON:
{
  "egoMonologue": "Monólogo de Jinpachi Ego com sua clássica taça de yakisoba...",
  "newRanking": ${newRank},
  "rankingDelta": -6,
  "clubBid": {
    "club": "Bastard München",
    "amountYen": 15000000,
    "formatted": "¥ 15.000.000"
  },
  "unlockedWeapons": []
}
`;

    const raw = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseJson(raw, defaultFallback);
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Using high-fidelity fallback for ranking evaluation:", error?.message || error);
    return res.json(defaultFallback);
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Blue Lock RPG server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
