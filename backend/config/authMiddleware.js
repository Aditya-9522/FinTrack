const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "No token, access denied" });
  }

  // Expect format: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // assuming payload has { id: userId }
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
