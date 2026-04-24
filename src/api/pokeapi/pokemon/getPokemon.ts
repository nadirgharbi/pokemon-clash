import { pokeApiClient } from "@/api/config";
import { MAX_POKEMON_TO_FETCH } from "@/utils/const";

type ErrorReturn = {
  status?: number | string;
  message?: string;
};

/**
 * 
 * @param attr to get french pokemon by name or id or something else
 * @returns 
 */
const getFrenchName = async (attr: string | number): Promise<string | undefined> => {
  try {
    const res = await pokeApiClient.get(`/pokemon-species/${attr}`);
  
    const frEntry = res.data.names?.find(
      (n: { language: { name: string }; name: string }) => n.language.name === "fr"
    );

    return frEntry?.name;
  } catch {
    return undefined;
  }
};

export const getPokemon = async (id: number): Promise<PokeAPIResponse> => {
  try {
    const [pokemonRes, nameFr] = await Promise.all([
      pokeApiClient.get(`/pokemon/${id}`),
      getFrenchName(id),
    ]);
    return { ...pokemonRes.data, nameFr };
  } catch (error: ErrorReturn | any) {
    throw new Error(error.message);
  }
};

export const getPokemons = async (offset = 0, limit = 30): Promise<PokeAPIResponse[]> => {
  try {
    const end = Math.min(offset + limit, MAX_POKEMON_TO_FETCH);
    const pokemons: ReturnType<typeof getPokemon>[] = [];

    for (let i = offset; i < end; i++) {
      pokemons.push(getPokemon(i + 1));
    }

    return Promise.all(pokemons);
  } catch (error: ErrorReturn | any) {
    throw new Error(error.message);
  }
};

export const getPokemonByName = async (name: string): Promise<PokeAPIResponse> => {
  try {
    const [pokemonRes, nameFr] = await Promise.all([
      pokeApiClient.get(`/pokemon/${name.toLowerCase()}`),
      getFrenchName(name.toLowerCase()),
    ]);
    return { ...pokemonRes.data, nameFr };
  } catch (error: ErrorReturn | any) {
    throw new Error(error.message);
  }
}
