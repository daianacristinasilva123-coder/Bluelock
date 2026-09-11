import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  CharacterProfile,
  ChatMessage,
  CharacterMemory,
  CharacterRelationship,
} from "../types";
import { CANONICAL_CHARACTERS } from "../data/canonicalCharacters";
import {
  Send,
  Sparkles,
  MapPin,
  Users,
  Flame,
  ShieldAlert,
  Award,
  Zap,
  HelpCircle,
  Swords,
  ChevronRight,
  Target,
} from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  character: CharacterProfile;
  messages: ChatMessage[];
  memories: CharacterMemory[];
  relationships: Record<string, CharacterRelationship>;
  currentChapter: string;
  onSendMessage: (text: string, scene: string) => Promise<void>;
  isLoading: boolean;
  onOpen1v1Training: (charName: string) => void;
}

const SCENES = [
  { id: "refeitorio", name: "Refeitório Egoísta (Carne vs Natto)", desc: "Onde os atacantes se alimentam conforme seu ranking e discutem futebol." },
  { id: "vestiario", name: "Vestiário Subterrâneo", desc: "Clima tenso entre partidas e trocas de farpas antes dos testes." },
  { id: "campo", name: "Gramado Sintético de Treinamento", desc: "Campo aberto para disputas 1v1 e aprimoramento de armas individuais." },
  { id: "sala_ego", name: "Monitor Central de Jinpachi Ego", desc: "A tela gigante acende com o olhar arregalado e as provocações de Ego." },
  { id: "dormitorio", name: "Dormitório Comunitário", desc: "Momento de descanso, videogames com Nagi e planos táticos noturnos." },
];

export const StoryChatView: React.FC<Props> = ({
  character,
  messages,
  memories,
  relationships,
  currentChapter,
  onSendMessage,
  isLoading,
  onOpen1v1Training,
}) => {
  const [inputText, setInputText] = useState("");
  const [currentScene, setCurrentScene] = useState(SCENES[0].name);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("Todos");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const textToSend = directText !== undefined ? directText : inputText;
    if (!textToSend.trim() && textToSend !== ".") return;
    if (isLoading) return;

    sounds.playClick();
    const finalContent = selectedRecipient !== "Todos" && textToSend !== "."
      ? `[Para ${selectedRecipient}]: ${textToSend}`
      : textToSend;

    onSendMessage(finalContent, currentScene);
    setInputText("");
  };

  // Detect if the latest message asks a question to prompt rapid dynamic answers
  const lastAiMessage = useMemo(() => {
    const aiMsgs = messages.filter((m) => m.sender === "ai");
    return aiMsgs.length > 0 ? aiMsgs[aiMsgs.length - 1] : null;
  }, [messages]);

  const hasPendingQuestion = useMemo(() => {
    if (!lastAiMessage) return false;
    return lastAiMessage.text.includes("?");
  }, [lastAiMessage]);

  const DYNAMIC_REPLIES = useMemo(() => {
    const target = selectedRecipient !== "Todos" ? selectedRecipient : "Isagi Yoichi";
    return [
      {
        label: "🔥 Impor Meu Ego",
        text: `Eu vou finalizar de primeira e calar todo mundo. Não tenho medo de ninguém nesse gramado!`,
        theme: "rose",
      },
      {
        label: "🧠 Proposta Tática",
        text: `Se você puxar a marcação pro primeiro pau, eu invado o ponto cego da zaga e faço o gol.`,
        theme: "cyan",
      },
      {
        label: `⚔️ Desafiar ${target.split(" ")[0]}`,
        text: `Para ${target}: Você fala muito! Vem pro 1 contra 1 no campo sintético agora pra gente tirar a prova!`,
        theme: "amber",
      },
      {
        label: "⚡ Resposta Direta",
        text: `Pode mandar a bola em mim. Eu garanto que não vou errar o alvo.`,
        theme: "emerald",
      },
    ];
  }, [selectedRecipient]);

  const SUGGESTED_DIALOGUES = [
    character.canonTargetCharacter
      ? `Para ${character.canonTargetCharacter}: "${character.relationshipWithCanon.includes("irmão") ? "Ei, vamos treinar juntos hoje?" : "Qual é o seu plano pro próximo jogo?"}"`
      : 'Para Nagi: "Bora pro campo agora ou vai ficar com preguiça?"',
    'Para Rin: "Qual é o seu limite? Quero ver sua destruição de perto."',
    'Para Isagi: "Como funciona sua fórmula de gol com a Metavisão?"',
    'Para Ego: "Qual é o objetivo real deste próximo teste?"',
    'Para Kaiser: "Você acha mesmo que seu Kaiser Impact é invencível?"',
    '.', // Observe silently
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto bg-zinc-950 border-x border-zinc-800 text-zinc-100 font-sans">
      {/* Top Header / Scene Navigator */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 p-3 sm:p-4 backdrop-blur flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-zinc-400">LOCAL:</span>
          <select
            value={currentScene}
            onChange={(e) => {
              setCurrentScene(e.target.value);
              sounds.playClick();
            }}
            className="bg-zinc-950 border border-zinc-700 text-xs text-cyan-300 font-bold rounded px-2.5 py-1 focus:outline-none focus:border-cyan-400"
          >
            {SCENES.map((sc) => (
              <option key={sc.id} value={sc.name}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
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
        </div>
      </div>

      {/* Recipient Quick Chips */}
      <div className="bg-zinc-900/40 border-b border-zinc-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span className="text-zinc-500 font-mono text-[11px] shrink-0">Dirigir fala:</span>
        <button
          onClick={() => {
            setSelectedRecipient("Todos");
            sounds.playClick();
          }}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition shrink-0 ${
            selectedRecipient === "Todos"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold"
              : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
          }`}
        >
          Ambiente Aberto (Todos)
        </button>
        {Object.keys(CANONICAL_CHARACTERS).slice(0, 9).map((cName) => {
          const isTarget = character.canonTargetCharacter === cName;
          return (
            <button
              key={cName}
              onClick={() => {
                setSelectedRecipient(cName);
                sounds.playClick();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition shrink-0 flex items-center gap-1 ${
                selectedRecipient === cName
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-sm shadow-cyan-900/40"
                  : isTarget
                  ? "bg-indigo-950/80 text-indigo-300 border border-indigo-500/50"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
              }`}
            >
              {isTarget && <Flame className="w-2.5 h-2.5 text-cyan-400" />}
              {cName.split(" ")[0]}
            </button>
          );
        })}
        
        {character.trainingsAvailable !== undefined && character.trainingsAvailable > 0 && (
          <button
            onClick={() => onOpen1v1Training(selectedRecipient === "Todos" ? "Barou Shoei" : selectedRecipient)}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold ml-auto shrink-0 flex items-center gap-1 shadow-md shadow-emerald-900/30 transition border border-emerald-400"
          >
            <Zap className="w-3 h-3" /> Treinar 1v1
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const hasQuestion = !isUser && msg.text.includes("?");

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm transition-all ${
                  isUser
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-cyan-900/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none hover:border-zinc-700"
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-3 text-[11px] font-mono mb-2 pb-1.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold tracking-wide">
                      {isUser ? `VOCÊ (${character.name})` : "BLUE LOCK • MUNDO & PERSONAGENS"}
                    </span>
                    {hasQuestion && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 animate-pulse">
                        <HelpCircle className="w-2.5 h-2.5" /> Pergunta Ativa
                      </span>
                    )}
                  </div>
                  <span className="opacity-60">{msg.timestamp}</span>
                </div>

                {/* Body Text */}
                <div className="leading-relaxed whitespace-pre-line text-sm">
                  {msg.text}
                </div>

                {/* Exp or Stat Progression Badge */}
                {msg.expAwarded && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> +{msg.expAwarded} EXP de Egoísta
                    </span>
                    {msg.statNote && <span className="text-[11px] text-zinc-400">{msg.statNote}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-cyan-400 font-mono bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl max-w-md animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            Os atacantes e Ego estão reagindo ao seu ego com novas provocações...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input area */}
      <div className="p-3 sm:p-4 bg-zinc-900/95 border-t border-zinc-800">
        {/* Dynamic Contextual Action Buttons if character asked a question */}
        {hasPendingQuestion && (
          <div className="mb-3 p-2.5 bg-zinc-950/80 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Respostas Rápidas ao Desafio dos Personagens:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DYNAMIC_REPLIES.map((rep, idx) => (
                <button
                  type="button"
                  key={idx}
                  disabled={isLoading}
                  onClick={() => handleSubmit(undefined, rep.text)}
                  className="flex items-start text-left gap-1.5 p-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-400/50 transition group"
                >
                  <span className="text-[11px] font-bold text-cyan-300 shrink-0 font-mono">
                    {rep.label}:
                  </span>
                  <span className="text-[11px] text-zinc-300 group-hover:text-white line-clamp-1">
                    &quot;{rep.text}&quot;
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 ml-auto shrink-0 self-center" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="text-[10px] font-mono text-zinc-500 self-center flex items-center gap-1">
            <Target className="w-3 h-3 text-cyan-400" /> Tópicos:
          </span>
          {SUGGESTED_DIALOGUES.map((sug, i) => {
            const cleanDisplay = sug.replace(/^Para [^:]+: /, "").replace(/"/g, "");
            return (
              <button
                type="button"
                key={i}
                disabled={isLoading}
                onClick={() => {
                  if (sug === ".") {
                    handleSubmit(undefined, ".");
                  } else {
                    setInputText(sug);
                  }
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                  sug === "."
                    ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-cyan-400 hover:text-cyan-300"
                }`}
              >
                {sug === "." ? (
                  "Observar em Silêncio (.)"
                ) : (
                  <>
                    <Swords className="w-2.5 h-2.5 opacity-60" />
                    <span>{cleanDisplay.length > 38 ? cleanDisplay.slice(0, 38) + "..." : cleanDisplay}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Escreva sua fala/ação para responder à pergunta de ${selectedRecipient !== "Todos" ? selectedRecipient : "Blue Lock"}...`}
              disabled={isLoading}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-3 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || (!inputText.trim() && inputText !== ".")}
            className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black font-['Chakra_Petch'] text-sm uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-50 shadow-md shadow-cyan-900/30"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Responder</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 font-mono">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            Os personagens são dinâmicos e sempre exigirão suas respostas e decisões táticas!
          </span>
          <span className="text-zinc-600">Blue Lock AI System</span>
        </div>
      </div>
    </div>
  );
};
