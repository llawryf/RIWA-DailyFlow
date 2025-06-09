const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
const hashPassword = require("./utils/hashPassword");
const loginValidation = require("./utils/loginValidation");
const checkUser = require("./utils/checkUser");


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "ucka.veleri.hr",
  user: "lmajetic",
  password: "11",
  database: "lmajetic",
});

app.use(express.urlencoded({ extended: true }));

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/api/pretragaRecepta", (req, res) => {
  const query = `
      SELECT
        Recept.SifraRecepta,
        Recept.NazivRecepta,
        Recept.OznakeRecepta,
        Recept.OcjenaRecepta,
        GROUP_CONCAT(CONCAT(Sastojak.NazivSastojka, ' (', SastojakUReceptu.KolicinaSastojka, ')') SEPARATOR ', ') AS Sastojci
      FROM Recept
      LEFT JOIN SastojakUReceptu ON Recept.SifraRecepta = SastojakUReceptu.SifraRecepta
      LEFT JOIN Sastojak ON Sastojak.SifraSastojka = SastojakUReceptu.SifraSastojka
      GROUP BY Recept.SifraRecepta, Recept.NazivRecepta, Recept.OznakeRecepta, Recept.OcjenaRecepta
    `;

  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/api/pretragaSpremljenihRecepta/:email", (req, res) => {
  const { email } = req.params;

  const query = `
        SELECT SifraRecepta, NazivRecepta, OznakeRecepta, OcjenaRecepta, EmailKorisnika
        FROM Recept
        WHERE EmailKorisnika = ?
    `;
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error("Error retrieving recipes:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving recipes." });
    }

    res.send(results);
  });
});
/*
  app.get("/api/searchUserSavedRecipes/:email", (req, res) => {
    const { email } = req.params;

    const query = `
        SELECT SifraRecepta, NazivRecepta, OznakeRecepta, OcjenaRecepta, EmailKorisnika
        FROM Recept
        WHERE EmailKorisnika = ?
    `;
    connection.query(query, [email], (error, results) => {
        if (error) {
            console.error('Error retrieving recipes:', error);
            return res.status(500).json({ error: 'An error occurred while retrieving recipes.' });
        }

        res.send(results);
    });
  });
*/
const { verifyToken } = require("./auth");

app.get("/api/PetragaKorisnika", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nedostaje token za validaciju" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    connection.query(
      "SELECT KorisnickoIme, PreferencijeKorisnika FROM KORISNIK",
      (error, results) => {
        if (error) throw error;
        res.send(results);
      }
    );
  } catch (err) {
    return res.status(401).json({ message: "Token je istekao ili ne valja" });
  }
});


app.get("/api/adminPetragaKorisnika/", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nedostaje token za validaciju" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    connection.query(
      "SELECT KorisnickoIme, EmailKorisnika FROM KORISNIK",
      (error, results) => {
        if (error) throw error;
        res.send(results);
      }
    );
  } catch (err) {
    return res.status(401).json({ message: "Token je istekao ili ne valja" });
  }
});


app.post("/IzradaRecepta", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nedostaje token za validaciju" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const { recipeName, recipeDescription, recipeTags } = req.body;
    // Provjera ako su polja ispunjena
    if (!recipeName || !recipeDescription || !recipeTags) {
      return res.status(400).json({ error: "Sva su polja obavezna" });
    }
    // SQL upit za unos podataka
    const query =
      "INSERT INTO Recipe (recipeName, recipeDescription, recipeTags) VALUES (?, ?, ?)";
    const values = [recipeName, recipeDescription, recipeTags];
    // Izvršavanje upita
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error("Greška prilikom unosa u bazu:", error);
        return res
          .status(500)
          .json({ error: "Došlo je do pogreške prilikom unosa u bazu." });
      }
      // Uspješan odgovor
      res.status(201).json({
        message: "Recept uspješno unesen!",
        data: { id: results.insertId, recipeName, recipeDescription, recipeTags },
      });
    });
  } catch (err) {
    return res.status(401).json({ message: "Token je istekao ili ne valja" });
  }
});


app.post("/register", async (req, res) => {
  const { korIme, email, password, prefKor } = req.body;

  // Provjera ako su polja ispunjena
  if (!korIme || !email || !password || !prefKor) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }
  try {
    // Provjeri postoji li korisnik - koristi izdvojenu funkciju
    const userExists = await checkUser(email, connection);
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }
  } catch (err) {
    console.error("Error checking user existence:", err);
    return res.status(500).json({ success: false, message: "Error checking user." });
  }

    // hashiranje lozinke i unos u bazu
    try {
      const hashedPassword = await hashPassword(password);
      const insertQuery =
        "INSERT INTO KORISNIK (EmailKorisnika, Lozinka, KorisnickoIme, PreferencijeKorisnika) VALUES (?, ?, ?,?)";

      connection.query(
        insertQuery,
        [email, hashedPassword, korIme, prefKor],
        (err, results) => {
          if (err) {
            console.error("Error during user insertion:", err);
            return res.status(500).json({
              success: false,
              message: "An error occurred while creating the user.",
            });
          }

          return res
            .status(201)
            .json({ success: true, message: "Account created successfully." });
        }
      );
    } catch (hashError) {
      console.error("Error during password hashing:", hashError);
      return res.status(500).json({
        success: false,
        message: "An error occurred while hashing the password.",
      });
    }
  });

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const validation = loginValidation({ username, password });

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.message,
    });
  }
  //Trazi prema kor.imenu
  const query = "SELECT * FROM KORISNIK WHERE KorisnickoIme = ?";
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Greška u bazi podataka." });
    }

    //Ako kor. nije naden
    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Pogrešno korisničko ime ili lozinka.",
      });
    }

    //Dohvacanje hashiranje lozinke
    const user = results[0];
    bcrypt.compare(password, user.Lozinka, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res
          .status(500)
          .json({ success: false, message: "Greška pri usporedbi lozinke." });
      }

      // Ako se lozinke podudaraju + jwt autentikacija:
      if (isMatch) {
        const { jwtSecrets } = require("./secret");

        const token = jwt.sign(
          { username: user.KorisnickoIme },
          jwtSecrets[0], // koristi trenutni ključ
          { expiresIn: "1h" }
        );


        return res.status(200).json({
          success: true,
          message: "Prijava uspješna.",
          token,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Pogrešno korisničko ime ili lozinka.",
        });
      }
    });
  });
});

app.delete("/api/DeleteRecipe/:id", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nedostaje token za validaciju" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const { id } = req.params; // dohvat id-a iz poziva
    const query = "DELETE FROM Recept WHERE SifraRecepta = ?";
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error deleting recipe:", error);
        return res
          .status(500)
          .json({ error: "An error occurred while deleting the recipe." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Recipe not found." });
      }

      res.status(200).json({ message: "Recipe deleted successfully." });
    });
  } catch (err) {
    return res.status(401).json({ message: "Token je istekao ili ne valja" });
  }
});


app.delete("/api/DeleteUser/:email", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nedostaje token za validaciju" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const { email } = req.params;

    // SQL upit za brisanje korisnika
    const query = "DELETE FROM KORISNIK WHERE EmailKorisnika = ?";

    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error("Error deleting user:", error);
        return res
          .status(500)
          .json({ error: "Greska pri ucitavanju korisnika" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Korisnik ne postoji" });
      }

      res.status(200).json({ message: "Korisnik uspjesno izbrisan" });
    });
  } catch (err) {
    return res.status(401).json({ message: "Token je istekao ili ne valja" });
  }
});


app.put("/api/updateUser/:id", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nedostaje token za validaciju" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const { id } = req.params;
    const { Lozinka, Mail, PreferencijeKorisnika } = req.body;

    try {
      const hashedPassword = await hashPassword(Lozinka);

      const query = `
        UPDATE KORISNIK
        SET Lozinka = ?, PreferencijeKorisnika = ?
        WHERE EmailKorisnika = ?`;

      const values = [hashedPassword, PreferencijeKorisnika, Mail];

      connection.query(query, values, (error, results) => {
        if (error) {
          console.error("Error updating user:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Korisnik nije pronađen" });
        }

        res.json({ message: "Podaci su uspješno ažurirani" });
      });

    } catch (error) {
      console.error("Greška pri hashiranju lozinke:", error);
      res.status(500).json({ error: "Neuspješno hashiranje lozinke" });
    }

  } catch (err) {
    return res.status(401).json({ message: "Token je istekao ili ne valja" });
  }
});


app.listen(port, () => {
  console.log("Server running at port: " + port);
});
