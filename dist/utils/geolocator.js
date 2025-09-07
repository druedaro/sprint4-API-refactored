// src/utils/geolocator.ts
/**
 * Obtiene las coordenadas geográficas del navegador del usuario.
 * @returns Una promesa que resuelve con un objeto de tipo GeolocationCoordinates.
 */
export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            return reject(new Error('La geolocalización no está disponible en tu navegador.'));
        }
        navigator.geolocation.getCurrentPosition((position) => resolve(position.coords), (error) => reject(error));
    });
}
