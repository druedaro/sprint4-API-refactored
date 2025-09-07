// src/services/api.service.ts

/**
 * Servicio agnóstico para realizar peticiones fetch a cualquier API.
 * @param url La URL del endpoint al que se va a consultar.
 * @param options Opciones de la petición (headers, method, etc.).
 * @returns Una promesa que resuelve con los datos en formato JSON.
 */
export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            // Error más descriptivo, como sugirió el profesor.
            throw new Error(`Error en la red: ${response.status} - ${response.statusText}`);
        }

        return await response.json() as T;

    } catch (error) {
        console.error(`Error al realizar la petición a ${url}:`, error);
        // Re-lanzamos el error para que el código que llama a esta función pueda manejarlo.
        throw error;
    }
}