module.exports = {
  jwtSecrets: [
    process.env.JWT_SECRET_CURRENT,
    process.env.JWT_SECRET_PREVIOUS
  ]
};