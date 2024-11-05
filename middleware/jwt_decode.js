const jwt = require("jsonwebtoken");
const environment = require("../env/environmentVar");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Access denied, Token not provided!",
    });
  }

  try {
    const decoded_token = jwt.verify(token, environment.JWT_SECRET_KEY);
    req.user = decoded_token;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = authenticateJWT;
