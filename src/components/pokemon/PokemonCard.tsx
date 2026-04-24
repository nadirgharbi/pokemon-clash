import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalize } from "@/utils/string";
import { POKEMON_TYPE_COLORS } from "@/utils/const";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface PokemonCardProps {
  pokemon: PokeAPIResponse;
  className?: string;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, className }) => {
  const formatPokemonId = String(pokemon.id).padStart(3, "0");

  return (
    <Card className={className}>
      <CardHeader className="items-center gap-1 p-3">
        {pokemon.sprites.front_shiny && (
          <Image
            src={pokemon.sprites.front_shiny}
            width={120}
            height={120}
            alt={`${pokemon.name} sprite`}
            className="mx-auto"
          />
        )}
        <CardTitle className="text-sm font-semibold text-center leading-tight">
          {pokemon.nameFr ?? capitalize(pokemon.name)}{" "}
          <span className="text-white/40 font-normal">#{formatPokemonId}</span>
        </CardTitle>
        <div className="flex flex-wrap gap-1 justify-center">
          {pokemon.types.map(({ type }) => (
            <Badge
              key={type.name}
              className="text-xs px-2 py-0"
              style={{ backgroundColor: POKEMON_TYPE_COLORS[type.name] ?? "#777" }}
            >
              {capitalize(type.name)}
            </Badge>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
};
