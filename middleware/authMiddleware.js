const jwt = require("jsonwebtoken");

// Middleware untuk verifikasi JWT
const verifyTokenAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek header Authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded; // simpan data user di req.user

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek header Authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded; // simpan data user di req.user

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyTokenAdmin, verifyToken };
