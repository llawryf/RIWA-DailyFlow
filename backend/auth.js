const jwt = require("jsonwebtoken");
const { jwtSecrets } = require("./secrets");

function verifyToken(token) {
  for (const secret of jwtSecrets) {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
    }
  }
  throw new Error("Neispravan token ili je istekao");
}

module.exports = { verifyToken };
