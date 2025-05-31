const util = require('util');

async function checkUser(email, connection) {
  const queryAsync = util.promisify(connection.query).bind(connection);
  const results = await queryAsync("SELECT * FROM KORISNIK WHERE EmailKorisnika = ?", [email]);
  return results.length > 0;
}

module.exports = checkUser;
