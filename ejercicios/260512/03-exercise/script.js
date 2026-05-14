// Array de objetos
const carrito = [
    {nombre: "🍞 Pan de molde", precio:1.50 },
    {nombre: "🥛 Leche entera", precio: 1.90},
    {nombre: "🥚 Huevos Camperos", precio: 3.20},
    {nombre: "🥑 Aguacate", precio:1.00}
];

// APOYO VISUAL
let listaHTML = document.getElementById('lista-producto');
for(let i = 0; i < carrito.length;i++){
    // Usamos carrito[i].nombre para sacar el dato en cada vuelta
    listaHTML.innerHTML += `
    <li><span>${carrito[i].nombre}</span>
    <span>${carrito[i].precio.toFixed(2)}€</span>
    `  
}
// FUNCION COBRAR
function cobrar() {

let sumaTotal = 0;
for (let i = 0; i< carrito.length; i++){
    sumaTotal = sumaTotal + carrito[i].precio;
}

document.getElementById('resultado-total').textContent =
"Total: " + sumaTotal.toFixed(2) + " €";

}