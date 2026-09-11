import React, { useState, useRef, useEffect } from "react";
import { InMatchChatMessage, CharacterProfile, PitchState } from "../types";
import { Send, MessageSquare, Flame, Sparkles, Shield, Zap, AlertCircle, Swords, AlertTriangle } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  messages: InMatchChatMessage[];
  character: CharacterProfile;
  playerTeam: string;
  opponentTeam: string;
  currentMinute: number;
  pitchState: PitchState;
  currentScore: { playerTeam: number; opponentTeam: number };
  onSendMessage: (messageText: string) => Promise<void>;
  isLoading: boolean;
}

export const InMatchChatPanel: React.FC<Props> = ({
  messages,
  character,
  playerTeam,
  opponentTeam,
  currentMinute,
  pitchState,
  currentScore,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    sounds.playClick();
    const txt = textToSend.trim();
    setInputText("");
    await onSendMessage(txt);
  };

  const QUICK_SHOUTS = [
    { label: "Passa a bola pra mim agora!", icon: Zap, category: "teammate" },
    { label: "Faz a tabela 1-2 comigo!", icon: Sparkles, category: "teammate" },
    { label: "Desmarca no ponto cego da zaga!", icon: Flame, category: "teammate" },
    { label: "Entra firme na dividida, não recua!", icon: Shield, category: "teammate" },
    { label: "Rival, você não vai passar por mim!", icon: Swords, category: "rival" },
    { label: "Vem pro mano a mano se tiver coragem!", icon: Flame, category: "rival" },
    { label: "Eu vou te devorar nesse gramado!", icon: AlertCircle, category: "rival" },
    { label: "Juiz, foi falta clara! Marca isso!", icon: AlertTriangle, category: "foul" },
    { label: "Ego, qual é a peça que falta?", icon: MessageSquare, category: "coach" },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950/80 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
              Comunicação & Gritos de Campo
            </h4>
            <div className="text-[10px] text-zinc-400 font-mono">
              Fale com companheiros (Isagi, Bachira), rivais (Kaiser, Rin) e Ego
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded">
          ⏱️ {currentMinute}&apos;
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.length === 0 ? (
          <div className="text-center py-8 px-4 text-zinc-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-cyan-400" />
            <p className="font-semibold text-zinc-400">Nenhum diálogo ainda nesta partida</p>
            <p className="text-[11px] mt-1 text-zinc-500">
              Grite ordens táticas, peça a bola, provoque os rivais ou converse com seus parceiros!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "player";
            const isRival = msg.role === "rival";
            const isCoach = msg.role === "coach";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Name & Minute Badge */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono">
                  <span className="text-zinc-500">⏱️ {msg.minute}&apos;</span>
                  <span
                    className={`font-bold ${
                      isUser
                        ? "text-cyan-400"
                        : isRival
                        ? "text-rose-400"
                        : isCoach
                        ? "text-amber-400"
                        : "text-blue-400"
                    }`}
                  >
                    {msg.sender}
                  </span>
                  {!isUser && (
                    <span
                      className={`text-[9px] px-1 rounded uppercase ${
                        isRival
                          ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                          : isCoach
                          ? "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                          : "bg-blue-950/60 text-blue-300 border border-blue-800/40"
                      }`}
                    >
                      {isRival ? "Rival" : isCoach ? "Técnico" : "Time"}
                    </span>
                  )}
                </div>

                {/* Speech Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed border ${
                    isUser
                      ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-50 rounded-br-none"
                      : isRival
                      ? "bg-rose-950/40 border-rose-500/40 text-rose-50 rounded-bl-none"
                      : isCoach
                      ? "bg-amber-950/40 border-amber-500/40 text-amber-50 rounded-bl-none"
                      : "bg-zinc-900 border-zinc-700/80 text-zinc-100 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Tactical Effect Tag */}
                  {msg.tacticalEffect && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-1 text-[10px] font-mono text-cyan-300 font-semibold">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{msg.tacticalEffect}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2 bg-zinc-900/60 rounded-lg border border-cyan-500/30 animate-pulse w-fit">
            <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Ouvindo resposta no gramado...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* In-Match Question Responses if pending */}
      {messages.length > 0 && messages[messages.length - 1].role !== "player" && messages[messages.length - 1].content.includes("?") && (
        <div className="px-2.5 py-1.5 bg-amber-950/40 border-t border-amber-500/30 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-[10px] font-mono text-amber-300 font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Responder Pergunta:
          </span>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSend("Vou chutar de primeira no ângulo, se prepara!")}
            className="shrink-0 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-200 text-[10px] font-medium"
          >
            🔥 Chuto de primeira!
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSend("Manda no ponto cego que eu devoro o espaço!")}
            className="shrink-0 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/40 text-cyan-200 text-[10px] font-medium"
          >
            ⚡ Solta no ponto cego!
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSend("Cala a boca e tenta me parar se for capaz!")}
            className="shrink-0 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 text-rose-200 text-[10px] font-medium"
          >
            ⚔️ Tenta me parar!
          </button>
        </div>
      )}

      {/* Quick Shout Buttons */}
      <div className="p-2 bg-zinc-900/80 border-t border-zinc-800/80">
        <div className="text-[10px] font-mono text-zinc-400 mb-1 px-1 flex items-center justify-between">
          <span>Gritos Táticos Rápidos:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_SHOUTS.map((shout, idx) => {
            const Icon = shout.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(shout.label)}
                disabled={isLoading}
                className="shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition disabled:opacity-50"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span>{shout.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Message Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Grite algo no campo para o time ou rivais..."
          disabled={isLoading}
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Enviar grito no campo"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
