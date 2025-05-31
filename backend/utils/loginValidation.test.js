const loginValidation = require("./loginValidation");

  test("Provjera ako je polje korisnicko ime prazno, a lozinka prisutna", () => {
    const result = loginValidation({ password: "pass" });
    expect(result.isValid).toBe(false);
  });

  test("Provjera ako je polje lozinka prazno, a korisnicko ime prisutno", () => {
    const result = loginValidation({ username: "user" });
    expect(result.isValid).toBe(false);
  });

  test("Provjera ako su oba prazna", () => {
    const result = loginValidation({});
    expect(result.isValid).toBe(false);
  });
