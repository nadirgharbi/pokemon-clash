"use client";
import { getPokemons, getPokemonByName } from "@/api/pokeapi/pokemon/getPokemon";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Spinner } from "@/components/ui/spinner";
import { MAX_POKEMON_TO_FETCH } from "@/utils/const";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 30;

export default function PokedexPage() {
  const [pokemons, setPokemons] = useState<PokeAPIResponse[]>([]);
  const [searchResult, setSearchResult] = useState<PokeAPIResponse | null | "not-found">(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setSearchResult(null);
      return;
    }
    setSearching(true);
    try {
      // Cherche d'abord par nom français parmi les pokémon déjà chargés
      const frMatch = pokemons.find(
        (p) => p.nameFr?.toLowerCase() === q.toLowerCase()
      );
      if (frMatch) {
        setSearchResult(frMatch);
        return;
      }
      // Sinon requête API (fonctionne avec nom anglais ou numéro)
      const result = await getPokemonByName(q);
      setSearchResult(result);
    } catch {
      setSearchResult("not-found");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResult(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-center">Pokédex</h1>

      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un Pokémon..."
          className="flex-1 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm outline-none focus:border-white/40"
        />
        <button
          type="submit"
          className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
        >
          {searching ? <Spinner className="w-4 h-4" /> : "Chercher"}
        </button>
        {searchResult !== null && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            ✕
          </button>
        )}
      </form>

      {searchResult === "not-found" && (
        <p className="text-red-400">Pokémon introuvable.</p>
      )}

      {searchResult && searchResult !== "not-found" && (
        <div className="w-full">
          <p className="text-sm text-white/50 mb-4">Résultat de la recherche :</p>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full">
            <PokemonCard pokemon={searchResult} />
          </div>
        </div>
      )}

      {!searchResult && (
        <>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full">
            {pokemons.map((pokemon, id) => (
              <PokemonCard pokemon={pokemon} key={id} />
            ))}
          </div>
          {loading && <Spinner className="w-10 h-10 animate-spin" />}
          <div ref={sentinelRef} className="h-1 w-full" />
        </>
      )}
    </div>
  );
}
