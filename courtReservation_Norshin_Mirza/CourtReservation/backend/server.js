const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const reservationsRouter = require('./routes/reservations');

// Maak een express-applicatie
const app = express();

// Pad naar de SQLite-database
const dbPath = path.join(__dirname, 'db.sqlite');

// Maak een nieuwe databaseverbinding
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Fout bij het maken van de databaseverbinding:', err.message);
    } else {
        console.log('Databaseverbinding tot stand gebracht.');

        // SQL-statements voor het aanmaken van de tabellen
        const createReservationsTable = `
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        naam TEXT NOT NULL,
        sport TEXT NOT NULL,
        baan TEXT NOT NULL,
        extra_ballen INTEGER DEFAULT 0,
        extra_racket INTEGER DEFAULT 0,
        datum DATE NOT NULL,
        tijd TEXT NOT NULL
      );
    `;

        const createCourtsTable = `
      CREATE TABLE IF NOT EXISTS courts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        naam TEXT NOT NULL,
        locatie TEXT NOT NULL,
        type TEXT NOT NULL,
        FOREIGN KEY (locatie) REFERENCES locations (naam) ON DELETE CASCADE
      );
    `;

        const createLocationsTable = `
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        naam TEXT NOT NULL,
        adres TEXT NOT NULL,
        stad TEXT NOT NULL,
        postcode TEXT NOT NULL
      );
    `;

        // Voer de SQL-statements uit om de tabellen aan te maken
        db.serialize(() => {
            db.run(createReservationsTable, (err) => {
                if (err) {
                    console.error('Fout bij het aanmaken van de tabel voor reserveringen:', err.message);
                } else {
                    console.log('Tabel voor reserveringen aangemaakt.');
                }
            });

            db.run(createCourtsTable, (err) => {
                if (err) {
                    console.error('Fout bij het aanmaken van de tabel voor banen:', err.message);
                } else {
                    console.log('Tabel voor banen aangemaakt.');
                }
            });

            db.run(createLocationsTable, (err) => {
                if (err) {
                    console.error('Fout bij het aanmaken van de tabel voor locaties:', err.message);
                } else {
                    console.log('Tabel voor locaties aangemaakt.');
                }
            });
        });
    }
});

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
