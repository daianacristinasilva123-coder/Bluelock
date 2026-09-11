import React from "react";
import { StoryChapter, CharacterProfile } from "../types";
import { Play, CheckCircle2, Lock, Flame, ShieldAlert, Award } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  chapters: StoryChapter[];
  character: CharacterProfile;
  onStartMatchForChapter: (chapter: StoryChapter) => void;
  onSelectStoryScene: (chapterTitle: string) => void;
  onOpenTransfers?: () => void;
}

export const StoryProgressView: React.FC<Props> = ({
  chapters,
  character,
  onStartMatchForChapter,
  onSelectStoryScene,
  onOpenTransfers,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 text-zinc-100 font-sans space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
            Estrutura Canônica do Anime & Neo Egoist League
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Chakra_Petch'] text-white mt-1">
            AS 10 FASES DO PROJETO EGOÍSTA
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
            Desde a Seleção do Time Z e Primeira Seleção até a batalha contra o Japão Sub-20 e o leilão europeu da Liga Neo Egoísta.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-4 shrink-0 text-xs font-mono">
          <div>
            <div className="text-zinc-500">Seu Ranking Atual</div>
            <div className="text-xl font-bold font-['Chakra_Petch'] text-amber-400">
              #{character.currentRanking}
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <div className="text-zinc-500">Meta Suprema</div>
            <div className="text-xl font-bold font-['Chakra_Petch'] text-cyan-400">
              TOP #1
            </div>
          </div>
        </div>
      </div>

      {/* Neo Egoist League Transfer Auction Banner */}
      {onOpenTransfers && (
        <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0">
              ¥
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                <span>MERCADO DE TRANSFERÊNCIAS • NEO EGOIST LEAGUE</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-zinc-950 text-[9px] font-black">
                  LEILÃO OFICIAL
                </span>
              </div>
              <h3 className="text-base font-bold font-['Chakra_Petch'] text-white mt-0.5">
                {character.currentClub ? (
                  <>Contratado: <span className="text-emerald-300">{character.currentClub}</span> (¥{(character.currentBidYen || 120000000).toLocaleString()})</>
                ) : (
                  <>Os 5 Gigantes Europeus estão disputando seu passe!</>
                )}
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
                Bastard München (Alemanha), P.X.G (França), Manshine City (Inglaterra), Ubers (Itália) e Barcha (Espanha) enviaram ofertas salariais milionárias em Ienes.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenTransfers();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-zinc-950 font-black font-['Chakra_Petch'] uppercase text-xs tracking-wider transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Acessar Leilão dos Clubes</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {chapters.map((chap, idx) => {
          return (
            <div
              key={chap.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition relative overflow-hidden ${
                chap.isCompleted
                  ? "bg-zinc-900/60 border-emerald-500/40"
                  : chap.isUnlocked
                  ? "bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950/20"
                  : "bg-zinc-950/60 border-zinc-800/80 opacity-60"
              }`}
            >
              <div>
                {/* Chapter header */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    FASE 0{chap.id}
                  </span>

                  {chap.isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> CONCLUÍDA
                    </span>
                  ) : chap.isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-mono text-cyan-300 font-bold animate-pulse">
                      ● EM ANDAMENTO
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-mono text-zinc-500">
                      <Lock className="w-3.5 h-3.5" /> BLOQUEADA
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white">
                  {chap.title}
                </h3>
                <div className="text-xs text-amber-300 font-semibold mb-2">
                  {chap.subtitle}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  {chap.description}
                </p>

                {/* Adversários e Chaves */}
                <div className="space-y-1.5 text-xs font-mono mb-4 pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-zinc-500 font-semibold">Rivais:</span>
                    <span className="text-rose-300 truncate">{chap.opponents.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-zinc-500 font-semibold">Personagens-Chave:</span>
                    <span className="text-cyan-300 truncate">{chap.keyCharacters.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                <button
                  disabled={!chap.isUnlocked}
                  onClick={() => {
                    sounds.playClick();
                    onSelectStoryScene(chap.title);
                  }}
                  className="px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition disabled:opacity-40"
                >
                  Diálogos & Vestiário
                </button>
                <button
                  disabled={!chap.isUnlocked}
                  onClick={() => {
                    sounds.playWhistle();
                    onStartMatchForChapter(chap);
                  }}
                  className="px-3 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black font-['Chakra_Petch'] text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition disabled:opacity-40 shadow-sm shadow-cyan-400/30"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Jogar Partida
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
