const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movieRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const discoveryRoutes = require("./routes/discoveryRoutes");
const { notFoundHandler, errorHandler } = require("./utils/errorHandlers");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.use("/api/peliculas", movieRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api", discoveryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
