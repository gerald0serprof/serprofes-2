/* EJERCICIO 1 : Contador de Clics (Gestión de Datos) */
//1. Se identifica las etiquetas exactas que se van a manipular
const btnContar = document.querySelector('#countBtn');
const spanContar = document.querySelector('#count');

//2. Variable global para recordar el número de clics
let contador = 0;

//3. Escuchamos el evento clic en el botón
/*
btnContar.addEventListener('click', () => {
    contador++;
    spanContar.textContent = contador;
});
*/

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

/* EJERCICIO 3 : Modo Oscuro */
const toggleOscuro = document.querySelector('#themeToggle');
const textoSwitch = document.querySelector('.switch-text');
const cuerpoWeb = document.body;

// Paso A -> Comprueba si el usuario ya tenia el modo oscuro guardado al acargar la web
const temaGuardado = localStorage.getItem('temaPreferido')
if (temaGuardado === 'oscuro') {
    cuerpoWeb.classList.add('dark');
    toggleOscuro.checked = true;
    textoSwitch.textContent = 'Desactivar Modo Oscuro';
}

// Paso B -> Escucha cuadno el usuario marca o desmarca el checkbox
toggleOscuro.addEventListener('change', () => {
    if (toggleOscuro.checked) {
        cuerpoWeb.classList.add('dark');
        localStorage.setItem('temaPreferido', 'oscuro');
        textoSwitch.textContent = 'Desactivar Modo Oscuro';
    }else {
        cuerpoWeb.classList.remove('dark');
        localStorage.setItem('temaPreferido', 'claro');
        textoSwitch.textContent = 'Activar Modo Oscuro';
    }
});

/* RETO 1 : Desabilitar botón contador si llega a un limite X */
const LIMITE_MAX = 10;
const botonEspecial = document.getElementById('countBtn');

btnContar.addEventListener('click', () => {
    contador++;
    spanContar.textContent = contador;
    if (contador >= LIMITE_MAX) {
        botonEspecial.disabled = true;
        botonEspecial.style.backgroundColor = "gray";
        botonEspecial.style.color = "white";
        botonEspecial.style.cursor = "not-allowed";
    }
});

