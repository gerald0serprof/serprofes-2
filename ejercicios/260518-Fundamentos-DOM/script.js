/* EJERCICIO 1 : Contador de Clics (Gestión de Datos) */
//1. Se identifica las etiquetas exactas que se van a manipular
const btnContar = document.querySelector('#countBtn');
const spanContar = document.querySelector('#count');

//2. Variable global para recordar el número de clics
let contador = 0;

//3. Escuchamos el evento clic en el botón
btnContar.addEventListener('click', () => {
    contador++;
    spanContar.textContent = contador;
});

/* EJERCICIO 2 : Toggle Menu (Manipulación de Clases CSS) */
const btnToggle = document.querySelector('#toggleMenu');
const nav = document.querySelector('#mainNav');

btnToggle.addEventListener('click', () => {
    //classList.toggle() -> Si la clase está oculto, se quitará
    nav.classList.toggle('oculto');

    //Cambia el texto del botón dependiendo de si el menú está visible o no
    const estaOculto = nav.classList.contains('oculto');
    if (estaOculto) {
        btnToggle.textContent = 'Mostrar Menu';
    }else {
        btnToggle.textContent = 'Ocultar Menu';
    }
});