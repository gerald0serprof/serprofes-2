import { callAPI } from "./api.js";

// Atrapamos los elementos de la iterfáz
const pantalla = document.getElementById('pantallaResultados');
const btnBuscar = document.getElementById('btnBuscar');
const inputId = document.getElementById('inputId');
const btnError = document.getElementById('btnError');
const formCrear = document.getElementById('formCrear');

// GET DINÁMICO (buscar publicación)
btnBuscar.addEventListener('click', async () => {
    const id = inputId.value.trim();
    // Seguridad: Que no nos envien campos vacios
    if (id === "") {
        pantalla.textContent = "Por favor, escribe un número de ID.";
        return;
    }
    pantalla.textContent = "Viajando a internet ...";

    try {
        // Se llama a nuesto cartero con la ruta dinámica
        const post = await callAPI('/post/${id}');
        pantalla.textContent = JSON.stringify(post, null, 2);
    } catch (error) {
        pantalla.textContent = "No se encontró la publicación o hubo un error."
        console.error("Fallo crítico en el sistema: ", error)
        throw error;
    }
});