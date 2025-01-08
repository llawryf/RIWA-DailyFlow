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
  
  app.listen(port, () => {
    console.log("Server running at port: " + port);
});

