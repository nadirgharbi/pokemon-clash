"use client";
import { getPokemons } from "@/api/pokeapi/pokemon/getPokemon";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MAX_POKEMON_TO_FETCH } from "@/utils/const";
import { useEffect, useState } from "react";
import PokeZoneLogo from "@/assets/Pokzone.png";
import Image from "next/image";

const PAGE_SIZE = 30;

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="mt-10">
        <Image src={PokeZoneLogo} alt="PokeZone Logo" width={250} height={250} />
      </div>

      <main className="flex flex-1 w-full flex-col items-center gap-12">
        <p className="text-lg font-bold text-center">Bienvenue sur Pokézone</p>
        <p className="text-xl font-bold text-center">L'application est en cours de développement. Ce que tu retrouveras ici :</p>
        <ul className="list-disc">
          <li className="text-emerald-200 font-bold">Un Pokédex national répertoriant les 1025 Pokémon</li>
          <li>Toutes les informations à savoir sur chaque Pokémon</li>
          <li>Un Nuzlocke Tracker pour suivre tes nuzlockes sur chaque jeu</li>
          <li>Un Shiny Dex pour marquer tous les shinies obtenus</li>
          <li>Et bien d'autres</li>
        </ul>
      </main>
    </div>
  );
}
