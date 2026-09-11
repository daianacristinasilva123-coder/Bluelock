import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RotateCcw, Trash2, Copy, Check } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught runtime error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.removeItem("bluelock_rpg_active_match_v2");
      localStorage.removeItem("bluelock_rpg_messages_v2");
    } catch (e) {}
    window.location.reload();
  };

  private handleFullReset = () => {
    if (window.confirm("Isso redefinirá os dados temporários e salvará o app de qualquer erro. Deseja continuar?")) {
      try {
        localStorage.clear();
      } catch (e) {}
      window.location.reload();
    }
  };

  private handleCopyError = () => {
    const errorText = `${this.state.error?.toString()}\n\nStack:\n${this.state.error?.stack || ""}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ""}`;
    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                  Sistema de Recuperação Blue Lock
                </h2>
                <p className="text-xs text-zinc-400">
                  Um erro inesperado de interface foi interceptado para evitar a tela branca.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs font-mono text-rose-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {this.state.error?.message || "Erro de renderização desconhecido"}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold font-['Chakra_Petch'] uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Recarregar App
              </button>

              <button
                onClick={this.handleResetCache}
                className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center justify-center gap-2 transition border border-zinc-700 cursor-pointer"
              >
                Recuperar Partida
              </button>

              <button
                onClick={this.handleCopyError}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center justify-center gap-1.5 transition border border-zinc-700 cursor-pointer"
                title="Copiar Detalhes do Erro"
              >
                {this.state.copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Se o erro persistir:</span>
              <button
                onClick={this.handleFullReset}
                className="text-rose-400 hover:text-rose-300 underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Limpar Dados e Reiniciar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
