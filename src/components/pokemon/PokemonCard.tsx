import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize } from "@/utils/string";
import { POKEMON_TYPE_COLORS } from "@/utils/const";
import Image from "next/image";
import { Badge } from "../ui/badge";

export const PokemonCard: React.FC<{ pokemon: PokeAPIResponse }> = ({ pokemon }) => {
  // #region Utilities
  const formatPokemonId = String(pokemon.id).padStart(3, "0");
  const abilities = pokemon.abilities.map((ab) => capitalize(ab.ability.name)).join(", ");
  // #endregion

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Image src={pokemon.sprites.front_default} width={128} height={128} alt={`${pokemon.name} sprite`} className="mx-auto" />
          {capitalize(pokemon.name)} {' '}
          <span className="text-black/50">#{formatPokemonId}</span>
        </CardTitle>
        <div className="flex gap-1">
          {pokemon.types.map(({ type }) => (
            <Badge
              key={type.name}
              style={{ backgroundColor: POKEMON_TYPE_COLORS[type.name] ?? "#777" }}
            >
              {capitalize(type.name)}
            </Badge>
          ))}
        </div>

        {/* <CardDescription>
          
        </CardDescription> */}
      </CardHeader>

      {/* <CardContent>
        <div>Abilities: {abilities}</div>
      </CardContent> */}
    </Card>
  );
};
