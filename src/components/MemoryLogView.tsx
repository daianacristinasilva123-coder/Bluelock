import React, { useState } from "react";
import { CharacterMemory, CharacterProfile } from "../types";
import { History, Search, Plus, Sparkles, Filter, Bookmark } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  character: CharacterProfile;
  memories: CharacterMemory[];
  onAddCustomMemory: (charName: string, eventText: string) => void;
}

export const MemoryLogView: React.FC<Props> = ({
  character,
  memories,
  onAddCustomMemory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharFilter, setSelectedCharFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCharName, setNewCharName] = useState("Nagi Seishiro");
  const [newEventText, setNewEventText] = useState("");

  const filtered = memories.filter((m) => {
    const matchesSearch =
      m.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.characterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChar =
      selectedCharFilter === "all" ||
      m.characterName.toLowerCase() === selectedCharFilter.toLowerCase();
    return matchesSearch && matchesChar;
  });

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventText.trim()) return;
    sounds.playEgoImpact();
    onAddCustomMemory(newCharName, newEventText.trim());
    setNewEventText("");
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 text-zinc-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <History className="w-4 h-4" />
            Sistema de Memória Viva • Blue Lock
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Chakra_Petch'] text-white mt-1">
            ARQUIVO DE MEMÓRIAS DOS PERSONAGENS
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
            Cada conversa, gol, derrota, provocação ou promessa fica gravada na mente dos outros atacantes.
            A IA consulta este histórico para manter a consistência de cada personagem.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddModal(true);
            sounds.playClick();
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold font-['Chakra_Petch'] text-xs uppercase tracking-wider flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Promessa / Fato
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por palavras-chave (ex: gol, provocação, irmão, treino)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={selectedCharFilter}
            onChange={(e) => setSelectedCharFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Todos os Personagens</option>
            {Array.from(new Set(memories.map((m) => m.characterName))).map((cName) => (
              <option key={cName} value={cName}>
                {cName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Memory Timeline List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <Bookmark className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <div className="text-zinc-300 font-bold font-['Chakra_Petch'] text-base">
              NENHUMA MEMÓRIA ENCONTRADA
            </div>
            <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
              Converse com os jogadores, dispute partidas ou participe de treinos para criar laços e memórias inesquecíveis.
            </p>
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-['Chakra_Petch']">
                      {m.characterName}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        m.importance === "decisiva"
                          ? "bg-rose-950 text-rose-300 border-rose-500/50 font-bold"
                          : m.importance === "alta"
                          ? "bg-amber-950 text-amber-300 border-amber-500/50"
                          : "bg-zinc-950 text-zinc-400 border-zinc-800"
                      }`}
                    >
                      {m.importance.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                    {m.event}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-zinc-500">{m.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Manual Memory */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">
              Registrar Nova Memória / Promessa
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Adicione um fato que os personagens devem sempre recordar na história.
            </p>

            <form onSubmit={handleSaveMemory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Personagem Envolvido</label>
                <input
                  type="text"
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Descrição do Acontecimento ou Promessa</label>
                <textarea
                  rows={3}
                  value={newEventText}
                  onChange={(e) => setNewEventText(e.target.value)}
                  placeholder="Ex: Prometeu a Nagi que ambos passariam juntos pela 2ª Seleção sem falhar..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold font-['Chakra_Petch'] text-xs uppercase"
                >
                  Salvar Memória
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
