const checkUser = require('./checkUser');
//varijabla koja glumi bazu i resetira si nakon svakog testa
let baza;
beforeEach(() => {
  baza = {
    query: jest.fn()
  };
});

test('Provjera ako je korisnik u bazi', async () => {
  baza.query.mockImplementation((sql, params, callback) => {
    callback(null, [{ EmailKorisnika: 'netko@email.hr' }]);
  });

  const result = await checkUser('netko@email.hr', baza);
  expect(result).toBe(true);
});

test('Provjera ako korisnika nema u bazi', async () => {
  baza.query.mockImplementation((sql, params, callback) => {
    callback(null, []);
  });

  const result = await checkUser('nonexistent@example.com', baza);
  expect(result).toBe(false);
});
