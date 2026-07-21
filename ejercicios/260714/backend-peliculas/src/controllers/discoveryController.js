const tmdbService = require("../services/tmdbService");

const search = async (req, res) => {
  const result = await tmdbService.searchContent(req.query);
  return res.json(result);
};

const upcoming = async (req, res) => {
  const result = await tmdbService.getUpcoming(req.query);
  return res.json(result);
};

module.exports = {
  search,
  upcoming,
};
