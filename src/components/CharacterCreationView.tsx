import React, { useState } from "react";
import { CharacterProfile, PlayerStats } from "../types";
import { CANONICAL_CHARACTERS } from "../data/canonicalCharacters";
import { Sparkles, Zap, Shield, Target, User, Flame, Compass, ChevronRight } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  onComplete: (character: CharacterProfile) => void;
  isLoadingPrologue: boolean;
}

const STAT_PRESETS: Record<string, { label: string; desc: string; stats: PlayerStats }> = {
  balanced: {
    label: "Equilibrado",
    desc: "Atributos versáteis prontos para qualquer adaptação.",
    stats: { speed: 68, strength: 65, finishing: 70, dribble: 68, ballControl: 70, vision: 67, iq: 69, stamina: 70 },
  },
  speedster: {
    label: "Velocista Letal",
    desc: "Inspirado em Chigiri e Zantetsu. Rompe linhas em velocidade máxima.",
    stats: { speed: 86, strength: 58, finishing: 68, dribble: 75, ballControl: 65, vision: 62, iq: 64, stamina: 72 },
  },
  clinical_striker: {
    label: "Artilheiro Clínico",
    desc: "Faro de gol implacável na grande área como Rin e Kunigami.",
    stats: { speed: 66, strength: 74, finishing: 85, dribble: 62, ballControl: 73, vision: 68, iq: 72, stamina: 68 },
  },
  dribble_magician: {
    label: "Mágico do Drible",
    desc: "Inspirado em Bachira e Yukimiya. Quebras de ritmo e agilidade pura.",
    stats: { speed: 78, strength: 55, finishing: 66, dribble: 88, ballControl: 82, vision: 65, iq: 68, stamina: 66 },
  },
  tactical_genius: {
    label: "Gênio Tático",
    desc: "Inspirado em Isagi e Niko. Leitura espacial e QI futebolístico elevado.",
    stats: { speed: 64, strength: 60, finishing: 68, dribble: 66, ballControl: 74, vision: 86, iq: 88, stamina: 74 },
  },
  physical_monster: {
    label: "Monstro Físico",
    desc: "Inspirado em Barou e Tokimitsu. Proteção de bola e arranque brutal.",
    stats: { speed: 72, strength: 88, finishing: 76, dribble: 65, ballControl: 68, vision: 58, iq: 62, stamina: 82 },
  },
};

const NATIONALITIES = [
  { label: "Brasil 🇧🇷", val: "Brasil 🇧🇷" },
  { label: "Japão 🇯🇵", val: "Japão 🇯🇵" },
  { label: "Alemanha 🇩🇪", val: "Alemanha 🇩🇪" },
  { label: "França 🇫🇷", val: "França 🇫🇷" },
  { label: "Argentina 🇦🇷", val: "Argentina 🇦🇷" },
  { label: "Espanha 🇪🇸", val: "Espanha 🇪🇸" },
  { label: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿", val: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { label: "Itália 🇮🇹", val: "Itália 🇮🇹" },
  { label: "Portugal 🇵🇹", val: "Portugal 🇵🇹" },
];

export const CharacterCreationView: React.FC<Props> = ({ onComplete, isLoadingPrologue }) => {
  // Basic info
  const [name, setName] = useState("Leo Nakamura");
  const [nickname, setNickname] = useState("O Predador Solitário");
  const [age, setAge] = useState(16);
  const [nationality, setNationality] = useState("Brasil 🇧🇷");
  const [height, setHeight] = useState(181);
  const [position, setPosition] = useState("Centroavante (CF)");
  const [dominantFoot, setDominantFoot] = useState("Direito (Destro)");

  // Appearance & Narrative
  const [appearance, setAppearance] = useState("Cabelo preto desgrenhado com mechas azul-petróleo, olhar afiado e focado, físico atlético esguio.");
  const [personality, setPersonality] = useState("Ambicioso, observador, calmo sob pressão, mas feroz e insaciável quando pisa na grande área.");
  const [backstory, setBackstory] = useState("Destaque jovem com passagem por clubes de base no Brasil e Japão. Veio para o Blue Lock rejeitando o futebol cooperativo tradicional para provar que gols individuais definem o vencedor.");
  const [playstyle, setPlaystyle] = useState("Caçador de Espaços e Finalizador de Primeira");
  const [mainWeapon, setMainWeapon] = useState("Curva Impossível com Efeito Reverso no Ponto Cego");

  // Canon Relationship (Core feature!)
  const [targetCanon, setTargetCanon] = useState("Nagi Seishiro");
  const [relationType, setRelationType] = useState("irmão mais novo");
  const [customRelationDetail, setCustomRelationDetail] = useState("Irmão mais novo do Nagi Seishiro que cresceu jogando futebol de rua enquanto Nagi jogava videogame.");

  // Stats
  const [hasSpun, setHasSpun] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(3);
  const [spinTier, setSpinTier] = useState<"Normal" | "Avançado" | "Classe Mundial">("Normal");
  const [stats, setStats] = useState<PlayerStats>({
    speed: 50, strength: 50, finishing: 50, dribble: 50, ballControl: 50, vision: 50, iq: 50, stamina: 50
  });

  const handleSpinStats = () => {
    if (spinsRemaining <= 0) return;
    sounds.playClick();
    setSpinsRemaining((prev) => prev - 1);
    
    // Determine tier randomly (60% Normal, 30% Avançado, 10% Classe Mundial)
    const roll = Math.random();
    let min = 50;
    let max = 69;
    let tier: "Normal" | "Avançado" | "Classe Mundial" = "Normal";
    
    if (roll > 0.90) {
      tier = "Classe Mundial";
      min = 80;
      max = 90;
    } else if (roll > 0.60) {
      tier = "Avançado";
      min = 70;
      max = 80;
    }

    setSpinTier(tier);
    setHasSpun(true);

    // Randomize stats within bracket
    const generateStat = () => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Boost specific stats depending on position
    let newStats = {
      speed: generateStat(),
      strength: generateStat(),
      finishing: generateStat(),
      dribble: generateStat(),
      ballControl: generateStat(),
      vision: generateStat(),
      iq: generateStat(),
      stamina: generateStat(),
    };

    if (position.includes("CF")) newStats.finishing = Math.min(95, newStats.finishing + 5);
    if (position.includes("LW") || position.includes("RW")) newStats.speed = Math.min(95, newStats.speed + 5);
    if (position.includes("CAM")) newStats.vision = Math.min(95, newStats.vision + 5);

    setStats(newStats);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playEgoImpact();

    const relationshipFormatted = relationType === "Nenhum"
      ? "Nenhum vínculo prévio conhecido"
      : `${relationType} de ${targetCanon}. ${customRelationDetail}`;

    const newChar: CharacterProfile = {
      id: "char_" + Date.now(),
      name: name.trim() || "Atacante Egoísta",
      nickname: nickname.trim(),
      age: Number(age),
      nationality,
      height: Number(height),
      position,
      dominantFoot,
      appearance: appearance.trim(),
      personality: personality.trim(),
      backstory: backstory.trim(),
      playstyle: playstyle.trim(),
      mainWeapon: mainWeapon.trim(),
      relationshipWithCanon: relationshipFormatted,
      canonTargetCharacter: targetCanon,
      stats,
      level: 1,
      exp: 0,
      expToNextLevel: 100,
      statPointsAvailable: 0,
      unlockedWeapons: [mainWeapon.trim()],
      currentRanking: 299,
      highestRanking: 299,
      jerseyNumber: 299,
      currentBidYen: 0,
      currentClub: "Blue Lock Project",
      careerStats: {
        goals: 0,
        assists: 0,
        matchesPlayed: 0,
        averageRating: 0,
      },
    };

    onComplete(newChar);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs tracking-widest uppercase font-mono mb-3">
            <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Criação de Atacante Original • Blue Lock
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Chakra_Petch'] text-white">
            FORJE SEU <span className="text-cyan-400">EGOÍSTA</span>
          </h1>
          <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Crie seu personagem original. Apenas você controla suas decisões, falas e ações.
            A IA controla todos os 299 rivais, treinadores e o destino de Blue Lock.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Identidade Básica */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800 text-white">
              <User className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold font-['Chakra_Petch'] uppercase tracking-wider">
                1. Identidade do Jogador
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Apelido / Alcunha</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ex: O Imperador da Área, O Fantasma"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Nacionalidade</label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  {NATIONALITIES.map((n) => (
                    <option key={n.val} value={n.val}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Idade ({age} anos)</label>
                <input
                  type="range"
                  min={15}
                  max={18}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Altura ({height} cm)</label>
                <input
                  type="range"
                  min={165}
                  max={198}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Pé Dominante</label>
                <select
                  value={dominantFoot}
                  onChange={(e) => setDominantFoot(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="Direito (Destro)">Direito (Destro)</option>
                  <option value="Esquerdo (Canhoto)">Esquerdo (Canhoto)</option>
                  <option value="Ambidestro Puro">Ambidestro Puro</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Posição Predileta</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    "Centroavante (CF)",
                    "Segundo Atacante (SS)",
                    "Ponta Esquerda (LW)",
                    "Ponta Direita (RW)",
                    "Meia Ofensivo (CAM)",
                  ].map((pos) => (
                    <button
                      type="button"
                      key={pos}
                      onClick={() => {
                        setPosition(pos);
                        sounds.playClick();
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition ${
                        position === pos
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Vínculo e Relação com Personagem Existente (Destaque Fundamental!) */}
          <div className="bg-gradient-to-br from-zinc-900 to-indigo-950/40 border-2 border-cyan-500/50 rounded-xl p-5 sm:p-6 shadow-lg shadow-cyan-950/20">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold font-['Chakra_Petch'] uppercase tracking-wider text-white">
                  2. Relação com Personagens do Blue Lock
                </h2>
                <p className="text-xs text-zinc-400">
                  Exemplo do prompt: Nagi pode ser seu irmão mais novo ou rival de base. A IA lembrará disso e reagirá dinamicamente!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">Personagem Canônico Alvo</label>
                <select
                  value={targetCanon}
                  onChange={(e) => setTargetCanon(e.target.value)}
                  className="w-full bg-zinc-950 border border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-medium"
                >
                  {Object.keys(CANONICAL_CHARACTERS).map((cName) => (
                    <option key={cName} value={cName}>
                      {cName} ({CANONICAL_CHARACTERS[cName].role})
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400">
                  <span className="text-cyan-300 font-semibold">{targetCanon}:</span>{" "}
                  &ldquo;{CANONICAL_CHARACTERS[targetCanon]?.quote}&rdquo;
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">Tipo de Relação</label>
                <select
                  value={relationType}
                  onChange={(e) => {
                    setRelationType(e.target.value);
                    if (e.target.value === "irmão mais novo") {
                      setCustomRelationDetail(`Irmão mais novo do ${targetCanon} que veio para o Blue Lock forjar seu próprio caminho.`);
                    } else if (e.target.value === "amigo de infância") {
                      setCustomRelationDetail(`Amigo de infância inseparável de ${targetCanon} que prometeu chegar à Copa do Mundo juntos.`);
                    } else if (e.target.value === "rival jurado") {
                      setCustomRelationDetail(`Rival jurado de ${targetCanon} desde as categorias de base com histórico de confrontos acalorados.`);
                    }
                  }}
                  className="w-full bg-zinc-950 border border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-medium"
                >
                  <option value="irmão mais novo">Irmão Mais Novo 👦</option>
                  <option value="irmão mais velho">Irmão Mais Velho 🧑</option>
                  <option value="amigo de infância">Amigo de Infância 🤝</option>
                  <option value="rival jurado">Rival Jurado de Base ⚔️</option>
                  <option value="ex-companheiro de time">Ex-Companheiro de Escola ⚽</option>
                  <option value="admirador respeitoso">Admirador Respeitoso 🌟</option>
                  <option value="Nenhum">Nenhum (Começar como desconhecido total)</option>
                </select>

                <div className="mt-2">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Detalhe / Memória Inicial Compartilhada
                  </label>
                  <input
                    type="text"
                    value={customRelationDetail}
                    onChange={(e) => setCustomRelationDetail(e.target.value)}
                    placeholder="Ex: Nagi sempre pedia para você carregar as mochilas dele na infância..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Preview Banner of Canon Reaction */}
            <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg flex items-start gap-3">
              <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-bold text-cyan-300 uppercase">Impacto Vivo na História:</span> Ao iniciar,{" "}
                <strong className="text-white">{targetCanon}</strong> e outros personagens (como Isagi e Reo) saberão imediatamente deste vínculo. Eles vão comentar, provocar ou te proteger de acordo com seus traços originais!
              </div>
            </div>
          </div>

          {/* Section 3: Arma Principal & Estilo de Jogo */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800 text-white">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold font-['Chakra_Petch'] uppercase tracking-wider">
                3. Arma Principal & Estilo de Jogo
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Arma Principal (Seu Superpoder no Futebol)</label>
                <input
                  type="text"
                  value={mainWeapon}
                  onChange={(e) => setMainWeapon(e.target.value)}
                  placeholder="Ex: Domínio Acrobático, Chute Trivela a 30m, Drible Elástico Rápido"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    "Chute Curvado no Ponto Cego",
                    "Domínio Instantâneo em Movimento",
                    "Arrancada Explosiva em 5 Metros",
                    "Metavisão Tática Periférica",
                    "Drible Invisível de Corpo",
                    "Pivô e Chute no Giro",
                  ].map((sugg) => (
                    <button
                      type="button"
                      key={sugg}
                      onClick={() => {
                        setMainWeapon(sugg);
                        sounds.playClick();
                      }}
                      className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Estilo de Jogo</label>
                <input
                  type="text"
                  value={playstyle}
                  onChange={(e) => setPlaystyle(e.target.value)}
                  placeholder="Ex: Caçador de Espaços, Driblador de Ruptura, Pivô Dominante"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    "Caçador de Espaços",
                    "Driblador Solitário",
                    "Atacante Físico Demolidor",
                    "Criador de Jogadas Letal",
                    "Finalizador Acrobático",
                  ].map((sugg) => (
                    <button
                      type="button"
                      key={sugg}
                      onClick={() => {
                        setPlaystyle(sugg);
                        sounds.playClick();
                      }}
                      className="text-[11px] px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Aparência Visual</label>
                <input
                  type="text"
                  value={appearance}
                  onChange={(e) => setAppearance(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-zinc-400 mb-1">História de Origem & Personalidade</label>
                <textarea
                  rows={2}
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Atributos Iniciais (Gacha) */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-white">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold font-['Chakra_Petch'] uppercase tracking-wider">
                  4. Despertar do Potencial (Rolete seus Atributos)
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Média Geral: {hasSpun ? Math.round((Object.values(stats) as number[]).reduce((a, b) => a + b, 0) / 8) : "?"}
              </span>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-zinc-400 mb-4">
                O seu potencial inicial é definido pelo acaso, dependendo da sua Posição e Arma. Após a criação, os atributos só poderão ser aumentados através de Treinamentos (máximo de 3 treinos por partida).
                <br/><br/>
                <span className="inline-block px-2 py-1 bg-zinc-800 rounded text-xs">Normal: 50-69</span>
                <span className="inline-block px-2 py-1 bg-zinc-800 rounded text-xs ml-2">Avançado: 70-80</span>
                <span className="inline-block px-2 py-1 bg-zinc-800 rounded text-xs ml-2">Classe Mundial: 80-90</span>
              </p>
              
              <button
                type="button"
                onClick={handleSpinStats}
                disabled={spinsRemaining <= 0}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-emerald-900/50 transition transform hover:scale-105 active:scale-95"
              >
                {spinsRemaining > 0 ? `Girar Roleta de Potencial (${spinsRemaining} restantes)` : "Tentativas Esgotadas (3/3)"}
              </button>

              {hasSpun && (
                <div className="mt-6">
                  <div className="inline-block px-4 py-2 rounded-full border border-emerald-500/50 bg-emerald-950/30 text-emerald-400 font-bold mb-4">
                    Talento Despertado: {spinTier}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        { key: "speed", label: "Velocidade" },
                        { key: "strength", label: "Força" },
                        { key: "finishing", label: "Finalização" },
                        { key: "dribble", label: "Drible" },
                        { key: "ballControl", label: "Controle" },
                        { key: "vision", label: "Visão" },
                        { key: "iq", label: "QI" },
                        { key: "stamina", label: "Fôlego" },
                      ] as { key: keyof PlayerStats; label: string }[]
                    ).map(({ key, label }) => {
                      const val = stats[key];
                      return (
                        <div key={key} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 flex flex-col items-center">
                          <span className="text-xs font-mono text-zinc-400 mb-1">{label}</span>
                          <span className="text-xl font-bold font-['Chakra_Petch'] text-emerald-400">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isLoadingPrologue || !hasSpun}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-black font-['Chakra_Petch'] text-lg tracking-wider uppercase transition shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
            >
              {isLoadingPrologue ? (
                <>
                  <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  Jinpachi Ego Está Avaliando Seus Dados...
                </>
              ) : (
                <>
                  Entrar no Blue Lock • Despertar o Ego
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-xs text-zinc-500 mt-2 font-mono">
              Ranking Inicial: #299 • Objetivo: #1 do Mundo
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
