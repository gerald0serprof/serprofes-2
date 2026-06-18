// Mostramos información del sistema
/*
console.log("Iniciamos el cuarto de máquina");
console.log("Versión Node");
console.log(process.version);
*/

// Importamos Express
const express = require("express");
// Creamos la applicación
const app = express();

// Ruta principal
app.get("/", (req,res) => {
    // Se envia la respuesta
    res.send("Servidor funcionando");
});

app.get("/saludo", (req, res) => {
    res.send("Hola alumnos");
});

app.get("/api", (req, res) => {
    res.json({
        estado:"ok"
    });
});

app.get("/hobbies", (req, res) => {
  res.json([
    { hobbie: "leer" },
    { hobbie: "cine" },
    { hobbie: "programar" }
  ]);
});

// Arrancamos el servidor que en el puerto 3000
app.listen(3000, () => {
    console.log("Sevidor iniciado");
});

