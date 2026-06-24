//1. Importamos la herramienta principal (Express)
const express = require("express");

const cors = require("cors"); // 1. IMPORTAMOS CORS

//2. Creamos nuestra aplicación(nuestro servidor)
const app = express();

//3. MIDDLEWARE (La línea mágica)
// Esto es  un traductor. Le dice a Node: "Si alguien
// te envia datos desde fuera, tradúcelos al formato
// JSON para que podamos leerlos". Si falta esto
// , el POST falla."
app.use(cors()); // 2. DAMOS PERMISO A REACT
app.use(express.json());

//4. NUESTRA BASE DE DATOS
// Guardamos información temporalmente en la lista array
//dentro de la memoria del servidor
let estudiantes = [
    { id: 1, nombre: "Aroa", curso: "React"},
    { id: 2, nombre: "Daniela", curso: "Node"},
    { id: 3, nombre: "Jose", curso: "React"},
    { id: 4, nombre: "Rafal", curso: "Node"},
    { id: 5, nombre: "Pedro", curso: "React"},
    { id: 6, nombre: "Ivan", curso: "Node"},
    { id: 7, nombre: "Lewis", curso: "React"},
    { id: 8, nombre: "Alexa", curso: "Node"},
    { id: 9, nombre: "Bryan", curso: "React"},
    { id: 10, nombre: "Rosa", curso: "Node"}
];

// RUTA GET: PARA LEER DATOS
// Cuando alguien pregunte por "/api/estudiantes", el servidor muestra la lista
app.get("/api/estudiantes", (req, res)=> {
    res.json(estudiantes);
});

// RUTA POST: PARA GUARDAR DATOS NUEVOS
//Cuando alguien envíe información a "api/estudiantes", hacemos lo siguiente
app.post("/api/estudiantes", (req, res) => {
  // A. Extraemos nombre y curso del body
  const { nombre, curso } = req.body; 

  // [RETO NIVEL 3]: Validación (El portero)
  if (!nombre || !curso || nombre.trim() === "" || curso.trim() === "") {
    return res.status(400).json({ 
      error: "Error: El nombre y el curso son obligatorios." 
    });
  }

  // [RETO NIVEL 2]: ID Automático
  const nuevoEstudiante = {
    id: estudiantes.length + 1,
    nombre: nombre,
    curso: curso
  };

  estudiantes.push(nuevoEstudiante);

  res.json({
    mensaje: "¡Estudiante añadido con éxito!",
    listaActualizada: estudiantes
  });
});

// ==========================================
// RUTAS DE PROFESORES [RETO NIVEL 1]
// ==========================================
app.get("/api/profesores", (req, res) => {
  res.json(profesores);
});

app.post("/api/profesores", (req, res) => {
  const nuevoProfesor = {
    id: profesores.length + 1,
    ...req.body
  };
  profesores.push(nuevoProfesor);
  res.json({
    mensaje: "¡Profesor añadido con éxito!",
    listaActualizada: profesores
  });
});


// ==========================================
// RUTAS DINÁMICAS (CRUD COMPLETO)
// ==========================================

// 🔍 BUSCAR UN ESTUDIANTE POR ID
app.get("/api/estudiantes/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);
  const estudiante = estudiantes.find(e => e.id === idBuscado);

  if (estudiante) {
    res.json(estudiante);
  } else {
    res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

// ✏️ ACTUALIZAR UN ESTUDIANTE
app.put("/api/estudiantes/:id", (req, res) => {
  const idActualizar = parseInt(req.params.id);
  const indice = estudiantes.findIndex(e => e.id === idActualizar);

  if (indice !== -1) {
    // Actualizamos los datos, pero mantenemos el ID original intacto
    estudiantes[indice] = { id: idActualizar, ...req.body };
    res.json({
      mensaje: "¡Estudiante actualizado!",
      estudianteModificado: estudiantes[indice]
    });
  } else {
    res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

// 🗑️ ELIMINAR UN ESTUDIANTE
app.delete("/api/estudiantes/:id", (req, res) => {
  const idBorrar = parseInt(req.params.id);
  // Nos quedamos con todos los que NO coincidan con el ID
  estudiantes = estudiantes.filter(e => e.id !== idBorrar);

  res.json({
    mensaje: "Estudiante eliminado",
    listaActualizada: estudiantes
  });
});

//5.ENCENDER EL MOTOR
// Le decimos al servidor que quede vigilando el puerto 3000
app.listen(3000, () =>{
    console.log("🎉¡Servidor funcionando! URL: http://localhost:3000");
})