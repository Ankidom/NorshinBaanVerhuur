const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const reservationsRouter = require('./routes/reservations');
const usersRouter = require('./routes/usersRouter');
const db = require('./database/db');


// Maak een express-applicatie
const app = express();

// Pad naar de SQLite-database
const dbPath = path.join(__dirname, 'db.sqlite');

// Gebruik de users-router voor het verwerken van gebruikers
app.use('/users', usersRouter);

// Middleware voor het verwerken van JSON-gegevens
app.use(express.json());

// Middleware voor het verwerken van formuliergegevens
app.use(express.urlencoded({ extended: false }));

// Cors-configuratie
app.use(cors());

// Serveer de frontend-bestanden
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Stuur index.html als standaardbestand
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Stuur reserveren.html
app.get('/reserveren.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'reserveren.html'));
});

// Stuur about.html
app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'about.html'));
});

// Stuur navbar.html
app.get('/navbar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'navbar.html'));
});

// Stuur planning.html
app.get('/planning.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'planning.html'));
});

// Stuur wijzigReservering.html
app.get('/wijzigReservering.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'wijzigReservering.html'));
});

// Endpoint voor het verwerken van het reserveringsformulier
app.post('/reserveren', (req, res) => {
    const { naam, sport, baan, extra_ballen, extra_racket, datum, tijd } = req.body;

    // Voeg de reservering toe aan de database
    db.run(
        `INSERT INTO reservations (naam, sport, baan, extra_ballen, extra_racket, datum, tijd) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [naam, sport, baan, extra_ballen, extra_racket, datum, tijd],
        (err) => {
            if (err) {
                console.error('Fout bij het toevoegen van de reservering:', err.message);
                res.status(500).send('Er is een interne serverfout opgetreden.');
            } else {
                console.log('Reservering succesvol toegevoegd aan de database.');
                res.status(200).send('Reservering succesvol verwerkt.');
            }
        }
    );
});

// Gebruik de reservations-router voor het verwerken van reserveringen
app.use('/reserveringen', reservationsRouter);

// Start de server op de opgegeven poort
const port = 3000;
app.listen(port, () => {
    console.log(`Server is gestart op poort ${port}`);
});
