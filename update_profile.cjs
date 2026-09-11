const fs = require('fs');
let code = fs.readFileSync('src/components/EgoistProfileView.tsx', 'utf-8');

// Replace stat incrementing UI since they no longer distribute points manually
const oldLevelSection = `      {/* Level, Exp & Points Allocation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono text-zinc-400">PROGRESSO DE EVOLUÇÃO</div>
            <div className="text-lg font-bold font-['Chakra_Petch'] text-white">
              Nível {character.level} Egoísta
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-mono">
              <span className="text-zinc-400">Pontos para Atributos: </span>
              <span className="text-cyan-400 font-bold text-base">{availablePoints} pts</span>
            </div>
          </div>
        </div>

        {/* EXP Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>EXP para Nível {character.level + 1}</span>
            <span>
              {character.exp} / {character.expToNextLevel} EXP
            </span>
          </div>
          <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: \`\${Math.min(100, (character.exp / character.expToNextLevel) * 100)}%\` }}
            />
          </div>
        </div>
      </div>`;

const newLevelSection = `      {/* Level, Exp & Points Allocation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono text-zinc-400">PROGRESSO DE EVOLUÇÃO</div>
            <div className="text-lg font-bold font-['Chakra_Petch'] text-white">
              Nível {character.level} Egoísta
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-mono">
              <span className="text-zinc-400">Treinos 1v1 Restantes: </span>
              <span className="text-emerald-400 font-bold text-base">{character.trainingsAvailable || 0}</span>
              <div className="text-[10px] text-zinc-500">+3 treinos ganhos por partida jogada</div>
            </div>
          </div>
        </div>

        {/* EXP Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>EXP para Nível {character.level + 1}</span>
            <span>
              {character.exp} / {character.expToNextLevel} EXP
            </span>
          </div>
          <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: \`\${Math.min(100, (character.exp / character.expToNextLevel) * 100)}%\` }}
            />
          </div>
        </div>
      </div>`;

code = code.replace(oldLevelSection, newLevelSection);

// We also need to remove the '+' buttons in the stat grid.
const oldGridSection = `      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-white pb-2 border-b border-zinc-800">
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-['Chakra_Petch'] uppercase tracking-wider">Pentágono de Atributos</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {STAT_CONFIG.map(({ key, label, desc }) => {
              const val = localStats[key];
              const getGrade = (v: number) => {
                if (v >= 90) return { letter: "S", color: "text-amber-400 border-amber-400 bg-amber-400/10" };
                if (v >= 80) return { letter: "A", color: "text-cyan-400 border-cyan-400 bg-cyan-400/10" };
                if (v >= 70) return { letter: "B", color: "text-emerald-400 border-emerald-400 bg-emerald-400/10" };
                if (v >= 60) return { letter: "C", color: "text-zinc-300 border-zinc-600 bg-zinc-600/10" };
                return { letter: "D", color: "text-zinc-500 border-zinc-800 bg-zinc-800/30" };
              };
              const grade = getGrade(val);

              return (
                <div key={key} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-bold text-zinc-200">{label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{desc}</div>
                    </div>
                    <div className={\`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono border \${grade.color}\`}>
                      {grade.letter}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 transition-all duration-300"
                          style={{ width: \`\${val}%\` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold w-6 text-right">{val}</div>
                    
                    {availablePoints > 0 && (
                      <button
                        onClick={() => handleIncrementStat(key)}
                        disabled={val >= 99}
                        className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-zinc-950 flex items-center justify-center transition disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>`;

const newGridSection = `      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-white pb-2 border-b border-zinc-800">
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-['Chakra_Petch'] uppercase tracking-wider">Pentágono de Atributos</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {STAT_CONFIG.map(({ key, label, desc }) => {
              const val = localStats[key];
              const getGrade = (v: number) => {
                if (v >= 90) return { letter: "S", color: "text-amber-400 border-amber-400 bg-amber-400/10" };
                if (v >= 80) return { letter: "A", color: "text-cyan-400 border-cyan-400 bg-cyan-400/10" };
                if (v >= 70) return { letter: "B", color: "text-emerald-400 border-emerald-400 bg-emerald-400/10" };
                if (v >= 60) return { letter: "C", color: "text-zinc-300 border-zinc-600 bg-zinc-600/10" };
                return { letter: "D", color: "text-zinc-500 border-zinc-800 bg-zinc-800/30" };
              };
              const grade = getGrade(val);

              return (
                <div key={key} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-bold text-zinc-200">{label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{desc}</div>
                    </div>
                    <div className={\`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono border \${grade.color}\`}>
                      {grade.letter}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 transition-all duration-300"
                          style={{ width: \`\${val}%\` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold w-6 text-right">{val}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>`;

code = code.replace(oldGridSection, newGridSection);

fs.writeFileSync('src/components/EgoistProfileView.tsx', code);
