// src/config.ts

// Clave de API para OpenWeatherMap. En un proyecto real, esto vendría de variables de entorno (.env).
export const WEATHER_API_KEY = '96cf2de381520089b251bc30cc3baf52';

// Ciudad por defecto si el usuario no comparte su ubicación.
export const DEFAULT_CITY = 'Barcelona';

// Definimos una interfaz para las respuestas de las APIs de chistes para ser más específicos que 'any'.
interface JokeApiResponse {
    joke?: string;  // Para icanhazdadjoke
    value?: string; // Para Chuck Norris
}

/**
 * Array de proveedores de chistes.
 * Cada objeto contiene la URL y un 'parser', una función que sabe cómo extraer
 * el chiste del formato de respuesta específico de esa API.
 * Esto hace que nuestro código principal sea agnóstico a la fuente del chiste.
 */
export const jokeProviders = [
    {
        url: 'https://icanhazdadjoke.com/',
        options: {
            headers: { 'Accept': 'application/json' }
        },
        // Sabe que el chiste está en la propiedad 'joke'
        parser: (data: JokeApiResponse): string => data.joke!
    },
    {
        url: 'https://api.chucknorris.io/jokes/random',
        options: {},
        // Sabe que el chiste está en la propiedad 'value'
        parser: (data: JokeApiResponse): string => data.value!
    }
];