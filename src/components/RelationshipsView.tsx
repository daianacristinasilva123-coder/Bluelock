import React, { useState } from "react";
import { CharacterProfile, CharacterRelationship, CharacterMemory } from "../types";
import { CANONICAL_CHARACTERS } from "../data/canonicalCharacters";
import { HeartHandshake, Swords, Shield, Zap, MessageSquare, Flame, Award } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  character: CharacterProfile;
  relationships: Record<string, CharacterRelationship>;
  memories: CharacterMemory[];
  onStartChatWith: (characterName: string) => void;
  onStart1v1Training: (characterName: string) => void;
}

export const RelationshipsView: React.FC<Props> = ({
  character,
  relationships,
  memories,
  onStartChatWith,
  onStart1v1Training,
}) => {
  const [filter, setFilter] = useState<"all" | "family_friends" | "rivals">("all");
  const [selectedCharDetail, setSelectedCharDetail] = useState<string | null>(null);

  const characterList = Object.keys(CANONICAL_CHARACTERS).map((name) => {
    const rel = relationships[name] || {
      characterName: name,
      role: CANONICAL_CHARACTERS[name].role,
      avatarColor: CANONICAL_CHARACTERS[name].avatarColor,
      trust: 30,
      respect: 40,
      rivalry: 50,
      chemistry: 20,
      status: "Competidor",
      lastInteraction: "Convocado para o mesmo bloco de seleção.",
    };
    const info = CANONICAL_CHARACTERS[name];
    const charMemories = memories.filter(
      (m) => m.characterName.toLowerCase() === name.toLowerCase()
    );

    return { name, rel, info, charMemories };
  });

  const filtered = characterList.filter(({ rel }) => {
    if (filter === "family_friends") {
      return rel.trust >= 60 || rel.status.toLowerCase().includes("irmão") || rel.status.toLowerCase().includes("amigo");
    }
    if (filter === "rivals") {
      return rel.rivalry >= 60 || rel.status.toLowerCase().includes("rival");
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 text-zinc-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <HeartHandshake className="w-4 h-4" />
            Rede de Relações & Dinâmica de Egos
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Chakra_Petch'] text-white mt-1">
            VÍNCULOS & RIVALIDADES
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
            Cada atacante reage dinamicamente às suas decisões, jogadas e provocações.
            Vínculos familiares e amizades influenciam quem passa a bola para você.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => {
              setFilter("all");
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "all" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40" : "text-zinc-400 hover:text-white"
            }`}
          >
            Todos ({characterList.length})
          </button>
          <button
            onClick={() => {
              setFilter("family_friends");
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "family_friends" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40" : "text-zinc-400 hover:text-white"
            }`}
          >
            Amigos & Família
          </button>
          <button
            onClick={() => {
              setFilter("rivals");
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "rivals" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40" : "text-zinc-400 hover:text-white"
            }`}
          >
            Rivais Jurados
          </button>
        </div>
      </div>

      {/* Grid of Character Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {filtered.map(({ name, rel, info, charMemories }) => {
          const isCanonTarget = character.canonTargetCharacter === name;

          return (
            <div
              key={name}
              className={`bg-zinc-900/90 border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-zinc-700 ${
                isCanonTarget
                  ? "border-cyan-500/80 shadow-lg shadow-cyan-950/30 bg-gradient-to-b from-zinc-900 to-cyan-950/20"
                  : "border-zinc-800"
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white">
                        {name}
                      </h3>
                      {isCanonTarget && (
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                          VÍNCULO PRINCIPAL
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">{info.role}</div>
                  </div>

                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border font-bold ${
                      rel.status.includes("Irmão")
                        ? "bg-cyan-950 text-cyan-300 border-cyan-500/50"
                        : rel.status.includes("Amigo")
                        ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                        : rel.status.includes("Rival")
                        ? "bg-rose-950 text-rose-300 border-rose-500/50"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    {rel.status}
                  </span>
                </div>

                {/* Quote */}
                <div className="text-xs italic text-zinc-400 bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/80 mb-4">
                  &ldquo;{info.quote}&rdquo;
                </div>

                {/* Relationship Meters */}
                <div className="space-y-2 text-xs font-mono">
                  {/* Trust */}
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>Confiança</span>
                      <span className="text-cyan-400 font-bold">{rel.trust}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${rel.trust}%` }}
                      />
                    </div>
                  </div>

                  {/* Respect */}
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>Respeito Mútuo</span>
                      <span className="text-emerald-400 font-bold">{rel.respect}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${rel.respect}%` }}
                      />
                    </div>
                  </div>

                  {/* Rivalry */}
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>Rivalidade / Tensão</span>
                      <span className="text-rose-400 font-bold">{rel.rivalry}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${rel.rivalry}%` }}
                      />
                    </div>
                  </div>

                  {/* Chemistry */}
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <span>Química de Jogo</span>
                      <span className="text-amber-400 font-bold">{rel.chemistry}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${rel.chemistry}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Memories Count */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>Memórias Registradas:</span>
                  <span className="text-zinc-300 font-bold">{charMemories.length} eventos</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onStartChatWith(name);
                  }}
                  className="px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  Conversar
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onStart1v1Training(name);
                  }}
                  className="px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-bold font-['Chakra_Petch'] text-cyan-300 flex items-center justify-center gap-1.5 transition"
                >
                  <Swords className="w-3.5 h-3.5 text-cyan-400" />
                  Duelo 1v1
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
