import {baseURL} from "./config.js";

/** callAPI: Cliente Genérico
* @param {String} ruta - Ruta final (ej. "/post/")
* @param {object} ocpiones - Configuración extra (GET, POST, DELETE..)
*
*/
export async function callAPI(ruta, opciones = {}){
    // 1. Se construye la URL completa (Base + Ruta)
    const urlCompleta = `${baseURL}${ruta}`;

    // 2. Bloque de seguridad (se realizará en caso que falle la lógica del sistema)

    try {
        // 3. El 'await'
        const respuesta = await fetch(urlCompleta, {
            headers: {"Content-Type": "application/json"},
            ...opciones
        });

        // 4. Verificamos el estado(El servidor respondió, ej: 404 No Encontrado)
        if (!respuesta) {
            throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
        }
        // 5. Traducimos el paquete JSON a un objeto de Javascript
        const datos = await respuesta.json();

        return datos;
    } catch (error) {
        // 6. Si se cae internet o la URL no existe, lo atrapamos aquí
        console.error("Fallo crítico en el sistema: ", error)

        throw error;
    } finally {
        console.log("Finalizó la llamada a la API");
    }
}