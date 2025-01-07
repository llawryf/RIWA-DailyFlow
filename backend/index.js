const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(cors());


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


  app.get("/api/knjige/:naslov", (req, res) => {
    //req  - slanje zahtjeva s klijentske strane, res - slanje odgovora sa serverske strane
    const naslov= req.params.naslov;
      connection.query("SELECT * FROM knjiga WHERE naslov = ?", naslov,(error, results) => {
         if (error) throw error;
         res.send(results);
       });
       
     });


  app.get("/api/PetragaKorisnika/", (req, res) => {
    connection.query("SELECT userId, username FROM User",(error, results) => {
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

  app.post("/api/rezerv_knjige", (req, res) => {
    const data = req.body;
    rezervacija = [[data.datum,data.id_knjiga, data.id_korisnik]]
   connection.query("INSERT INTO rezervacija (datum_rez, knjiga, korisnik) VALUES ?", [rezervacija], (error, results) => {
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

  app.listen(port, () => {
    console.log("Server running at port: " + port);
});

