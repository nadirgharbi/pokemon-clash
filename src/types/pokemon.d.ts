// types/pokeapi.ts

interface PokeAPIResponse {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number

  types: Array<{
    slot: number
    type: {
      name: string  // "fire", "water", etc.
      url: string
    }
  }>

  stats: Array<{
    base_stat: number
    effort: number
    stat: {
      name: string  // "hp", "attack", "defense", "special-attack", "special-defense", "speed"
      url: string
    }
  }>

  sprites: {
    front_default: string       // sprite face
    back_default: string        // sprite dos
    front_shiny: string         // sprite shiny face
    back_shiny: string          // sprite shiny dos
    other: {
      'official-artwork': {
        front_default: string   // artwork HD
      }
    }
  }

  moves: Array<{
    move: {
      name: string  // "flamethrower", "surf", etc.
      url: string
    }
  }>

  abilities: Array<{
    ability: {
      name: string  // "blaze", "torrent", etc.
      url: string
    }
    is_hidden: boolean
    slot: number
  }>
}