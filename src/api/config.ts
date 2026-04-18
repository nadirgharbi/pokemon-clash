// api configuration
import axios from "axios";

export const pokeApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_POKE_API_URL,
    timeout: 5000
})