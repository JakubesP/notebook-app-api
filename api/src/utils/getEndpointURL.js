module.exports = (req, endpoint) =>
  `${req.protocol}://${req.get("host")}/${endpoint}`;
