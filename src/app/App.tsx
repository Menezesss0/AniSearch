import { useState, useRef } from "react";
import { Search, X, ExternalLink, Star, Tv, Film, Clock, Loader2, LayoutGrid, List } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnimeResult {
  id: string;
  title: string;
  coverUrl: string;
  score?: number;
  episodes?: number | string;
  status: string;
  type: "TV" | "Movie" | "OVA" | "ONA" | "Special";
  year?: number;
  genres: string[];
  url: string;
  dubbed?: boolean;
}

interface Source {
  id: string;
  name: string;
  kind: "database" | "streaming" | "free";
}

// ─── Sources ──────────────────────────────────────────────────────────────────

const SOURCES: Source[] = [
  { id: "mal",        name: "MyAnimeList",  kind: "database"  },
  { id: "anilist",    name: "AniList",      kind: "database"  },
  { id: "crunchyroll",name: "Crunchyroll",  kind: "streaming" },
  { id: "gogoanime",  name: "Gogoanime",    kind: "free"      },
  { id: "zoro",       name: "Aniwatch",     kind: "free"      },
  { id: "ap",         name: "AnimePlanet",  kind: "database"  },
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const ANIME_DB: Record<string, Partial<AnimeResult>[]> = {
  mal: [
    { title: "Shingeki no Kyojin: The Final Season Part 3", coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=285&fit=crop&auto=format", score: 9.0, episodes: 11, status: "Finished", type: "TV", year: 2023, genres: ["Action", "Drama", "Fantasy"], url: "#" },
    { title: "Kimetsu no Yaiba: Katanakaji no Sato-hen", coverUrl: "https://images.unsplash.com/photo-1565631388823-2b59b93c0c08?w=200&h=285&fit=crop&auto=format", score: 8.6, episodes: 11, status: "Finished", type: "TV", year: 2023, genres: ["Action", "Supernatural"], url: "#" },
    { title: "Jujutsu Kaisen Season 2", coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=285&fit=crop&auto=format", score: 8.7, episodes: 23, status: "Finished", type: "TV", year: 2023, genres: ["Action", "School", "Supernatural"], url: "#" },
    { title: "Vinland Saga Season 2", coverUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=200&h=285&fit=crop&auto=format", score: 9.0, episodes: 24, status: "Finished", type: "TV", year: 2023, genres: ["Action", "Adventure", "Drama"], url: "#" },
    { title: "Oshi no Ko", coverUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&h=285&fit=crop&auto=format", score: 8.7, episodes: 11, status: "Finished", type: "TV", year: 2023, genres: ["Drama", "Mystery"], url: "#" },
  ],
  anilist: [
    { title: "Attack on Titan: The Final Season THE FINAL CHAPTERS", coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=285&fit=crop&auto=format", score: 9.1, episodes: 2, status: "Finished", type: "TV", year: 2023, genres: ["Action", "Drama", "Sci-Fi"], url: "#" },
    { title: "Demon Slayer: Swordsmith Village Arc", coverUrl: "https://images.unsplash.com/photo-1565631388823-2b59b93c0c08?w=200&h=285&fit=crop&auto=format", score: 8.7, episodes: 11, status: "Finished", type: "TV", year: 2023, genres: ["Action", "Supernatural"], url: "#" },
    { title: "Jujutsu Kaisen 2nd Season", coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=285&fit=crop&auto=format", score: 8.8, episodes: 23, status: "Finished", type: "TV", year: 2023, genres: ["Action", "Supernatural"], url: "#" },
    { title: "Chainsaw Man", coverUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=200&h=285&fit=crop&auto=format", score: 8.6, episodes: 12, status: "Finished", type: "TV", year: 2022, genres: ["Action", "Horror"], url: "#" },
  ],
  crunchyroll: [
    { title: "Attack on Titan Final Season THE FINAL CHAPTERS", coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=285&fit=crop&auto=format", episodes: "2 Parts", status: "Complete", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: true },
    { title: "Demon Slayer: Kimetsu no Yaiba Swordsmith Village Arc", coverUrl: "https://images.unsplash.com/photo-1565631388823-2b59b93c0c08?w=200&h=285&fit=crop&auto=format", episodes: 11, status: "Complete", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: true },
    { title: "Jujutsu Kaisen Season 2", coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=285&fit=crop&auto=format", episodes: 23, status: "Complete", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: true },
    { title: "My Hero Academia Season 7", coverUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=285&fit=crop&auto=format", episodes: 21, status: "Complete", type: "TV", year: 2024, genres: ["Action", "School"], url: "#", dubbed: true },
  ],
  gogoanime: [
    { title: "Shingeki no Kyojin: The Final Season Part 3", coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=285&fit=crop&auto=format", episodes: 11, status: "Completed", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: false },
    { title: "Kimetsu no Yaiba: Katanakaji no Sato-hen", coverUrl: "https://images.unsplash.com/photo-1565631388823-2b59b93c0c08?w=200&h=285&fit=crop&auto=format", episodes: 11, status: "Completed", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: false },
    { title: "Jujutsu Kaisen 2nd Season", coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=285&fit=crop&auto=format", episodes: 23, status: "Completed", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: false },
    { title: "One Piece", coverUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=200&h=285&fit=crop&auto=format", episodes: "1100+", status: "Ongoing", type: "TV", year: 1999, genres: ["Action", "Adventure"], url: "#", dubbed: false },
  ],
  zoro: [
    { title: "Attack on Titan Final Season Part 3", coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=285&fit=crop&auto=format", episodes: 11, status: "Completed", type: "TV", year: 2023, genres: ["Action", "Drama"], url: "#", dubbed: true },
    { title: "Demon Slayer: Swordsmith Village Arc", coverUrl: "https://images.unsplash.com/photo-1565631388823-2b59b93c0c08?w=200&h=285&fit=crop&auto=format", episodes: 11, status: "Completed", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: true },
    { title: "Jujutsu Kaisen 2", coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=285&fit=crop&auto=format", episodes: 23, status: "Completed", type: "TV", year: 2023, genres: ["Action"], url: "#", dubbed: true },
    { title: "Chainsaw Man", coverUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=200&h=285&fit=crop&auto=format", episodes: 12, status: "Completed", type: "TV", year: 2022, genres: ["Action", "Horror"], url: "#", dubbed: true },
  ],
  ap: [
    { title: "Attack on Titan: The Final Season", coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=285&fit=crop&auto=format", score: 4.3, episodes: 2, status: "Watched", type: "TV", year: 2023, genres: ["Action", "Drama"], url: "#" },
    { title: "Demon Slayer: Swordsmith Village", coverUrl: "https://images.unsplash.com/photo-1565631388823-2b59b93c0c08?w=200&h=285&fit=crop&auto=format", score: 4.1, episodes: 11, status: "Watched", type: "TV", year: 2023, genres: ["Action", "Fantasy"], url: "#" },
    { title: "Jujutsu Kaisen Season 2", coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=285&fit=crop&auto=format", score: 4.4, episodes: 23, status: "Watched", type: "TV", year: 2023, genres: ["Action", "Supernatural"], url: "#" },
    { title: "Vinland Saga Season 2", coverUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=200&h=285&fit=crop&auto=format", score: 4.5, episodes: 24, status: "Watched", type: "TV", year: 2023, genres: ["Action", "Historical"], url: "#" },
  ],
};

function mockSearch(query: string, sourceId: string): Promise<AnimeResult[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pool = ANIME_DB[sourceId] || [];
      const q = query.toLowerCase();
      const filtered = pool.filter(
        (a) => a.title?.toLowerCase().includes(q) || a.genres?.some((g) => g.toLowerCase().includes(q))
      );
      resolve(
        (filtered.length > 0 ? filtered : pool).map((a, i) => ({
          id: `${sourceId}-${i}`,
          title: a.title ?? "Unknown",
          coverUrl: a.coverUrl ?? "",
          score: a.score,
          episodes: a.episodes,
          status: a.status ?? "Unknown",
          type: a.type ?? "TV",
          year: a.year,
          genres: a.genres ?? [],
          url: a.url ?? "#",
          dubbed: a.dubbed,
        }))
      );
    }, 400 + Math.random() * 900);
  });
}

// ─── Score display ────────────────────────────────────────────────────────────

function Score({ score, sourceId }: { score: number; sourceId: string }) {
  const outOf5 = sourceId === "ap";
  const normalized = outOf5 ? (score / 5) * 10 : score;
  const color = normalized >= 8 ? "#4ade80" : normalized >= 6.5 ? "#facc15" : "#f87171";
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-medium" style={{ color }}>
      <Star size={9} fill={color} strokeWidth={0} />
      {score.toFixed(1)}
    </span>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function GridCard({ result, sourceId }: { result: AnimeResult; sourceId: string }) {
  const [hovered, setHovered] = useState(false);
  const ongoing = result.status.toLowerCase().includes("ongoing") || result.status.toLowerCase().includes("airing");

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: "var(--card)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
        transition: "border-color 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: "2/3" }}>
        <img src={result.coverUrl} alt={result.title} className="w-full h-full object-cover" style={{ transition: "transform 0.3s", transform: hovered ? "scale(1.04)" : "scale(1)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 25%, transparent 70%)" }} />

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex items-end justify-between">
          {result.score !== undefined && <Score score={result.score} sourceId={sourceId} />}
          {result.dubbed !== undefined && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.6)", color: "#a0a0b0" }}>
              {result.dubbed ? "DUB" : "SUB"}
            </span>
          )}
        </div>

        {/* External link on hover */}
        {hovered && (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-1.5 rounded-lg"
            style={{ background: "rgba(0,0,0,0.65)", color: "#e0e0e8" }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 py-2 flex flex-col gap-1">
        <p className="text-[12px] font-medium leading-snug line-clamp-2 text-foreground">
          {result.title}
        </p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-[10px] font-mono flex items-center gap-0.5">
            {result.type === "Movie" ? <Film size={9} /> : <Tv size={9} />}
            {result.type}
          </span>
          {result.episodes !== undefined && (
            <span className="text-[10px] font-mono flex items-center gap-0.5">
              <Clock size={9} />{result.episodes}
            </span>
          )}
          {result.year && <span className="text-[10px] font-mono ml-auto">{result.year}</span>}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
            style={{
              background: ongoing ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
              color: ongoing ? "#4ade80" : "#666680",
            }}
          >
            {result.status}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────

function ListRow({ result, sourceId }: { result: AnimeResult; sourceId: string }) {
  const [hovered, setHovered] = useState(false);
  const ongoing = result.status.toLowerCase().includes("ongoing") || result.status.toLowerCase().includes("airing");

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
      style={{
        background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "background 0.1s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-9 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
        <img src={result.coverUrl} alt={result.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">{result.title}</p>
        <div className="flex items-center gap-2.5 mt-0.5">
          {result.score !== undefined && <Score score={result.score} sourceId={sourceId} />}
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-0.5">
            {result.type === "Movie" ? <Film size={9} /> : <Tv size={9} />} {result.type}
          </span>
          {result.episodes !== undefined && (
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-0.5">
              <Clock size={9} /> {result.episodes} ep
            </span>
          )}
          {result.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] font-mono text-muted-foreground">{g}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {result.year && <span className="text-[11px] font-mono text-muted-foreground">{result.year}</span>}
        <span
          className="text-[9px] font-mono px-2 py-0.5 rounded-full"
          style={{
            background: ongoing ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
            color: ongoing ? "#4ade80" : "#666680",
          }}
        >
          {result.status}
        </span>
        {result.dubbed !== undefined && (
          <span className="text-[9px] font-mono text-muted-foreground">{result.dubbed ? "DUB" : "SUB"}</span>
        )}
        {hovered && (
          <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Source section ───────────────────────────────────────────────────────────

function SourceSection({
  source,
  results,
  loading,
  viewMode,
}: {
  source: Source;
  results: AnimeResult[] | null;
  loading: boolean;
  viewMode: "grid" | "list";
}) {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold text-foreground">{source.name}</span>
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.05)", color: "#666680" }}
          >
            {source.kind}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
          {!loading && results !== null && (
            <span className="text-[11px] font-mono text-muted-foreground">{results.length} resultado{results.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-[12px] font-mono">Buscando…</span>
        </div>
      )}

      {!loading && results !== null && results.length === 0 && (
        <p className="py-10 text-center text-[12px] font-mono text-muted-foreground">Nenhum resultado</p>
      )}

      {!loading && results !== null && results.length > 0 && viewMode === "grid" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {results.map((r) => <GridCard key={r.id} result={r} sourceId={source.id} />)}
        </div>
      )}

      {!loading && results !== null && results.length > 0 && viewMode === "list" && (
        <div className="flex flex-col">
          {results.map((r) => <ListRow key={r.id} result={r} sourceId={source.id} />)}
        </div>
      )}
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const QUICK = ["Attack on Titan", "Demon Slayer", "Jujutsu Kaisen", "One Piece", "Chainsaw Man"];

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [enabled, setEnabled] = useState<Set<string>>(new Set(SOURCES.map((s) => s.id)));
  const [results, setResults] = useState<Record<string, AnimeResult[] | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleSource(id: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });
  }

  function doSearch(q: string) {
    if (!q.trim()) return;
    setActiveQuery(q);
    setInputValue(q);
    setHasSearched(true);
    setActiveTab("all");

    const ids = SOURCES.filter((s) => enabled.has(s.id)).map((s) => s.id);
    const initLoad: Record<string, boolean> = {};
    ids.forEach((id) => (initLoad[id] = true));
    setLoading(initLoad);
    setResults({});

    ids.forEach((id) => {
      mockSearch(q, id).then((data) => {
        setResults((p) => ({ ...p, [id]: data }));
        setLoading((p) => ({ ...p, [id]: false }));
      });
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doSearch(inputValue);
  }

  function clear() {
    setInputValue("");
    setHasSearched(false);
    setActiveQuery("");
    setResults({});
    setLoading({});
    inputRef.current?.focus();
  }

  const activeSources = SOURCES.filter((s) => enabled.has(s.id));
  const isLoading = Object.values(loading).some(Boolean);
  const totalFound = Object.values(results).reduce((a, r) => a + (r?.length ?? 0), 0);
  const visibleSources = activeTab === "all" ? activeSources : activeSources.filter((s) => s.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Topbar */}
      <header
        className="flex items-center gap-5 px-6 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(12,12,14,0.97)" }}
      >
        {/* Logo */}
        <span
          className="text-[15px] font-bold tracking-widest shrink-0 select-none"
          style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.15em", color: "#f0f0f4" }}
        >
          ANIMEX
        </span>

        {/* Search */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: "var(--input-background)", border: "1px solid var(--border)" }}
          >
            <Search size={14} className="shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pesquisar anime…"
              className="flex-1 bg-transparent outline-none text-[13px] text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            {inputValue && (
              <button type="button" onClick={clear} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={13} />
              </button>
            )}
            <button
              type="submit"
              className="shrink-0 px-3 py-1 rounded-md text-[12px] font-semibold transition-all active:scale-95"
              style={{ background: "#7c3aed", color: "#fff", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}
            >
              BUSCAR
            </button>
          </div>
        </form>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 shrink-0 p-1 rounded-lg" style={{ background: "var(--muted)" }}>
          {(["grid", "list"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className="p-1.5 rounded-md transition-all"
              style={{
                background: viewMode === m ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewMode === m ? "#f0f0f4" : "#666680",
              }}
            >
              {m === "grid" ? <LayoutGrid size={14} /> : <List size={14} />}
            </button>
          ))}
        </div>

        {/* Result count */}
        {hasSearched && (
          <span className="text-[11px] font-mono text-muted-foreground shrink-0">
            {isLoading ? "buscando…" : `${totalFound} resultados`}
          </span>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside
          className="w-52 shrink-0 flex flex-col py-5 gap-1 overflow-y-auto"
          style={{ borderRight: "1px solid var(--border)" }}
        >
          <p className="px-4 mb-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Fontes</p>

          {/* All */}
          <button
            onClick={() => setActiveTab("all")}
            className="flex items-center justify-between mx-3 px-3 py-2 rounded-lg text-left transition-all"
            style={{
              background: activeTab === "all" ? "rgba(124,58,237,0.12)" : "transparent",
              color: activeTab === "all" ? "#c4b5fd" : "#a0a0b0",
            }}
          >
            <span className="text-[13px] font-medium">Todos</span>
            {hasSearched && !isLoading && (
              <span className="text-[10px] font-mono" style={{ color: activeTab === "all" ? "#7c3aed" : "#666680" }}>{totalFound}</span>
            )}
          </button>

          <div className="my-1 mx-4 h-px bg-border" />

          {/* Per source */}
          {SOURCES.map((s) => {
            const isActive = activeTab === s.id;
            const isEnabled = enabled.has(s.id);
            const count = results[s.id]?.length;

            return (
              <div key={s.id} className="flex items-center gap-1 mx-3">
                <button
                  onClick={() => isEnabled && setActiveTab(s.id)}
                  className="flex items-center justify-between flex-1 px-3 py-2 rounded-lg text-left transition-all"
                  style={{
                    background: isActive && isEnabled ? "rgba(255,255,255,0.05)" : "transparent",
                    color: isEnabled ? (isActive ? "#f0f0f4" : "#a0a0b0") : "#3a3a44",
                    cursor: isEnabled ? "pointer" : "default",
                  }}
                >
                  <span className="text-[13px] font-medium truncate">{s.name}</span>
                  {isEnabled && (
                    <span className="text-[10px] font-mono shrink-0 ml-1" style={{ color: "#666680" }}>
                      {loading[s.id] ? <Loader2 size={9} className="animate-spin inline" /> : count !== undefined ? count : ""}
                    </span>
                  )}
                </button>

                {/* Toggle */}
                <button
                  onClick={() => toggleSource(s.id)}
                  className="shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all"
                  style={{
                    background: isEnabled ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isEnabled ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                  title={isEnabled ? "Desativar" : "Ativar"}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: isEnabled ? "#7c3aed" : "#3a3a44" }} />
                </button>
              </div>
            );
          })}
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-8 py-6">

          {/* Empty state */}
          {!hasSearched && (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <Search size={36} className="text-muted-foreground opacity-40" />
              <div>
                <p className="text-[15px] font-medium text-foreground mb-1">Pesquise em {SOURCES.length} fontes ao mesmo tempo</p>
                <p className="text-[12px] font-mono text-muted-foreground">MAL · AniList · Crunchyroll · Gogoanime · Aniwatch · AnimePlanet</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => doSearch(q)}
                    className="text-[12px] px-3 py-1.5 rounded-lg transition-all hover:text-foreground"
                    style={{ background: "var(--card)", border: "1px solid var(--border)", color: "#666680" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {hasSearched && (
            <div className="flex flex-col gap-10">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-muted-foreground">Resultados para</span>
                <span className="text-[13px] font-medium text-foreground">"{activeQuery}"</span>
                <button onClick={clear} className="ml-auto text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <X size={10} /> limpar
                </button>
              </div>

              {visibleSources.map((source) => (
                <SourceSection
                  key={source.id}
                  source={source}
                  results={results[source.id] ?? null}
                  loading={loading[source.id] ?? false}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
