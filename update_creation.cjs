const fs = require('fs');
let code = fs.readFileSync('src/components/CharacterCreationView.tsx', 'utf-8');

const oldStatsSection = `          {/* Section 4: Atributos Iniciais */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-white">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold font-['Chakra_Petch'] uppercase tracking-wider">
                  4. Atributos do Egoísta (0 - 99)
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Média Geral: {Math.round((Object.values(stats) as number[]).reduce((a, b) => a + b, 0) / 8)}
              </span>
            </div>

            {/* Presets */}
            <div className="mt-4">
              <label className="block text-xs font-mono text-zinc-400 mb-2">Selecione um Arquétipo Pré-definido:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {Object.entries(STAT_PRESETS).map(([key, p]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className={\`p-2.5 rounded-lg border text-left transition \${
                      selectedPreset === key
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }\`}
                  >
                    <div className="text-xs font-semibold">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {(
                [
                  { key: "speed", label: "Velocidade" },
                  { key: "strength", label: "Força Física" },
                  { key: "finishing", label: "Finalização" },
                  { key: "dribble", label: "Drible" },
                  { key: "ballControl", label: "Controle de Bola" },
                  { key: "vision", label: "Visão de Jogo" },
                  { key: "iq", label: "QI / Inteligência" },
                  { key: "stamina", label: "Resistência" },
                ] as { key: keyof PlayerStats; label: string }[]
              ).map(({ key, label }) => {
                const val = stats[key];
                return (
                  <div key={key} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-zinc-400">{label}</span>
                      <span className="font-bold text-emerald-400">{val}</span>
                    </div>
                    <input
                      type="range"
                      min={45}
                      max={95}
                      value={val}
                      onChange={(e) => handleStatChange(key, Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>`;

const newStatsSection = `          {/* Section 4: Atributos Iniciais (Gacha) */}
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
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/50 transition transform hover:scale-105 active:scale-95"
              >
                Girar Roleta de Potencial
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
          </div>`;

code = code.replace(oldStatsSection, newStatsSection);

// We need to update state and imports.
const oldStateLogic = `  // Stats
  const [selectedPreset, setSelectedPreset] = useState<string>("clinical_striker");
  const [stats, setStats] = useState<PlayerStats>(STAT_PRESETS.clinical_striker.stats);

  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    setStats({ ...STAT_PRESETS[presetKey].stats });
    sounds.playClick();
  };

  const handleStatChange = (statKey: keyof PlayerStats, val: number) => {
    setStats((prev) => ({
      ...prev,
      [statKey]: Math.min(95, Math.max(45, val)),
    }));
  };`;

const newStateLogic = `  // Stats
  const [hasSpun, setHasSpun] = useState(false);
  const [spinTier, setSpinTier] = useState<"Normal" | "Avançado" | "Classe Mundial">("Normal");
  const [stats, setStats] = useState<PlayerStats>({
    speed: 50, strength: 50, finishing: 50, dribble: 50, ballControl: 50, vision: 50, iq: 50, stamina: 50
  });

  const handleSpinStats = () => {
    sounds.playClick();
    
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
  };`;

code = code.replace(oldStateLogic, newStateLogic);

// Add disabled condition to the submit button if they haven't spun
code = code.replace(`disabled={isLoadingPrologue}`, `disabled={isLoadingPrologue || !hasSpun}`);

fs.writeFileSync('src/components/CharacterCreationView.tsx', code);
