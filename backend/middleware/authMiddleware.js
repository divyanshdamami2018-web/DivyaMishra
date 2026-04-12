const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
