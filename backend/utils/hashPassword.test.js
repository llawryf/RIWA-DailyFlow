const hashPassword = require("./hashPassword");
const bcrypt = require("bcrypt");

  const OrginalnaLozinka = "lozinka123";

  test("provjera ako je hashiranje prošlo uspješno", async () => {
    const hash = await hashPassword(OrginalnaLozinka);
    expect(hash).not.toBe(OrginalnaLozinka);
    expect(typeof hash).toBe("string");
  });

  test("provjera podudaranja hashirane i nehashirane lozinke", async () => {
    const hash = await hashPassword(OrginalnaLozinka);
    const isMatch = await bcrypt.compare(OrginalnaLozinka, hash);
    expect(isMatch).toBe(true);
  });

