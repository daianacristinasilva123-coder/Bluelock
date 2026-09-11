import { CharacterRelationship, StoryChapter } from "../types";

export interface CanonCharacterInfo {
  name: string;
  romaji: string;
  role: string;
  quote: string;
  personality: string;
  avatarColor: string;
  accentColor: string;
  weapon: string;
  number?: number;
}

export const CANONICAL_CHARACTERS: Record<string, CanonCharacterInfo> = {
  "Isagi Yoichi": {
    name: "Isagi Yoichi",
    romaji: "Yoichi Isagi",
    role: "Egoísta da Adaptação & Metavisão (Camisa 11 do Time Z)",
    quote: "Eu vou devorar você e reconstruir a minha fórmula de gol!",
    personality: "Humilde e observador fora do gramado; dentro dele, um predador voraz, analítico e impiedoso, buscando sempre a peça que falta.",
    avatarColor: "bg-blue-950 text-blue-300 border-blue-500",
    accentColor: "#3b82f6",
    weapon: "Chute Direto (Direct Shot), Olfato para o Gol & Metavisão Espacial",
    number: 11,
  },
  "Meguru Bachira": {
    name: "Meguru Bachira",
    romaji: "Meguru Bachira",
    role: "Driblador Frenético & Voz do Monstro (Camisa 8 do Time Z)",
    quote: "Vem dançar com o meu monstro!",
    personality: "Extrovertido, brincalhão, excêntrico e instintivo. Encara o futebol como uma dança de pura liberdade e improvisação.",
    avatarColor: "bg-amber-950 text-amber-300 border-amber-500",
    accentColor: "#f59e0b",
    weapon: "Drible de Quebra de Ritmo, Elástico & Passes Teleguiados",
    number: 8,
  },
  "Rensuke Kunigami": {
    name: "Rensuke Kunigami",
    romaji: "Rensuke Kunigami",
    role: "O Herói Muscular / Canhota de Fogo (Camisa 9 do Time Z)",
    quote: "Eu jogo para me tornar um super-herói do futebol.",
    personality: "Honrado, forte, leal e disciplinado. Acredita no jogo limpo e na força inabalável dos seus ideais.",
    avatarColor: "bg-orange-950 text-orange-300 border-orange-500",
    accentColor: "#f97316",
    weapon: "Míssil de Canhota a 28 Metros & Físico Brutal",
    number: 9,
  },
  "Hyoma Chigiri": {
    name: "Hyoma Chigiri",
    romaji: "Hyoma Chigiri",
    role: "A Pantera Rubra Veloz (Camisa 4 do Time Z)",
    quote: "Ninguém neste campo consegue acompanhar a minha velocidade.",
    personality: "Elegante, calmo e focado. Rompeu as correntes do trauma no joelho para se tornar a pantera imparável em velocidade máxima.",
    avatarColor: "bg-rose-950 text-rose-300 border-rose-500",
    accentColor: "#f43f5e",
    weapon: "Velocidade Máxima de 44.88 km/h & Arrancada a 50m",
    number: 4,
  },
  "Gin Gagamaru": {
    name: "Gin Gagamaru",
    romaji: "Gin Gagamaru",
    role: "O Predador Acrobático & Muralha Felina (Camisa 6 do Time Z)",
    quote: "Reação física instantânea. Se a bola voar, eu mordo.",
    personality: "Selvagem, quieto, come carne crua, dorme em posições estranhas e possui uma flexibilidade corporal sobre-humana.",
    avatarColor: "bg-emerald-950 text-emerald-300 border-emerald-500",
    accentColor: "#10b981",
    weapon: "Defesas Acrobáticas de Escorpião & Alcance Dinâmico",
    number: 6,
  },
  "Jingo Raichi": {
    name: "Jingo Raichi",
    romaji: "Jingo Raichi",
    role: "O Cão de Guarda Sexy Soccer (Camisa 10 do Time Z)",
    quote: "Sai do meu caminho, seu bosta! Eu vou grudar em você até o apito final!",
    personality: "Boca-suja, agressivo, orgulhoso e incansável. Nunca foge de uma dividida e destrói o fôlego de qualquer atacante rival.",
    avatarColor: "bg-red-950 text-red-300 border-red-500",
    accentColor: "#ef4444",
    weapon: "Marcação Sexy Incessante 1v1 & Duelo Físico Brutal",
    number: 10,
  },
  "Gurimu Igarashi": {
    name: "Gurimu Igarashi",
    romaji: "Gurimu Igarashi (Igaguri)",
    role: "O Monge Desesperado & Malícia (Camisa 12 do Time Z)",
    quote: "Nem morto eu volto pro templo do meu pai! Namu Amida Butsu!",
    personality: "Cômico, desesperado por sobrevivência, medroso em treinos mas cheio de truques e malandragem para cavar faltas.",
    avatarColor: "bg-yellow-950 text-yellow-300 border-yellow-500",
    accentColor: "#eab308",
    weapon: "Malícia / Cavar Falta Teatral & Sobrevivência Pura",
    number: 12,
  },
  "Asahi Naruhaya": {
    name: "Asahi Naruhaya",
    romaji: "Asahi Naruhaya",
    role: "O Caçador do Ponto Cego (Camisa 5 do Time Z)",
    quote: "Eu jogo para sustentar meus irmãos menores. Não posso perder aqui!",
    personality: "Travesso, ladrão de lanches, carinhoso com a família e com uma leitura precisa de infiltração sem a bola nas costas da zaga.",
    avatarColor: "bg-stone-900 text-stone-300 border-stone-500",
    accentColor: "#a8a29e",
    weapon: "Movimentação sem Bola no Ponto Cego da Defesa",
    number: 5,
  },
  "Wataru Kuon": {
    name: "Wataru Kuon",
    romaji: "Wataru Kuon",
    role: "O Saltador Aéreo & Estrategista Traidor (Camisa 3 do Time Z)",
    quote: "Para sobreviver, até os heróis devem calcular cada traição.",
    personality: "Parecia o irmão mais velho acolhedor, mas esconde um lado frio e egoísta disposto a tudo para garantir a artilharia.",
    avatarColor: "bg-indigo-950 text-indigo-300 border-indigo-500",
    accentColor: "#6366f1",
    weapon: "Salto Vertical de Basquete & Cabeceio Aéreo",
    number: 3,
  },
  "Okuhito Iemon": {
    name: "Okuhito Iemon",
    romaji: "Okuhito Iemon",
    role: "O Capitão Provisório & Goleiro Honrado (Camisa 1 do Time Z)",
    quote: "Se é pelo time, eu assumo a trave sem reclamar.",
    personality: "Responsável, prestativo, maduro e sempre pronto para sacrificar a própria posição para manter o Time Z unido.",
    avatarColor: "bg-cyan-950 text-cyan-300 border-cyan-500",
    accentColor: "#06b6d4",
    weapon: "Liderança de Vestiário & Posicionamento Defensivo",
    number: 1,
  },
  "Yudai Imamura": {
    name: "Yudai Imamura",
    romaji: "Yudai Imamura",
    role: "O Ponta Paquerador & Agilidade (Camisa 7 do Time Z)",
    quote: "O futebol tem que ter estilo e conquista, como paquerar garotas!",
    personality: "Vaidoso, ágil, descontraído e veloz em sprints laterais de apoio ofensivo.",
    avatarColor: "bg-pink-950 text-pink-300 border-pink-500",
    accentColor: "#ec4899",
    weapon: "Agilidade Curta & Velocidade Lateral de Fuga",
    number: 7,
  },
  "Ryosuke Kira": {
    name: "Ryosuke Kira",
    romaji: "Ryosuke Kira",
    role: "A Joia Nacional do Japão (Primeiro Eliminado)",
    quote: "O futebol é um esporte de equipe! Você está louco, Ego!",
    personality: "O craque bom-moço do futebol colegial tradicional japonês, hipócrita em sua falsa modéstia e chocado ao ser eliminado no Onigokko.",
    avatarColor: "bg-teal-950 text-teal-300 border-teal-500",
    accentColor: "#14b8a6",
    weapon: "Passe Refinado de Alta Precisão & Status de Joia Nacional",
    number: 11,
  },
  "Barou Shoei": {
    name: "Barou Shoei",
    romaji: "Shoei Barou",
    role: "O Rei dos Vilões (Camisa 10 do Time X)",
    quote: "Eu sou o Rei deste campo. Saiam do meu caminho, plebeus!",
    personality: "Maníaco por limpeza e organização rigorosa, narcisista futebolístico feroz que exige que todos se prostrem diante do seu reinado.",
    avatarColor: "bg-red-950 text-red-300 border-red-500",
    accentColor: "#ef4444",
    weapon: "Drible de Força (Chop Dribble) & Chute Curvo a 29 Metros",
    number: 10,
  },
  "Ikki Niko": {
    name: "Ikki Niko",
    romaji: "Ikki Niko",
    role: "O Estrategista das Sombras (Camisa 9 do Time Y)",
    quote: "Eu vejo o campo inteiro. Seus movimentos já estão na minha palma.",
    personality: "Tímido e quieto por trás da franja cobrindo os olhos, mas um general tático impiedoso que usa visão espacial para contra-ataques cirúrgicos.",
    avatarColor: "bg-violet-950 text-violet-300 border-violet-500",
    accentColor: "#8b5cf6",
    weapon: "Visão Espacial Analítica & Desarme em Ponto Cego",
    number: 9,
  },
  "Hibiki Okawa": {
    name: "Hibiki Okawa",
    romaji: "Hibiki Okawa",
    role: "Artilheiro de Kumamoto (Time Y)",
    quote: "Deixa a bola nos meus pés que eu sou o artilheiro do colegial!",
    personality: "Confiante e explosivo na finalização, sendo a arma letal alimentada pelos passes de Niko.",
    avatarColor: "bg-purple-950 text-purple-300 border-purple-500",
    accentColor: "#a855f7",
    weapon: "Finalização Rápida no Contra-Ataque & Arrancada Central",
    number: 11,
  },
  "Irmãos Wanima": {
    name: "Irmãos Wanima",
    romaji: "Junichi & Keisuke Wanima",
    role: "Os Gêmeos Crocodilos do Caos (Time W)",
    quote: "Olha só o joelho do Chigiri tremendo! Vamos quebrar ele de novo!",
    personality: "Sádicos, provocadores, com caretas monstruosas e uma sincronia telepática perfeita no gramado.",
    avatarColor: "bg-lime-950 text-lime-300 border-lime-500",
    accentColor: "#84cc16",
    weapon: "Sincronia Telepática de Gêmeos & Jogo Psicológico Sujo",
    number: 10,
  },
  "Seishiro Nagi": {
    name: "Seishiro Nagi",
    romaji: "Seishiro Nagi",
    role: "Gênio do Domínio Instantâneo (Camisa 11 do Time V)",
    quote: "Que incômodo... Posso ir dormir agora?",
    personality: "Preguiçoso, relaxado, incrivelmente talentoso, despreza esforço inútil, mas acende em chamas quando provocado por rivais que o forçam a evoluir.",
    avatarColor: "bg-slate-700 text-white border-slate-400",
    accentColor: "#94a3b8",
    weapon: "Domínio Absoluto de Gravidade Zero & Voleio no Ponto Cego",
    number: 11,
  },
  "Mikage Reo": {
    name: "Mikage Reo",
    romaji: "Reo Mikage",
    role: "O Camaleão / Maestro (Camisa 9 do Time V)",
    quote: "Eu vou comprar a Copa do Mundo com as minhas próprias mãos.",
    personality: "Carismático, bilionário herdeiro da Mikage Corp, hipercompetitivo e obcecado por alcançar o topo mundial ao lado de Nagi.",
    avatarColor: "bg-purple-950 text-purple-300 border-purple-500",
    accentColor: "#a855f7",
    weapon: "Cópia a 99% de Qualquer Habilidade & Polivalência Suprema",
    number: 9,
  },
  "Tsurugi Zantetsu": {
    name: "Tsurugi Zantetsu",
    romaji: "Zantetsu Tsurugi",
    role: "A Arrancada Bala (Camisa 10 do Time V)",
    quote: "Não me chame de burro! Eu sou inteligente em aceleração pura!",
    personality: "Usa óculos para parecer sábio mas confunde palavras difíceis; no entanto, seus primeiros passos de aceleração humilham qualquer marcador.",
    avatarColor: "bg-amber-950 text-amber-200 border-amber-600",
    accentColor: "#d97706",
    weapon: "Aceleração Explosiva nos Primeiros Passos & Chute Canhoto Curvo",
    number: 10,
  },
  "Itoshi Rin": {
    name: "Itoshi Rin",
    romaji: "Rin Itoshi",
    role: "O Número 1 & Fantocheiro Implacável",
    quote: "Você é morno. Destrua-se diante de mim.",
    personality: "Frio, hipercompetitivo, ríspido, calculista e obcecado por superar e aniquilar o irmão Sae. Não tolera mediocridade.",
    avatarColor: "bg-emerald-950 text-emerald-300 border-emerald-500",
    accentColor: "#10b981",
    weapon: "Curvatura Perfeita & Marionetista do Campo Inteiro",
    number: 10,
  },
  "Ryusei Shidou": {
    name: "Ryusei Shidou",
    romaji: "Ryusei Shidou",
    role: "Demônio da Grande Área",
    quote: "Exploda seus limites! O gol é o orgasmo supremo da existência!",
    personality: "Extremamente agressivo, carismático, selvagem, imprevisível e sem qualquer respeito por hierarquias.",
    avatarColor: "bg-pink-950 text-pink-300 border-pink-500",
    accentColor: "#ec4899",
    weapon: "Consciência Espacial Extrema na Área & Gols Acrobáticos",
    number: 13,
  },
  "Michael Kaiser": {
    name: "Michael Kaiser",
    romaji: "Michael Kaiser",
    role: "Prodígio Mundial da Nova Geração & Ás do Bastard",
    quote: "Ajoelhe-se diante do Imperador. Vocês não passam de figurantes.",
    personality: "Arrogante, teatral, sádico taticamente, refinado e com desprezo por quem não alcança sua velocidade de chute.",
    avatarColor: "bg-indigo-950 text-indigo-300 border-indigo-500",
    accentColor: "#6366f1",
    weapon: "Kaiser Impact (O Balanço de Perna Mais Rápido do Mundo)",
    number: 10,
  },
  "Itoshi Sae": {
    name: "Itoshi Sae",
    romaji: "Sae Itoshi",
    role: "Joia Mundial Sub-20 (Real Madrid)",
    quote: "O futebol japonês é um lixo sem futuro.",
    personality: "Frio, distante, impecável tecnicamente, direto e cético com quem não tem fome real de grandeza.",
    avatarColor: "bg-teal-950 text-teal-300 border-teal-500",
    accentColor: "#14b8a6",
    weapon: "Passes Destruidores de Linhas & Precisão Cirúrgica",
    number: 10,
  },
  "Noel Noa": {
    name: "Noel Noa",
    romaji: "Noel Noa",
    role: "O Melhor Atacante do Mundo (Bastard München)",
    quote: "Dê-me dados, lógica e 100% de probabilidade. Emoções não marcam gols.",
    personality: "Ultra-racional, estoico, analítico, o auge da máquina perfeita de finalização com ambas as pernas.",
    avatarColor: "bg-yellow-950 text-yellow-300 border-yellow-500",
    accentColor: "#eab308",
    weapon: "Ambidestria Absoluta & Eficiência Mecânica",
    number: 9,
  },
  "Jinpachi Ego": {
    name: "Jinpachi Ego",
    romaji: "Jinpachi Ego",
    role: "Arquiteto e Diretor de Blue Lock",
    quote: "Sejam egoístas. Descartem a mediocridade do bom mocismo.",
    personality: "Cínico, visionário, psicologicamente afiado, provocador voraz de fomes insaciáveis.",
    avatarColor: "bg-zinc-900 text-cyan-400 border-cyan-500",
    accentColor: "#06b6d4",
    weapon: "Análise Psicotática & Filosofia do Egoísmo Puro",
    number: 0,
  },
};

export const INITIAL_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    code: "TIME_Z_CAP_1",
    title: "Capítulo 1: Quarto 300 - O Teste do Onigokko",
    subtitle: "136 Segundos para Sobreviver ao Pega-Pega & Eliminação de Kira",
    description: "O início exato de Blue Lock! Jinpachi Ego tranca os 12 atacantes do Time Z (Isagi, Bachira, Kunigami, Chigiri, Raichi, Igarashi, Kuon, Gagamaru, Iemon, Imamura, Naruhaya e Kira). Uma bola. Quem for atingido quando o cronômetro zerar é expulso do futebol para sempre!",
    opponents: ["Ryosuke Kira (Joia Nacional)", "Gurimu Igarashi (Igaguri)", "Atacantes do Quarto 300"],
    keyCharacters: ["Isagi Yoichi", "Meguru Bachira", "Ryosuke Kira", "Jinpachi Ego", "Rensuke Kunigami"],
    isCompleted: false,
    isUnlocked: true,
  },
  {
    id: 2,
    code: "TIME_Z_CAP_2",
    title: "Capítulo 2: Primeira Seleção - Time Z vs Time X",
    subtitle: "A Estreia no Prédio 5 & O Reinado de Barou Shouei",
    description: "A primeira partida oficial da Primeira Seleção! O Time Z começa em caos total, brigando egoisticamente pela bola, até que Barou Shouei, o 'Rei' do Time X, humilha a todos com 4 gols. Isagi e Bachira descobrem que o futebol Blue Lock nasce de 'criar o 1 a partir do 0', servindo a bomba de Kunigami!",
    opponents: ["Barou Shoei (O Rei)", "Time X Completo"],
    keyCharacters: ["Barou Shoei", "Isagi Yoichi", "Rensuke Kunigami", "Meguru Bachira", "Jingo Raichi"],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 3,
    code: "TIME_Z_CAP_3",
    title: "Capítulo 3: Primeira Seleção - Time Z vs Time Y",
    subtitle: "A Retranca Mortal & A Visão Espacial de Ikki Niko",
    description: "O Time Z joga tudo ou nada com a 'Operação Próximo Eu'. O Time Y arma uma retranca impenetrável e contra-ataca sob o comando genial de Ikki Niko para o artilheiro Hibiki Okawa. Isagi desperta sua visão de jogo/olfato para o gol, Gagamaru salva na linha e o Time Z vence no último segundo (2x1)!",
    opponents: ["Ikki Niko (O Estrategista)", "Hibiki Okawa (Artilheiro)", "Defesa Trancada do Time Y"],
    keyCharacters: ["Ikki Niko", "Isagi Yoichi", "Gin Gagamaru", "Hyoma Chigiri", "Asahi Naruhaya"],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 4,
    code: "TIME_Z_CAP_4",
    title: "Capítulo 4: Primeira Seleção - Time Z vs Time W",
    subtitle: "Os Gêmeos Wanima & A Quebra das Correntes da Pantera",
    description: "Os irmãos Wanima usam sincronia telepática e zombam da lesão no joelho de Chigiri. Para piorar, Wataru Kuon trai o Time Z, vendendo todas as táticas secretas para fazer um hat-trick e ser artilheiro isolado! Jogando com 10 contra 12 e perdendo por 4x3, Chigiri rasga suas correntes, dispara a 44.88 km/h e empata em 4x4!",
    opponents: ["Keisuke Wanima", "Junichi Wanima", "Wataru Kuon (O Traidor)"],
    keyCharacters: ["Hyoma Chigiri", "Wataru Kuon", "Isagi Yoichi", "Jingo Raichi", "Irmãos Wanima"],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 5,
    code: "TIME_Z_CAP_5",
    title: "Capítulo 5: Time Z vs Time V (Batalha Final do Prédio 5)",
    subtitle: "O Despertar dos Monstros & A Vitória Épica do Chute Direto",
    description: "O jogo do destino! O invicto Time V (Nagi, Reo, Zantetsu) massacra no início abrindo 3x0. Bachira ri e desperta seu monstro com um golaço de trivela. Kunigami solta um míssil na gaveta. Chigiri voa em sprint. Nagi desperta a paixão pelo futebol. Kuon comete uma falta heroica se redimindo com cartão vermelho. E Isagi inventa o 'Direct Shot' no último suspiro para a vitória por 5x4!",
    opponents: ["Seishiro Nagi", "Mikage Reo", "Tsurugi Zantetsu", "Time V Completo"],
    keyCharacters: ["Seishiro Nagi", "Mikage Reo", "Isagi Yoichi", "Meguru Bachira", "Hyoma Chigiri", "Wataru Kuon"],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 6,
    code: "SELECAO_2_CAP_6",
    title: "Capítulo 6: Segunda Seleção - Duelo contra o Top 3",
    subtitle: "100 Gols no Blue Lock Man & O Monstro Itoshi Rin",
    description: "Após vencer o teste individual dos 100 gols com chute direto contra o Blue Lock Man holográfico, o trio formado por Isagi, Bachira e o protagonista desafia os maiores de Blue Lock: Itoshi Rin (#1), Jyubei Aryu (#2) e Aoshi Tokimitsu (#3). Rin mostra a distância abissal, vence por 5x4 e rouba Bachira!",
    opponents: ["Itoshi Rin (Top 1)", "Jyubei Aryu (Top 2)", "Aoshi Tokimitsu (Top 3)"],
    keyCharacters: ["Itoshi Rin", "Meguru Bachira", "Isagi Yoichi", "Jyubei Aryu", "Aoshi Tokimitsu"],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 7,
    code: "SELECAO_2_CAP_7",
    title: "Capítulo 7: Segunda Seleção - Queda e Ascensão do Rei",
    subtitle: "Duelo 2v2 no Limite do Abismo & 3v3 de Titãs",
    description: "Isagi e Nagi caem para o 2v2 onde quem perde é expulso! Enfrentam Barou Shoei e o ex-companheiro de Time Z, Asahi Naruhaya. Isagi devora o drible no ponto cego de Naruhaya, força o Rei Barou a provar o desespero e recruta Barou para o 3v3 épico contra Chigiri, Kunigami e Reo Mikage!",
    opponents: ["Barou Shoei", "Asahi Naruhaya", "Reo Mikage", "Rensuke Kunigami"],
    keyCharacters: ["Barou Shoei", "Seishiro Nagi", "Isagi Yoichi", "Hyoma Chigiri", "Asahi Naruhaya"],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 8,
    code: "SELECAO_2_CAP_8",
    title: "Capítulo 8: A Revanche do 4v4",
    subtitle: "Resgatar Bachira & Devorar o Gênio Itoshi Rin",
    description: "O quarteto formado por Isagi, Nagi, Barou e Chigiri desafia o time de Itoshi Rin, Aryu, Tokimitsu e Bachira. Bachira descarta a voz do monstro imaginário e encontra a sua própria essência no drible solto. Isagi lê o campo até os limites do cérebro, decidindo tudo na jogada da sorte (Luck)!",
    opponents: ["Itoshi Rin", "Meguru Bachira", "Jyubei Aryu", "Aoshi Tokimitsu"],
    keyCharacters: ["Itoshi Rin", "Isagi Yoichi", "Meguru Bachira", "Seishiro Nagi", "Barou Shoei"],
    isCompleted: false,
    isUnlocked: false,
  },
  {
    id: 9,
    code: "SUB20_CAP_9",
    title: "Capítulo 9: Blue Lock 11 vs Seleção do Japão Sub-20",
    subtitle: "Estádio Nacional Lotado & O Destino do Projeto Ego",
    description: "A maior partida da história do futebol japonês! O Blue Lock 11 entra em campo para não ser extinto contra a muralha de ferro de Oliver Aiku e o gênio mundial Itoshi Sae, com Ryusei Shidou como demônio de área. Gols inacreditáveis, Gagamaru no gol e a consagração do novo futebol!",
    opponents: ["Itoshi Sae (Real Madrid)", "Oliver Aiku (Capitão Sub-20)", "Ryusei Shidou", "Defesa de Diamante Sub-20"],
    keyCharacters: ["Itoshi Sae", "Oliver Aiku", "Ryusei Shidou", "Isagi Yoichi", "Itoshi Rin", "Gin Gagamaru"],
    isCompleted: false,
    isUnlocked: false,
  },
];

export function buildInitialRelationships(
  relationshipWithCanon: string,
  targetCanon: string
): Record<string, CharacterRelationship> {
  const result: Record<string, CharacterRelationship> = {};

  // Standard initial setups
  Object.keys(CANONICAL_CHARACTERS).forEach((charName) => {
    let trust = 30;
    let respect = 40;
    let rivalry = 50;
    let chemistry = 20;
    let status = "Competidor";

    // Special customization if user selected a relation with this specific character
    if (targetCanon && charName.toLowerCase().includes(targetCanon.toLowerCase())) {
      const rel = relationshipWithCanon.toLowerCase();
      if (rel.includes("irmão") || rel.includes("irmã") || rel.includes("família") || rel.includes("primo")) {
        trust = 90;
        respect = 75;
        rivalry = 30;
        chemistry = 80;
        status = "Irmão / Família";
      } else if (rel.includes("amigo") || rel.includes("infância")) {
        trust = 85;
        respect = 70;
        rivalry = 45;
        chemistry = 75;
        status = "Amigo de Infância";
      } else if (rel.includes("rival")) {
        trust = 25;
        respect = 80;
        rivalry = 95;
        chemistry = 30;
        status = "Rival Jurado";
      } else if (rel.includes("admirador") || rel.includes("fã")) {
        trust = 40;
        respect = 90;
        rivalry = 20;
        chemistry = 40;
        status = "Admirador";
      } else {
        trust = 60;
        respect = 60;
        status = relationshipWithCanon;
      }
    }

    result[charName] = {
      characterName: charName,
      role: CANONICAL_CHARACTERS[charName].role,
      avatarColor: CANONICAL_CHARACTERS[charName].avatarColor,
      trust,
      respect,
      rivalry,
      chemistry,
      status,
      lastInteraction: "Convocado para o mesmo bloco de seleção.",
    };
  });

  return result;
}
