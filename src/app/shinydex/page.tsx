"use client";
import { getPokemons } from "@/api/pokeapi/pokemon/getPokemon";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MAX_POKEMON_TO_FETCH } from "@/utils/const";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 1025;
const LS_KEY = "shinydex";

async function fetchShiniesFromServer(): Promise<number[]> {
  try {
    const res = await fetch("/api/shinydex");
    const data = await res.json();
    return Array.isArray(data.shinies) ? data.shinies : [];
  } catch {
    return [];
  }
}

async function saveShiniestoServer(shinies: number[]): Promise<void> {
  await fetch("/api/shinydex", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shinies }),
  });
}

export default function ShinyDexPage() {
  const [pokemons, setPokemons] = useState<PokeAPIResponse[]>([]);
  const [shinies, setShinies] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showingShinyObtained, setShowingShinyObtained] = useState(false);
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const pokemonShown = showingShinyObtained ? pokemons.filter((p) => shinies.has(p.id)) : pokemons;

  useEffect(() => {
    fetchShiniesFromServer().then((serverShinies) => {
      if (serverShinies.length > 0) {
        setShinies(new Set(serverShinies));
        localStorage.setItem(LS_KEY, JSON.stringify(serverShinies));
      } else {
        try {
          const local = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
          if (Array.isArray(local)) setShinies(new Set(local));
        } catch {}
      }
    });
  }, []);

  const toggleShiny = (id: number) => {
    setShinies((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      const arr = Array.from(next);
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
      saveShiniestoServer(arr);
      return next;
    });
  };

  const loadMore = async () => {
    if (loadingRef.current || offsetRef.current >= MAX_POKEMON_TO_FETCH) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const data = await getPokemons(offsetRef.current, PAGE_SIZE);
      offsetRef.current += data.length;
      setPokemons((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const obtained = shinies.size;

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-center">✨ Shiny Dex</h1>
      <p className="text-white/50 text-sm">
        {obtained} / {MAX_POKEMON_TO_FETCH} shinies obtenus
      </p>

      <Button className={"cursor-pointer font-bold"} onClick={() => setShowingShinyObtained((prev) => !prev)}>
        {showingShinyObtained ? "Tout afficher" : "Afficher mes shinies"}
      </Button>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full">
        {pokemonShown.map((pokemon) => (
          <button key={pokemon.id} onClick={() => toggleShiny(pokemon.id)} className="text-left w-full cursor-pointer">
            <div
              className={`hover:opacity-100 transition-opacity ${shinies.has(pokemon.id) ? "opacity-100 ring-2 ring-yellow-400 rounded-xl" : "opacity-75"}`}
            >
              <PokemonCard pokemon={pokemon} />
            </div>
          </button>
        ))}
      </div>

      {loading && <Spinner className="w-10 h-10 animate-spin" />}
      <div ref={sentinelRef} className="h-1 w-full" />
    </div>
  );
}
