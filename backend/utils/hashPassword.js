const bcrypt = require("bcrypt");

const hashPassword = (password, salt = 10) =>
  bcrypt.hash(password, salt);

module.exports = hashPassword;
