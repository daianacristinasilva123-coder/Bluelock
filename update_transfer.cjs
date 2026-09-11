const fs = require('fs');
let code = fs.readFileSync('src/components/TransferMarketView.tsx', 'utf-8');

// 1. Update imports
code = code.replace(
  'RotateCcw,\n} from "lucide-react";',
  'RotateCcw,\n  ListOrdered,\n  Swords,\n} from "lucide-react";'
);

// 2. Update activeSubTab state
code = code.replace(
  'useState<"offers" | "leaderboard" | "egoPhilosophy" | "awards">("offers");',
  'useState<"offers" | "leaderboard" | "egoPhilosophy" | "awards" | "standings" | "cup">("offers");'
);

// 3. Insert Stats Logic right after activeSubTab
const statsLogic = `
  // Stats and season logic
  const matchesPlayed = character.careerStats?.matchesPlayed || 0;
  const isSeasonOver = matchesPlayed >= 10;

  const rivalStats = [
    { name: "Barou Shoei", goals: 15, assists: 2, rating: 8.8 },
    { name: "Michael Kaiser", goals: 13, assists: 6, rating: 9.3 },
    { name: "Itoshi Rin", goals: 14, assists: 4, rating: 9.1 },
    { name: "Yo Hiori", goals: 2, assists: 10, rating: 8.5 },
    { name: "Alexis Ness", goals: 3, assists: 9, rating: 8.4 },
  ];

  const playerGoals = character.careerStats?.goals || 0;
  const playerAssists = character.careerStats?.assists || 0;
  const playerRating = character.careerStats?.averageRating || 0;

  const topScorer = [{name: character.name, goals: playerGoals}, ...rivalStats].sort((a,b) => b.goals - a.goals)[0];
  const topAssists = [{name: character.name, assists: playerAssists}, ...rivalStats].sort((a,b) => b.assists - a.assists)[0];
  const topRating = [{name: character.name, rating: playerRating}, ...rivalStats].sort((a,b) => b.rating - a.rating)[0];

  const playerWonBoot = topScorer.name === character.name;
  const playerWonPlaymaker = topAssists.name === character.name;
  // Bola de ouro = Maior nota + (Mais Gols ou Mais Assistências)
  const playerWonBall = topRating.name === character.name && (playerWonBoot || playerWonPlaymaker);
  
  const ballWinner = playerWonBall ? character : rivalStats.find(r => r.name === topRating.name) || rivalStats[0];
`;
code = code.replace(
  '// Offers from character state or generated',
  statsLogic + '\n  // Offers from character state or generated'
);

// 4. Update the Buttons to include "Tabela" and "Copa"
const buttonsTarget = `
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("awards");
          }}
          className={\`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 \${
            activeSubTab === "awards"
              ? "bg-amber-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-amber-400/70 hover:text-amber-400 border border-zinc-800"
          }\`}
        >
          <Award className="w-3.5 h-3.5" />
          Premiações da Temporada
        </button>
      </div>`;
      
const newButtons = `
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("standings");
          }}
          className={\`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 \${
            activeSubTab === "standings"
              ? "bg-cyan-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }\`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          Tabela da NEL
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("cup");
          }}
          className={\`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 \${
            activeSubTab === "cup"
              ? "bg-cyan-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }\`}
        >
          <Swords className="w-3.5 h-3.5" />
          Copa Blue Lock
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("awards");
          }}
          className={\`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 \${
            activeSubTab === "awards"
              ? "bg-amber-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-amber-400/70 hover:text-amber-400 border border-zinc-800"
          }\`}
        >
          <Award className="w-3.5 h-3.5" />
          Premiações (Fim da Liga)
        </button>
      </div>`;
code = code.replace(buttonsTarget, newButtons);

// 5. Update Awards Tab
const awardsOld = `      {/* VIEW: AWARDS TAB */}
      {activeSubTab === "awards" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-bold">
                <Award className="w-4 h-4" />
                PREMIAÇÕES OFICIAIS DA TEMPORADA NEL
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Cerimônia de Encerramento
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bola de Ouro */}
            <div className="bg-gradient-to-b from-amber-500/10 to-zinc-950 border border-amber-500/30 rounded-xl p-5 text-center flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-amber-500/50"></div>
              <Trophy className="w-12 h-12 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">Bola de Ouro</h3>
              <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">Melhor Jogador da NEL</p>
              
              <div className="bg-amber-400/20 border border-amber-400/50 rounded-lg p-3 w-full">
                <div className="text-sm font-bold text-amber-400 font-['Chakra_Petch'] mb-1">VENCEDOR INCONTESTÁVEL</div>
                <div className="text-white font-bold">{character.name}</div>
                <div className="text-[10px] text-zinc-300 mt-1">Ranking: #{character.currentRanking}</div>
              </div>
            </div>

            {/* Chuteira de Ouro */}
            <div className="bg-gradient-to-b from-emerald-500/10 to-zinc-950 border border-emerald-500/30 rounded-xl p-5 text-center flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-emerald-500/50"></div>
              <Flame className="w-12 h-12 text-emerald-400 mb-3" />
              <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">Chuteira de Ouro</h3>
              <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">Artilheiro Máximo</p>
              
              <div className="bg-emerald-400/20 border border-emerald-400/50 rounded-lg p-3 w-full">
                <div className="text-sm font-bold text-emerald-400 font-['Chakra_Petch'] mb-1">VENCEDOR INCONTESTÁVEL</div>
                <div className="text-white font-bold">{character.name}</div>
                <div className="text-[10px] text-zinc-300 mt-1">{character.careerStats?.goals || 0} Gols Marcados</div>
              </div>
            </div>

            {/* Garçom do Ano */}
            <div className="bg-gradient-to-b from-cyan-500/10 to-zinc-950 border border-cyan-500/30 rounded-xl p-5 text-center flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-cyan-500/50"></div>
              <Sparkles className="w-12 h-12 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">Garçom do Ano</h3>
              <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">Líder de Assistências</p>
              
              <div className="bg-cyan-400/20 border border-cyan-400/50 rounded-lg p-3 w-full">
                <div className="text-sm font-bold text-cyan-400 font-['Chakra_Petch'] mb-1">VENCEDOR INCONTESTÁVEL</div>
                <div className="text-white font-bold">{character.name}</div>
                <div className="text-[10px] text-zinc-300 mt-1">{character.careerStats?.assists || 0} Assistências</div>
              </div>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Como o verdadeiro protagonista do Projeto Blue Lock, você devorou todos e roubou todos os tronos!
            </p>
          </div>
        </div>
      )}`;

const awardsNew = `      {/* VIEW: AWARDS TAB */}
      {activeSubTab === "awards" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-bold">
                <Award className="w-4 h-4" />
                PREMIAÇÕES OFICIAIS DA TEMPORADA NEL
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Cerimônia de Encerramento
              </h2>
            </div>
          </div>

          {!isSeasonOver ? (
            <div className="text-center py-10">
              <Award className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white mb-2">A Temporada Ainda Está em Andamento</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                As premiações da Bola de Ouro, Chuteira de Ouro e Garçom do Ano serão reveladas apenas ao final da liga (10 partidas jogadas).
                Atualmente você jogou {matchesPlayed} partida(s).
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bola de Ouro */}
                <div className="bg-gradient-to-b from-amber-500/10 to-zinc-950 border border-amber-500/30 rounded-xl p-5 text-center flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-amber-500/50"></div>
                  <Trophy className="w-12 h-12 text-amber-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">Bola de Ouro</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">Maior Nota + (Artilheiro/Garçom)</p>
                  
                  {playerWonBall ? (
                    <div className="bg-amber-400/20 border border-amber-400/50 rounded-lg p-3 w-full">
                      <div className="text-sm font-bold text-amber-400 font-['Chakra_Petch'] mb-1">VENCEDOR</div>
                      <div className="text-white font-bold">{character.name}</div>
                      <div className="text-[10px] text-zinc-300 mt-1">Nota Média: {playerRating}</div>
                    </div>
                  ) : (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 w-full">
                      <div className="text-sm font-bold text-zinc-400 font-['Chakra_Petch'] mb-1">VENCEDOR</div>
                      <div className="text-white font-bold">{ballWinner.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Nota Média: {(ballWinner as any).rating || (ballWinner as any).averageRating}</div>
                    </div>
                  )}
                </div>

                {/* Chuteira de Ouro */}
                <div className="bg-gradient-to-b from-emerald-500/10 to-zinc-950 border border-emerald-500/30 rounded-xl p-5 text-center flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-emerald-500/50"></div>
                  <Flame className="w-12 h-12 text-emerald-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">Chuteira de Ouro</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">Artilheiro Máximo</p>
                  
                  {playerWonBoot ? (
                    <div className="bg-emerald-400/20 border border-emerald-400/50 rounded-lg p-3 w-full">
                      <div className="text-sm font-bold text-emerald-400 font-['Chakra_Petch'] mb-1">VENCEDOR</div>
                      <div className="text-white font-bold">{character.name}</div>
                      <div className="text-[10px] text-zinc-300 mt-1">{playerGoals} Gols Marcados</div>
                    </div>
                  ) : (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 w-full">
                      <div className="text-sm font-bold text-zinc-400 font-['Chakra_Petch'] mb-1">VENCEDOR</div>
                      <div className="text-white font-bold">{topScorer.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">{topScorer.goals} Gols Marcados</div>
                    </div>
                  )}
                </div>

                {/* Garçom do Ano */}
                <div className="bg-gradient-to-b from-cyan-500/10 to-zinc-950 border border-cyan-500/30 rounded-xl p-5 text-center flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-cyan-500/50"></div>
                  <Sparkles className="w-12 h-12 text-cyan-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">Garçom do Ano</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">Líder de Assistências</p>
                  
                  {playerWonPlaymaker ? (
                    <div className="bg-cyan-400/20 border border-cyan-400/50 rounded-lg p-3 w-full">
                      <div className="text-sm font-bold text-cyan-400 font-['Chakra_Petch'] mb-1">VENCEDOR</div>
                      <div className="text-white font-bold">{character.name}</div>
                      <div className="text-[10px] text-zinc-300 mt-1">{playerAssists} Assistências</div>
                    </div>
                  ) : (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 w-full">
                      <div className="text-sm font-bold text-zinc-400 font-['Chakra_Petch'] mb-1">VENCEDOR</div>
                      <div className="text-white font-bold">{topAssists.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">{topAssists.assists} Assistências</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                  A disputa foi brutal. Apenas os verdadeiros atacantes sobreviveram para contar história!
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW: STANDINGS TAB */}
      {activeSubTab === "standings" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase font-bold">
                <ListOrdered className="w-4 h-4" />
                CLASSIFICAÇÃO GERAL
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Tabela da Neo Egoist League
              </h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-4">Clube</th>
                  <th className="py-3 px-4 text-center">J</th>
                  <th className="py-3 px-4 text-center">V</th>
                  <th className="py-3 px-4 text-center">E</th>
                  <th className="py-3 px-4 text-center">D</th>
                  <th className="py-3 px-4 text-center">SG</th>
                  <th className="py-3 px-4 text-center font-bold text-white">Pts</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-amber-400">1</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇩🇪 Bastard München</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">+7</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">12</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-300">2</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇫🇷 Paris X Gen</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">3</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">1</td>
                  <td className="py-3 px-4 text-center text-zinc-300">+5</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">9</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-400">3</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇮🇹 Ubers</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">2</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">2</td>
                  <td className="py-3 px-4 text-center text-zinc-300">+1</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">6</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-500">4</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇬🇧 Manshine City</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">1</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">3</td>
                  <td className="py-3 px-4 text-center text-zinc-300">-4</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">3</td>
                </tr>
                <tr className="hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-600">5</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇪🇸 F.C. Barcha</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">-9</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            * A tabela reflete a classificação dos clubes ao final da NEL. 
          </div>
        </div>
      )}

      {/* VIEW: CUP TAB */}
      {activeSubTab === "cup" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase font-bold">
                <Swords className="w-4 h-4" />
                MATA-MATA ESPECIAL
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Copa Blue Lock (U-20 World Cup Preliminar)
              </h2>
            </div>
          </div>
          <div className="py-10 text-center">
            <Swords className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 font-['Chakra_Petch']">Chaveamento em Definição</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              A Copa do Mundo Sub-20 se aproxima. Apenas os 23 jogadores que sobreviverem ao leilão final formarão a seleção do Japão para enfrentar as potências globais no torneio eliminatório!
            </p>
          </div>
        </div>
      )}`;
      
code = code.replace(awardsOld, awardsNew);

// Rename 'Propostas de Transferência' button to include Janela
code = code.replace(
  'Propostas de Transferência ({offers.length})',
  'Janela de Transferência ({offers.length})'
);

fs.writeFileSync('src/components/TransferMarketView.tsx', code);
