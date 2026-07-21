require("dotenv").config();

module.exports = {
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    baseUrl: "https://api.themoviedb.org/3",
    imageBaseUrl: "https://image.tmdb.org/t/p/w500",
    language: "es-ES",
  },
  server: { port: process.env.SERVER_PORT || 3000 },
};
