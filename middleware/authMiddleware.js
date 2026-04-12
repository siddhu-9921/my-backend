const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Access denied");

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }

};

module.exports = auth;