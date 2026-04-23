import { pokeApiClient } from "@/api/config";
import { MAX_POKEMON_TO_FETCH } from "@/utils/const";

type ErrorReturn = {
  status?: number | string;
  message?: string;
};

const getFrenchName = async (id: number): Promise<string | undefined> => {
  try {
    const res = await pokeApiClient.get(`/pokemon-species/${id}`);
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

export const getPokemons = async (): Promise<PokeAPIResponse[]> => {
  try {
    const pokemons: ReturnType<typeof getPokemon>[] = [];

    for (let i = 0; i < MAX_POKEMON_TO_FETCH; i++) {
      pokemons.push(getPokemon(i + 1));
    }

    const res = Promise.all(pokemons);
    return res;
  } catch (error: ErrorReturn | any) {
    throw new Error(error.message);
  }
};
