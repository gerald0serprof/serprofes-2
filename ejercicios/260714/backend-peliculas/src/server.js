const app = require("./app");
const { server } = require("../config");

app.listen(server.port, () => {
  console.log(`API de CineDB disponible en http://localhost:${server.port}`);
});