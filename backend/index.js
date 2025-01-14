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
   connection.query("SELECT SifraRecepta, NazivRecepta, OznakeRecepta, OcjenaRecepta FROM Recept", (error, results) => {
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
            console.error('Error retrieving recipes:', error);
            return res.status(500).json({ error: 'An error occurred while retrieving recipes.' });
        }
        
        res.send(results);
    });
  });

  app.get("/api/PetragaKorisnika/", (req, res) => {
    connection.query("SELECT KorisnickoIme, PreferencijeKorisnika FROM KORISNIK",(error, results) => {
      if (error) throw error;
      res.send(results);
    });


  });

 app.get("/api/adminPetragaKorisnika/", (req, res) => {
    connection.query("SELECT KorisnickoIme, EmailKorisnika FROM KORISNIK",(error, results) => {
      if (error) throw error;
      res.send(results);
    });


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
    const query = 'DELETE FROM Recept WHERE SifraRecepta = ?';
        connection.query(query, [id], (error, results) => {
          if (error) {
            console.error('Error deleting recipe:', error);
            return res.status(500).json({ error: 'An error occurred while deleting the recipe.' });
          }
          
          if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Recipe not found.' });
          }
          
          res.status(200).json({ message: 'Recipe deleted successfully.' });
        });
      });

  app.delete('/api/DeleteUser/:email', (req, res) => {
    const { email } = req.params;
    
    // SQL upit za brisanje korisnika
    const query = 'DELETE FROM KORISNIK WHERE EmailKorisnika = ?';
    
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the user.' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
      
      res.status(200).json({ message: 'User deleted successfully.' });
    });
  });
  

  app.put("/api/updateUser/:id", (req, res) => {
    const { id } = req.params;
    const {  Lozinka, Mail, PreferencijeKorisnika } = req.body;
  
    
    const query = `
      UPDATE KORISNIK 
      SET Lozinka = ?, PreferencijeKorisnika = ? 
      WHERE EmailKorisnika = ?`;
  
    
    const values = [ Lozinka, PreferencijeKorisnika, Mail];
  
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Korisnik nije pronađen' });
        return;
      }
      res.json({ message: 'Podaci su uspješno ažurirani' });
    });
  });
  

  app.listen(port, () => {
    console.log("Server running at port: " + port);
});

