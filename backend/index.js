const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'ucka.veleri.hr',
    user: 'lmajetic',
    password: '11',
    database: 'lmajetic'
  });

  
app.use(express.urlencoded({ extended: true }));
  


connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  app.get("/api/pretragaRecepta", (req, res) => {
   connection.query("SELECT recipeId, recipeName, recipeTags, recipeRating FROM Recipe", (error, results) => {
      if (error) throw error;
      res.send(results);
    });
    
  });


  app.get("/api/PetragaKorisnika/", (req, res) => {
    connection.query("SELECT KorisnickoIme, EmailKorisnika FROM KORISNIK",(error, results) => {
      if (error) throw error;
      res.send(results);
    });


  });



  app.get("/api/prikazsvihRecepata/:id_korisnik", (req, res) => {
    const id_korisnik = req.params.id_korisnik;
    connection.query(
      "SELECT recipeId, recipeName,userEmail,recipeDescription, recipeTags, recipeRating  FROM Recipe, User WHERE Recipe.userId = User.userId AND User.userId = ?",
      id_korisnik,
      (error, results) => {
        if (error) {
          console.error('Database query error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        if (results.length === 0) {
          res.status(404).json({ message: 'No recipes found for this user' });
          return;
        }
        res.json(results);
      }
    );
  });
 
  app.post("/api/unos_knjige", (req, res) => {
    const data = req.body;
    knjiga = [[data.naslov,data.autor, data.opis,data.stanje,data.slika]]
   connection.query("INSERT INTO knjiga (naslov, autor, opis,stanje,slika) VALUES ?", [knjiga], (error, results) => {
      if (error) throw error;
      res.send(results);
    });
   // res.send("poslano"+data.id_knjiga);
  });

  app.get("/api/rezervirane_knjige/:id_korisnik", (req, res) => {
    const id_korisnik= req.params.id_korisnik;
    connection.query("SELECT knjiga.id,naslov,autor, korisnik.ime,korisnik.prezime,rezervacija.datum_rez FROM knjiga, rezervacija, korisnik WHERE knjiga.id=rezervacija.knjiga and korisnik.id=rezervacija.korisnik AND korisnik.id=?", id_korisnik,(error, results) => {
      if (error) throw error;
      res.send(results);
    });
  });

  app.post("/IzradaRecepta", (req, res) => {
    const { recipeName, recipeDescription, recipeTags } = req.body;
    // Provjera jesu li polja ispunjena
    if (!recipeName || !recipeDescription || !recipeTags) {
      return res.status(400).json({ error: "Sva polja su obavezna!" });}
    // SQL upit za unos podataka
    const query = "INSERT INTO Recipe (recipeName, recipeDescription, recipeTags) VALUES (?, ?, ?)";
    const values = [recipeName, recipeDescription, recipeTags];
    // Izvršavanje upita
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error("Greška prilikom unosa u bazu:", error);
        return res.status(500).json({ error: "Došlo je do pogreške prilikom unosa u bazu." });}
      // Uspješan odgovor
      res.status(201).json({
        message: "Recept uspješno unesen!",
        data: { id: results.insertId, recipeName, recipeDescription, recipeTags },
      });
    });
  });
  

  app.post("/register", async (req, res) => {
    const { korIme, email, password } = req.body;
  
    // Check if all required fields are present
    if (!korIme || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
  
    // Check if user already exists in the database
    const query = 'SELECT * FROM KORISNIK WHERE EmailKorisnika = ?';
    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error during user query:', err);  // Log the exact error
        return res.status(500).json({ success: false, message: 'An error occurred while checking the user.' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already exists.' });
      }
  
      // Hash password and insert new user into the database
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO KORISNIK (EmailKorisnika, Lozinka, KorisnickoIme) VALUES (?, ?, ?)';
        
        connection.query(insertQuery, [email, hashedPassword, korIme], (err, results) => {
          if (err) {
            console.error('Error during user insertion:', err);  // Log the exact error
            return res.status(500).json({ success: false, message: 'An error occurred while creating the user.' });
          }
  
          return res.status(201).json({ success: true, message: 'Account created successfully.' });
        });
      } catch (hashError) {
        console.error('Error during password hashing:', hashError);  // Log the hashing error
        return res.status(500).json({ success: false, message: 'An error occurred while hashing the password.' });
      }
    });
  });

  app.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Korisničko ime i lozinka su obavezni.' });
    }
  
    // Find user by username
    const query = 'SELECT * FROM KORISNIK WHERE KorisnickoIme = ?';
    connection.query(query, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Greška u bazi podataka.' });
      }
  
      // If no user found, return error
      if (results.length === 0) {
        return res.status(400).json({ success: false, message: 'Pogrešno korisničko ime ili lozinka.' });
      }
  
      // Get the stored hashed password
      const user = results[0];
      bcrypt.compare(password, user.Lozinka, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ success: false, message: 'Greška pri usporedbi lozinke.' });
        }
  
        // If passwords match, return success, otherwise return error
        if (isMatch) {
          return res.status(200).json({ success: true, message: 'Prijava uspješna.' });
        } else {
          return res.status(400).json({ success: false, message: 'Pogrešno korisničko ime ili lozinka.' });
        }
      });
    });
  });


  app.delete('/api/DeleteRecipe/:id', async (req, res) => {
    const { id } = req.params; // dohvat id-a iz poziva
    try {
      const result = await pool.query(
        'DELETE FROM Recipe WHERE recipeId = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Recipe not found.' });
      }

      res.status(200).json({ message: 'Recipe deleted successfully', deletedRecipe: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the recipe.' });
    }
  });

  app.put("/api/updateUser/:id", (req, res) => {
    const { id } = req.params;
    const { EmailKorisnika, Lozinka, KorisnickoIme, PreferencijeKorisnika } = req.body;
  
    // SQL upit za ažuriranje podataka korisnika
    const query = `
      UPDATE KORISNIK 
      SET EmailKorisnika = ?, Lozinka = ?, PreferencijeKorisnika = ? 
      WHERE KorisnickoIme = ?`;
  
    // Vrednosti za upit
    const values = [EmailKorisnika, Lozinka, PreferencijeKorisnika, KorisnickoIme];
  
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({ message: 'User updated successfully' });
    });
  });
  

  app.listen(port, () => {
    console.log("Server running at port: " + port);
});

