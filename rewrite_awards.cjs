const fs = require('fs');
let code = fs.readFileSync('src/components/TransferMarketView.tsx', 'utf-8');

const oldLogic = `  // Stats and season logic
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
  
  const ballWinner = playerWonBall ? character : rivalStats.find(r => r.name === topRating.name) || rivalStats[0];`;

const newLogic = `  // Stats and season logic
  const matchesPlayed = character.careerStats?.matchesPlayed || 0;
  const isSeasonOver = matchesPlayed >= 10;

  const m = Math.max(1, matchesPlayed);
  const rivalStats = [
    { name: "Barou Shoei", goals: Math.floor(m * 1.5), assists: Math.floor(m * 0.2), rating: 8.8 },
    { name: "Michael Kaiser", goals: Math.floor(m * 1.3), assists: Math.floor(m * 0.6), rating: 9.3 },
    { name: "Itoshi Rin", goals: Math.floor(m * 1.4), assists: Math.floor(m * 0.4), rating: 9.1 },
    { name: "Yo Hiori", goals: Math.floor(m * 0.2), assists: Math.floor(m * 1.0), rating: 8.5 },
    { name: "Alexis Ness", goals: Math.floor(m * 0.3), assists: Math.floor(m * 0.9), rating: 8.4 },
  ];

  const playerGoals = character.careerStats?.goals || 0;
  const playerAssists = character.careerStats?.assists || 0;
  const playerRating = character.careerStats?.averageRating || 0;

  const allPlayers = [
    { name: character.name, goals: playerGoals, assists: playerAssists, rating: playerRating, isPlayer: true },
    ...rivalStats.map(r => ({ ...r, isPlayer: false }))
  ];

  const topScorers = [...allPlayers].sort((a,b) => b.goals - a.goals);
  const topAssists = [...allPlayers].sort((a,b) => b.assists - a.assists);
  const topRatings = [...allPlayers].sort((a,b) => b.rating - a.rating);

  const topScorer = topScorers[0];
  const topPlaymaker = topAssists[0];
  
  // Bola de ouro: quem tem mais nota E (mais gols ou mais assistências)
  let ballWinner = topScorer;
  if (topPlaymaker.rating > topScorer.rating) {
    ballWinner = topPlaymaker;
  }
  if (topRatings[0].rating > ballWinner.rating && (topRatings[0].goals === topScorer.goals || topRatings[0].assists === topPlaymaker.assists)) {
    ballWinner = topRatings[0];
  }
`;

code = code.replace(oldLogic, newLogic);

const oldView = `              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>`;

const newView = `              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bola de Ouro */}
                <div className="bg-gradient-to-b from-amber-500/10 to-zinc-950 border border-amber-500/30 rounded-xl p-5 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-amber-500/50"></div>
                  <Trophy className="w-12 h-12 text-amber-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase text-center">Bola de Ouro</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase text-center">Maior Nota + (Artilheiro/Garçom)</p>
                  
                  <div className="w-full space-y-2 mt-2">
                    <div className="flex justify-between items-center bg-amber-400/20 border border-amber-400/50 rounded-lg p-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">1º</span>
                        <span className={\`font-bold \${ballWinner.isPlayer ? 'text-amber-400' : 'text-white'}\`}>{ballWinner.name}</span>
                      </div>
                      <div className="text-xs text-amber-400 font-mono">Nota: {ballWinner.rating.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {/* Chuteira de Ouro */}
                <div className="bg-gradient-to-b from-emerald-500/10 to-zinc-950 border border-emerald-500/30 rounded-xl p-5 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-emerald-500/50"></div>
                  <Flame className="w-12 h-12 text-emerald-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase text-center">Chuteira de Ouro</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase text-center">Artilheiro Máximo</p>
                  
                  <div className="w-full space-y-2 mt-2">
                    {topScorers.slice(0, 3).map((player, idx) => (
                      <div key={idx} className={\`flex justify-between items-center rounded-lg p-2 px-3 \${idx === 0 ? 'bg-emerald-400/20 border border-emerald-400/50' : 'bg-zinc-800/50 border border-zinc-700/50'}\`}>
                        <div className="flex items-center gap-2">
                          <span className={\`font-bold \${idx === 0 ? 'text-emerald-400' : 'text-zinc-500'}\`}>{idx + 1}º</span>
                          <span className={\`font-bold \${player.isPlayer ? 'text-cyan-400' : 'text-white'}\`}>{player.name}</span>
                        </div>
                        <div className={\`text-xs font-mono \${idx === 0 ? 'text-emerald-400' : 'text-zinc-400'}\`}>{player.goals} Gols</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garçom do Ano */}
                <div className="bg-gradient-to-b from-cyan-500/10 to-zinc-950 border border-cyan-500/30 rounded-xl p-5 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-cyan-500/50"></div>
                  <Sparkles className="w-12 h-12 text-cyan-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase text-center">Garçom do Ano</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase text-center">Líder de Assistências</p>
                  
                  <div className="w-full space-y-2 mt-2">
                    {topAssists.slice(0, 3).map((player, idx) => (
                      <div key={idx} className={\`flex justify-between items-center rounded-lg p-2 px-3 \${idx === 0 ? 'bg-cyan-400/20 border border-cyan-400/50' : 'bg-zinc-800/50 border border-zinc-700/50'}\`}>
                        <div className="flex items-center gap-2">
                          <span className={\`font-bold \${idx === 0 ? 'text-cyan-400' : 'text-zinc-500'}\`}>{idx + 1}º</span>
                          <span className={\`font-bold \${player.isPlayer ? 'text-cyan-400' : 'text-white'}\`}>{player.name}</span>
                        </div>
                        <div className={\`text-xs font-mono \${idx === 0 ? 'text-cyan-400' : 'text-zinc-400'}\`}>{player.assists} Assis</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>`;

code = code.replace(oldView, newView);
fs.writeFileSync('src/components/TransferMarketView.tsx', code);
