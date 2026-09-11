import React, { useState } from "react";
import { CharacterProfile, TransferOffer } from "../types";
import {
  NEL_CLUBS,
  CANONICAL_NEL_LEADERBOARD,
  generateClubTransferOffers,
  NELBidLeaderboardEntry,
} from "../data/transferClubs";
import {
  Building2,
  Trophy,
  Flame,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileSignature,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  RotateCcw,
  ListOrdered,
  Swords,
} from "lucide-react";
import { sounds } from "../utils/audio";

interface Props {
  character: CharacterProfile;
  onAcceptTransferOffer: (offer: TransferOffer) => void;
  onRefreshOffers: () => void;
}

export const TransferMarketView: React.FC<Props> = ({
  character,
  onAcceptTransferOffer,
  onRefreshOffers,
}) => {
  const [selectedOfferForDetails, setSelectedOfferForDetails] = useState<TransferOffer | null>(null);
  const [isSigningSuccess, setIsSigningSuccess] = useState<TransferOffer | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"offers" | "leaderboard" | "egoPhilosophy" | "awards" | "standings" | "cup">("offers");

  
  // Stats and season logic
  const matchesPlayed = character.careerStats?.matchesPlayed || 0;
  const isSeasonOver = matchesPlayed >= 10;

  const m = Math.max(1, matchesPlayed);
  const rivalStats = [
    { name: "Barou Shoei", goals: Math.floor(m * 1.5), assists: Math.floor(m * 0.2), rating: 8.8 },
    { name: "Michael Kaiser", goals: Math.floor(m * 1.3), assists: Math.floor(m * 0.6), rating: 9.3 },
    { name: "Itoshi Rin", goals: Math.floor(m * 1.4), assists: Math.floor(m * 0.4), rating: 9.1 },
    { name: "Yo Hiori", goals: Math.floor(m * 0.2), assists: Math.floor(m * 1.0), rating: 8.5 },
    { name: "Alexis Ness", goals: Math.floor(m * 0.3), assists: Math.floor(m * 0.9), rating: 8.4 },
  ];

  const playerGoals = character.careerStats?.goals || 0;
  const playerAssists = character.careerStats?.assists || 0;
  const playerRating = character.careerStats?.averageRating || 0;

  const allPlayers = [
    { name: character.name, goals: playerGoals, assists: playerAssists, rating: playerRating, isPlayer: true },
    ...rivalStats.map(r => ({ ...r, isPlayer: false }))
  ];

  const topScorers = [...allPlayers].sort((a,b) => b.goals - a.goals);
  const topAssists = [...allPlayers].sort((a,b) => b.assists - a.assists);
  const topRatings = [...allPlayers].sort((a,b) => b.rating - a.rating);

  const topScorer = topScorers[0];
  const topPlaymaker = topAssists[0];
  
  // Bola de ouro: quem tem mais nota E (mais gols ou mais assistências)
  let ballWinner = topScorer;
  if (topPlaymaker.rating > topScorer.rating) {
    ballWinner = topPlaymaker;
  }
  if (topRatings[0].rating > ballWinner.rating && (topRatings[0].goals === topScorer.goals || topRatings[0].assists === topPlaymaker.assists)) {
    ballWinner = topRatings[0];
  }


  // Offers from character state or generated
  const offers: TransferOffer[] =
    character.transferOffers && character.transferOffers.length > 0
      ? character.transferOffers
      : generateClubTransferOffers(character);

  const currentClubOffer = offers.find((o) => o.clubName === character.currentClub);
  const highestInterestOffer = [...offers].sort((a, b) => b.interestScore - a.interestScore)[0];

  const handleSignContract = (offer: TransferOffer) => {
    sounds.playEgoImpact();
    setIsSigningSuccess(offer);
    onAcceptTransferOffer(offer);

    setTimeout(() => {
      setIsSigningSuccess(null);
    }, 4500);
  };

  // Helper formatting for Yen
  const formatYen = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Dynamic ranking calculation in NEL
  const playerBid = character.currentBidYen || highestInterestOffer?.bidYen || 50000000;
  const leaderboardWithPlayer: NELBidLeaderboardEntry[] = [
    ...CANONICAL_NEL_LEADERBOARD.filter((e) => e.playerName !== character.name),
    {
      rank: 0, // calculated below
      playerName: character.name,
      club: character.currentClub || highestInterestOffer?.clubName || "Aguardando Assinatura",
      countryFlag: currentClubOffer?.flagEmoji || "🇯🇵",
      bidYen: playerBid,
      bidFormatted: formatYen(playerBid),
      weapon: character.mainWeapon,
      isProtagonist: true,
    },
  ].sort((a, b) => b.bidYen - a.bidYen);

  // Assign ranks
  leaderboardWithPlayer.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  const playerRankEntry = leaderboardWithPlayer.find((e) => e.isProtagonist);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 text-zinc-100 font-sans space-y-6">
      {/* Top Banner: Neo Egoist League Transfer Auction */}
      <div className="bg-gradient-to-r from-zinc-950 via-blue-950/60 to-zinc-950 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1.5">
              <Building2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              SISTEMA DE LANCES & MERCADO DE TRANSFERÊNCIAS • NEO EGOIST LEAGUE
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-['Chakra_Petch'] text-white">
              Leilão Oficial dos Clubes Europeus
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Na Liga Neo Egoísta, os maiores clubes do mundo (Alemanha, França, Inglaterra, Itália e Espanha) 
              assistem a cada partida sua e disputam seu talento enviando <strong>propostas salariais em Ienes (¥)</strong>. 
              Os times que tiverem <strong>mais interesse no seu estilo</strong> enviaram ofertas formais. 
              Você tem a liberdade de <strong>escolher com qual time assinar</strong>!
            </p>

            {/* Current Club Badge */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {character.currentClub ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 text-xs font-mono shadow">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Clube Atual: <strong>{character.currentClub}</strong>
                  </span>
                  <span className="text-zinc-400 font-normal">
                    ({formatYen(character.currentBidYen || playerBid)} / ano)
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-300 text-xs font-mono">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Janela Aberta: Escolha seu clube entre as propostas abaixo!</span>
                </div>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  onRefreshOffers();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 transition font-mono"
                title="Recalcular propostas com base nos seus atributos atuais"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Atualizar Lances dos Clubes</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="flex items-center gap-4 sm:gap-6 bg-zinc-950/90 border border-zinc-800 p-4 rounded-xl shrink-0 self-start lg:self-center shadow-lg">
            <div className="text-center">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Seu Valor de Mercado</div>
              <div className="text-2xl sm:text-3xl font-black font-['Chakra_Petch'] text-amber-400 mt-0.5">
                {formatYen(playerBid)}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> Salário Anual Oficial
              </div>
            </div>

            <div className="w-px h-12 bg-zinc-800" />

            <div className="text-center">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">NEL Ranking</div>
              <div className="text-2xl sm:text-3xl font-black font-['Chakra_Petch'] text-cyan-400 mt-0.5">
                #{playerRankEntry?.rank || 5}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">Entre os 300 Egoístas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signing Success Toast Alert */}
      {isSigningSuccess && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border-2 border-emerald-400 text-emerald-200 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300 shadow-2xl shadow-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-xl shrink-0">
              ✍️
            </div>
            <div>
              <div className="font-['Chakra_Petch'] font-black text-base text-white uppercase">
                CONTRATO ASSINADO COM SUCESSO!
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                Você é o novo atacante oficial do <strong>{isSigningSuccess.clubName}</strong>! 
                Salário acordado de <strong>{formatYen(isSigningSuccess.bidYen)}</strong> ao ano. 
                Jinpachi Ego oficializou a transferência nos telões do Blue Lock!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSigningSuccess(null)}
            className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("offers");
          }}
          className={`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
            activeSubTab === "offers"
              ? "bg-cyan-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <FileSignature className="w-3.5 h-3.5" />
          Janela de Transferência ({offers.length})
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("leaderboard");
          }}
          className={`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
            activeSubTab === "leaderboard"
              ? "bg-cyan-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Tabela Oficial de Lances NEL
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("egoPhilosophy");
          }}
          className={`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
            activeSubTab === "egoPhilosophy"
              ? "bg-cyan-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Cabine do Ego: Os 5 Mestres
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("standings");
          }}
          className={`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
            activeSubTab === "standings"
              ? "bg-cyan-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          Tabela da NEL
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("cup");
          }}
          className={`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
            activeSubTab === "cup"
              ? "bg-cyan-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          Copa Blue Lock
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSubTab("awards");
          }}
          className={`px-4 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
            activeSubTab === "awards"
              ? "bg-amber-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 text-amber-400/70 hover:text-amber-400 border border-zinc-800"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Premiações (Fim da Liga)
        </button>
      </div>

      {/* VIEW: OFFERS TAB */}
      {activeSubTab === "offers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>
              Ordenado por: <strong>Nível de Interesse dos Clubes no seu Perfil</strong>
            </span>
            <span>{offers.length} propostas ativas registradas</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {offers.map((offer, index) => {
              const isCurrent = character.currentClub === offer.clubName;
              const isHighestInterest = index === 0;

              return (
                <div
                  key={offer.id || offer.clubName}
                  className={`rounded-2xl border transition-all p-5 flex flex-col justify-between relative overflow-hidden ${
                    isCurrent
                      ? "bg-gradient-to-b from-emerald-950/40 via-zinc-900 to-zinc-950 border-emerald-500/80 shadow-lg shadow-emerald-500/10"
                      : isHighestInterest
                      ? "bg-gradient-to-b from-amber-950/30 via-zinc-900 to-zinc-950 border-amber-500/70 shadow-lg shadow-amber-500/10"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {/* Top Badge: Highest Interest or Current Club */}
                  {isCurrent ? (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 text-[10px] font-black font-['Chakra_Petch'] uppercase px-3 py-1 rounded-bl-xl shadow flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> SEU CLUBE CONTRATADO
                    </div>
                  ) : isHighestInterest ? (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 text-[10px] font-black font-['Chakra_Petch'] uppercase px-3 py-1 rounded-bl-xl shadow flex items-center gap-1 animate-pulse">
                      <Flame className="w-3 h-3" /> MAIOR INTERESSE NO SEU EGO!
                    </div>
                  ) : null}

                  {/* Club Header Info */}
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="text-3xl shrink-0 p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                        {offer.flagEmoji}
                      </div>

                      <div className="flex-1 pr-16">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          {offer.league}
                        </div>
                        <h3 className="text-xl font-black font-['Chakra_Petch'] text-white">
                          {offer.clubName}
                        </h3>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          Master Striker: <strong className="text-cyan-300">{offer.masterStriker}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Interest Score Bar */}
                    <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          Interesse Técnico:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            offer.interestLevel === "Muito Alto" ? "bg-amber-500/20 text-amber-400" :
                            offer.interestLevel === "Alto" ? "bg-cyan-500/20 text-cyan-400" :
                            offer.interestLevel === "Médio" ? "bg-zinc-700/50 text-zinc-300" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {offer.interestLevel}
                          </span>
                          <span className="text-amber-400 font-bold font-['Chakra_Petch'] text-sm">
                            {offer.interestScore}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            offer.interestScore >= 80
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : "bg-gradient-to-r from-cyan-500 to-blue-500"
                          }`}
                          style={{ width: `${offer.interestScore}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1 font-mono">
                        {offer.tacticalFitNotes}
                      </div>
                    </div>

                    {/* Contract Salary & Terms Grid */}
                    <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Salário Anual (Oferta)</div>
                        <div className="text-base sm:text-lg font-black font-['Chakra_Petch'] text-emerald-400">
                          {formatYen(offer.bidYen)}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Salário Semanal</div>
                        <div className="text-sm sm:text-base font-bold font-['Chakra_Petch'] text-zinc-200">
                          {formatYen(offer.weeklySalaryYen)}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Bônus de Assinatura</div>
                        <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
                          +{formatYen(offer.signingBonusYen)}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Duração do Vínculo</div>
                        <div className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">
                          {offer.contractYears} Anos de Contrato
                        </div>
                      </div>
                    </div>

                    {/* Promised Role */}
                    <div className="mt-3 text-xs bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
                      <span className="text-zinc-400 font-mono">Função Prometida: </span>
                      <span className="text-cyan-300 font-semibold">{offer.promisedRole}</span>
                    </div>

                    {/* Scout / Master Striker Report */}
                    <div className="mt-3 text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800 italic leading-relaxed">
                      &ldquo;{offer.interestReason}&rdquo;
                    </div>

                    {/* Key Teammates / Rivals */}
                    {offer.keyRivalsOrAllies && offer.keyRivalsOrAllies.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-zinc-400">Atletas do Elenco:</span>
                        {offer.keyRivalsOrAllies.map((p, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3.5 border-t border-zinc-800 flex items-center justify-between gap-3">
                    {isCurrent ? (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-bold font-['Chakra_Petch'] uppercase text-center text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Seu Contrato Vigente
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSignContract(offer)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-950 font-black font-['Chakra_Petch'] uppercase tracking-wider text-xs transition shadow-lg flex items-center justify-center gap-2 group"
                      >
                        <FileSignature className="w-4 h-4 text-zinc-950 group-hover:scale-110 transition-transform" />
                        Assinar com o {offer.clubName} ({formatYen(offer.bidYen)})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: LEADERBOARD TAB */}
      {activeSubTab === "leaderboard" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-bold">
                <Trophy className="w-4 h-4" />
                TABELA OFICIAL DE LEILÃO • BLUE LOCK NEL AUCTION
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Top 12 Jogadores Mais Valiosos do Mundo
              </h2>
            </div>
            <div className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
              Transmitido globalmente para olheiros
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Jogador</th>
                  <th className="py-2.5 px-3">Clube da Oferta</th>
                  <th className="py-2.5 px-3">Arma Principal</th>
                  <th className="py-2.5 px-3 text-right">Maior Lance Anual (¥)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {leaderboardWithPlayer.map((row) => (
                  <tr
                    key={row.rank + row.playerName}
                    className={`transition-colors ${
                      row.isProtagonist
                        ? "bg-cyan-950/40 font-bold border-l-4 border-cyan-400 text-cyan-200"
                        : "hover:bg-zinc-950/50 text-zinc-300"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black font-['Chakra_Petch'] ${
                          row.rank === 1
                            ? "bg-amber-400 text-zinc-950"
                            : row.rank === 2
                            ? "bg-slate-300 text-zinc-950"
                            : row.rank === 3
                            ? "bg-amber-700 text-white"
                            : row.isProtagonist
                            ? "bg-cyan-400 text-zinc-950"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        #{row.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-['Chakra_Petch'] font-bold text-white text-sm">
                          {row.playerName}
                        </span>
                        {row.isProtagonist && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-zinc-950 text-[9px] font-black uppercase">
                            VOCÊ
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <span>{row.countryFlag}</span>
                        <span>{row.club}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{row.weapon}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-sm font-black font-['Chakra_Petch'] text-emerald-400">
                        {row.bidFormatted}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: EGO PHILOSOPHY / 5 MASTERS */}
      {activeSubTab === "egoPhilosophy" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-zinc-950 font-bold flex items-center justify-center shrink-0 text-sm">
              EGO
            </div>
            <div>
              <div className="text-xs font-mono uppercase font-bold text-cyan-400">
                Jinpachi Ego • Transmissão da Sala de Monitoramento
              </div>
              <p className="text-xs text-zinc-300 mt-1 italic leading-relaxed">
                &ldquo;Prestem atenção, diamantes brutos. O futebol do século XXI não é caridade. 
                Cada um desses cinco clubes europeus possui uma filosofia dogmática diferente. 
                Se você escolher a Alemanha de Noel Noa, precisará de números e racionalidade. 
                Na França de Julian Loki, de velocidade pura. Na Inglaterra de Chris Prince, de supremacia física. 
                Na Itália de Marc Snuffy, de disciplina tática. E na Espanha de Lavinho, de ousadia individualista. 
                O clube com maior interesse em você é aquele onde seu ego causará o maior estrago. 
                Escolha seu destino e devore a Europa!&rdquo;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEL_CLUBS.map((club) => (
              <div
                key={club.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{club.flagEmoji}</span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">{club.league}</span>
                  </div>
                  <h4 className="text-base font-bold font-['Chakra_Petch'] text-white">{club.name}</h4>
                  <div className="text-xs text-cyan-300 mt-0.5">Master: {club.masterStriker}</div>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{club.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] italic text-zinc-300">
                  &ldquo;{club.masterQuote}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: AWARDS TAB */}
      {activeSubTab === "awards" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-bold">
                <Award className="w-4 h-4" />
                PREMIAÇÕES OFICIAIS DA TEMPORADA NEL
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Cerimônia de Encerramento
              </h2>
            </div>
          </div>

          {!isSeasonOver ? (
            <div className="text-center py-10">
              <Award className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white mb-2">A Temporada Ainda Está em Andamento</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                As premiações da Bola de Ouro, Chuteira de Ouro e Garçom do Ano serão reveladas apenas ao final da liga (10 partidas jogadas).
                Atualmente você jogou {matchesPlayed} partida(s).
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bola de Ouro */}
                <div className="bg-gradient-to-b from-amber-500/10 to-zinc-950 border border-amber-500/30 rounded-xl p-5 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-amber-500/50"></div>
                  <Trophy className="w-12 h-12 text-amber-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase text-center">Bola de Ouro</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase text-center">Maior Nota + (Artilheiro/Garçom)</p>
                  
                  <div className="w-full space-y-2 mt-2">
                    <div className="flex justify-between items-center bg-amber-400/20 border border-amber-400/50 rounded-lg p-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">1º</span>
                        <span className={`font-bold ${ballWinner.isPlayer ? 'text-amber-400' : 'text-white'}`}>{ballWinner.name}</span>
                      </div>
                      <div className="text-xs text-amber-400 font-mono">Nota: {ballWinner.rating.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                {/* Chuteira de Ouro */}
                <div className="bg-gradient-to-b from-emerald-500/10 to-zinc-950 border border-emerald-500/30 rounded-xl p-5 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-emerald-500/50"></div>
                  <Flame className="w-12 h-12 text-emerald-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase text-center">Chuteira de Ouro</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase text-center">Artilheiro Máximo</p>
                  
                  <div className="w-full space-y-2 mt-2">
                    {topScorers.slice(0, 3).map((player, idx) => (
                      <div key={idx} className={`flex justify-between items-center rounded-lg p-2 px-3 ${idx === 0 ? 'bg-emerald-400/20 border border-emerald-400/50' : 'bg-zinc-800/50 border border-zinc-700/50'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${idx === 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>{idx + 1}º</span>
                          <span className={`font-bold ${player.isPlayer ? 'text-cyan-400' : 'text-white'}`}>{player.name}</span>
                        </div>
                        <div className={`text-xs font-mono ${idx === 0 ? 'text-emerald-400' : 'text-zinc-400'}`}>{player.goals} Gols</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garçom do Ano */}
                <div className="bg-gradient-to-b from-cyan-500/10 to-zinc-950 border border-cyan-500/30 rounded-xl p-5 flex flex-col items-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-cyan-500/50"></div>
                  <Sparkles className="w-12 h-12 text-cyan-400 mb-3" />
                  <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase text-center">Garçom do Ano</h3>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase text-center">Líder de Assistências</p>
                  
                  <div className="w-full space-y-2 mt-2">
                    {topAssists.slice(0, 3).map((player, idx) => (
                      <div key={idx} className={`flex justify-between items-center rounded-lg p-2 px-3 ${idx === 0 ? 'bg-cyan-400/20 border border-cyan-400/50' : 'bg-zinc-800/50 border border-zinc-700/50'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${idx === 0 ? 'text-cyan-400' : 'text-zinc-500'}`}>{idx + 1}º</span>
                          <span className={`font-bold ${player.isPlayer ? 'text-cyan-400' : 'text-white'}`}>{player.name}</span>
                        </div>
                        <div className={`text-xs font-mono ${idx === 0 ? 'text-cyan-400' : 'text-zinc-400'}`}>{player.assists} Assis</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                  A disputa foi brutal. Apenas os verdadeiros atacantes sobreviveram para contar história!
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW: STANDINGS TAB */}
      {activeSubTab === "standings" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase font-bold">
                <ListOrdered className="w-4 h-4" />
                CLASSIFICAÇÃO GERAL
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Tabela da Neo Egoist League
              </h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-4">Clube</th>
                  <th className="py-3 px-4 text-center">J</th>
                  <th className="py-3 px-4 text-center">V</th>
                  <th className="py-3 px-4 text-center">E</th>
                  <th className="py-3 px-4 text-center">D</th>
                  <th className="py-3 px-4 text-center">SG</th>
                  <th className="py-3 px-4 text-center font-bold text-white">Pts</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-amber-400">1</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇩🇪 Bastard München</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">+7</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">12</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-300">2</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇫🇷 Paris X Gen</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">3</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">1</td>
                  <td className="py-3 px-4 text-center text-zinc-300">+5</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">9</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-400">3</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇮🇹 Ubers</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">2</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">2</td>
                  <td className="py-3 px-4 text-center text-zinc-300">+1</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">6</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-500">4</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇬🇧 Manshine City</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">1</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">3</td>
                  <td className="py-3 px-4 text-center text-zinc-300">-4</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">3</td>
                </tr>
                <tr className="hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-bold text-zinc-600">5</td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">🇪🇸 F.C. Barcha</td>
                  <td className="py-3 px-4 text-center text-zinc-400">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">0</td>
                  <td className="py-3 px-4 text-center text-zinc-300">4</td>
                  <td className="py-3 px-4 text-center text-zinc-300">-9</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-400">0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            * A tabela reflete a classificação dos clubes ao final da NEL. 
          </div>
        </div>
      )}

      {/* VIEW: CUP TAB */}
      {activeSubTab === "cup" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase font-bold">
                <Swords className="w-4 h-4" />
                MATA-MATA ESPECIAL
              </div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mt-0.5">
                Copa Blue Lock (U-20 World Cup Preliminar)
              </h2>
            </div>
          </div>
          <div className="py-10 text-center">
            <Swords className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 font-['Chakra_Petch']">Chaveamento em Definição</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              A Copa do Mundo Sub-20 se aproxima. Apenas os 23 jogadores que sobreviverem ao leilão final formarão a seleção do Japão para enfrentar as potências globais no torneio eliminatório!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
