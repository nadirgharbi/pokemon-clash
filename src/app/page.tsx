"use client";
import { getPokemon, getPokemons } from "@/api/pokeapi/pokemon/getPokemon";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [pokemons, setPokemons] = useState<PokeAPIResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const data = await getPokemons();
      if (data) {
        setPokemons(data);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    toast.promise(fetchPokemons(), {
      loading: "Loading...",
      success: (data) => `All pokemons has been fetch`,
      error: "Error",
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full  flex-col items-center gap-12 py-32 px-16 ">
        {process.env.POKEAPI_URL}

        <p className="text-5xl font-bold text-center">Welcome to Pokemon Clash</p>

        {pokemons ? (
          loading ? (
            <Spinner className="w-80 h-80" />
          ) : (
            <div className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-1 gap-6 w-full">
              {pokemons.map((pokemon, id) => (
                <PokemonCard pokemon={pokemon} key={id} />
              ))}
            </div>
          )
        ) : null}
      </main>
    </div>
  );
}
