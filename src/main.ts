// main.ts
'use strict'

// Importaciones de nuestros nuevos módulos
import { fetchData } from './services/api.service.js';
import { getCurrentPosition } from './utils/geolocator.js';
import { WEATHER_API_KEY, DEFAULT_CITY, jokeProviders } from './config/config.js';

// ---- INTERFACES ----
interface JokeReport {
    joke: string;
    score: number;
    date: string; // ISO 8601 string
}

interface WeatherData {
    name: string;
    weather: {
        description: string;
        icon: string;
    }[];
    main: {
        temp: number;
        humidity: number;
    };
}

// ---- SELECTORES DEL DOM ----
const locationStrong = document.querySelector('.location strong')!;
const weatherDescription = document.getElementById('weatherDescription')!;
const weatherIcon = document.getElementById('weatherIcon')!;
const weatherTemp = document.getElementById('weatherTemp')!;
const weatherHumidity = document.getElementById('weatherHumidity')!;
const jokesDiv = document.getElementById('jokesDiv')!;
const ratingButtons = document.querySelectorAll('#ratingButtons button');
const submitButton = document.getElementById('submitButton')!;
const jokeContainer = document.querySelector('.custom-background') as HTMLDivElement;

// ---- ESTADO DE LA APLICACIÓN ----
const reportJokes: JokeReport[] = [];
let currentJoke: string = '';
let selectedScore: number | null = null;

// ---- LÓGICA DE CLIMA ----
async function getWeather() {
    let weatherUrl: string;
    try {
        const coords = await getCurrentPosition();
        // Construye la URL con las coordenadas del usuario
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${WEATHER_API_KEY}`;
        
    } catch (error) {
        console.warn('No se pudo obtener la geolocalización. Usando ciudad por defecto.', error);
        // Construye la URL con la ciudad por defecto del archivo de configuración
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&units=metric&appid=${WEATHER_API_KEY}`;
    }

    try {
        const data = await fetchData<WeatherData>(weatherUrl);
        locationStrong.textContent = data.name;
        weatherDescription.textContent = data.weather[0].description.toUpperCase();
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;
        weatherTemp.textContent = `${data.main.temp.toFixed(1)} °C`;
        weatherHumidity.textContent = `${data.main.humidity} %`;
    } catch (error) {
        console.error('Error al obtener los datos del clima:', error);
        locationStrong.textContent = 'Clima no disponible';
    }
}


// ---- LÓGICA DE CHISTES ----
async function getRandomJoke() {
    try {
        // 1. Elige un proveedor de chistes al azar desde el archivo de configuración
        const randomProvider = jokeProviders[Math.floor(Math.random() * jokeProviders.length)];
        
        // 2. Llama al servicio agnóstico con la URL y opciones del proveedor
        const data = await fetchData<any>(randomProvider.url, randomProvider.options);

        // 3. Usa el 'parser' del proveedor para extraer el texto del chiste
        currentJoke = randomProvider.parser(data);
        jokesDiv.textContent = currentJoke;

        // 4. Resetea la UI para el nuevo chiste
        resetRating();
        changeJokeShape();

    } catch (error) {
        jokesDiv.textContent = 'No se pudo cargar el chiste. ¡Inténtalo de nuevo!';
        console.error('Error obteniendo un chiste:', error);
    }
}

// ---- LÓGICA DE PUNTUACIÓN ----
function initializeRating() {
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const score = parseInt(button.getAttribute('data-score')!);
            
            // Lógica para seleccionar/deseleccionar
            if (score === selectedScore) {
                selectedScore = null;
                button.classList.remove('btn-selected');
            } else {
                selectedScore = score;
                ratingButtons.forEach(btn => btn.classList.remove('btn-selected'));
                button.classList.add('btn-selected');
            }
        });
    });

    submitButton.addEventListener('click', () => {
        if (selectedScore !== null) {
            addJokeReport(selectedScore);
        }
        getRandomJoke();
    });
}

function addJokeReport(score: number) {
    const jokeReport: JokeReport = {
        joke: currentJoke,
        score,
        date: new Date().toISOString()
    };
    reportJokes.push(jokeReport);
    console.log('Reporte de chistes actualizado:', reportJokes);
}

function resetRating() {
    selectedScore = null;
    ratingButtons.forEach(btn => btn.classList.remove('btn-selected'));
}

// ---- UTILIDADES UI ----
function changeJokeShape() {
    const shapes = ['shape-1', 'shape-2', 'shape-3', 'shape-4'];
    const currentShape = shapes.find(shape => jokeContainer.classList.contains(shape));
    let newShape;
    do {
        newShape = shapes[Math.floor(Math.random() * shapes.length)];
    } while (newShape === currentShape);

    if (currentShape) jokeContainer.classList.remove(currentShape);
    jokeContainer.classList.add(newShape);
}


// ---- INICIALIZACIÓN ----
function main() {
    getWeather();
    getRandomJoke();
    initializeRating();
}

main();