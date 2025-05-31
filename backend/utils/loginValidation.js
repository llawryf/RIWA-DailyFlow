function validateLoginInput({ username, password }) {
  if (!username || !password) {
    return {
      isValid: false,
      message: "Korisničko ime i lozinka su obavezni",
    };
  }
  return { isValid: true };
}
module.exports = validateLoginInput;
