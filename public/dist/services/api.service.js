// src/services/api.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Servicio agnóstico para realizar peticiones fetch a cualquier API.
 * @param url La URL del endpoint al que se va a consultar.
 * @param options Opciones de la petición (headers, method, etc.).
 * @returns Una promesa que resuelve con los datos en formato JSON.
 */
export function fetchData(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, options);
            if (!response.ok) {
                // Error más descriptivo, como sugirió el profesor.
                throw new Error(`Error en la red: ${response.status} - ${response.statusText}`);
            }
            return yield response.json();
        }
        catch (error) {
            console.error(`Error al realizar la petición a ${url}:`, error);
            // Re-lanzamos el error para que el código que llama a esta función pueda manejarlo.
            throw error;
        }
    });
}
