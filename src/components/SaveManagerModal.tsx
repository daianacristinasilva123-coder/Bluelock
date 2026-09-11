import React, { useRef } from "react";
import { Download, Upload, Trash2, Volume2, VolumeX, X, Shield, RefreshCw } from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  onClose: () => void;
  onExportSave: () => void;
  onImportSave: (jsonData: string) => void;
  onRequestReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SaveManagerModal: React.FC<Props> = ({
  onClose,
  onExportSave,
  onImportSave,
  onRequestReset,
  soundEnabled,
  onToggleSound,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportSave(content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-zinc-100 font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase">
            Gerenciador de Progresso • Blue Lock
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <div className="font-bold text-white">Efeitos Sonoros Sintéticos</div>
              <div className="text-zinc-500 text-[11px]">Sons de apito, celebração e impacto de ego.</div>
            </div>
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-lg border transition ${
                soundEnabled
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-zinc-800 border-zinc-700 text-zinc-500"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Export JSON */}
          <button
            onClick={onExportSave}
            className="w-full p-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-left transition"
          >
            <div>
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Exportar Arquivo de Save (.json)
              </div>
              <div className="text-zinc-500 text-[11px] mt-0.5">
                Baixe seu progresso, atributos e memórias para backup.
              </div>
            </div>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-left transition"
            >
              <div>
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Upload className="w-4 h-4" /> Importar Arquivo de Save (.json)
                </div>
                <div className="text-zinc-500 text-[11px] mt-0.5">
                  Restaure uma campanha anterior a partir de um arquivo salvo.
                </div>
              </div>
            </button>
          </div>

          {/* Reset / New Campaign */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onRequestReset();
            }}
            className="w-full p-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/60 flex items-center justify-between text-left transition text-rose-300 group"
          >
            <div>
              <div className="font-bold flex items-center gap-1.5 text-rose-300 group-hover:text-rose-200">
                <Trash2 className="w-4 h-4 text-rose-400" /> Reiniciar / Reajustar Meu Egoísta
              </div>
              <div className="text-rose-400/70 text-[11px] mt-0.5">
                Criar novo atacante do zero ou redefinir atributos & especialidade.
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
