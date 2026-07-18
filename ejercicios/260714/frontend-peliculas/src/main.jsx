import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// Hoja de estilos única y consolidada para toda la interfaz.
import "./App.css";

// Punto de arranque de la aplicación.
// Aquí React "engancha" el componente App al <div id="root"> del index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
