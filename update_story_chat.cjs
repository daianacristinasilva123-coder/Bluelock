const fs = require('fs');
let code = fs.readFileSync('src/components/StoryChatView.tsx', 'utf-8');

const oldHeaderDiv = `<div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400">FASE:</span>
          <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
            {currentChapter}
          </span>
          <span className="bg-amber-950/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
            RANK #{character.currentRanking}
          </span>
        </div>`;

const newHeaderDiv = `<div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400 hidden sm:inline">FASE:</span>
          <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
            {currentChapter}
          </span>
          <span className="bg-amber-950/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
            RANK #{character.currentRanking}
          </span>
          {character.trainingsAvailable !== undefined && character.trainingsAvailable > 0 && (
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3" /> {character.trainingsAvailable} Treinos Disp.
            </span>
          )}
        </div>`;

code = code.replace(oldHeaderDiv, newHeaderDiv);

const oldImports = `import { MapPin, Users, Send, ShieldAlert, Zap, Flame, Award } from "lucide-react";`;
if (!code.includes(oldImports)) {
  // It might not have Zap imported
  code = code.replace(`import { MapPin, Users, Send, ShieldAlert, Award, Flame } from "lucide-react";`, `import { MapPin, Users, Send, ShieldAlert, Award, Flame, Zap } from "lucide-react";`);
}

// Add the training button beside the chips
const oldChipsEnd = `          );
        })}
      </div>`;

const newChipsEnd = `          );
        })}
        
        {character.trainingsAvailable !== undefined && character.trainingsAvailable > 0 && (
          <button
            onClick={() => onOpen1v1Training(selectedRecipient === "Todos" ? "Barou Shoei" : selectedRecipient)}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold ml-auto shrink-0 flex items-center gap-1 shadow-md shadow-emerald-900/30 transition border border-emerald-400"
          >
            <Zap className="w-3 h-3" /> Treinar 1v1
          </button>
        )}
      </div>`;

code = code.replace(oldChipsEnd, newChipsEnd);

fs.writeFileSync('src/components/StoryChatView.tsx', code);
